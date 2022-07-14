const prerender = (req, res, next) => {
  if (typeof req.session.validSession !== 'undefined') {
    res.locals = {
      ...res.locals,
      ...req.session.downloadContext
    }
    next()
  } else {
    res.redirect('/session-timeout')
  }
};

module.exports = () => ({
  prerender
});
