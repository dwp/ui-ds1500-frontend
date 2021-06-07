function removeElement (e) {
  e.preventDefault()
  document.getElementById('global-cookie-message').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function () {
  // eslint-disable-next-line
  var globalCookieBanner = document.getElementById('global-cookie-message')
  // eslint-disable-next-line
  var hideBannerBtn = document.getElementById('btn_hide-banner')
  if (globalCookieBanner) {
    globalCookieBanner.style.display = 'block'
  }
  if (hideBannerBtn) {
    hideBannerBtn.addEventListener('click', removeElement)
  }
})
