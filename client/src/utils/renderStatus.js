// convert a status code to a string
export function statusText(status) {
  switch (status) {
    case 0:
      return "Rejected";
    case 1:
      return "Awaiting Student Changes";
    case 2:
      return "Awaiting Review";
    case 3:
      return "Awaiting Final Review";
    case 4:
      return "Accepted";
    default:
      return "";
  }
}

// convert a status code to a color string
export function statusColor(status) {
  switch (status) {
    case 0:
      return "#E60000"; // red
    case 1:
      return "#FFAE42"; // yellow
    case 2:
      return "#FFAE42"; // yellow
    case 3:
      return "#FFAE42"; // yellow
    case 4:
      return "#32CD32"; // green
    default:
      return "";
  }
}