"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Menu } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/config/site";

const MobileNavbar = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-background border-border fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4 lg:hidden">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border">
          <span className="text-primary font-serif text-sm font-bold">L</span>
        </div>
        <h1 className="text-foreground font-serif text-lg font-semibold">
          Luminal
        </h1>
      </div>

      {/* Theme Toggle and Hamburger Menu */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-border/50 bg-background/50 hover:bg-muted/50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="flex h-[100dvh] max-h-screen flex-col p-0 data-[state=closed]:duration-200 data-[state=open]:duration-300"
          >
            {/* Logo Section */}
            <div className="border-sidebar-border/50 flex h-20 items-center justify-center border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border">
                  <span className="text-primary font-serif text-lg font-bold">
                    L
                  </span>
                </div>
                <h1 className="text-sidebar-foreground font-serif text-xl font-semibold">
                  Luminal
                </h1>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border border-transparent"
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

            {/* Quick Actions */}
            <div className="border-sidebar-border/50 space-y-3 border-t p-4">
              <div className="space-y-2">
                <Button
                  className="w-full justify-start font-sans shadow-sm"
                  size="default"
                  onClick={handleLinkClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Button>
                <Button
                  className="w-full justify-start font-sans"
                  variant="outline"
                  size="sm"
                  onClick={handleLinkClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            {/* User Profile */}
            <div className="border-sidebar-border/50 border-t p-4">
              {isLoading ? (
                <div className="flex items-center space-x-3 rounded-xl p-2">
                  <div className="bg-sidebar-accent h-10 w-10 animate-pulse rounded-full"></div>
                  <div className="min-w-0 flex-1">
                    <div className="bg-sidebar-accent h-4 w-20 animate-pulse rounded"></div>
                    <div className="bg-sidebar-accent mt-1 h-3 w-24 animate-pulse rounded"></div>
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3 rounded-xl p-2">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      className="ring-sidebar-border rounded-full object-cover ring-2"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-full border">
                      <span className="text-primary font-sans text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sidebar-foreground truncate font-sans text-sm font-medium">
                      {user.name}
                    </p>
                    <p className="text-sidebar-foreground/60 truncate font-sans text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 rounded-xl p-2">
                  <div className="bg-sidebar-accent border-sidebar-border flex h-10 w-10 items-center justify-center rounded-full border">
                    <span className="text-sidebar-foreground/60 font-sans text-sm font-medium">
                      ?
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sidebar-foreground truncate font-sans text-sm font-medium">
                      Guest
                    </p>
                    <p className="text-sidebar-foreground/60 truncate font-sans text-xs">
                      Not signed in
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
