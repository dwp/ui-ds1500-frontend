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

const isValidPatientName = (value, { fieldName }) => {
  let lastChar, isValid, isValidLastChar, isValidSpecialChar
  if (value) {
    isValid = VALID_NAME.test(value)
    lastChar = value.slice(-1);
    isValidLastChar = VALID_CHARACTER.test(lastChar)
    isValidSpecialChar = specialCharCheck(value)
  }
  if (isValid) {
    return []
  } else if (!isValidLastChar) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.endCharInvalid`
      }
    })]
  } else if (!isValidSpecialChar) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.specialChar`
      }
    })];
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.pattern`
      }
    })];
  }
}

const isValidPhoneNumber = (value) => {
  let isValidNum
  if (value && VALID_TELEPHONE_CHARACTER.test(value)) {
    const number = phoneUtil.parse(value, 'GB')
    isValidNum = phoneUtil.isValidNumber(number)
  } else {
    isValidNum = false
  }

  if (isValidNum) {
    return []
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: 'ds1500:gpPhone.invalid'
      }
    })]
  }
}

function hasValidWords (value, { fieldName }) {
  const STANDARD_LENGTH_LIMIT = 58
  return checkWordsValid(value, STANDARD_LENGTH_LIMIT, { fieldName })
}

function hasValidWordsRepresentativeDetails (value, { fieldName }) {
  const REPRESENTATIVE_LENGTH_LIMIT = 43
  return checkWordsValid(value, REPRESENTATIVE_LENGTH_LIMIT, { fieldName })
}

function checkWordsValid (value, lengthLimit, { fieldName }) {
  let words = []
  if (value) {
    words = value.split(/\s/)
  }

  const isValid = words.every((word) => word.length <= lengthLimit);

  if (isValid) {
    return []
  } else {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.wordTooLong`,
        inline: `ds1500:${fieldName}.wordTooLong`
      }
    })]
  }
}

function hasValidWordsPatientName (value, { fieldName }) {
  const words = value.split(/\s/);
  const WORD_LENGTH_LIMIT = 58
  const LAST_WORD_LENGTH_LIMIT = 35
  let isValidFirstWords, isValidLastWord, isFirstWordTooShort
  if (words.length > 1) {
    const lastWord = words.pop();
    isValidFirstWords = words.every((word) => word.length <= WORD_LENGTH_LIMIT);
    isValidLastWord = lastWord.length <= LAST_WORD_LENGTH_LIMIT
    isFirstWordTooShort = words.every((word) => word.length < 2);
  } else {
    isFirstWordTooShort = value.length < 2
    isValidFirstWords = true
    isValidLastWord = value.length <= LAST_WORD_LENGTH_LIMIT
  }

  const isValid = isValidFirstWords && isValidLastWord && !isFirstWordTooShort

  if (isValid) {
    return [];
  } else if (!isValidFirstWords && !isValidLastWord) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.firstLastTooLong`,
        inline: `ds1500:${fieldName}.firstLastTooLong`
      }
    })];
  } else if (isFirstWordTooShort) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.wordTooShort`,
        inline: `ds1500:${fieldName}.wordTooShort`
      }
    })];
  } else if (!isValidFirstWords) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.firstWordTooLong`,
        inline: `ds1500:${fieldName}.firstWordTooLong`
      }
    })];
  } else if (!isValidLastWord) {
    return [ValidationError.make({
      errorMsg: {
        summary: `ds1500:${fieldName}.lastWordTooLong`,
        inline: `ds1500:${fieldName}.lastWordTooLong`
      }
    })];
  }
}

module.exports = {
  isValidPatientName,
  isValidPhoneNumber,
  hasValidWords,
  specialCharCheck,
  hasValidWordsPatientName,
  hasValidWordsRepresentativeDetails,
  checkWordsValid
}
