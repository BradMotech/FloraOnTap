import { format } from "date-fns";

export function formatDate (timestamp: any) {
    if (timestamp) {
      const date = timestamp.toDate();
      return format(date, "yyyy-MM-dd");
    }
    return "";
  };

  export function formatReadableDate(dateString){
    const date = new Date(dateString);
  
    // Get the day of the month
    const day = date.getDate();
  
    // Get the suffix for the day (st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // for 11th to 20th
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    // Format the date as: Sep 10th, 2024
    const formattedDate = date.toLocaleString('en-US', {
      month: 'short', // Sep
      day: 'numeric', // 10
      year: 'numeric' // 2024
    });
  
    // Format the time as: 12:02 AM/PM
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // Use AM/PM format
    });
  
    // Combine date and time with the day suffix
    return `${formattedDate.replace(/\d+/, `${day}${getDaySuffix(day)}`)} at ${formattedTime}`;
  };