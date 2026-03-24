import { format } from "date-fns";

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"), 10);
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}
