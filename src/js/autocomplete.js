/* eslint-disable */
// ignore because we need the code to run in older browsers and we don't have any transpiler
var options = {
  url: 'data/trust-data.min.json',

  getValue: function outputValue (element) {
    return element.trust;
  },

  list: {
    onSelectItemEvent: function selectItem () {
      var address1Output;
      var address2Output;
      var address3Output;
      var cityOutput;
      var countyOutput;
      var postcodeOutput;
      var address1Value = $('#f-trustName').getSelectedItemData().address1;
      var address2Value = $('#f-trustName').getSelectedItemData().address2;
      var address3Value = $('#f-trustName').getSelectedItemData().address3;
      var cityValue = $('#f-trustName').getSelectedItemData().city;
      var countyValue = $('#f-trustName').getSelectedItemData().county;
      var postcodeValue = $('#f-trustName').getSelectedItemData().postcode;

      address1Output = (address1Value !== '') ? address1Value + '\n' : '';
      address2Output = (address2Value !== '') ? address2Value + '\n' : '';
      address3Output = (address3Value !== '') ? address3Value + '\n' : '';
      cityOutput = (cityValue !== '') ? cityValue + '\n' : '';
      countyOutput = (countyValue !== '') ? countyValue + '\n' : '';
      postcodeOutput = (postcodeValue !== '') ? postcodeValue : '';

      $('#f-gpAddress').val(address1Output + address2Output + address3Output + cityOutput + countyOutput + postcodeOutput)
      $('#f-trustName').val($('#f-trustName').getSelectedItemData().trust);
      // adding attributes for GA tracking on submit
      $('#f-gpAddress').removeAttr('data-user');
      $('#f-gpAddress').attr('data-auto', '');
      $('#f-trustName').removeAttr('data-user');
      $('#f-trustName').attr('data-auto', '');
    },
    match: {enabled: true},
    sort: {enabled: true}
  }
};

$('#f-trustName').easyAutocomplete(options);
