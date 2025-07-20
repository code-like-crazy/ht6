"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import CreateOrganizationModal from "@/components/organizations/create-organization-modal";
import JoinOrganizationModal from "@/components/organizations/join-organization-modal";

type OrganizationModalContextType = {
  openCreateModal: () => void;
  openJoinModal: () => void;
};

const OrganizationModalContext = createContext<
  OrganizationModalContextType | undefined
>(undefined);

export const useOrganizationModals = () => {
  const context = useContext(OrganizationModalContext);
  if (!context) {
    throw new Error(
      "useOrganizationModals must be used within an OrganizationModalProvider",
    );
  }
  return context;
};

type OrganizationModalProviderProps = {
  children: ReactNode;
};

export const OrganizationModalProvider = ({
  children,
}: OrganizationModalProviderProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const openJoinModal = () => setIsJoinModalOpen(true);

  return (
    <OrganizationModalContext.Provider
      value={{
        openCreateModal,
        openJoinModal,
      }}
    >
      {children}

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <JoinOrganizationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </OrganizationModalContext.Provider>
  );
};
