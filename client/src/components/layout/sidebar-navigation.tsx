"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks } from "@/config/site";

const SidebarNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-6">
      <div className="space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                }`}
              />
              <span className="font-sans">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
