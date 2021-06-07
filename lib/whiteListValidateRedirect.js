/* eslint-disable quotes */
const redirectMapping = {
  ds1500: 'ds1500',
  "ds1500-start": 'ds1500-start',
  feedback: 'feedback',
  thankyou: 'thankyou'
}

function whiteListValidateRedirect (key) {
  if (key in redirectMapping) {
    return redirectMapping[key]
  } else {
    return false;
  }
}

module.exports = whiteListValidateRedirect
