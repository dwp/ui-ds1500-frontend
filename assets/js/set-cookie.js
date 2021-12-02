/* global document */
/* eslint-disable no-var, prefer-template */
/**
 * @param name
 * @param value
 * @param days
 */
function setCookie (name, value, days) {
  var expDays = 1 || days;
  var date = new Date();
  var path = '; Path=/';
  var sameSite = '; SameSite=Strict';
  var secure = document.location.protocol === 'https:' ? '; Secure' : '';
  var expires = '';
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  expires = '; Expires=' + date.toUTCString();

  document.cookie = name + '=' + (value || '') + expires + sameSite + path + secure;
}

export default setCookie;
