const prerender = (req, res, next) => {
  if (typeof req.session.validSession !== 'undefined') {
    next()
  } else {
    res.redirect('/session-timeout')
  }
};

module.exports = () => ({
  prerender
});
