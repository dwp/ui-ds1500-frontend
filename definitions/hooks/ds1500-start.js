const prerender = (req, res, next) => {
  req.session.previousPage = 'ds1500-start';
  if (typeof req.session.validSession === 'undefined' || req.session.validSession) {
    req.session.validSession = true;
    next()
  } else {
    res.redirect('/session-timeout')
  }
};

const preredirect = (req, res, next) => {
  req.session.validSession = true;
  next()
};

module.exports = () => ({
  prerender,
  preredirect
});
