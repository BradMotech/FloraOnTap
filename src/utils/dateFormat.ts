import { format } from "date-fns";

export function formatDate (timestamp: any) {
    if (timestamp) {
      const date = timestamp.toDate();
      return format(date, "yyyy-MM-dd");
    }
    return "";
  };