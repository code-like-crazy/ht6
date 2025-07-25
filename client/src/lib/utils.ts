import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""}`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""}`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""}`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  } else {
    return "just now";
  }
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function getIconComponent(
  iconName: string | null | undefined,
): LucideIcon {
  if (!iconName) {
    return LucideIcons.Building2;
  }

  // Convert icon name to PascalCase if needed
  const pascalCaseIconName = iconName
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  // Try to get the icon from Lucide
  const iconMap = LucideIcons as unknown as Record<string, LucideIcon>;
  const IconComponent =
    iconMap[pascalCaseIconName] || iconMap[iconName] || LucideIcons.Building2;

  return IconComponent;
}
