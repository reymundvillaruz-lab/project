export type UserRole = "ADMINISTRATOR" | "BHW" | "PHYSICIAN" | "NURSE";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "success" | "warning" | "destructive" | "info";
  description?: string;
  allowedRoles?: UserRole[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
