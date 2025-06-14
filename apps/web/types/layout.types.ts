import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
  children?: SidebarItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppHeaderProps {
  onMenuClick: () => void;
  breadcrumbs?: BreadcrumbItem[];
  pageTitle?: string;
}

export interface AppLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface PublicLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export interface AppHeaderProps {
  onMobileMenuOpen?: () => React.ReactNode;
  showMobileMenu?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export interface AppSidebarProps {
  items: SidebarItem[];
  className?: string;
}
