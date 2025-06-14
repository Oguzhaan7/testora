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
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">T</span>
          </div>
          <span className="text-xl font-bold">Testora</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-2 p-4">
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

  return (
    <div>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          isActive && "bg-muted font-medium"
        )}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
          {item.badge && (
            <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </Link>
      </Button>

      {item.children && item.children.length > 0 && isActive && (
        <div className="ml-4 mt-2 space-y-1">
          {item.children.map((child) => (
            <SidebarItem key={child.href} item={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}
