const { field, validators: r } = require('@dwp/govuk-casa');
const { DateTime } = require('luxon');

const { isValidPhoneNumber, isValidPatientName, hasValidWords, hasValidWordsPatientName, hasValidWordsRepresentativeDetails } = require('../../lib/validation-rules/sr1');
const { isEmptyDateOfBirth, isDateNumericDob, isValidDateRangeDob, isTooLongDob } = require('../../lib/validation-rules/sr1DateOfBirth')
const { isEmptyDateOfDiagnosis, isDateNumeric, isValidDateRange, isDateOfDiagnosisInFuture, isDateBeforeDoB } = require('../../lib/validation-rules/sr1DateOfDiagnosis')
const { VALID_POSTCODE } = require('../../lib/constants')

module.exports = () => [
  field('patientName').validators([
    r.required.make({
      errorMsg: 'sr1:patientName.empty'
    }),
    {
      name: 'hasValidWordsPatientName',
      validate: hasValidWordsPatientName
    },
    {
      name: 'isValidPatientName',
      validate: isValidPatientName
    }
  ]).processors([
    (value) => {
      return String(value).trim();
    }
  ]),
  field('patientAddress').validators([
    r.required.make({
      errorMsg: 'sr1:patientAddress.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    }
  ]),
  field('patientPostcode').validators([
    r.required.make({
      errorMsg: 'sr1:patientPostcode.empty'
    }),
    r.strlen.make({
      max: 8,
      errorMsgMax: 'sr1:patientPostcode.tooLong'
    }),
    r.regex.make({
      pattern: VALID_POSTCODE,
      errorMsg: 'sr1:patientPostcode.invalid'
    })
  ]).processors([
    (value) => {
      return String(value).trim();
    }
  ]),
  field('patientDateOfBirth').validators([
    {
      name: 'isEmptyDateOfBirth',
      validate: isEmptyDateOfBirth
    },
    {
      name: 'isDateNumericDob',
      validate: isDateNumericDob

    },
    {
      name: 'isValidDateRangeDob',
      validate: isValidDateRangeDob

    },
    {
      name: 'isTooLongDob',
      validate: isTooLongDob

    },
    r.dateObject.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      beforeOffsetFromNow: { days: 0 },
      afterOffsetFromNow: DateTime.fromISO('1890-01-01').diff(DateTime.now()),
      errorMsg: {
        summary: 'sr1:patientDateOfBirth.invalid',
        focusSuffix: '[dd]'
      },
      errorMsgAfterOffset: {
        summary: 'sr1:patientDateOfBirth.rangePast',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      },
      errorMsgBeforeOffset: {
        summary: 'sr1:patientDateOfBirth.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })
  ]),
  field('patientNino', { optional: true }).validators([
    r.nino.make({
      allowWhitespace: true,
      errorMsg: 'sr1:patientNino.invalid'
    })
  ]).processors([
    (value) => {
      return String(value).trim();
    }
  ]),
  field('diagnosis').validators([
    r.required.make({
      errorMsg: 'sr1:diagnosis.empty'
    }),
    r.strlen.make({
      max: 126,
      errorMsgMax: 'sr1:diagnosis.tooLong'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    }
  ]),
  field('dateOfDiagnosis').validators([
    {
      name: 'isEmptyDateOfDiagnosis',
      validate: isEmptyDateOfDiagnosis
    },
    {
      name: 'isDateNumeric',
      validate: isDateNumeric
    },
    {
      name: 'isValidDateRange',
      validate: isValidDateRange
    },
    {
      name: 'isDateOfDiagnosisInFuture',
      validate: isDateOfDiagnosisInFuture
    },
    {
      name: 'isDateBeforeDoB',
      validate: isDateBeforeDoB
    }
  ]),
  field('otherDiagnoses', { optional: true }).validators([
    {
      name: 'hasValidWords',
      validate: hasValidWords
    },
    r.strlen.make({
      max: 132,
      errorMsgMax: 'sr1:otherDiagnoses.tooLong'
    })
  ]),
  field('patientAware').validators([
    r.required.make({
      errorMsg: 'sr1:patientAware.empty'
    }),
    r.inArray.make({
      source: ['Yes', 'No'],
      errorMsg: 'sr1:patientAware.empty'
    })
  ]),
  field('formRequester').validators([
    r.required.make({
      errorMsg: 'sr1:formRequester.empty'
    }),
    r.inArray.make({
      source: ['Patient', 'Representative'],
      errorMsg: 'sr1:formRequester.empty'
    })
  ]),
  field('representativeName', { optional: true }).validators([
    {
      name: 'hasValidWordsRepresentativeDetails',
      validate: hasValidWordsRepresentativeDetails
    }
  ]),
  field('representativeAddress', { optional: true }).validators([
    {
      name: 'hasValidWordsRepresentativeDetails',
      validate: hasValidWordsRepresentativeDetails
    }
  ]),
  field('representativePostcode', { optional: true }).validators([
    r.strlen.make({
      max: 8,
      errorMsgMax: 'sr1:representativePostcode.tooLong'
    }),
    r.regex.make({
      pattern: VALID_POSTCODE,
      errorMsg: 'sr1:representativePostcode.invalid'
    })
  ]).processors([
    (value) => {
      return String(value).trim();
    }
  ]),
  field('clinicalFeatures').validators([
    r.required.make({
      errorMsg: 'sr1:clinicalFeatures.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    },
    r.strlen.make({
      max: 236,
      errorMsgMax: 'sr1:clinicalFeatures.tooLong'
    })
  ]),
  field('treatment').validators([
    r.required.make({
      errorMsg: 'sr1:treatment.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    },
    r.strlen.make({
      max: 160,
      errorMsgMax: 'sr1:treatment.tooLong'
    })
  ]),
  field('otherIntervention', { optional: true }).validators([
    {
      name: 'hasValidWords',
      validate: hasValidWords
    },
    r.strlen.make({
      max: 120,
      errorMsgMax: 'sr1:otherIntervention.tooLong'
    })
  ]),
  field('declaration').validators([
    r.required.make({
      errorMsg: 'sr1:declaration.empty'
    }),
    r.inArray.make({
      source: ['Specialist nurse', 'General Practitioner', 'GMC registered consultant', 'Other'],
      errorMsg: 'sr1:declaration.empty'
    })
  ]),
  field('gmcNumber').validators([
    r.required.make({
      errorMsg: 'sr1:gmcNumber.empty'
    }),
    r.strlen.make({
      max: 7,
      min: 7,
      errorMsgMax: 'sr1:gmcNumber.tooLong',
      errorMsgMin: 'sr1:gmcNumber.tooShort'
    }),
    r.regex.make({
      pattern: /^(?!0000000)[0-9]*$/,
      errorMsg: 'sr1:gmcNumber.pattern'
    })
  ]).condition(({ journeyContext, waypoint }) => {
    const formData = journeyContext.getDataForPage(waypoint);
    return formData.declaration === 'General Practitioner';
  }).processors([
    (value) => {
      return String(value).trim();
    }
  ]),
  field('gmcNumberConsultant').validators([
    r.required.make({
      errorMsg: 'sr1:gmcNumberConsultant.empty'
    }),
    r.strlen.make({
      max: 7,
      min: 7,
      errorMsgMax: 'sr1:gmcNumberConsultant.tooLong',
      errorMsgMin: 'sr1:gmcNumberConsultant.tooShort'
    }),
    r.regex.make({
      pattern: /^(?!0000000)[0-9]*$/,
      errorMsg: 'sr1:gmcNumberConsultant.pattern'
    })
  ])
    .condition(({ journeyContext, waypoint }) => {
      const formData = journeyContext.getDataForPage(waypoint);
      return formData.declaration === 'GMC registered consultant';
    })
    .processors([
      (value) => {
        return String(value).trim();
      }
    ]),
  field('declarationAdditionalDetail').validators([
    r.required.make({
      errorMsg: 'sr1:declarationAdditionalDetail.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    }
  ]).condition(({ journeyContext, waypoint }) => {
    const formData = journeyContext.getDataForPage(waypoint);
    return formData.declaration === 'Other';
  }),
  field('gpName').validators([
    r.required.make({
      errorMsg: 'sr1:gpName.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    }
  ]),
  field('gpAddress').validators([
    r.required.make({
      errorMsg: 'sr1:gpAddress.empty'
    }),
    {
      name: 'hasValidWords',
      validate: hasValidWords
    }
  ]),
  field('gpPhone').validators([
    r.required.make({
      errorMsg: 'sr1:gpPhone.empty'
    }),
    {
      name: 'isValidPhoneNumber',
      validate: isValidPhoneNumber
    }
  ]).processors([
    (value) => {
      return String(value).trim();
    }
  ])
];
