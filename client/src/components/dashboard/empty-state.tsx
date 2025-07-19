"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderOpen, Plus, ArrowRight } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionText: string;
  onActionClick?: () => void;
};

const EmptyState = ({
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="border-border max-w-md p-8 text-center shadow-sm">
        <div className="bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <FolderOpen className="text-muted-foreground h-8 w-8" />
        </div>

        <h3 className="text-foreground mb-2 font-serif text-xl font-semibold">
          {title}
        </h3>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        <Button onClick={onActionClick} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          {actionText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="border-border mt-6 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Need help getting started?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              View documentation
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmptyState;
