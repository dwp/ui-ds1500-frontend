const { ValidationError } = require('@dwp/govuk-casa');
const { approximateDateFieldToLuxon } = require('../../utils/standard-date-formatters')
const { VALID_NUMERIC, VALID_DAY, VALID_MONTH } = require('../constants')

const isEmptyDateOfDiagnosis = (value) => {
  const isValid = value.dd && value.mm && value.yyyy
  const isEmpty = !value.dd && !value.mm && !value.yyyy
  const isEmptyMonthAndYear = !!value.dd && !value.mm && !value.yyyy
  const isEmptyDayAndYear = !value.dd && !!value.mm && !value.yyyy
  const isEmptyDayAndMonth = !value.dd && !value.mm && !!value.yyyy
  const isEmptyDay = !value.dd && !!value.mm && !!value.yyyy
  const isEmptyMonth = !!value.dd && !value.mm && !!value.yyyy
  const isEmptyYear = !!value.dd && !!value.mm && !value.yyyy

  if (isValid) {
    return []
  }
  if (isEmpty) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.empty',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[dd].empty',
        focusSuffix: '[dd]'
      }
    })];
  }
  if (isEmptyMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[mm].empty',
        focusSuffix: '[mm]'
      }
    })];
  }
  if (isEmptyYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[yyyy].empty',
        focusSuffix: '[yyyy]'
      }
    })];
  }
  if (isEmptyMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.empty[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.empty[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.empty[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  } else {
    return []
  }
}

const isDateNumeric = (value) => {
  let focusSuffix
  const dd = VALID_NUMERIC.test(value.dd)
  const mm = VALID_NUMERIC.test(value.mm)
  const yyyy = VALID_NUMERIC.test(value.yyyy)
  if (!dd && !mm && !yyyy) {
    focusSuffix = ['[dd]', '[mm]', '[yyyy]']
  }
  if (dd && !mm && !yyyy) {
    focusSuffix = ['[dd]', '[mm]', '[yyyy]']
  }
  if (!dd && mm && !yyyy) {
    focusSuffix = ['[dd]', '[mm]', '[yyyy]']
  }
  if (!dd && !mm && yyyy) {
    focusSuffix = ['[dd]', '[mm]', '[yyyy]']
  }
  if (!dd && mm && yyyy) {
    focusSuffix = '[dd]'
  }
  if (!mm && dd && yyyy) {
    focusSuffix = '[mm]'
  }
  if (!yyyy && dd && mm) {
    focusSuffix = '[yyyy]'
  }

  if (!dd || !mm || !yyyy) {
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
  const currentYear = new Date().getFullYear()
  const validDay = VALID_DAY.test(value.dd)
  const validMonth = VALID_MONTH.test(value.mm)
  const validYear = value.yyyy >= 1890 && value.yyyy <= currentYear

  const isValid = validDay && validMonth && validYear
  const inValid = !validDay && !validMonth && !validYear
  const isValidDay = !validDay && validMonth && validYear
  const isValidMonth = validDay && !validMonth && validYear
  const isValidYear = validDay && validMonth && !validYear
  const isValidMonthAndYear = validDay && !validMonth && !validYear
  const isValidDayAndYear = !validDay && validMonth && !validYear
  const isValidDayAndMonth = !validDay && !validMonth && validYear

  if (isValid) {
    return []
  }
  if (inValid) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.range',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.range[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.range[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.range[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[dd].range',
        focusSuffix: '[dd]'
      }
    })]
  }
  if (isValidMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis[mm].range',
        focusSuffix: '[mm]'
      }
    })]
  }
  if (isValidYear) {
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
  const currentDay = parseInt(new Date().getDate())
  const currentMonth = parseInt(new Date().getMonth() + 1)
  const currentYear = parseInt(new Date().getFullYear())
  const fieldDay = parseInt(value.dd)
  const fieldMonth = parseInt(value.mm)
  const fieldYear = parseInt(value.yyyy)

  if ((fieldYear === currentYear) && ((fieldMonth > currentMonth) || (fieldMonth === currentMonth && fieldDay > currentDay))) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfDiagnosis.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
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
  const isEmptyDoD = !value.dd || !value.mm || !value.yyyy
  const dateOfBirth = approximateDateFieldToLuxon(otherField)
  const dateOfDiagnosis = approximateDateFieldToLuxon(value)

  if (isEmptyDoB) {
    // Minimum date range is 01 01 2001 if date of birth is left blank
    const minDate = { dd: '01', mm: '01', yyyy: '2001' }
    const minDateApprox = approximateDateFieldToLuxon(minDate)
    isValid = dateOfDiagnosis > minDateApprox
  }

  if (!isEmptyDoB && !isEmptyDoD) {
    isValid = dateOfDiagnosis >= dateOfBirth
  }

  if (isValid) {
    return []
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: `sr1:${fieldName}.beforeDob`,
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
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
