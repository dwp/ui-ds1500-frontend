/* eslint-disable quotes */
const redirectMapping = {
  ds1500: 'ds1500',
  "ds1500-start": 'ds1500-start',
  "ds1500-download": 'ds1500-download',
  confirmation: 'confirmation',
  feedback: 'feedback',
  "feedback-sent": 'feedback-sent'
}

function whiteListValidateRedirect (key) {
  if (key in redirectMapping) {
    return redirectMapping[key]
  } else {
    return false;
  }
}

module.exports = whiteListValidateRedirect
