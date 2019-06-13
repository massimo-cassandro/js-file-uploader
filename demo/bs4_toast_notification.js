/* exported showToastNotification */

function showToastNotification (message_key, error_type, fupl_options) {
  let alert_class= error_type === 'error' ? 'danger' : error_type, // per allineamento alle classi di bs4

  toast_notification = `<div class="toast fupl-alert" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="mr-auto lead text-${alert_class}">Attenzione!</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">${fupl_options.alert_messages[message_key]}</div>
  </div>`,

  alert_wrapper = '<div class="fupl-alert-wrapper"></div>';

  if(!$('.fupl-alert-wrapper', fupl_options.wrapper).length) {
    $(alert_wrapper).appendTo(fupl_options.wrapper);
  }

  $(toast_notification).appendTo($('.fupl-alert-wrapper', fupl_options.wrapper));

  $('.fupl-alert:last').toast({
    animation: true,
    autohide: true,
    delay: 10000
  }).on('hidden.bs.toast', function () {
    $(this).remove();
    if( !$('.fupl-alert-wrapper .fupl-alert', fupl_options.wrapper).length ) {
      $('.fupl-alert-wrapper', fupl_options.wrapper).remove();
    }
  }).toast('show');
}
