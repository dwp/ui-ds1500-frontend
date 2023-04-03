const { ValidationError } = require('@dwp/govuk-casa');
const moment = require('moment');
const { approximateDateFieldToMoment } = require('../../utils/standard-date-formatters')
const { VALID_NUMERIC, VALID_MONTH } = require('../constants')

const isEmptyDateOfDiagnosis = (value) => {
  const isEmptyMonthAndYear = !value.mm && !value.yyyy
  const isEmptyMonth = !value.mm && !!value.yyyy
  const isEmptyYear = !value.yyyy && !!value.mm

  if (isEmptyMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.empty',
        focusSuffix: ['[mm]', '[yyyy]']
      }
    })]
  } else if (isEmptyMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[mm].empty',
        focusSuffix: '[mm]'
      }
    })]
  } else if (isEmptyYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[yyyy].empty',
        focusSuffix: '[yyyy]'
      }
    })]
  } else {
    return []
  }
}

const isDateNumeric = (value) => {
  let focusSuffix
  const mm = VALID_NUMERIC.test(value.mm)
  const yyyy = VALID_NUMERIC.test(value.yyyy)
  if (!mm && !yyyy) {
    focusSuffix = ['[mm]', '[yyyy]']
  }
  if (!mm && yyyy) {
    focusSuffix = '[mm]'
  }
  if (!yyyy && mm) {
    focusSuffix = '[yyyy]'
  }

  if (!mm || !yyyy) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.isNumeric',
        focusSuffix
      }
    })]
  } else {
    return []
  }
}

const isValidDateRange = (value) => {
  let isValidYear, isValidMonth
  if (value.mm) {
    isValidMonth = VALID_MONTH.test(value.mm)
  }
  if (value.yyyy) {
    const currentYear = new Date().getFullYear()
    isValidYear = value.yyyy >= 1890 && value.yyyy <= currentYear
  }

  if (!isValidMonth && !isValidYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.range',
        focusSuffix: ['[mm]', '[yyyy]']
      }
    })]
  } else if (!isValidMonth && !!isValidYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[mm].range',
        focusSuffix: '[mm]'
      }
    })]
  } else if (!isValidYear && !!isValidMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[yyyy].range',
        focusSuffix: '[yyyy]'
      }
    })]
  } else {
    return []
  }
}

const isDateOfDiagnosisInFuture = (value) => {
  const currentMonth = parseInt(new Date().getMonth() + 1);
  const currentYear = parseInt(new Date().getFullYear())
  const fieldMonth = parseInt(value.mm)
  const fieldYear = parseInt(value.yyyy)

  if (fieldYear === currentYear && fieldMonth > currentMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.future',
        focusSuffix: ['[mm]', '[yyyy]']
      }
    })]
  } else {
    return []
  }
}

function isDateBeforeDoB (value, { waypoint, journeyContext, fieldName }) {
  let isValid
  const otherFieldName = 'patientDateOfBirth'
  const otherField = journeyContext.getDataForPage(waypoint)[otherFieldName]
  const isEmptyDoB = !otherField.dd || !otherField.mm || !otherField.yyyy
  const isEmptyDoD = !value.mm || !value.yyyy
  const dateOfBirth = approximateDateFieldToMoment(otherField)
  const dateOfDiagnosis = approximateDateFieldToMoment(value)

  if (isEmptyDoB) {
    // Minimum date range is 01 2001 if date of birth is left blank
    const minDate = { mm: '01', yyyy: '2001' }
    const minDateApprox = approximateDateFieldToMoment(minDate)
    isValid = moment(dateOfDiagnosis).isAfter(minDateApprox)
  }

  if (!isEmptyDoB && !isEmptyDoD) {
    isValid = moment(dateOfDiagnosis).isAfter(dateOfBirth)
  }

  if (isValid) {
    return []
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: `sr1:${fieldName}.beforeDob`,
        focusSuffix: ['[mm]', '[yyyy]']
      }
    })];
  }
}

module.exports = {
  isEmptyDateOfDiagnosis,
  isDateNumeric,
  isValidDateRange,
  isDateOfDiagnosisInFuture,
  isDateBeforeDoB
}
