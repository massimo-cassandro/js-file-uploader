// check for equired file-uploader
export  function check_required_uploader(options) {
  'use strict';

  const default_options = {
    alert_api: message => { window.alert(message); },
    message: 'È necessario caricare le immagini obbligatorie'
  };

  options = Object.assign({}, default_options, options);

  document.querySelectorAll('form').forEach(_form => {

    _form.addEventListener('submit', function(e) {
      let failed_req_uploaders = _form.querySelectorAll(
        '.fupl-wrapper:not([disabled])[data-required="true"][data-has-values="false"]'
      );
      if(failed_req_uploaders.length) {
        options.alert_api(options.message);

        _form.querySelectorAll('[type="submit"]').forEach(item => {
          item.disabled = false;
        });
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    }, false);

  });

}
