/* eslint-disable quotes */
const redirectMapping = {
  sr1: 'sr1',
  "sr1-start": 'sr1-start',
  "sr1-download": 'sr1-download',
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
