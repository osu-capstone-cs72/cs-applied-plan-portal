// convert a status code to a string
export function formatRole(role) {
  switch (role) {
    case 0:
      return "Student";
    case 1:
      return "Advisor";
    case 2:
      return "Head Advisor";
    default:
      return "";
  }
}