"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import IntegrationSelectionModal from "../projects/integration-selection-modal";

type IntegrationModalContextType = {
  openIntegrationModal: (projectId: number) => void;
};

const IntegrationModalContext = createContext<
  IntegrationModalContextType | undefined
>(undefined);

export const useIntegrationModal = () => {
  const context = useContext(IntegrationModalContext);
  if (!context) {
    throw new Error(
      "useIntegrationModal must be used within an IntegrationModalProvider",
    );
  }
  return context;
};

type IntegrationModalProviderProps = {
  children: ReactNode;
};

export const IntegrationModalProvider = ({
  children,
}: IntegrationModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const openIntegrationModal = (projectId: number) => {
    setProjectId(projectId);
    setIsModalOpen(true);
  };

  return (
    <IntegrationModalContext.Provider
      value={{
        openIntegrationModal,
      }}
    >
      {children}

      <IntegrationSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectId(null);
        }}
        projectId={projectId}
      />
    </IntegrationModalContext.Provider>
  );
};
