const clearCookieBtn = document.querySelector('[data-js="clearCookie"]');

if (clearCookieBtn) {
  clearCookieBtn.addEventListener('click', () => {
    document.cookie = 'ssoTicket =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.replace('/');
  });
}
