#!/usr/bin/env node
/** Draws the sharing cards listed in `src/data/og.ts` into `public/og/`.
 *
 *  Run by `npm run og`, and by `npm run build` through the `prebuild` hook, so
 *  the files exist before Astro copies `public/` into `dist/client/`. The
 *  directory is generated in full on every run and is git-ignored.
 *
 *  Why a script and not an Astro endpoint: @astrojs/cloudflare v14 prerenders
 *  routes inside workerd rather than Node, so a prerendered `/og/[slug].png`
 *  route cannot read a font off disk or call a native image library — the
 *  build fails with `No such module "chunks/sharp"`. Keeping the generator
 *  outside Astro also keeps satori and sharp out of the Worker bundle
 *  entirely.
 *
 *  satori lays a small flexbox tree out into SVG and sharp rasterises it. No
 *  headless browser and no system fonts: satori is handed the two Inter files
 *  in `src/assets/fonts/` and turns every glyph into a `<path>`, so the
 *  rasteriser needs no font of its own and the cards come out identical on
 *  this Mac and on Cloudflare's Linux build image.
 *
 *  The card is the site in miniature: sand ground, ink text, one accent rule.
 *  Inter stands in for the site's system-font stack, which satori cannot
 *  resolve; at this size the difference is invisible and the weight is right. */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { OG_HEIGHT, OG_WIDTH, ogCards } from '../src/data/og.ts';
import { person } from '../src/data/person.ts';

const root = new URL('../', import.meta.url);
const outDir = new URL('public/og/', root);
/** Renders for sharing by hand (Instagram, LinkedIn, X); not served by the site. */
const socialDir = new URL('docs/social/', root);

/** The card's own copy of the palette: `--color-bg`, `--color-ink`,
 *  `--color-ink-soft` and `--color-accent` from `src/styles/tokens.css`.
 *  satori has no cascade, so the four values are written out here. Keep them
 *  in step with that file. */
const SAND = '#FED';
const INK = '#111';
const INK_SOFT = '#444';
const ACCENT = '#F40';

/** Inter, latin subset, copied out of @fontsource/inter 5.3.0. SIL OFL 1.1;
 *  the licence sits beside the files. */
const fonts = await Promise.all(
  [
    ['inter-latin-400-normal.woff', 400],
    ['inter-latin-700-normal.woff', 700],
  ].map(async ([file, weight]) => ({
    name: 'Inter',
    data: await readFile(new URL(`src/assets/fonts/${file}`, root)),
    weight,
    style: 'normal',
  })),
);

/** satori takes React elements; this builds the same shape without React. */
const box = (style, children) => ({ type: 'div', props: { style, children } });

/** The site URL as it is spoken, without the scheme or the trailing slash. */
const readableUrl = person.url.replace(/^https?:\/\//, '').replace(/\/+$/, '');

const card = ({ title, subtitle }) =>
  box(
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: SAND,
      color: INK,
      padding: 72,
      fontFamily: 'Inter',
    },
    [
      /* The title hangs from the rule rather than sitting under the top edge,
         so a one-line card and a three-line card are composed the same way. */
      box(
        {
          display: 'flex',
          flexGrow: 1,
          alignItems: 'flex-end',
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        },
        title,
      ),
      /* When and where, for the one card that describes a dated event. Set at
         the footer's size and in the softer ink, so it reads as a caption to
         the title rather than as a second title. Cards without a subtitle
         leave the row out entirely rather than drawing an empty one. */
      ...(subtitle
        ? [box({ display: 'flex', marginTop: 28, fontSize: 30, color: INK_SOFT }, subtitle)]
        : []),
      /* Every h1 on the site carries a thin accent rule under it. Here it is
         six pixels: the same gesture, at a size that survives a thumbnail. */
      box({ height: 6, marginTop: 40, marginBottom: 24, backgroundColor: ACCENT }, ''),
      box({ display: 'flex', justifyContent: 'space-between', fontSize: 30 }, [
        box({ display: 'flex', fontWeight: 700 }, `${person.name} · ${person.alternateName}`),
        box({ display: 'flex', color: INK_SOFT }, readableUrl),
      ]),
    ],
  );

/** The caption band under a picture: title, then event · date · time · venue,
 *  on sand with the accent rule on top. Sized to the card it sits in. */
const band = ({ title, subtitle }, width, height, scale) =>
  box(
    {
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: SAND,
      color: INK,
      paddingLeft: 48 * scale,
      paddingRight: 48 * scale,
      fontFamily: 'Inter',
      borderTop: `${6 * scale}px solid ${ACCENT}`,
    },
    [
      box({ display: 'flex', fontSize: 34 * scale, fontWeight: 700, letterSpacing: '-0.01em' }, title),
      ...(subtitle
        ? [box({ display: 'flex', marginTop: 10 * scale, fontSize: 24 * scale, color: INK_SOFT }, subtitle)]
        : []),
    ],
  );

/** A picture card: the illustration cropped to the top part, the band below.
 *  `bandHeight` is a fraction of the card height. */
const pictureCard = async (entry, width, height, bandFraction = 0.21) => {
  const bandHeight = Math.round(height * bandFraction);
  const imageHeight = height - bandHeight;
  const scale = width / 1200;
  /* Wide cards crop the 2:1 illustration a little top and bottom. The
     Instagram square fits the whole picture at full width instead, so the
     robots at the edges stay in; the sand above and below is part of the
     design there. */
  const fit = imageHeight / width > 0.55 ? 'contain' : 'cover';
  const picture = await sharp(new URL(entry.image, root).pathname)
    .resize(width, imageHeight, { fit, position: 'centre', background: SAND })
    .png()
    .toBuffer();
  const svg = await satori(band(entry, width, bandHeight, scale), { width, height: bandHeight, fonts });
  const caption = await sharp(Buffer.from(svg)).png().toBuffer();
  return sharp({ create: { width, height, channels: 3, background: SAND } })
    .composite([
      { input: picture, top: 0, left: 0 },
      { input: caption, top: imageHeight, left: 0 },
    ])
    .png()
    .toBuffer();
};

const png = async (entry) => {
  if (entry.image) return pictureCard(entry, OG_WIDTH, OG_HEIGHT);
  const svg = await satori(card(entry), { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
};

/** The same picture card at the sizes the networks want, for posting by hand.
 *  Written to docs/social/, never served. */
const socialSizes = [
  ['instagram', 1080, 1080, 0.16],
  ['linkedin', 1200, 627, 0.21],
  ['x', 1600, 900, 0.21],
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const entry of ogCards) {
  const { slug } = entry;
  const bytes = await png(entry);
  await writeFile(new URL(`${slug}.png`, outDir), bytes);
  console.log(`og: ${fileURLToPath(new URL(`${slug}.png`, outDir))} (${bytes.length} bytes)`);
}

console.log(`og: ${ogCards.length} cards, ${OG_WIDTH}x${OG_HEIGHT}`);

for (const entry of ogCards.filter((c) => c.image)) {
  await mkdir(socialDir, { recursive: true });
  for (const [name, width, height, fraction] of socialSizes) {
    const bytes = await (await sharp(await pictureCard(entry, width, height, fraction))).jpeg({ quality: 90 }).toBuffer();
    const file = new URL(`${entry.slug}-${name}.jpg`, socialDir);
    await writeFile(file, bytes);
    console.log(`social: ${fileURLToPath(file)} ${width}x${height} (${bytes.length} bytes)`);
  }
}
