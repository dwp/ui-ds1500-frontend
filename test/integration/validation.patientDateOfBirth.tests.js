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

describe('validation: patientDateOfBirthDay', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientDateOfBirthDay', '');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-required', 'Enter your patient\'s day of birth');
  });

  it('should reject values outside the range 1 and 31', function () {
    browser.fill('patientDateOfBirthDay', '0');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-range', 'Day must be between 1 and 31');
  });

  it('should accept values inside the range 1 and 31', function () {
    browser.fill('patientDateOfBirthDay', '5');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientDateOfBirth-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: patientDateOfBirthMonth', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-required', 'Enter your patient\'s month of birth');
  });

  it('should reject values outside the range 1 and 12', function () {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '0');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-range', 'Month must be between 1 and 12');
  });

  it('should accept values inside the range 1 and 12', function () {
    browser.fill('patientDateOfBirthDay', '5');
    browser.fill('patientDateOfBirthMonth', '3');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientDateOfBirth-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: patientDateOfBirthYear', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-required', 'Enter your patient\'s year of birth');
  });

  it('should reject values outside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '1889');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientDateOfBirth-error .parsley-range', 'Enter a valid year');
  });

  it('should accept values inside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('patientDateOfBirthDay', '5');
    browser.fill('patientDateOfBirthMonth', '3');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientDateOfBirth-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: patientDateOfBirth', function () {
  it('should accept valid dates', function () {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '4');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientDateOfBirth-error li')).not.to.exist; // eslint-disable-line
  });

  it('should accept valid dates with leading zeros', function () {
    browser.fill('patientDateOfBirthDay', '01');
    browser.fill('patientDateOfBirthMonth', '04');
    browser.fill('patientDateOfBirthYear', '2017');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientDateOfBirth-error li')).not.to.exist; // eslint-disable-line
  });

  it('should reject invalid dates', function (done) {
    browser.fill('patientDateOfBirthDay', '31');
    browser.fill('patientDateOfBirthMonth', '2');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#patientDateOfBirth-error li');
    }
    browser.wait(loaded, function () {
      browser.assert.text('#patientDateOfBirth-error li', 'The date of birth does not seem to be a valid date');
      done();
    });
  });
});
