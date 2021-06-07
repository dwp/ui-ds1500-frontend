const Browser = require('zombie');
const chai = require('chai');
const expect = chai.expect;
const { CONFIRM_BTN } = require('./constants');

Browser.localhost('localhost', 3000);
Browser.silent = true;

const browser = new Browser();

before(function () {
  return browser.visit('/ds1500');
});

describe('validation: otherDiagnoses', function () {
  it('should not trigger error if left blank', function () {
    browser.fill('otherDiagnoses', '');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#otherDiagnoses-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('otherDiagnoses', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#otherDiagnoses-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject strings longer than 132 characters', function () {
    browser.fill('otherDiagnoses', '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#otherDiagnoses-error .parsley-maxlength', 'Other relevant diagnoses has a maximum length of 132 characters');
  });

  it('should accept standard values', function () {
    browser.fill('otherDiagnoses', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue tortor ex, ut lobortis est venenatis at.');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#otherDiagnoses-error li')).not.to.exist; // eslint-disable-line
  });
});
