"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  createButtonHref?: string;
};

const DashboardHeader = ({
  title,
  description,
  showCreateButton = true,
  createButtonText = "Create Project",
  onCreateClick,
  createButtonHref,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-foreground font-serif text-2xl font-semibold sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {description}
          </p>
        )}
      </div>
      {showCreateButton && (
        <>
          {createButtonHref ? (
            <Button asChild className="w-full shadow-sm sm:w-auto">
              <Link href={createButtonHref}>
                <Plus className="mr-2 h-4 w-4" />
                {createButtonText}
              </Link>
            </Button>
          ) : (
            <Button
              onClick={onCreateClick}
              className="w-full shadow-sm sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHeader;
