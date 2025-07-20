import { OrganizationModalProvider } from "@/components/providers/organization-modal-provider";
import { IntegrationModalProvider } from "@/components/providers/integration-modal-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import DashboardContent from "@/components/layout/dashboard-content";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = (props: Props) => {
  return (
    <OrganizationModalProvider>
      <IntegrationModalProvider>
        <UserProvider>
          <SidebarProvider>
            <DashboardContent>{props.children}</DashboardContent>
          </SidebarProvider>
        </UserProvider>
      </IntegrationModalProvider>
    </OrganizationModalProvider>
  );
};

export default DashboardLayout;
