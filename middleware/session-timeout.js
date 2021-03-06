module.exports = (app, proxyUrl, waypoints, sessionTtl, timeoutDialogCountdown) => {
  app.use(proxyUrl, (req, res, next) => {
    const { mountUrl } = res.locals.casa;

    res.locals.timeoutDialog = {
      keepAliveUrl: `${mountUrl}${waypoints.SESSION_KEEP_ALIVE}`,
      signOutUrl: `${mountUrl}${waypoints.SESSION_RESTART}`,
      timeoutUrl: `${mountUrl}${waypoints.SESSION_ENDED}`,
      countdown: sessionTtl - timeoutDialogCountdown,
      timeout: sessionTtl
    };

    next();
  });
};
