export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export const FOOTER_NAV = {
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
} as const;
