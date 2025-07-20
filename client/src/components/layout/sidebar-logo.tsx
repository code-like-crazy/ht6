import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarLogoProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarLogo = ({ isCollapsed, onToggle }: SidebarLogoProps) => {
  return (
    <div className="border-sidebar-border/50 flex h-20 items-center border-b px-4">
      {/* Logo Section */}
      <div className="flex flex-1 items-center space-x-3">
        <div className="bg-primary/10 border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
          <span className="text-primary font-serif text-lg font-bold">L</span>
        </div>
        <h1
          className={`text-sidebar-foreground overflow-hidden font-serif text-xl font-semibold transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          Loominal
        </h1>
      </div>

      {/* Collapse Toggle Button - only show when expanded */}
      {!isCollapsed && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hover:bg-sidebar-accent/50 h-8 w-8 shrink-0 p-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Collapse sidebar</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default SidebarLogo;
