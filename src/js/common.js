/* eslint-disable */
// ignore because we need the code to run in older browsers and we don't have any transpiler
$(function () {
  // focus invalid field when link clicked in error summary
  $('.error-summary a').on('click keydown', function (e) {
    if (e.type === 'click' || e.keyCode === 32) {
      e.preventDefault();
      var href = $(this).attr('href').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
      var $input = $('input[name="' + href.replace('#error-', '') + '"], textarea[name="' + href.replace('#error-', '') + '"]');
      var $a = $(href);
      $('body').scrollTop($a.offset().top);
      if ($input.length) {
        $input.focus();
      } else {
        $a.closest('.error').find('input, textarea').first().focus();
      }
    }
  });
});
