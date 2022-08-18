const chai = require('chai');
const expect = chai.expect;

const { isValidPhoneNumber, hasValidWords, isValidPatientName, specialCharCheck, hasValidWordsPatientName, hasValidWordsRepresentativeDetails, checkWordsValid } = require('../../../../lib/validation-rules/ds1500');
const { validNumbers } = require('../../../helpers/commonValues');

const expectedErrorMsg = (fieldName, errKey) => {
  return [{
    focusSuffix: [],
    inline: `ds1500:${fieldName}.${errKey}`,
    message: `ds1500:${fieldName}.${errKey}`,
    summary: `ds1500:${fieldName}.${errKey}`,
    variables: {},
    field: undefined,
    fieldHref: undefined,
    fieldKeySuffix: undefined,
    validator: undefined
  }]
}

describe('isValidPatientName', () => {
  const field = { fieldName: 'patientName' }
  it('should throw error message if name contain invalid characters at end', () => {
    const fieldValue = 'test@';
    return expect(isValidPatientName(fieldValue, field)).to.eql(expectedErrorMsg(field.fieldName, 'endCharInvalid'))
  })
  it('should throw error message if it contains special chars ', () => {
    const fieldValue = 'te@st';
    return expect(isValidPatientName(fieldValue, field)).to.eql(expectedErrorMsg(field.fieldName, 'pattern'))
  })
  it('should throw error if name contains other than letters, spaces, hyphens, apostrophes and full stops', () => {
    const fieldValue = 'test=?+tester';
    return expect(isValidPatientName(fieldValue, field)).to.eql(expectedErrorMsg(field.fieldName, 'pattern'))
  })
  it('should not throw error if name contains spaces', () => {
    const fieldValue = 'john smith';
    return expect(isValidPatientName(fieldValue, field)).to.eql([])
  })
  it('should not throw error if name contains hyphens', () => {
    const fieldValue = 'john-smith';
    return expect(isValidPatientName(fieldValue, field)).to.eql([])
  })
  it('should not throw error if name contains apostrophes', () => {
    const fieldValue = "Nei'l";
    return expect(isValidPatientName(fieldValue, field)).to.eql([])
  })
  it('should not throw error if it is valid name', () => {
    const fieldValue = "Nei'l armstrong";
    return expect(isValidPatientName(fieldValue, field)).to.eql([])
  })
})

describe('specialCharCheck', () => {
  it('should return true if first character of a string is an alphabet', () => {
    const str = 'John'
    expect(specialCharCheck(str)).to.be.equal(true)
  })
  it('should return false if first character of a string is not an alphabet', () => {
    const str = '@John'
    expect(specialCharCheck(str)).to.be.equal(false)
  })
  it('should return true if adjacent two character are alphabets whole string', () => {
    const str = 'John smith'
    expect(specialCharCheck(str)).to.be.equal(true)
  })
  it('should return false if adjacent two character are not alphabets', () => {
    const str = 'John- smith'
    expect(specialCharCheck(str)).to.be.equal(false)
  })
})

describe('ds1500 validations: GP Phone Number', () => {
  describe('isValidPhoneNumber', () => {
    const field = { fieldName: 'gpPhone' }
    it('should throw error if number contain non numeric characters', () => {
      const fieldValue = '07432-1234';
      return expect(isValidPhoneNumber(fieldValue)).to.eql(expectedErrorMsg(field.fieldName, 'invalid'))
    })
    it('should throw error if fewer than 9 digits', () => {
      const fieldValue = '01234567';
      return expect(isValidPhoneNumber(fieldValue)).to.eql(expectedErrorMsg(field.fieldName, 'invalid'))
    })
    it('should throw error if more than 15 digits', () => {
      const fieldValue = '01234567891234567';
      return expect(isValidPhoneNumber(fieldValue)).to.eql(expectedErrorMsg(field.fieldName, 'invalid'))
    })

    validNumbers.forEach((fieldValue) => {
      it('should not throw error if it is valid number', () => {
        return expect(isValidPhoneNumber(fieldValue)).to.eql([])
      })
    })
  })
})

describe('ds1500 validations: Diagnosis', () => {
  describe('hasValidWords', () => {
    const dataContext = {
      waypointId: 'testPage',
      fieldName: 'diagnosis',
      journeyContext: {
        getDataForPage: function () {
          return this.testPage
        },
        testPage: {
          diagnosis: ''
        }
      }
    }
    const wordLengthLimit = 58
    const testValues = {
      upperLimit: 'a'.repeat(wordLengthLimit + 1),
      passLimit: 'a'.repeat(wordLengthLimit),
      lowerLimit: 'a'
    }

    const sentencePrefix = 'This is a test sentence '

    it('should throw error if contains words greater than word length limit', () => {
      return expect(hasValidWords(sentencePrefix + testValues.upperLimit, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'wordTooLong'))
    })
    it('should not throw error if words are on the boundary of the word length limit', () => {
      return expect(hasValidWords(sentencePrefix + testValues.passLimit, dataContext)).to.eql([])
    })
    it('should not throw error if words are well within the word length limit', () => {
      return expect(hasValidWords(sentencePrefix + testValues.lowerLimit, dataContext)).to.eql([])
    })
    it('should not throw error if string is empty', () => {
      return expect(hasValidWords('', dataContext)).to.eql([])
    })
  })
});

describe('ds1500 validations: RepresentativeName', () => {
  describe('hasValidWordsRepresentativeDetails', () => {
    const dataContext = {
      waypointId: 'testPage',
      fieldName: 'representativeName',
      journeyContext: {
        getDataForPage: function () {
          return this.testPage
        },
        testPage: {
          representativeName: ''
        }
      }
    }
    const wordLengthLimit = 43
    const testValues = {
      upperLimit: 'a'.repeat(wordLengthLimit + 1),
      passLimit: 'a'.repeat(wordLengthLimit),
      lowerLimit: 'a'
    }

    const sentencePrefix = 'This is a test sentence '

    it('should throw error if contains words greater than word length limit', () => {
      return expect(hasValidWordsRepresentativeDetails(sentencePrefix + testValues.upperLimit, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'wordTooLong'))
    })
    it('should not throw error if words are on the boundary of the word length limit', () => {
      return expect(hasValidWordsRepresentativeDetails(sentencePrefix + testValues.passLimit, dataContext)).to.eql([])
    })
    it('should not throw error if words are well within the word length limit', () => {
      return expect(hasValidWordsRepresentativeDetails(sentencePrefix + testValues.lowerLimit, dataContext)).to.eql([])
    })
    it('should not throw error if string is empty', () => {
      return expect(hasValidWordsRepresentativeDetails('', dataContext)).to.eql([])
    })
  })
});

describe('checkWordsValid', () => {
  const dataContext = {
    waypointId: 'testPage',
    fieldName: 'diagnosis',
    journeyContext: {
      getDataForPage: function () {
        return this.testPage
      },
      testPage: {
        diagnosis: ''
      }
    }
  }
  const wordLengthLimit = 58
  const testValues = {
    upperLimit: 'a'.repeat(wordLengthLimit + 1),
    passLimit: 'a'.repeat(wordLengthLimit),
    lowerLimit: 'a'
  }

  const sentencePrefix = 'This is a test sentence '

  it('should throw error if contains words greater than word length limit', () => {
    return expect(checkWordsValid(sentencePrefix + testValues.upperLimit, wordLengthLimit, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'wordTooLong'))
  })
  it('should not throw error if words are on the boundary of the word length limit', () => {
    return expect(checkWordsValid(sentencePrefix + testValues.passLimit, wordLengthLimit, dataContext)).to.eql([])
  })
  it('should not throw error if words are well within the word length limit', () => {
    return expect(checkWordsValid(sentencePrefix + testValues.lowerLimit, wordLengthLimit, dataContext)).to.eql([])
  })
  it('should not throw error if string is empty', () => {
    return expect(checkWordsValid('', wordLengthLimit, dataContext)).to.eql([])
  })
});

describe('hasValidWordsPatientName', () => {
  const dataContext = {
    waypointId: 'testPage',
    fieldName: 'patientName',
    journeyContext: {
      getDataForPage: function () {
        return this.testPage
      },
      testPage: {
        patientName: ''
      }
    }
  }
  it('should throw error if both first words greater than 58 characters long and last word greater than 35 characters', () => {
    const fieldValue = 'a'.repeat(59) + ' ' + 'b'.repeat(36)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'firstLastTooLong'))
  })
  it('should throw error if first word is less than 2 characters', () => {
    const fieldValue = 'a';
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'wordTooShort'))
  })
  it('should throw error if first words greater than 58 characters long', () => {
    const fieldValue = 'a'.repeat(59);
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'lastWordTooLong'))
  })
  it('should throw error if last word greater than 35 characters long', () => {
    const fieldValue = 'a'.repeat(50) + ' ' + 'b'.repeat(36)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'lastWordTooLong'))
  })
  it('should not throw error if it is valid name, first words less than 58 characters long and last word less than 35 characters long', () => {
    const fieldValue = 'a'.repeat(10) + ' ' + 'b'.repeat(5)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.eql([])
  })
})
