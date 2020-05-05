// set a cookie
export function setCookie(cookName, cookValue) {
  document.cookie = cookName + "=" + cookValue + ";" + ";path=/";
}