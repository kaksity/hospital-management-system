import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

export const formatDateOnly = (dateString: string | Date): string => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return format(date, "MMM d, yyyy");
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return format(date, "MMM d, yyyy HH:mm");
};

// Optional: For relative dates like "45 days remaining"
export const getDaysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};