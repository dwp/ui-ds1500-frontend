const path = require('path')
const oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;

module.exports = {
  PROJECT_DIR: path.resolve(__dirname, '../'),
  SESSIONID: 'sessionID',
  // Cookies
  CONSENT_COOKIE_NAME: 'seen_cookie_message',
  COOKIE_CONSENT: 'cookie-consent',
  COOKIE_POLICY: 'cookie-policy',
  COOKIE_DETAILS: 'cookie-details',
  COOKIE_OPTIONS_DEFAULT: {
    path: '/',
    maxAge: oneYearInMilliseconds,
    httpOnly: false
  },
  COOKIE_UPDATE_QUERY_PARAM: 'cookies_updated',
  DATE_FIELDS: ['patientDateOfBirth', 'dateOfDiagnosis', 'dateOfSpecialRules'],
  GTM_DOMAIN: '.dwpcloud.uk',
  // Regex
  VALID_DAY: /^(0?[1-9]|[12]\d|3[01])$/,
  VALID_MONTH: /^(0?[1-9]|1[012])$/,
  VALID_NUMERIC: /^[0-9]*$/,
  // eslint-disable-next-line
  VALID_TELEPHONE_CHARACTER: /^[0-9-\+\(\)\s]*$/,
  VALID_CHARACTER: /^[a-zA-Z]*$/,
  VALID_NAME: /^([A-Za-z](([A-Za-z]|'|\.|-|\s)?[A-Za-z])*)?$/,
  VALID_POSTCODE: /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9](([0-9]?)|([ABEHMNPRVWXY]?))|([0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))) ?[0-9]((?![CIKMOV])[A-Z]){2}$|^(BFPO)[ ]?[0-9]{1,4}$/i,

  waypoints: {
    START: 'sr1-start',
    SESSION_KEEP_ALIVE: 'session-keep-alive',
    SESSION_TIMEOUT: 'session-timeout',
    SESSION_ENDED: 'session-ended',
    // Cookies
    COOKIE_POLICY: 'cookie-policy',
    COOKIE_DETAILS: 'cookie-details',
    COOKIE_CONSENT: 'cookie-consent'
  }
};
