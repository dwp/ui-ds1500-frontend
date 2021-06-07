const { ValidationError } = require('@dwp/govuk-casa');
const { VALID_DAY, VALID_MONTH, VALID_NUMERIC } = require('../constants')

const isEmptyDateOfBirth = (fieldValue) => {
  const isValid = fieldValue.dd && fieldValue.mm && fieldValue.yyyy
  const isEmpty = !fieldValue.dd && !fieldValue.mm && !fieldValue.yyyy
  const isEmptyDay = !fieldValue.dd && !!fieldValue.mm && !!fieldValue.yyyy
  const isEmptyMonth = !!fieldValue.dd && !fieldValue.mm && !!fieldValue.yyyy
  const isEmptyYear = !!fieldValue.dd && !!fieldValue.mm && !fieldValue.yyyy
  const isEmptyMonthAndYear = !!fieldValue.dd && !fieldValue.mm && !fieldValue.yyyy
  const isEmptyDayAndYear = !fieldValue.dd && !!fieldValue.mm && !fieldValue.yyyy
  const isEmptyDayAndMonth = !fieldValue.dd && !fieldValue.mm && !!fieldValue.yyyy

  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve()
    }
    if (isEmpty) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.empty',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }));
    }
    if (isEmptyDay) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[dd].empty',
        focusSuffix: '[dd]'
      }));
    }
    if (isEmptyMonth) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[mm].empty',
        focusSuffix: '[mm]'
      }));
    }
    if (isEmptyYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[yyyy].empty',
        focusSuffix: '[yyyy]'
      }));
    }
    if (isEmptyMonthAndYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.empty[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }));
    }
    if (isEmptyDayAndYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.empty[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }));
    }
    if (isEmptyDayAndMonth) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.empty[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }));
    }
  })
}

const isDateNumericDob = (fieldValue) => {
  let focusSuffix
  const dd = VALID_NUMERIC.test(fieldValue.dd)
  const mm = VALID_NUMERIC.test(fieldValue.mm)
  const yyyy = VALID_NUMERIC.test(fieldValue.yyyy)
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

  return new Promise((resolve, reject) => {
    if (!dd || !mm || !yyyy) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.isNumeric',
        focusSuffix
      }))
    } else {
      resolve()
    }
  })
}

const isValidDateRangeDob = (fieldValue) => {
  const currentYear = new Date().getFullYear()
  const validDay = VALID_DAY.test(fieldValue.dd)
  const validMonth = VALID_MONTH.test(fieldValue.mm)
  const validYear = fieldValue.yyyy >= 1890 && fieldValue.yyyy <= currentYear

  const isValid = validDay && validMonth && validYear
  const inValid = !validDay && !validMonth && !validYear
  const isValidDay = !validDay && validMonth && validYear
  const isValidMonth = validDay && !validMonth && validYear
  const isValidYear = validDay && validMonth && !validYear
  const isValidMonthAndYear = validDay && !validMonth && !validYear
  const isValidDayAndYear = !validDay && validMonth && !validYear
  const isValidDayAndMonth = !validDay && !validMonth && validYear

  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve()
    }
    if (inValid) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.range',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }))
    }
    if (isValidDayAndMonth) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.range[DDMM]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }))
    }
    if (isValidDayAndYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.range[DDYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }))
    }
    if (isValidMonthAndYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.range[MMYY]',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }))
    }
    if (isValidDay) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[dd].range',
        focusSuffix: '[dd]'
      }))
    }
    if (isValidMonth) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[mm].range',
        focusSuffix: '[mm]'
      }))
    }
    if (isValidYear) {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth[yyyy].range',
        focusSuffix: '[yyyy]'
      }))
    }
  })
}

const isTooLongDob = (fieldValue) => {
  const totalLength = fieldValue.mm.length + fieldValue.dd.length + fieldValue.yyyy.length
  const isValid = totalLength <= 8

  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve()
    } else {
      reject(new ValidationError({
        summary: 'ds1500:patientDateOfBirth.tooLong',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }))
    }
  })
}

module.exports = {
  isEmptyDateOfBirth,
  isDateNumericDob,
  isValidDateRangeDob,
  isTooLongDob
};
