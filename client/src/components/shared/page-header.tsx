"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";
import { getIconComponent } from "@/lib/utils";
import Link from "next/link";

type ActionButton = {
  label: string;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
  onClick?: () => void;
  href?: string;
};

type SelectOption = {
  value: string;
  label: string;
  icon?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ActionButton[];
  selector?: {
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    width?: string;
  };
};

const PageHeader = ({
  title,
  description,
  actions = [],
  selector,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {selector && (
          <Select value={selector.value} onValueChange={selector.onValueChange}>
            <SelectTrigger
              className={`w-full ${selector.width || "sm:w-[200px]"}`}
            >
              <SelectValue
                placeholder={selector.placeholder || "Select option"}
              />
            </SelectTrigger>
            <SelectContent>
              {selector.options.map((option) => {
                const IconComponent = getIconComponent(option.icon);
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && <IconComponent className="h-4 w-4" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {actions.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {actions.map((action, index) => {
              const ButtonContent = (
                <>
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </>
              );

              if (action.href) {
                return (
                  <Button
                    key={index}
                    asChild
                    variant={action.variant || "default"}
                    className="flex items-center gap-2"
                  >
                    <Link href={action.href}>{ButtonContent}</Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || "default"}
                  className="flex items-center gap-2"
                >
                  {ButtonContent}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
