const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const { validNumbers } = require('../../../helpers/commonValues');
const validators = require('../../../../definitions/field-validators/ds1500');

const defaultValidators = {
  patientName: '',
  patientAddress: '',
  patientDateOfBirth: { dd: '', mm: '', yyyy: '' },
  dateOfDiagnosis: { dd: '', mm: '', yyyy: '' },
  patientNino: '',
  patientAware: '',
  formRequester: '',
  representativeName: '',
  representativePostcode: '',
  clinicalFeatures: ''
}

describe('Validators: ds1500', () => {
  describe('field: patientName', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientName', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:patientName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientName', 'Required', { patientName: 'test-value' });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const patientName = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'patientName', 'hasValidWords', { ...defaultValidators, patientName }, {
        summary: 'ds1500:patientName.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 58 characters long', async () => {
      const patientName = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'patientName', 'hasValidWords', { ...defaultValidators, patientName });
    });

    it('should fail "isValidPatientName" validator if name has special char at end', async () => {
      const patientName = 'test@'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', { ...defaultValidators, patientName }, {
        summary: 'ds1500:patientName.endCharInvalid'
      });
    });

    it('should fail "isValidPatientName" validator if name has special char', async () => {
      const patientName = '@test'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', { ...defaultValidators, patientName }, {
        summary: 'ds1500:patientName.specialChar'
      });
    });

    it('should fail "isValidPatientName" validator if name is invalid', async () => {
      const patientName = 'test12t'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', { ...defaultValidators, patientName }, {
        summary: 'ds1500:patientName.pattern'
      });
    });

    it('should pass "isValidPatientName" validator if name is valid', async () => {
      const patientName = 'test tester'
      await expectValidatorToPass(validators, 'patientName', 'isValidPatientName', { ...defaultValidators, patientName });
    });
  });

  describe('field: patientAddress', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientAddress', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:patientAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientAddress = 'London'
      await expectValidatorToPass(validators, 'patientAddress', 'Required', { ...defaultValidators, patientAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientAddress = '12 London road'
      await expectValidatorToPass(validators, 'patientAddress', 'Regex', { ...defaultValidators, patientAddress });
    });
  })

  describe('field: patientPostcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientPostcode', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:patientPostcode.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientPostcode = 'SW1 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'Required', { ...defaultValidators, patientPostcode });
    });

    it('should fail "strlen" validator if invalid value is provided', async () => {
      const patientPostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'patientPostcode', 'Strlen', { ...defaultValidators, patientPostcode }, {
        summary: 'ds1500:patientPostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid value is provided', async () => {
      const patientPostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'Strlen', { ...defaultValidators, patientPostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const patientPostcode = '11X X11'
      await expectValidatorToFail(validators, 'patientPostcode', 'Regex', { ...defaultValidators, patientPostcode }, {
        summary: 'ds1500:patientPostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientPostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'patientPostcode', 'Regex', { ...defaultValidators, patientPostcode });
    });
  })

  describe('field: patientNino', () => {
    it('should pass "optional" validator if no nino provided', async () => {
      await expectValidatorToPass(validators, 'patientNino', 'optional', { ...defaultValidators });
    });

    it('should fail "nino" validator if invalid nino provided', async () => {
      const patientNino = 'ABCD123456'
      await expectValidatorToFail(validators, 'patientNino', 'Nino', { ...defaultValidators, patientNino }, {
        summary: 'ds1500:patientNino.invalid'
      });
    });

    it('should pass "nino" validator if valid nino provided', async () => {
      const patientNino = 'AA370773A'
      await expectValidatorToPass(validators, 'patientNino', 'Nino', { ...defaultValidators, patientNino });
    });
  });

  describe('field: diagnosis', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'diagnosis', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:diagnosis.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'diagnosis', 'Required', { diagnosis: 'test-value' });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(59)
      await expectValidatorToFail(validators, 'diagnosis', 'Strlen', { ...defaultValidators, diagnosis }, {
        summary: 'ds1500:diagnosis.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'diagnosis', 'Strlen', { ...defaultValidators, diagnosis });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const diagnosis = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'diagnosis', 'hasValidWords', { ...defaultValidators, diagnosis }, {
        summary: 'ds1500:diagnosis.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 58 characters long', async () => {
      const diagnosis = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'diagnosis', 'hasValidWords', { ...defaultValidators, diagnosis });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const diagnosis = 'test test'
      await expectValidatorToPass(validators, 'diagnosis', 'Regex', { ...defaultValidators, diagnosis });
    });
  });

  describe('field: otherDiagnoses', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'otherDiagnoses', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(50)
      await expectValidatorToFail(validators, 'otherDiagnoses', 'Strlen', { ...defaultValidators, otherDiagnoses }, {
        summary: 'ds1500:otherDiagnoses.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Strlen', { ...defaultValidators, otherDiagnoses });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const otherDiagnoses = 'test test'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Regex', { ...defaultValidators, otherDiagnoses });
    });
  })

  describe('field: patientAware', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientAware', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:patientAware.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'Required', { patientAware: 'test-value' });
    });

    it('should pass "inArray" validator if value is yes', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'inArray', { patientAware: 'Yes' });
    });

    it('should pass "inArray" validator if value is no', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'inArray', { patientAware: 'No' });
    });
  })

  describe('field: formRequester', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'formRequester', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:formRequester.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'formRequester', 'Required', { formRequester: 'test-value' });
    });

    it('should pass "inArray" validator if value is Patient', async () => {
      await expectValidatorToPass(validators, 'formRequester', 'inArray', { formRequester: 'Patient' });
    });

    it('should pass "inArray" validator if value is Representative', async () => {
      await expectValidatorToPass(validators, 'formRequester', 'inArray', { formRequester: 'Representative' });
    });
  })

  describe('field: representativeName', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativeName', 'optional', { ...defaultValidators });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const representativeName = 'test test'
      await expectValidatorToPass(validators, 'representativeName', 'Regex', { ...defaultValidators, representativeName });
    });
  })

  describe('field: representativeAddress', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativeAddress', 'optional', { ...defaultValidators });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const representativeAddress = 'test test'
      await expectValidatorToPass(validators, 'representativeAddress', 'Regex', { ...defaultValidators, representativeAddress });
    });
  })

  describe('field: representativePostcode', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativePostcode', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const representativePostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'representativePostcode', 'Strlen', { ...defaultValidators, representativePostcode }, {
        summary: 'ds1500:representativePostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const representativePostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Strlen', { ...defaultValidators, representativePostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const representativePostcode = '11X X11'
      await expectValidatorToFail(validators, 'representativePostcode', 'Regex', { ...defaultValidators, representativePostcode }, {
        summary: 'ds1500:representativePostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const representativePostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'representativePostcode', 'Regex', { ...defaultValidators, representativePostcode });
    });
  })

  describe('field: clinicalFeatures', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'clinicalFeatures', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:clinicalFeatures.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Required', { clinicalFeatures: 'test-value' });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const clinicalFeatures = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'clinicalFeatures', 'hasValidWords', { ...defaultValidators, clinicalFeatures }, {
        summary: 'ds1500:clinicalFeatures.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 58 characters long', async () => {
      const clinicalFeatures = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'clinicalFeatures', 'hasValidWords', { ...defaultValidators, clinicalFeatures });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const clinicalFeatures = 'a'.repeat(50) + ' ' + 'b'.repeat(50) + ' ' + 'c'.repeat(50) + ' ' + 'd'.repeat(50) + ' ' + 'e'.repeat(50)
      await expectValidatorToFail(validators, 'clinicalFeatures', 'Strlen', { ...defaultValidators, clinicalFeatures }, {
        summary: 'ds1500:clinicalFeatures.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const clinicalFeatures = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Strlen', { ...defaultValidators, clinicalFeatures });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const clinicalFeatures = 'test test'
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Regex', { ...defaultValidators, clinicalFeatures });
    });
  });

  describe('field: treatment', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'treatment', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:treatment.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'treatment', 'Required', { treatment: 'test-value' });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const treatment = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'treatment', 'hasValidWords', { ...defaultValidators, treatment }, {
        summary: 'ds1500:treatment.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 58 characters long', async () => {
      const treatment = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'treatment', 'hasValidWords', { ...defaultValidators, treatment });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const treatment = 'a'.repeat(55) + ' ' + 'b'.repeat(55) + ' ' + 'c'.repeat(55)
      await expectValidatorToFail(validators, 'treatment', 'Strlen', { ...defaultValidators, treatment }, {
        summary: 'ds1500:treatment.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const treatment = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'treatment', 'Strlen', { ...defaultValidators, treatment });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const treatment = 'test test'
      await expectValidatorToPass(validators, 'treatment', 'Regex', { ...defaultValidators, treatment });
    });
  });

  describe('field: otherIntervention', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'otherIntervention', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const otherIntervention = 'a'.repeat(55) + ' ' + 'b'.repeat(55) + ' ' + 'c'.repeat(55)
      await expectValidatorToFail(validators, 'otherIntervention', 'Strlen', { ...defaultValidators, otherIntervention }, {
        summary: 'ds1500:otherIntervention.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const otherIntervention = 'a'.repeat(55) + ' ' + 'b'.repeat(55)
      await expectValidatorToPass(validators, 'otherIntervention', 'Strlen', { ...defaultValidators, otherIntervention });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const otherIntervention = 'test test'
      await expectValidatorToPass(validators, 'otherIntervention', 'Regex', { ...defaultValidators, otherIntervention });
    });
  })

  describe('field: declaration', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'declaration', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:declaration.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'declaration', 'Required', { declaration: 'test-value' });
    });

    it('should pass "inArray" validator if value is General Practitioner', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', { declaration: 'General Practitioner' });
    });

    it('should pass "inArray" validator if value is GMC registered consultant', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', { declaration: 'GMC registered consultant' });
    });

    it('should pass "inArray" validator if value is Other', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', { declaration: 'Other' });
    });
  })

  describe('field: gmcNumber', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'General Practitioner'
      await expectValidatorToFail(validators, 'gmcNumber', 'Required', { ...defaultValidators, declaration }, {
        summary: 'ds1500:gmcNumber.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }

      await expectValidatorToPass(validators, 'gmcNumber', 'Required', { ...defaultValidators, ...setValidators });
    });

    it('should fail "strlen" validator if max invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456789'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.tooLong'
      });
    });

    it('should fail "strlen" validator if min invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '01234'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.tooShort'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'Strlen', { ...defaultValidators, ...setValidators });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '@12e456'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Regex', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.pattern'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'Regex', { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: gmcNumberConsultant', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'GMC registered consultant'
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Required', { ...defaultValidators, declaration }, {
        summary: 'ds1500:gmcNumberConsultant.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }

      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Required', { ...defaultValidators, ...setValidators });
    });

    it('should fail "strlen" validator if max invalid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456789'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumberConsultant.tooLong'
      });
    });

    it('should fail "strlen" validator if min invalid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '01234'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumberConsultant.tooShort'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Strlen', { ...defaultValidators, ...setValidators });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '@12e456'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Regex', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumberConsultant.pattern'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Regex', { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: declarationAdditionalDetail', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'Other'
      await expectValidatorToFail(validators, 'declarationAdditionalDetail', 'Required', { ...defaultValidators, declaration }, {
        summary: 'ds1500:declarationAdditionalDetail.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test'
      }

      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'Required', { ...defaultValidators, ...setValidators });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test test'
      }
      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'Regex', { ...defaultValidators, ...setValidators });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'a'.repeat(59)
      }
      await expectValidatorToFail(validators, 'declarationAdditionalDetail', 'hasValidWords', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:declarationAdditionalDetail.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 58 characters long', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'a'.repeat(10)
      }
      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'hasValidWords', { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: gpName', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpName', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:gpName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpName = 'John'
      await expectValidatorToPass(validators, 'gpName', 'Required', { ...defaultValidators, gpName });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpName = 'John Doe'
      await expectValidatorToPass(validators, 'gpName', 'Regex', { ...defaultValidators, gpName });
    });
  })

  describe('field: gpAddress', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpAddress', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:gpAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpAddress = 'London'
      await expectValidatorToPass(validators, 'gpAddress', 'Required', { ...defaultValidators, gpAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpAddress = '10 Downing street'
      await expectValidatorToPass(validators, 'gpAddress', 'Regex', { ...defaultValidators, gpAddress });
    });
  })

  describe('field: gpPhone', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpPhone', 'Required', { ...defaultValidators }, {
        summary: 'ds1500:gpPhone.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpPhone = '0123456789'
      await expectValidatorToPass(validators, 'gpPhone', 'Required', { ...defaultValidators, gpPhone });
    });

    it('should fail "isValidPhoneNumber" validator if invalid value is provided', async () => {
      const gpPhone = '@123c56789'
      await expectValidatorToFail(validators, 'gpPhone', 'isValidPhoneNumber', { ...defaultValidators, gpPhone }, {
        summary: 'ds1500:gpPhone.invalid'
      });
    });

    validNumbers.forEach((gpPhone) => {
      it(`should pass "isValidPhoneNumber" validator if a valid value is provided - ${gpPhone}`, async () => {
        await expectValidatorToPass(validators, 'gpPhone', 'isValidPhoneNumber', { ...defaultValidators, gpPhone });
      });
    })
    // @TODO add min/max field length tests
  })
});
