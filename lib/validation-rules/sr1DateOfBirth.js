const { ValidationError } = require('@dwp/govuk-casa');
const { VALID_DAY, VALID_MONTH, VALID_NUMERIC } = require('../constants')

const isEmptyDateOfBirth = (value) => {
  const isValid = value.dd && value.mm && value.yyyy
  const isEmpty = !value.dd && !value.mm && !value.yyyy
  const isEmptyDay = !value.dd && !!value.mm && !!value.yyyy
  const isEmptyMonth = !!value.dd && !value.mm && !!value.yyyy
  const isEmptyYear = !!value.dd && !!value.mm && !value.yyyy
  const isEmptyMonthAndYear = !!value.dd && !value.mm && !value.yyyy
  const isEmptyDayAndYear = !value.dd && !!value.mm && !value.yyyy
  const isEmptyDayAndMonth = !value.dd && !value.mm && !!value.yyyy

  if (isValid) {
    return []
  }
  if (isEmpty) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.empty',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[dd].empty',
        focusSuffix: '[dd]'
      }
    })];
  }
  if (isEmptyMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[mm].empty',
        focusSuffix: '[mm]'
      }
    })];
  }
  if (isEmptyYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[yyyy].empty',
        focusSuffix: '[yyyy]'
      }
    })];
  }
  if (isEmptyMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.empty[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.empty[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
  if (isEmptyDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.empty[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })];
  }
}

const isDateNumericDob = (value) => {
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
        summary: 'sr1:patientDateOfBirth.isNumeric',
        focusSuffix
      }
    })]
  } else {
    return []
  }
}

const isValidDateRangeDob = (value) => {
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
        summary: 'sr1:patientDateOfBirth.range',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.range[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDayAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.range[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidMonthAndYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.range[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
  if (isValidDay) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[dd].range',
        focusSuffix: '[dd]'
      }
    })]
  }
  if (isValidMonth) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[mm].range',
        focusSuffix: '[mm]'
      }
    })]
  }
  if (isValidYear) {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth[yyyy].range',
        focusSuffix: '[yyyy]'
      }
    })]
  }
}

const isTooLongDob = (value) => {
  const totalLength = value.mm.length + value.dd.length + value.yyyy.length
  const isValid = totalLength <= 8

  if (isValid) {
    return []
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.tooLong',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })]
  }
}

module.exports = {
  isEmptyDateOfBirth,
  isDateNumericDob,
  isValidDateRangeDob,
  isTooLongDob
};
