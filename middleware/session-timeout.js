module.exports = (router, mountUrl, proxyUrl, waypoints, sessionTtl, timeoutDialogCountdown) => {
  router.prependUse(proxyUrl, (req, res, next) => {
    res.locals.timeoutDialog = {
      keepAliveUrl: `${mountUrl}${waypoints.SESSION_KEEP_ALIVE}`,
      signOutUrl: `${mountUrl}${waypoints.SESSION_ENDED}`,
      timeoutUrl: `${mountUrl}${waypoints.SESSION_TIMEOUT}`,
      countdown: sessionTtl - timeoutDialogCountdown,
      timeout: sessionTtl
    };

    next();
  });
};
