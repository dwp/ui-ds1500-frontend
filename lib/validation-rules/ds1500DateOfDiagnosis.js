const { ValidationError } = require('@dwp/govuk-casa');
const moment = require('moment');
const { approximateDateFieldToMoment } = require('../../utils/standard-date-formatters')
const { VALID_NUMERIC, VALID_MONTH } = require('../constants')

const isEmptyDateOfDiagnosis = (fieldValue) => {
  const isEmptyMonthAndYear = !fieldValue.mm && !fieldValue.yyyy
  const isEmptyMonth = !fieldValue.mm && !!fieldValue.yyyy
  const isEmptyYear = !fieldValue.yyyy && !!fieldValue.mm
  return new Promise((resolve, reject) => {
    if (isEmptyMonthAndYear) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis.empty',
        focusSuffix: ['[mm]', '[yyyy]']
      }))
    } else if (isEmptyMonth) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis[mm].empty',
        focusSuffix: '[mm]'
      }))
    } else if (isEmptyYear) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis[yyyy].empty',
        focusSuffix: '[yyyy]'
      }))
    } else {
      resolve()
    }
  })
}

const isDateNumeric = (fieldValue) => {
  let focusSuffix
  const mm = VALID_NUMERIC.test(fieldValue.mm)
  const yyyy = VALID_NUMERIC.test(fieldValue.yyyy)
  if (!mm && !yyyy) {
    focusSuffix = ['[mm]', '[yyyy]']
  }
  if (!mm && yyyy) {
    focusSuffix = '[mm]'
  }
  if (!yyyy && mm) {
    focusSuffix = '[yyyy]'
  }

  return new Promise((resolve, reject) => {
    if (!mm || !yyyy) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis.isNumeric',
        focusSuffix
      }))
    } else {
      resolve()
    }
  })
}

const isValidDateRange = (fieldValue) => {
  let isValidYear, isValidMonth
  if (fieldValue.mm) {
    isValidMonth = VALID_MONTH.test(fieldValue.mm)
  }
  if (fieldValue.yyyy) {
    const currentYear = new Date().getFullYear()
    isValidYear = fieldValue.yyyy >= 1890 && fieldValue.yyyy <= currentYear
  }

  return new Promise((resolve, reject) => {
    if (!isValidMonth && !isValidYear) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis.range',
        focusSuffix: ['[mm]', '[yyyy]']
      }))
    } else if (!isValidMonth && !!isValidYear) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis[mm].range',
        focusSuffix: '[mm]'
      }))
    } else if (!isValidYear && !!isValidMonth) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis[yyyy].range',
        focusSuffix: '[yyyy]'
      }))
    } else {
      resolve()
    }
  })
}

const isDateOfDiagnosisInFuture = (fieldValue) => {
  const currentMonth = parseInt(new Date().getMonth() + 1);
  const currentYear = parseInt(new Date().getFullYear())
  const fieldMonth = parseInt(fieldValue.mm)
  const fieldYear = parseInt(fieldValue.yyyy)

  return new Promise((resolve, reject) => {
    if (fieldYear === currentYear && fieldMonth > currentMonth) {
      reject(new ValidationError({
        summary: 'ds1500:dateOfDiagnosis.future',
        focusSuffix: ['[mm]', '[yyyy]']
      }))
    } else {
      resolve()
    }
  })
}

function isDateBeforeDoB (fieldValue, dataContext) {
  let isValid
  const { waypointId, journeyContext, fieldName } = dataContext
  const { otherFieldName } = this
  const otherField = journeyContext.getDataForPage(waypointId)[otherFieldName]
  const isEmptyDoB = !otherField.dd || !otherField.mm || !otherField.yyyy
  const isEmptyDoD = !fieldValue.mm || !fieldValue.yyyy
  const dateOfBirth = approximateDateFieldToMoment(otherField)
  const dateOfDiagnosis = approximateDateFieldToMoment(fieldValue)

  if (isEmptyDoB) {
    // Minimum date range is 01 2001 if date of birth is left blank
    const minDate = { mm: '01', yyyy: '2001' }
    const minDateApprox = approximateDateFieldToMoment(minDate)
    isValid = moment(dateOfDiagnosis).isAfter(minDateApprox)
  }

  if (!isEmptyDoB && !isEmptyDoD) {
    isValid = moment(dateOfDiagnosis).isAfter(dateOfBirth)
  }

  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve();
    } else {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.beforeDob`,
        focusSuffix: ['[mm]', '[yyyy]']
      }));
    }
  });
}

module.exports = {
  isEmptyDateOfDiagnosis,
  isDateNumeric,
  isValidDateRange,
  isDateOfDiagnosisInFuture,
  isDateBeforeDoB
}
