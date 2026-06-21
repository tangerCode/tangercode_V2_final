export interface NavItem {
  key: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "pricing", href: "/pricing" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
];

export const footerServices: NavItem[] = [
  { key: "services.websites", href: "/services" },
  { key: "services.platforms", href: "/services" },
  { key: "services.erp", href: "/services" },
  { key: "services.mobile", href: "/services" },
];

export const footerCompany: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
];

export const footerContact: NavItem[] = [
  { key: "email", href: "mailto:contact@tangercode.ma" },
  { key: "phone", href: "tel:+212600000000" },
  { key: "location", href: "#" },
  { key: "start", href: "/contact" },
];

export const footerLegal: NavItem[] = [
  { key: "legal", href: "/legal/mentions" },
  { key: "privacy", href: "/legal/privacy" },
];
