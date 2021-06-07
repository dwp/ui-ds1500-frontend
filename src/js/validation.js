/* eslint-disable */
// ignore because we need the code to run in older browsers and we don't have any transpiler
const gmcVals = [$('#f-declaration').val(), $('#f-declaration-2').val()]
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
window.Parsley.on('field:error', function() {
  // This global callback will be called for any field that fails validation.
  console.log('Validation failed for: ', this.$element);
});
// add a new validator - field is required if it's visible
window.Parsley.addValidator('requireifvisible', {
  requirementType: 'string',
  priority: 257,
  validateString: function validateStringFunction (value, requirements) {
    // no validation if the field isn't visible
    return $('#f-' + requirements + ':visible').length === 0 || value.length > 0;
  }
});

window.Parsley.addValidator('requireifmedicalrelationvisible', {
  requirementType: 'string',
  // priority: 257,
  validateString: function (value, requirement, instance) {
    // no validation if the field isn't visible
    var declaration = $('input[name=' + requirement + ']:checked').first()
    // console.log('declaration', declaration)
    if (!declaration) {
      return false
    }

    var declarationVal = declaration.val()
    // console.log('declarationVal', declarationVal)
    var testResult
    if (gmcVals.indexOf(declarationVal) > -1) {
      testResult = $(instance.$element).is(':visible') && isNumeric(value) === true && value.length === 7
    } else {
      testResult = true
    }
    // console.log('testResult', testResult)
    return testResult
  }
});

window.Parsley.addValidator('requireifotherrelationvisible', {
  requirementType: 'string',
  // priority: 257,
  validateString: function (value, requirement, instance) {
    // no validation if the field isn't visible
    var declaration = $('input[name=' + requirement + ']:checked').first()
    if (!declaration) {
      return false
    }

    var declarationVal = declaration.val()
    var testResult
    if (declarationVal === $('#f-declaration-3').val()) {
      testResult = $(instance.$element).is(':visible')  && value.length > 3
    } else {
      testResult = true
    }

    return testResult
  }
});

window.Parsley.addValidator('gmcpattern', {
  requirementType: 'integer',
  validateString: function validateStringFunction2 (value) {
    return value.length === 0 || value.length === 7;
  }
});

window.Parsley.addValidator('invalidcharacters', {
  requirementType: 'string',
  priority: 500,
  validateString: function validateStringFunction3 (value, requirements, parsleyInstance) {
    var invalidList = '${}\\%&/<>"+ÿ=|?☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼';
    // check for invalid characters
    var listLength = invalidList.length;
    var thisCharacter;
    var invalidCharacters = '';
    var valueLength;
    var thisCharacterAscii;
    for (var i = 0; i < listLength; i++) {
      thisCharacter = invalidList.charAt(i);
      if (value.indexOf(thisCharacter) !== -1) invalidCharacters += thisCharacter;
    }
    // check for characters below ascii 32 (10 - LF, and 13 - CR, are fine though)
    valueLength = value.length;
    for (var j = 0; j < valueLength; j++) {
      thisCharacterAscii = value.charCodeAt(j);
      if (thisCharacterAscii < 32 && thisCharacterAscii !== 10 && thisCharacterAscii !== 13) return false;
    }
    if (invalidCharacters.length !== 0) {
      parsleyInstance.domOptions.invalidcharactersMessage += ': ' + invalidCharacters;
      return false;
    } else {
      return true;
    }
  }
});

function parseDateGroupName (str) {
  return str.replace(/(Day|Month|Year|\[dd\]|\[mm\]|\[yyyy\])/g, '')
}

function addErrorMarkup (qs) {
  $(qs).each(function (i, el) {
    var jEl = $(this)
    var groupName = jEl.attr('name')

    // for date inputs strip the Day|Month|Year to make groupName
    if (jEl.hasClass('govuk-date-input__input')) {
      return
    }

    var groupId = groupName + '-group'
    var errorId = groupName + '-error'
    var errorDiv = document.createElement('div')

    errorDiv.setAttribute('id', errorId)
    errorDiv.classList.add('validation-message')

    jEl.closest('.govuk-form-group').attr('id', groupId)

    jEl.before(errorDiv)
  })
}

function addErrorMarkupDate (qs) {
  $(qs).each(function (i, el) {
    var jEl = $(this)
    var groupName = jEl.attr('name')

    if (!jEl.hasClass('govuk-date-input__input')) {
      return
    }

    // for date inputs strip the Day|Month|Year to make groupName
    groupName = parseDateGroupName(groupName)

    var groupId = groupName + '-group'
    var errorId = groupName + '-error'
    var errorDiv = document.createElement('div')

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
    var jEl = $(this)
    var groupName = jEl.attr('name')

    if (!jEl.hasClass('govuk-radios__input')) {
      return
    }

    var groupId = groupName + '-group'
    var errorId = groupName + '-error'
    var errorDiv = document.createElement('div')

    errorDiv.setAttribute('id', errorId)
    errorDiv.classList.add('validation-message')

    jEl.closest('.govuk-form-group').attr('id', groupId)

    // for date inputs insert errorDiv after .legend
    jEl.closest('.govuk-fieldset').find('legend').after(errorDiv)
  })
}


$(function () {
  // initialise markup (add attributes to form-groups)
  addErrorMarkup('input:not(".govuk-radios__input"), textarea')
  addErrorMarkupDate('#f-patientDateOfBirth\\[yyyy\\], #f-dateOfDiagnosis\\[yyyy\\]')
  addErrorMarkupRadio('#f-patientAware, #f-formRequester, #f-declaration')
  $('form').parsley();
  $('input[name="formRequester"]').on('change', function () {
    $('input[name="representativeName"], input[name="representativeAddress"], input[name="representativePostcode"]').val('');
    $('input[name="representativeName"]').parsley().validate();
    $('textarea[name="representativeAddress"]').parsley().validate();
    $('input[name="representativePostcode"]').parsley().validate();
  });
  // duplicated in validation-declaration.js
  // set validation for appropriate year fields
  var thisYear = new Date().getFullYear();
  // need to double escape square brackets '[]' used in jquery id selectors
  $('#f-patientDateOfBirth\\[yyyy\\]').attr('data-parsley-range', '[1890,' + '2115' + ']');
  $('#f-dateOfDiagnosis\\[yyyy\\]').attr('data-parsley-range', '[1890,' + thisYear + ']');

  $('#f-patientDateOfBirth\\[dd\\]').parsley().on('field:validated', validateDOB);
  $('#f-patientDateOfBirth\\[mm\\]').parsley().on('field:validated', validateDOB);
  $('#f-patientDateOfBirth\\[yyyy\\]').parsley().on('field:validated', validateDOB);

  function validateDOB () {
    setTimeout(function () {
      $('ul[data-id="invalid-date"]').remove();
      $('ul[data-id="future-date"]').remove();
      if ($('#patientDateOfBirth-error ul li').length === 0) {
        var day = $('#f-patientDateOfBirth\\[dd\\]').val();
        var month = $('#f-patientDateOfBirth\\[mm\\]').val();
        var year = $('#f-patientDateOfBirth\\[yyyy\\]').val();

        var errContainer = $('#patientDateOfBirth-error');

        if (day !== '' && month !== '' && year !== '') {
          var date = new Date(Date.parse(year + '/' + month + '/' + day));

          if(date >  new Date()) {
            errContainer.html(getMsg($('#f-patientDateOfBirth\\[dd\\]').attr('data-parsley-future-message'), 'future-date'));
          } else if (!(date.getDate() === parseInt(day) &&
                        date.getMonth() + 1 === parseInt(month) &&
                        date.getFullYear() === parseInt(year) &&
                        date < new Date())) {
            errContainer.html(getMsg($('#f-patientDateOfBirth\\[dd\\]').attr('data-parsley-invalid-message'), 'invalid-date'));
          }
        }
      }

      checkDateErrors();
      
      if ($('#patientDateOfBirth-error ul li').length > 0) {
        $('#patientDateOfBirth-group').removeClass('parsley-success').addClass('parsley-error');
      } else {
        $('#patientDateOfBirth-group').removeClass('parsley-error');
      }
    }, 0)
  }

  function getMsg (m, id) {
    return '<ul data-id="' + id + '"><li class="parsley-' + id + '">' + m + '</li></ul>';
  }

  $('#f-dateOfDiagnosis\\[mm\\]').parsley().on('field:validated', checkDateErrors);
  $('#f-dateOfDiagnosis\\[yyyy\\]').parsley().on('field:validated', checkDateErrors);

  function checkDateErrors (e) {
    setTimeout(function () {
      $('[data-id="datefuture"]').remove();
      $('[data-id="diagdatebeforedob"]').remove();
      if ($('#dateOfDiagnosis-error ul li').length === 0) {
        var day = $('#f-patientDateOfBirth\\[dd\\]').val();
        var month = $('#f-patientDateOfBirth\\[mm\\]').val();
        var year = $('#f-patientDateOfBirth\\[yyyy\\]').val();
        var diagMonth = $('#f-dateOfDiagnosis\\[dd\\]').val();
        var diagYear = $('#f-dateOfDiagnosis\\[yyyy\\]').val();

        var errContainer = $('#dateOfDiagnosis-error');

        if (day !== '' && month !== '' && year !== '' && diagMonth !== '' && diagYear !== '') {
          var date = new Date(Date.parse(year + '/' + month + '/' + day));
          var diagDay = (parseInt(diagYear) === parseInt(year) && parseInt(diagMonth) === parseInt(month)) ? day : '1';
          var diagDate = new Date(Date.parse(diagYear + '/' + diagMonth + '/' + diagDay));

          if (diagDate > new Date()) {
            errContainer.html(getMsg($('#f-dateOfDiagnosis\\[dd\\]').attr('data-parsley-future-message'), 'datefuture'));
          } else if (date.getDate() === parseInt(day) &&
                        date.getMonth() + 1 === parseInt(month) &&
                        date.getFullYear() === parseInt(year) &&
                        date < new Date() && diagDate < date) {
            errContainer.html(getMsg($('#f-dateOfDiagnosis\\[dd\\]').attr('data-parsley-before-dob-message'), 'diagdatebeforedob'));
          }
        }
      }

      if ($('#dateOfDiagnosis-error ul li').length > 0) {
        $('#dateOfDiagnosis-group').removeClass('parsley-success').addClass('parsley-error');
      } else {
        $('#dateOfDiagnosis-group').removeClass('parsley-error');
      }
    }, 0)
  }
});
