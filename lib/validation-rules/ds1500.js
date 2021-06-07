/* eslint-disable no-undef */
const { ValidationError } = require('@dwp/govuk-casa');
const { VALID_CHARACTER, VALID_NAME, VALID_TELEPHONE_CHARACTER } = require('../constants')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
// A method to check if Special Char is not next to an A-Z a-z character on both sides in the name field
const specialCharCheck = (str) => {
  const arr = str.split('')
  let isValid;
  arr.every((s, i) => {
    if (i === 0) {
      if (VALID_CHARACTER.test(s)) {
        isValid = true
      } else {
        isValid = false
      }
      return isValid
    }

    if (i > 0 && i < arr.length - 1) {
      const prev = arr[i - 1]
      const next = arr[i + 1]
      if (/[-'.\s]/.test(s)) {
        if (VALID_CHARACTER.test(prev) && VALID_CHARACTER.test(next)) {
          isValid = true
        } else {
          isValid = false
        }
      }
      return isValid
    }
    return isValid
  })
  return isValid
}

const isValidPatientName = (fieldValue, dataContext) => {
  let lastChar, isValid, isValidLastChar, isValidSpecialChar
  if (fieldValue) {
    isValid = VALID_NAME.test(fieldValue)
    lastChar = fieldValue.slice(-1);
    isValidLastChar = VALID_CHARACTER.test(lastChar)
    isValidSpecialChar = specialCharCheck(fieldValue)
  }
  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve()
    } else if (!isValidLastChar) {
      reject(new ValidationError({
        summary: `ds1500:${dataContext.fieldName}.endCharInvalid`
      }));
    } else if (!isValidSpecialChar) {
      reject(new ValidationError({
        summary: `ds1500:${dataContext.fieldName}.specialChar`
      }));
    } else {
      reject(new ValidationError({
        summary: `ds1500:${dataContext.fieldName}.pattern`
      }));
    }
  })
}

const isValidPhoneNumber = (fieldValue) => {
  try {
    const number = phoneUtil.parse(fieldValue, 'GB')
    const isValidNum = VALID_TELEPHONE_CHARACTER.test(fieldValue) && phoneUtil.isValidNumber(number)
    return new Promise((resolve, reject) => {
      if (isValidNum) {
        resolve()
      }
      if (!isValidNum) {
        reject(new ValidationError({
          summary: 'ds1500:gpPhone.invalid'
        }));
      }
    })
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(new ValidationError({
        summary: 'ds1500:gpPhone.invalid'
      }))
    })
  }
}

function hasValidWords (fieldValue, dataContext) {
  let words = []
  const LENGTH_LIMIT = 58
  const { fieldName } = dataContext
  if (fieldValue) {
    words = fieldValue.split(/\s/)
  }

  const isValid = words.every((word) => word.length < LENGTH_LIMIT);

  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve();
    } else {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.wordTooLong`,
        inline: `ds1500:${fieldName}.wordTooLong`
      }));
    }
  })
}

module.exports = {
  isValidPatientName,
  isValidPhoneNumber,
  hasValidWords,
  specialCharCheck
}
