export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Articles",
    href: "/articles",
    description: "Explore all articles",
  },
  {
    title: "Categories",
    href: "/categories",
    description: "Browse by category",
  },
  {
    title: "Write",
    href: "/write",
    description: "Create new article",
  },
];

export const USER_NAV: NavItem[] = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
  },
  {
    title: "Notifications",
    href: "/notifications",
  },
  {
    title: "Settings",
    href: "/settings",
  },
];

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
