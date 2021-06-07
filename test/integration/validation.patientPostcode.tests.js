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

describe('validation: patientPostcode', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientPostcode', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientPostcode-error .parsley-required', 'Enter your patient\'s postcode');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('patientPostcode', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientPostcode-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject postcodes longer than 8 characters', function () {
    browser.fill('patientPostcode', '123456789');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientPostcode-error .parsley-maxlength', 'Your patient\'s postcode has a maximum length of 8 characters');
  });

  it('should accept standard postcodes', function () {
    browser.fill('patientPostcode', 'S8 0GA');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientPostcode-error li')).not.to.exist; // eslint-disable-line
  });
});
