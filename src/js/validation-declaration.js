/* eslint-disable */
const gmcVals = [$('#f-declaration').val(), $('#f-declaration-2').val()]

function parseDateGroupName (str) {
  return str.replace(/(Day|Month|Year|\[dd\]|\[mm\]|\[yyyy\])/g, '')
}

function addErrorMarkup (qs) {
  $(qs).each(function (i, el) {
    const jEl = $(this)
    const groupName = jEl.attr('name')

    // for date inputs strip the Day|Month|Year to make groupName
    if (jEl.hasClass('govuk-date-input__input')) {
      return
    }

    const groupId = groupName + '-group'
    const errorId = groupName + '-error'
    const errorDiv = document.createElement('div')

    errorDiv.setAttribute('id', errorId)
    errorDiv.classList.add('validation-message')

    jEl.closest('.govuk-form-group').attr('id', groupId)

    jEl.before(errorDiv)
  })
}

function addErrorMarkupDate (qs) {
  $(qs).each(function (i, el) {
    const jEl = $(this)
    let groupName = jEl.attr('name')

    if (!jEl.hasClass('govuk-date-input__input')) {
      return
    }

    // for date inputs strip the Day|Month|Year to make groupName
    groupName = parseDateGroupName(groupName)

    const groupId = groupName + '-group'
    const errorId = groupName + '-error'
    const errorDiv = document.createElement('div')

    errorDiv.setAttribute('id', errorId)
    errorDiv.classList.add('validation-message')

    jEl.closest('.govuk-date-input').attr('id', groupId)

    // for date inputs insert errorDiv after .legend
    jEl.closest('.govuk-fieldset').find('legend').after(errorDiv)
  })
}

function addErrorMarkupRadio (qs) {
  console.log('qs', qs)
  $(qs).each(function (i, el) {
    const jEl = $(this)
    const groupName = jEl.attr('name')

    if (!jEl.hasClass('govuk-radios__input')) {
      return
    }

    const groupId = groupName + '-group'
    const errorId = groupName + '-error'
    const errorDiv = document.createElement('div')

    errorDiv.setAttribute('id', errorId)
    errorDiv.classList.add('validation-message')

    jEl.closest('.govuk-form-group').attr('id', groupId)

    // for date inputs insert errorDiv after .legend
    jEl.closest('.govuk-fieldset').find('legend').after(errorDiv)
  })
}

$(function () {
  addErrorMarkup('input:not(".govuk-radios__input"), textarea')
  addErrorMarkupDate('#f-patientDateOfBirth\\[yyyy\\], #f-dateOfDiagnosis\\[yyyy\\]')
  addErrorMarkupRadio('#f-patientAware, #f-formRequester, #f-declaration')
  $('input[name="declaration"]').on('change', function () {
    $('input[name="gmcNumber"], input[name="declarationAdditionalDetail"]').val('1234567');
    // $('input[name="gmcNumber"]').parsley().validate();
    // $('input[name="declarationAdditionalDetail"]').parsley().validate();
    $('input[name="gmcNumber"], input[name="declarationAdditionalDetail"]').val('');
  });
})
