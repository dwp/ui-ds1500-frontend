const { DateTime } = require('luxon');

function dateFieldToLuxon (df) {
  return DateTime.utc(parseInt(df.yyyy), parseInt(df.mm), parseInt(df.dd)
  )
}

function approximateDateFieldToLuxon (df) {
  return DateTime.utc(parseInt(df.yyyy), parseInt(df.mm), parseInt(df.dd)
  )
}

function formatDateObject (date, { locale = 'en-gb' } = {}) {
  if (
    Object.prototype.toString.call(date) === '[object Object]' &&
    'yyyy' in date &&
    'mm' in date &&
    'dd' in date
  ) {
    let month = Math.max(0, parseInt(date.mm, 10));
    if (month === 0) {
      month = 1;
    }
    return DateTime.utc(
      Math.max(0, parseInt(date.yyyy, 10)),
      month,
      Math.max(1, parseInt(date.dd, 10))
    ).setLocale(locale).toLocaleString(DateTime.DATE_FULL);
  }
  return 'INVALID DATE OBJECT';
}

function formatDateSummaryObject (date, { locale = 'en' } = {}) {
  if (
    Object.prototype.toString.call(date) === '[object Object]' &&
    'yyyy' in date &&
    'mm' in date
  ) {
    let month = Math.max(0, parseInt(date.mm, 10));
    if (month === 0) {
      month = 1;
    }
    return DateTime.utc(
      Math.max(0, parseInt(date.yyyy, 10)),
      month,
      1
    ).setLocale(locale).toLocaleString({ month: 'long', year: 'numeric' })
  }
  return 'INVALID DATE SUMMARY OBJECT';
}

const isDateValue = (value) => !!(typeof value === 'object' && !!value.dd && !!value.mm && !!value.yyyy)
const isDateSummaryValue = (value) => !!(typeof value === 'object' && !!value.mm && !!value.yyyy)

module.exports = {
  dateFieldToLuxon,
  approximateDateFieldToLuxon,
  formatDateObject,
  formatDateSummaryObject,
  isDateValue,
  isDateSummaryValue
}
