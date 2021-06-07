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

describe('validation: representativeName', function () {
  it('should accept standard names', function () {
    browser.fill('representativeName', 'John Smith');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#representativeName-error li')).not.to.exist; // eslint-disable-line
  });

  it('should not trigger error if left blank', function () {
    browser.fill('representativeName', '');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#representativeName-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('representativeName', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#representativeName-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });
});

describe('validation: representativeAddress', function () {
  it('should accept standard addresses', function () {
    browser.fill('patientAddress', '10 street name, town name, city name');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#representativeAddress-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('representativeAddress', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#representativeAddress-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });
});

describe('validation: representativePostcode', function () {
  it('should accept standard postcodes', function () {
    browser.fill('patientPostcode', 'S8 0GA');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#representativePostcode-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('representativePostcode', '!@#$%^&');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#representativePostcode-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject postcodes longer than 8 characters', function () {
    browser.fill('representativePostcode', '123456789');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#representativePostcode-error .parsley-maxlength', 'Representative postcode has a maximum length of 8 characters');
  });
});
