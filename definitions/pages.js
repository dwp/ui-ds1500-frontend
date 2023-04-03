const sr1Fields = require('./fields/sr1')
const emptyFields = require('./fields/empty')
const startHooks = require('./hooks/sr1-start');
const sessionTimeoutHook = require('./hooks/session-timeout')
const downloadHook = require('./hooks/sr1-download')
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
    waypoint: 'sr1-start',
    view: 'sr1-start.njk',
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
    waypoint: 'sr1',
    view: 'sr1.njk',
    fields: sr1Fields(),
    id: 'sr1',
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
    waypoint: 'sr1-download',
    view: 'download.njk',
    fields: emptyFields(),
    id: 'sr1-download',
    hooks: [{
      hook: 'prerender',
      middleware: downloadPrerender
    }]
  }
];
