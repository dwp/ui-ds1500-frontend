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

describe('validation: dateOfDiagnosisDay', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfDiagnosisDay', '');
    browser.fill('dateOfDiagnosisMonth', '1');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-required', 'Enter day of diagnosis');
  });

  it('should reject values outside the range 1 and 31', function () {
    browser.fill('dateOfDiagnosisDay', '0');
    browser.fill('dateOfDiagnosisMonth', '1');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-range', 'Day must be between 1 and 31');
  });

  it('should accept values inside the range 1 and 31', function () {
    browser.fill('dateOfDiagnosisDay', '2');
    browser.fill('dateOfDiagnosisMonth', '2');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfDiagnosisMonth', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-required', 'Enter month of diagnosis');
  });

  it('should reject values outside the range 1 and 12', function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '0');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-range', 'Month must be between 1 and 12');
  });

  it('should accept values inside the range 1 and 12', function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '2');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfDiagnosisYear', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '1');
    browser.fill('dateOfDiagnosisYear', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-required', 'Enter year of diagnosis');
  });

  it('should reject values outside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '1');
    browser.fill('dateOfDiagnosisYear', '1889');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfDiagnosis-error .parsley-range', 'Enter a valid year');
  });

  it('should accept values inside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('dateOfDiagnosisDay', '1');
    browser.fill('dateOfDiagnosisMonth', '7');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfDiagnosis', function () {
  it('should accept valid dates', function () {
    browser.fill('dateOfDiagnosisDay', '2');
    browser.fill('dateOfDiagnosisMonth', '4');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });

  it('should accept valid dates with leading zeros', function () {
    browser.fill('dateOfDiagnosisDay', '02');
    browser.fill('dateOfDiagnosisMonth', '04');
    browser.fill('dateOfDiagnosisYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });

  it('should accept diagnosis dates after dob dates', function () {
    browser.fill('patientDateOfBirthDay', '31');
    browser.fill('patientDateOfBirthMonth', '1');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.fill('dateOfDiagnosisDay', new Date().getDay() + 1);
    browser.fill('dateOfDiagnosisMonth', new Date().getMonth());
    browser.fill('dateOfDiagnosisYear', new Date().getFullYear());
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfDiagnosis-error li')).not.to.exist; // eslint-disable-line
  });

  it('should reject future dates', function (done) {
    browser.fill('patientDateOfBirthDay', '1');
    browser.fill('patientDateOfBirthMonth', '4');
    browser.fill('patientDateOfBirthYear', '1981');
    browser.fill('dateOfDiagnosisDay', new Date().getDay() + 1).toString();
    browser.fill('dateOfDiagnosisMonth', new Date().getMonth()).toString();
    browser.fill('dateOfDiagnosisYear', new Date().getFullYear().toString());
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#dateOfDiagnosis-error li').innerHtml === 'Diagnosis cannot be in the future';
    }
    browser.wait(loaded, function () {
      browser.assert.text('#dateOfDiagnosis-error', 'Diagnosis cannot be in the future');
      done();
    });
  });

  it('should reject diagnosis dates before dob dates', function (done) {
    browser.fill('patientDateOfBirthDay', '01');
    browser.fill('patientDateOfBirthMonth', '04');
    browser.fill('patientDateOfBirthYear', '2017');
    browser.fill('dateOfDiagnosisDay', '01');
    browser.fill('dateOfDiagnosisMonth', '01');
    browser.fill('dateOfDiagnosisYear', '2017');
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#dateOfDiagnosis-error li').innerHtml === 'The date of diagnosis should not be before the patient\'s date of birth';
    }
    browser.wait(loaded, function () {
      browser.assert.text('#dateOfDiagnosis-error', 'The date of diagnosis should not be before the patient\'s date of birth');
      done();
    });
  });
});
