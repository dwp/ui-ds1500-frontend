const chai = require('chai');
const moment = require('moment');
const expect = chai.expect;
const { dateFieldToMoment, approximateDateFieldToMoment, isDateValue, isDateSummaryValue, formatDateObject, formatDateSummaryObject } = require('../../../utils/standard-date-formatters');

describe('dateUtils', () => {
  const validDate = {
    yyyy: '2000', mm: '01', dd: '01'
  }

  const validDateSummary = {
    yyyy: '2000', mm: '01'
  }

  describe('dateFieldToMoment', () => {
    it('should return expected value', () => {
      const dateField = { ...validDate }
      const expectedDate = moment.utc('2000-01-01')
      expect(dateFieldToMoment(dateField).isSame(expectedDate)).to.equal(true)
    })
  })

  describe('approximateDateFieldToMoment', () => {
    it('should return expected value', () => {
      const dateField = {
        ...validDate, dd: '13'
      }
      const expectedDate = moment.utc('2000-01-01')
      expect(approximateDateFieldToMoment(dateField).isSame(expectedDate)).to.equal(true)
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
        dd: '01',
        mm: '01'
      }

      const invalidDateField2 = {
        dd: '01'
      }

      const invalidDateField3 = {
        mm: '01'
      }

      const invalidDateField4 = {
        yyyy: '2000'
      }

      const invalidDateField5 = {
        dd: '01',
        yyyy: '2000'
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

      expect(formatDateObject(dateField)).to.equal('1 January 2000')
    })

    it('should return "INVALID DATE OBJECT" if invalid date object', () => {
      const dateField = { ...validDateSummary }

      expect(formatDateObject(dateField)).to.equal('INVALID DATE OBJECT')
    })
  })

  describe('formatDateSummaryObject', () => {
    it('should return dateString if valid date summaryobject', () => {
      const dateField = { ...validDate }

      expect(formatDateObject(dateField)).to.equal('1 January 2000')
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
