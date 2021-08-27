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

function hasValidWordsPatientName (fieldValue, dataContext) {
  const words = fieldValue.split(/\s/);
  const { fieldName } = dataContext
  const WORD_LENGTH_LIMIT = 58
  const LAST_WORD_LENGTH_LIMIT = 35
  let isValidFirstWords, isValidLastWord, isFirstWordTooShort
  if (words.length > 1) {
    const lastWord = words.pop();
    isValidFirstWords = words.every((word) => word.length <= WORD_LENGTH_LIMIT);
    isValidLastWord = lastWord.length <= LAST_WORD_LENGTH_LIMIT
    isFirstWordTooShort = words.every((word) => word.length < 2);
  } else {
    isFirstWordTooShort = fieldValue.length < 2
    isValidFirstWords = true
    isValidLastWord = fieldValue.length <= LAST_WORD_LENGTH_LIMIT
  }

  const isValid = isValidFirstWords && isValidLastWord && !isFirstWordTooShort
  return new Promise((resolve, reject) => {
    if (isValid) {
      resolve();
    } else if (!isValidFirstWords && !isValidLastWord) {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.firstLastTooLong`,
        inline: `ds1500:${fieldName}.firstLastTooLong`
      }));
    } else if (isFirstWordTooShort) {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.wordTooShort`,
        inline: `ds1500:${fieldName}.wordTooShort`
      }));
    } else if (!isValidFirstWords) {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.firstWordTooLong`,
        inline: `ds1500:${fieldName}.firstWordTooLong`
      }));
    } else if (!isValidLastWord) {
      reject(new ValidationError({
        summary: `ds1500:${fieldName}.lastWordTooLong`,
        inline: `ds1500:${fieldName}.lastWordTooLong`
      }));
    }
  })
}

module.exports = {
  isValidPatientName,
  isValidPhoneNumber,
  hasValidWords,
  specialCharCheck,
  hasValidWordsPatientName
}
