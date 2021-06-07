const moment = require('moment');

function dateFieldToMoment (df) {
  return moment.utc([df.yyyy, df.mm, df.dd].join('-'), 'YYYY-MM-DD'
  )
}

function approximateDateFieldToMoment (df) {
  return moment.utc([df.yyyy, df.mm, '01'].join('-'), 'YYYY-MM-DD'
  )
}

function formatDateObject (date, { locale = 'en' } = {}) {
  if (
    Object.prototype.toString.call(date) === '[object Object]' &&
    'yyyy' in date &&
    'mm' in date &&
    'dd' in date
  ) {
    return moment([
      Math.max(0, parseInt(date.yyyy, 10)),
      Math.max(0, parseInt(date.mm, 10) - 1),
      Math.max(1, parseInt(date.dd, 10))
    ]).locale(locale).format('D MMMM YYYY');
  }
  return 'INVALID DATE OBJECT';
}

function formatDateSummaryObject (date, { locale = 'en' } = {}) {
  if (
    Object.prototype.toString.call(date) === '[object Object]' &&
    'yyyy' in date &&
    'mm' in date
  ) {
    return moment([
      Math.max(0, parseInt(date.yyyy, 10)),
      Math.max(0, parseInt(date.mm, 10) - 1),
      1
    ]).locale(locale).format('MMMM YYYY');
  }
  return 'INVALID DATE SUMMARY OBJECT';
}

const isDateValue = (value) => !!(typeof value === 'object' && !!value.dd && !!value.mm && !!value.yyyy)
const isDateSummaryValue = (value) => !!(typeof value === 'object' && !!value.mm && !!value.yyyy)

module.exports = {
  dateFieldToMoment,
  approximateDateFieldToMoment,
  formatDateObject,
  formatDateSummaryObject,
  isDateValue,
  isDateSummaryValue
}
