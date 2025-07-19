import { getCurrentUser } from "@/server/services/user";
import Image from "next/image";

const SidebarUserProfile = async () => {
  const user = await getCurrentUser();

  return (
    <div className="border-sidebar-border/50 border-t p-4">
      {user ? (
        <div className="hover:bg-sidebar-accent/30 flex items-center space-x-3 rounded-xl p-2 transition-colors">
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
  );
};

export default SidebarUserProfile;
