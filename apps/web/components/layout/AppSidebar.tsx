"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "@/types/layout.types";

interface AppSidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AppSidebar({
  items,
  isOpen,
  onClose,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-sm font-bold text-white">T</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Testora</span>
            <span className="text-xs text-blue-100 opacity-80">
              AI-Powered Learning
            </span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <div className="space-y-1 p-4">
          {items.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </div>
  );

  if (isOpen !== undefined) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <div className={cn("border-r bg-muted/40", className)}>
      <div className="flex h-full max-h-screen flex-col">
        <SidebarContent />
      </div>
    </div>
  );
}

interface SidebarItemProps {
  item: SidebarItem;
  pathname: string;
}

function SidebarItem({ item, pathname }: SidebarItemProps) {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded =
    isActive ||
    (hasChildren &&
      item.children?.some(
        (child) =>
          pathname === child.href || pathname.startsWith(child.href + "/")
      ));

  return (
    <div className="space-y-1">
      <Button
        variant={isActive && !hasChildren ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start transition-colors",
          isActive &&
            !hasChildren &&
            "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600",
          hasChildren && isExpanded && "bg-gray-50 text-gray-900"
        )}
        asChild
      >
        <Link href={item.href} className="flex items-center">
          <item.icon className="mr-3 h-4 w-4" />
          {item.label}
          {item.badge && (
            <span className="ml-auto rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
              {item.badge}
            </span>
          )}
        </Link>
      </Button>

      {hasChildren && isExpanded && (
        <div className="ml-6 space-y-1 border-l border-gray-200 pl-4">
          {item.children?.map((child) => (
            <SidebarItem key={child.href} item={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}
