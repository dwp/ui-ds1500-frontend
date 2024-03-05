const chai = require('chai');
const { DateTime } = require('luxon');
const expect = chai.expect;
const { dateFieldToLuxon, approximateDateFieldToLuxon, isDateValue, isDateSummaryValue, formatDateObject, formatDateSummaryObject } = require('../../../utils/standard-date-formatters');

describe('dateUtils', () => {
  const validDate = {
    yyyy: 2000, mm: 5, dd: 1
  }

  const validDateSummary = {
    yyyy: 2000, mm: 6
  }

  describe('dateFieldToLuxon', () => {
    it('should return expected value', () => {
      const dateField = { ...validDate }
      const createdOnLuxon = DateTime.utc(2000, 5, 1);
      expect(dateFieldToLuxon(dateField).equals(createdOnLuxon)).to.equal(true)
    })
  })

  describe('approximateDateFieldToLuxon', () => {
    it('should return expected value', () => {
      const dateField = {
        ...validDate, dd: 13
      }
      const expectedDate = DateTime.utc(2000, 5, 13);
      expect(approximateDateFieldToLuxon(dateField).equals(expectedDate)).to.equal(true)
    })
  })

  describe('isDateValue', () => {
    it('should return true if correct date structure', () => {
      const dateField = { ...validDate }

      expect(isDateValue(dateField)).to.equal(true)
    })

    it('should return false if incorrect date structure', () => {
      const invalidDateField = { ...validDateSummary }
      const invalidDateField1 = {
        dd: 1,
        mm: 6
      }

      const invalidDateField2 = {
        dd: 1
      }

      const invalidDateField3 = {
        mm: 1
      }

      const invalidDateField4 = {
        yyyy: 2000
      }

      const invalidDateField5 = {
        dd: 1,
        yyyy: 2000
      }

      const invalidDateField6 = {}

      expect(isDateValue(invalidDateField)).to.equal(false)
      expect(isDateValue(invalidDateField1)).to.equal(false)
      expect(isDateValue(invalidDateField2)).to.equal(false)
      expect(isDateValue(invalidDateField3)).to.equal(false)
      expect(isDateValue(invalidDateField4)).to.equal(false)
      expect(isDateValue(invalidDateField5)).to.equal(false)
      expect(isDateValue(invalidDateField6)).to.equal(false)
    })
  })

  describe('isDateSummaryValue', () => {
    it('should return true if correct date summary structure', () => {
      const dateField = { ...validDateSummary }

      expect(isDateSummaryValue(dateField)).to.equal(true)
    })

    it('should return false if incorrect date structure', () => {
      const invalidDateField = {
        dd: '01',
        mm: '01'
      }

      const invalidDateField1 = {
        dd: '01'
      }

      const invalidDateField2 = {
        mm: '01'
      }

      const invalidDateField3 = {
        yyyy: '2000'
      }

      const invalidDateField4 = {}

      expect(isDateSummaryValue(invalidDateField)).to.equal(false)
      expect(isDateSummaryValue(invalidDateField1)).to.equal(false)
      expect(isDateSummaryValue(invalidDateField2)).to.equal(false)
      expect(isDateSummaryValue(invalidDateField3)).to.equal(false)
      expect(isDateSummaryValue(invalidDateField4)).to.equal(false)
    })
  })

  describe('formatDateObject', () => {
    it('should return dateString if valid date object', () => {
      const dateField = { ...validDate }

      expect(formatDateObject(dateField)).to.equal('1 May 2000')
    })

    it('should return "INVALID DATE OBJECT" if invalid date object', () => {
      const dateField = { ...validDateSummary }

      expect(formatDateObject(dateField)).to.equal('INVALID DATE OBJECT')
    })
  })

  describe('formatDateSummaryObject', () => {
    it('should return dateString if valid date summaryobject', () => {
      const dateField = { ...validDateSummary }

      expect(formatDateSummaryObject(dateField)).to.equal('June 2000')
    })

    it('should return "INVALID DATE OBJECT" if invalid date object', () => {
      const invalidDateField = {
        dd: '01',
        mm: '01'
      }

      const invalidDateField1 = {
        dd: '01'
      }

      const invalidDateField2 = {
        mm: '01'
      }

      const invalidDateField3 = {
        yyyy: '2000'
      }

      const invalidDateField4 = {}

      expect(formatDateSummaryObject(invalidDateField)).to.equal('INVALID DATE SUMMARY OBJECT')
      expect(formatDateSummaryObject(invalidDateField1)).to.equal('INVALID DATE SUMMARY OBJECT')
      expect(formatDateSummaryObject(invalidDateField2)).to.equal('INVALID DATE SUMMARY OBJECT')
      expect(formatDateSummaryObject(invalidDateField3)).to.equal('INVALID DATE SUMMARY OBJECT')
      expect(formatDateSummaryObject(invalidDateField4)).to.equal('INVALID DATE SUMMARY OBJECT')
    })
  })
})
