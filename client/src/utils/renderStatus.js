// convert a status code to a string
export function renderStatus(status) {
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