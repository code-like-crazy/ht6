"use client";

import { useUser } from "@/components/providers/user-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarUserProfileProps {
  isCollapsed: boolean;
}

const SidebarUserProfile = ({ isCollapsed }: SidebarUserProfileProps) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleLogout = () => {
    window.location.href = "/api/auth/custom-logout";
  };

  const userAvatar = user?.imageUrl ? (
    <Image
      src={user.imageUrl}
      alt={user.name || "User"}
      className="ring-sidebar-border shrink-0 rounded-full object-cover ring-2"
      width={40}
      height={40}
    />
  ) : (
    <div className="bg-primary/10 border-border flex h-10 w-10 items-center justify-center rounded-full border">
      <span className="text-primary font-sans text-sm font-semibold">
        {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
      </span>
    </div>
  );

  const guestAvatar = (
    <div className="bg-sidebar-accent border-sidebar-border flex h-10 w-10 items-center justify-center rounded-full border">
      <span className="text-sidebar-foreground/60 font-sans text-sm font-medium">
        ?
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="border-sidebar-border border-t p-4">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} rounded-xl p-2`}
        >
          <div className="bg-sidebar-accent border-sidebar-border flex h-10 w-10 animate-pulse items-center justify-center rounded-full border">
            <span className="text-sidebar-foreground/60 font-sans text-sm font-medium">
              ?
            </span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 overflow-hidden transition-all duration-300">
              <div className="bg-sidebar-accent/50 mb-1 h-4 w-20 animate-pulse rounded"></div>
              <div className="bg-sidebar-accent/30 h-3 w-32 animate-pulse rounded"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="border-sidebar-border/50 border-t p-4">
        <div className="flex justify-center">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="hover:bg-sidebar-accent/30 cursor-pointer rounded-xl p-2 transition-colors">
                  {userAvatar}
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-80 p-0">
                <div className="border-border/50 bg-muted/30 border-b px-4 py-3">
                  <div className="flex items-center gap-3">
                    {userAvatar}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-foreground truncate text-sm font-semibold">
                        {user.name}
                      </h4>
                      <p className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-full justify-start gap-3 px-3"
                      onClick={handleSettings}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-full justify-start gap-3 px-3 text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign out</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hover:bg-sidebar-accent/30 cursor-pointer rounded-xl p-2 transition-colors">
                  {guestAvatar}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="text-center">
                  <p className="font-medium">Guest</p>
                  <p className="text-xs opacity-70">Not signed in</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-sidebar-border/50 border-t p-4">
      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="hover:bg-sidebar-accent/30 flex w-full items-center space-x-3 rounded-xl p-2 text-left transition-colors">
              {userAvatar}
              <div
                className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                <p className="text-sidebar-foreground truncate font-sans text-sm font-medium">
                  {user.name}
                </p>
                <p className="text-sidebar-foreground/60 truncate font-sans text-xs">
                  {user.email}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-80 p-0">
            <div className="border-border/50 bg-muted/30 border-b px-4 py-3">
              <div className="flex items-center gap-3">
                {userAvatar}
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground truncate text-sm font-semibold">
                    {user.name}
                  </h4>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-full justify-start gap-3 px-3"
                  onClick={handleSettings}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-full justify-start gap-3 px-3 text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign out</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center space-x-3 rounded-xl p-2">
          {guestAvatar}
          <div
            className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
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
  );
};

export default SidebarUserProfile;
