import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import { UserProvider } from "@/components/providers/user-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async (props: Props) => {
  return (
    <div className="flex min-h-svh">
      {/* Mobile Navbar - only visible on small screens */}
      <MobileNavbar />

      {/* Desktop Sidebar - hidden on small screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="bg-secondary flex flex-1 flex-col">
        <header className="pointer-events-none absolute top-0 right-0 mt-6 ml-64 flex h-16 w-full items-center justify-end pr-16 pl-80 max-lg:hidden">
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pt-16 lg:ml-64 lg:pt-0">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
