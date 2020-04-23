function setCookie(cookName, cookValue) {
  document.cookie = cookName + "=" + cookValue + ";" + ";path=/";
}

export default setCookie;