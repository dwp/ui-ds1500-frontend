const pages = {
  ds1500: {
    view: 'ds1500.njk',
    fieldValidators: require('./field-validators/ds1500'),
    fieldGatherModifiers: require('./field-gather-modifiers/ds1500'),
    id: 'ds1500',
    hooks: {
      prerender: (req, res, next) => {
        if (typeof req.session.validSession !== 'undefined') {
          next()
        } else {
          res.redirect('/session-timeout')
        }
      }
    }
  },
  'select-form': {
    view: 'select-form.njk',
    fieldValidators: require('./field-validators/select-form.js'),
    id: 'select-form'
  },
  'sr1-form-request': {
    view: 'sr1-form-request.njk',
    id: 'sr1-form-request'
  },
  review: require('./pageDefinitions/review'),
  'ds1500-download': {
    view: 'download.njk',
    fieldValidators: require('./field-validators/empty'),
    id: 'ds1500-download',
    hooks: {
      prerender: (req, res, next) => {
        if (typeof req.session.validSession !== 'undefined') {
          res.locals = {
            ...res.locals,
            ...req.session.downloadContext
          }
          next()
        } else {
          res.redirect('/session-timeout')
        }
      }
    }
  }
}

module.exports = pages;
