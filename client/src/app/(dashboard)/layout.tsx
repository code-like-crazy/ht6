import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/mobile-navbar";

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
        <main className="flex-1 overflow-y-auto pt-16 lg:ml-64 lg:pt-0">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
