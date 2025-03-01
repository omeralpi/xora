import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToLocalTime(utcDate: Date) {
  const date = new Date(utcDate);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

  return formatDistanceToNow(localDate, { addSuffix: true });
}