const ds1500Fields = require('./fields/ds1500')
const emptyFields = require('./fields/empty')
const selectFormFields = require('./fields/select-form.js')
const startHooks = require('./hooks/ds1500-start');
const sessionTimeoutHook = require('./hooks/session-timeout')
const downloadHook = require('./hooks/ds1500-download')
const reviewHooks = require('./hooks/review')

const {
  prerender: startPrerender,
  preredirect: startPreredirect
} = startHooks();

const {
  prerender: sessionTimeoutPrerender
} = sessionTimeoutHook();

const {
  prerender: downloadPrerender
} = downloadHook();

const {
  prerender: reviewPrerender,
  postvalidate: reviewPostvalidate
} = reviewHooks();

module.exports = ({ mountUrl }) => [
  {
    waypoint: 'ds1500-start',
    view: 'ds1500-start.njk',
    hooks: [{
      hook: 'prerender',
      middleware: startPrerender
    },
    {
      hook: 'preredirect',
      middleware: startPreredirect
    }]
  },
  {
    waypoint: 'select-form',
    view: 'select-form.njk',
    fields: selectFormFields(),
    id: 'select-form',
    hooks: [{
      hook: 'prerender',
      middleware: sessionTimeoutPrerender
    }]
  },
  {
    waypoint: 'sr1-form-request',
    view: 'sr1-form-request.njk',
    id: 'sr1-form-request',
    hooks: [{
      hook: 'prerender',
      middleware: sessionTimeoutPrerender
    }]
  },
  {
    waypoint: 'ds1500',
    view: 'ds1500.njk',
    fields: ds1500Fields(),
    id: 'ds1500',
    hooks: [{
      hook: 'prerender',
      middleware: sessionTimeoutPrerender
    }]
  },
  {
    waypoint: 'review',
    view: 'review.njk',
    id: 'review',
    hooks: [{
      hook: 'prerender',
      middleware: reviewPrerender
    },
    {
      hook: 'postvalidate',
      middleware: reviewPostvalidate
    }]
  },
  {
    waypoint: 'ds1500-download',
    view: 'download.njk',
    fields: emptyFields(),
    id: 'ds1500-download',
    hooks: [{
      hook: 'prerender',
      middleware: downloadPrerender
    }]
  }];
