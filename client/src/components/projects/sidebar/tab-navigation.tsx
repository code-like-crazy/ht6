"use client";

import { projectTabs, ProjectTab } from "@/config/projects";

interface TabNavigationProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {projectTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`group flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
              : "text-foreground/70 hover:text-foreground hover:bg-muted/50 hover:border-border border-border/50 border"
          }`}
        >
          <tab.icon
            className={`mr-3 h-5 w-5 transition-colors ${
              activeTab === tab.id
                ? "text-primary"
                : "text-foreground/50 group-hover:text-foreground/70"
            }`}
          />
          <span className="font-sans">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
