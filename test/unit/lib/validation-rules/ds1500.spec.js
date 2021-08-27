const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { isValidPhoneNumber, hasValidWords, isValidPatientName, specialCharCheck, hasValidWordsPatientName } = require('../../../../lib/validation-rules/ds1500');
const { validNumbers } = require('../../../helpers/commonValues');

describe('isValidPatientName', () => {
  it('should reject if name contain invalid characters at end', () => {
    const fieldValue = 'test@';
    return expect(isValidPatientName(fieldValue)).to.be.rejected
  })
  it('should reject if it contains special chars ', () => {
    const fieldValue = 'te@st';
    return expect(isValidPatientName(fieldValue)).to.be.rejected
  })
  it('should reject if name contains other than letters, spaces, hyphens, apostrophes and full stops', () => {
    const fieldValue = 'test=?+tester';
    return expect(isValidPatientName(fieldValue)).to.be.rejected
  })
  it('should resolve if name contains spaces', () => {
    const fieldValue = 'john smith';
    return expect(isValidPatientName(fieldValue)).to.be.fulfilled
  })
  it('should resolve if name contains hyphens', () => {
    const fieldValue = 'john-smith';
    return expect(isValidPatientName(fieldValue)).to.be.fulfilled
  })
  it('should resolve if name contains apostrophes', () => {
    const fieldValue = "Nei'l";
    return expect(isValidPatientName(fieldValue)).to.be.fulfilled
  })
  it('should resolve if it is valid name', () => {
    const fieldValue = "Nei'l armstrong";
    return expect(isValidPatientName(fieldValue)).to.be.fulfilled
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
    it('should reject if number contain non numeric characters', () => {
      const fieldValue = '+07432-1234';
      return expect(isValidPhoneNumber(fieldValue)).to.be.rejected
    })
    it('should reject if fewer than 9 digits', () => {
      const fieldValue = '01234567';
      return expect(isValidPhoneNumber(fieldValue)).to.be.rejected
    })
    it('should reject if more than 15 digits', () => {
      const fieldValue = '01234567891234567';
      return expect(isValidPhoneNumber(fieldValue)).to.be.rejected
    })

    validNumbers.forEach((fieldValue) => {
      console.log({ fieldValue })
      it('should resolve if it is valid number', () => {
        return expect(isValidPhoneNumber(fieldValue)).to.be.fulfilled
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
    const testValues = {
      upperLimit: 'a'.repeat(59),
      pastLimit: 'a'.repeat(57),
      lowerLmit: 'a'
    }

    const sentencePrefix = 'This is a test sentence '

    it('should reject if contains words greater than 58 characters long', () => {
      return expect(hasValidWords(sentencePrefix + testValues.upperLimit, dataContext)).to.be.rejected
    })
    it('should resolve if words are within pass limit', () => {
      return expect(hasValidWords(sentencePrefix + testValues.pastLimit, dataContext)).to.be.fulfilled
    })
    it('should resolve if words are within lower limit', () => {
      return expect(hasValidWords(sentencePrefix + testValues.lowerLmit, dataContext)).to.be.fulfilled
    })
    it('should resolve if string is empty', () => {
      return expect(hasValidWords('', dataContext)).to.be.fulfilled
    })
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
  it('should reject if both first words greater than 58 characters long and last word greater than 35 characters', () => {
    const fieldValue = 'a'.repeat(59) + ' ' + 'b'.repeat(36)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.be.rejected
  })
  it('should reject if first word is less than 2 characters', () => {
    const fieldValue = 'a';
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.be.rejected
  })
  it('should reject if first words greater than 58 characters long', () => {
    const fieldValue = 'a'.repeat(59);
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.be.rejected
  })
  it('should reject if last word greater than 35 characters long', () => {
    const fieldValue = 'a'.repeat(50) + ' ' + 'b'.repeat(36)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.be.rejected
  })
  it('should resolve if it is valid name, first words less than 58 characters long and last word less than 35 characters long', () => {
    const fieldValue = 'a'.repeat(10) + ' ' + 'b'.repeat(5)
    return expect(hasValidWordsPatientName(fieldValue, dataContext)).to.be.fulfilled
  })
})
