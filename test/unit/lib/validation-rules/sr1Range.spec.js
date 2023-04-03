const chai = require('chai');
const expect = chai.expect;
const sr1Range = require('../../../../lib/validation-rules/sr1Range');

const expectedErrorMsg = (fieldName) => {
  return [{
    focusSuffix: [],
    inline: `validation:rule.${fieldName}.inline`,
    message: `validation:rule.${fieldName}.summary`,
    summary: `validation:rule.${fieldName}.summary`,
    variables: {},
    field: undefined,
    fieldHref: undefined,
    fieldKeySuffix: undefined,
    validator: undefined
  }]
}

describe('Validation rule: sr1Range', function () {
  const r1 = sr1Range.bind({
    min: 1890,
    max: 2018
  })

  it('should exist', function () {
      expect(sr1Range).to.exist; // eslint-disable-line
  });

  it('should not throw error message if values are within range', function () {
    expect(r1('2017')).to.eql([]);
    expect(r1('1890')).to.eql([]);
    expect(r1('2018')).to.eql([]);
  });

  it('should throw error messages if values are outside of range', function () {
    expect(r1('1889')).to.eql(expectedErrorMsg('dateObject'))
    expect(r1('1747')).to.eql(expectedErrorMsg('dateObject'))
    expect(r1('2019')).to.eql(expectedErrorMsg('dateObject'))
    expect(r1('3020')).to.eql(expectedErrorMsg('dateObject'))
  });
});
