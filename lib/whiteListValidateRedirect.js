/* eslint-disable quotes */
const redirectMapping = {
  ds1500: 'ds1500',
  "ds1500-start": 'ds1500-start',
  "ds1500-download": 'ds1500-download',
  confirmation: 'confirmation',
  feedback: 'feedback',
  "feedback-sent": 'feedback-sent',
  "select-form": 'select-form',
  "sr1-form-request": 'sr1-form-request'
}

function whiteListValidateRedirect (key) {
  if (key in redirectMapping) {
    return redirectMapping[key]
  } else {
    return false;
  }
}

module.exports = whiteListValidateRedirect
