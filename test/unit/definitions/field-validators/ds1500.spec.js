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
      await expectValidatorToFail(validators, 'patientName', 'required', { ...defaultValidators }, {
        summary: 'ds1500:patientName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientName', 'required', { patientName: 'test-value' });
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
      await expectValidatorToFail(validators, 'patientAddress', 'required', { ...defaultValidators }, {
        summary: 'ds1500:patientAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientAddress = 'London'
      await expectValidatorToPass(validators, 'patientAddress', 'required', { ...defaultValidators, patientAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientAddress = '12 London road'
      await expectValidatorToPass(validators, 'patientAddress', 'regex', { ...defaultValidators, patientAddress });
    });
  })

  describe('field: patientPostcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientPostcode', 'required', { ...defaultValidators }, {
        summary: 'ds1500:patientPostcode.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientPostcode = 'SW1 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'required', { ...defaultValidators, patientPostcode });
    });

    it('should fail "strlen" validator if invalid value is provided', async () => {
      const patientPostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'patientPostcode', 'strlen', { ...defaultValidators, patientPostcode }, {
        summary: 'ds1500:patientPostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid value is provided', async () => {
      const patientPostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'strlen', { ...defaultValidators, patientPostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const patientPostcode = '11X X11'
      await expectValidatorToFail(validators, 'patientPostcode', 'regex', { ...defaultValidators, patientPostcode }, {
        summary: 'ds1500:patientPostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientPostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'patientPostcode', 'regex', { ...defaultValidators, patientPostcode });
    });
  })

  describe('field: patientNino', () => {
    it('should pass "optional" validator if no nino provided', async () => {
      await expectValidatorToPass(validators, 'patientNino', 'optional', { ...defaultValidators });
    });

    it('should fail "nino" validator if invalid nino provided', async () => {
      const patientNino = 'ABCD123456'
      await expectValidatorToFail(validators, 'patientNino', 'nino', { ...defaultValidators, patientNino }, {
        summary: 'ds1500:patientNino.invalid'
      });
    });

    it('should pass "nino" validator if valid nino provided', async () => {
      const patientNino = 'AA370773A'
      await expectValidatorToPass(validators, 'patientNino', 'nino', { ...defaultValidators, patientNino });
    });
  });

  describe('field: diagnosis', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'diagnosis', 'required', { ...defaultValidators }, {
        summary: 'ds1500:diagnosis.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'diagnosis', 'required', { diagnosis: 'test-value' });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(59)
      await expectValidatorToFail(validators, 'diagnosis', 'strlen', { ...defaultValidators, diagnosis }, {
        summary: 'ds1500:diagnosis.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'diagnosis', 'strlen', { ...defaultValidators, diagnosis });
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
      await expectValidatorToPass(validators, 'diagnosis', 'regex', { ...defaultValidators, diagnosis });
    });
  });

  describe('field: otherDiagnoses', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'otherDiagnoses', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(50)
      await expectValidatorToFail(validators, 'otherDiagnoses', 'strlen', { ...defaultValidators, otherDiagnoses }, {
        summary: 'ds1500:otherDiagnoses.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'otherDiagnoses', 'strlen', { ...defaultValidators, otherDiagnoses });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const otherDiagnoses = 'test test'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'regex', { ...defaultValidators, otherDiagnoses });
    });
  })

  describe('field: patientAware', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientAware', 'required', { ...defaultValidators }, {
        summary: 'ds1500:patientAware.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'required', { patientAware: 'test-value' });
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
      await expectValidatorToFail(validators, 'formRequester', 'required', { ...defaultValidators }, {
        summary: 'ds1500:formRequester.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'formRequester', 'required', { formRequester: 'test-value' });
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
      await expectValidatorToPass(validators, 'representativeName', 'regex', { ...defaultValidators, representativeName });
    });
  })

  describe('field: representativeAddress', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativeAddress', 'optional', { ...defaultValidators });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const representativeAddress = 'test test'
      await expectValidatorToPass(validators, 'representativeAddress', 'regex', { ...defaultValidators, representativeAddress });
    });
  })

  describe('field: representativePostcode', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativePostcode', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const representativePostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'representativePostcode', 'strlen', { ...defaultValidators, representativePostcode }, {
        summary: 'ds1500:representativePostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const representativePostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'strlen', { ...defaultValidators, representativePostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const representativePostcode = '11X X11'
      await expectValidatorToFail(validators, 'representativePostcode', 'regex', { ...defaultValidators, representativePostcode }, {
        summary: 'ds1500:representativePostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const representativePostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'representativePostcode', 'regex', { ...defaultValidators, representativePostcode });
    });
  })

  describe('field: clinicalFeatures', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'clinicalFeatures', 'required', { ...defaultValidators }, {
        summary: 'ds1500:clinicalFeatures.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'clinicalFeatures', 'required', { clinicalFeatures: 'test-value' });
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
      await expectValidatorToFail(validators, 'clinicalFeatures', 'strlen', { ...defaultValidators, clinicalFeatures }, {
        summary: 'ds1500:clinicalFeatures.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const clinicalFeatures = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'clinicalFeatures', 'strlen', { ...defaultValidators, clinicalFeatures });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const clinicalFeatures = 'test test'
      await expectValidatorToPass(validators, 'clinicalFeatures', 'regex', { ...defaultValidators, clinicalFeatures });
    });
  });

  describe('field: treatment', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'treatment', 'required', { ...defaultValidators }, {
        summary: 'ds1500:treatment.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'treatment', 'required', { treatment: 'test-value' });
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
      await expectValidatorToFail(validators, 'treatment', 'strlen', { ...defaultValidators, treatment }, {
        summary: 'ds1500:treatment.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const treatment = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'treatment', 'strlen', { ...defaultValidators, treatment });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const treatment = 'test test'
      await expectValidatorToPass(validators, 'treatment', 'regex', { ...defaultValidators, treatment });
    });
  });

  describe('field: otherIntervention', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'otherIntervention', 'optional', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const otherIntervention = 'a'.repeat(55) + ' ' + 'b'.repeat(55) + ' ' + 'c'.repeat(55)
      await expectValidatorToFail(validators, 'otherIntervention', 'strlen', { ...defaultValidators, otherIntervention }, {
        summary: 'ds1500:otherIntervention.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const otherIntervention = 'a'.repeat(55) + ' ' + 'b'.repeat(55)
      await expectValidatorToPass(validators, 'otherIntervention', 'strlen', { ...defaultValidators, otherIntervention });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const otherIntervention = 'test test'
      await expectValidatorToPass(validators, 'otherIntervention', 'regex', { ...defaultValidators, otherIntervention });
    });
  })

  describe('field: declaration', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'declaration', 'required', { ...defaultValidators }, {
        summary: 'ds1500:declaration.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'declaration', 'required', { declaration: 'test-value' });
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
      await expectValidatorToFail(validators, 'gmcNumber', 'required', { ...defaultValidators, declaration }, {
        summary: 'ds1500:gmcNumber.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }

      await expectValidatorToPass(validators, 'gmcNumber', 'required', { ...defaultValidators, ...setValidators });
    });

    it('should fail "strlen" validator if max invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456789'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.tooLong'
      });
    });

    it('should fail "strlen" validator if min invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '01234'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'strlen', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.tooShort'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'strlen', { ...defaultValidators, ...setValidators });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '@12e456'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'regex', { ...defaultValidators, ...setValidators }, {
        summary: 'ds1500:gmcNumber.pattern'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'regex', { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: declarationAdditionalDetail', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'Other'
      await expectValidatorToFail(validators, 'declarationAdditionalDetail', 'required', { ...defaultValidators, declaration }, {
        summary: 'ds1500:declarationAdditionalDetail.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test'
      }

      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'required', { ...defaultValidators, ...setValidators });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test test'
      }
      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'regex', { ...defaultValidators, ...setValidators });
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
      await expectValidatorToFail(validators, 'gpName', 'required', { ...defaultValidators }, {
        summary: 'ds1500:gpName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpName = 'John'
      await expectValidatorToPass(validators, 'gpName', 'required', { ...defaultValidators, gpName });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpName = 'John Doe'
      await expectValidatorToPass(validators, 'gpName', 'regex', { ...defaultValidators, gpName });
    });
  })

  describe('field: trustName', () => {
    it('should pass "optional" validator even if a empty value is provided', async () => {
      const trustName = ''
      await expectValidatorToPass(validators, 'trustName', 'required', { ...defaultValidators, trustName });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const trustName = 'Clinic'
      await expectValidatorToPass(validators, 'trustName', 'regex', { ...defaultValidators, trustName });
    });
  })

  describe('field: gpAddress', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpAddress', 'required', { ...defaultValidators }, {
        summary: 'ds1500:gpAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpAddress = 'London'
      await expectValidatorToPass(validators, 'gpAddress', 'required', { ...defaultValidators, gpAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpAddress = '10 Downing street'
      await expectValidatorToPass(validators, 'gpAddress', 'regex', { ...defaultValidators, gpAddress });
    });
  })

  describe('field: gpPhone', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpPhone', 'required', { ...defaultValidators }, {
        summary: 'ds1500:gpPhone.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpPhone = '0123456789'
      await expectValidatorToPass(validators, 'gpPhone', 'required', { ...defaultValidators, gpPhone });
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
