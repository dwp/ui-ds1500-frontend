const pages = {
  ds1500: {
    view: 'ds1500.njk',
    fieldValidators: require('./field-validators/ds1500'),
    fieldGatherModifiers: require('./field-gather-modifiers/ds1500'),
    id: 'ds1500'
  },
  review: require('./pageDefinitions/review'),
  confirmation: {
    view: 'confirmation.njk',
    fieldValidators: require('./field-validators/empty'),
    id: 'confirmation',
    hooks: {
      prerender: (req, res, next) => {
        res.locals = {
          ...res.locals,
          ...req.session.downloadContext
        }
        next()
      }
    }
  }
}

module.exports = pages;
