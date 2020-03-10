// convert a status code to a string
export function renderStatus(status) {
  switch (status) {
    case 0:
      return "Rejected";
    case 1:
      return "Awaiting student changes";
    case 2:
      return "Awaiting review";
    case 3:
      return "Awaiting final review";
    case 4:
      return "Accepted";
    default:
      return "";
  }
}