/* eslint-disable no-var */
function focusOnTextBox (id) {
  setTimeout(function () {
    document.getElementById(id).focus()
  }, 3500)
}

window.onload = function () {
  (function onLoad () {
    function showReps () {
      var radioValueRaw = document.querySelector('input[name="formRequester"]:checked');
      if (radioValueRaw !== null) {
        const radioValue = radioValueRaw.value;
        if (radioValue === 'Representative') {
          focusOnTextBox('f-representativeName')
        }
      }
    }
    document.getElementById('f-formRequester').addEventListener('click', showReps, false);
    document.getElementById('f-formRequester-2').addEventListener('click', showReps, false);
  })();

  (function onLoadDeclarations () {
    function showDeclaration () {
      var radioValueRaw = document.querySelector('input[name="declaration"]:checked');
      if (radioValueRaw !== null) {
        const radioValue = radioValueRaw.value;
        switch (radioValue) {
          case 'General Practitioner':
            focusOnTextBox('f-gmcNumber')
            break;
          case 'GMC registered consultant':
            focusOnTextBox('f-gmcNumberConsultant')
            break;
          case 'Other':
            focusOnTextBox('f-declarationAdditionalDetail')
            break;
          default:
        }
      }
    }

    document.getElementById('f-declaration').addEventListener('click', showDeclaration, false);
    document.getElementById('f-declaration-2').addEventListener('click', showDeclaration, false);
    document.getElementById('f-declaration-3').addEventListener('click', showDeclaration, false);
    document.getElementById('f-declaration-4').addEventListener('click', showDeclaration, false);
  })();
}
