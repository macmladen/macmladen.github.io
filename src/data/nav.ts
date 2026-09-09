/** The three sections of the site, in order. The header bar and the footer row
 *  both show this list, so it is written once: "the footer carries the same
 *  hrefs as the header" is then a property of the data rather than a rule two
 *  components have to remember. Only the header marks the current page. */

export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'About', href: '/about/' },
  { label: 'Speaking', href: '/speaking/' },
  { label: 'Contact', href: '/contact/' },
];

export default nav;
