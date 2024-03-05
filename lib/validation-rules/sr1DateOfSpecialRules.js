const { ValidationError } = require('@dwp/govuk-casa');
const { VALID_NUMERIC, VALID_DAY, VALID_MONTH } = require('../constants')
const { approximateDateFieldToLuxon } = require('../../utils/standard-date-formatters');

const isEmptyDateOfSpecialRules = (value) => {
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
        summary: 'sr1:dateOfSpecialRules.empty',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[dd].empty',
        focusSuffix: '[dd]'
      }
    })];
  }
  if (isEmptyMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[mm].empty',
        focusSuffix: '[mm]'
      }
    })];
  }
  if (isEmptyYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[yyyy].empty',
        focusSuffix: '[yyyy]'
      }
    })];
  }
  if (isEmptyMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.empty[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.empty[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfRules.empty[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  } else {
    return []
  }
}

const isDateNumericSr = (value) => {
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
        summary: 'sr1:dateOfSpecialRules.isNumeric',
        focusSuffix
      }
    })]
  } else {
    return []
  }
}

const isValidDateRangeSr = (value) => {
  const currentYear = new Date().getFullYear()
  const validDay = VALID_DAY.test(value.dd)
  const validMonth = VALID_MONTH.test(value.mm)
  const validYear = parseInt(value.yyyy) >= 1890 && value.yyyy <= currentYear

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
        summary: 'sr1:dateOfSpecialRules.range',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.range[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.range[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.range[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[dd].range',
        focusSuffix: '[dd]'
      }
    })]
  }
  if (isValidMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[mm].range',
        focusSuffix: '[mm]'
      }
    })]
  }
  if (isValidYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules[yyyy].range',
        focusSuffix: '[yyyy]'
      }
    })]
  } else {
    return []
  }
}

const isDateOfSpecialRulesInFuture = (value) => {
  const currentDay = parseInt(new Date().getDate())
  const currentMonth = parseInt(new Date().getMonth() + 1)
  const currentYear = parseInt(new Date().getFullYear())
  const fieldDay = parseInt(value.dd)
  const fieldMonth = parseInt(value.mm)
  const fieldYear = parseInt(value.yyyy)

  if ((fieldYear === currentYear) && ((fieldMonth > currentMonth) || (fieldMonth === currentMonth && fieldDay > currentDay))) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:dateOfSpecialRules.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  } else {
    return []
  }
}

const isDateBeforeDateOfDiagnosis = (value, { waypoint, journeyContext, fieldName }) => {
  let isValid
  const otherFieldName = 'dateOfDiagnosis'
  const otherField = journeyContext.getDataForPage(waypoint)[otherFieldName]
  const isEmptyDoD = !otherField.dd || !otherField.mm || !otherField.yyyy
  const isEmptyDoSN = !value.dd || !value.mm || !value.yyyy
  const dateOfDiagnosis = approximateDateFieldToLuxon(otherField)
  const dateOfSpecialRules = approximateDateFieldToLuxon(value)

  if (isEmptyDoD) {
    // Minimum date range is 01 01 2001 if date of birth is left blank
    const minDate = { dd: '01', mm: '01', yyyy: '2001' }
    const minDateApprox = approximateDateFieldToLuxon(minDate)
    isValid = dateOfSpecialRules > minDateApprox
  }

  if (!isEmptyDoD && !isEmptyDoSN) {
    isValid = dateOfSpecialRules >= dateOfDiagnosis
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
  isEmptyDateOfSpecialRules,
  isDateNumericSr,
  isValidDateRangeSr,
  isDateOfSpecialRulesInFuture,
  isDateBeforeDateOfDiagnosis
}
