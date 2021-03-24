// check for required file-uploaders
function check_required_uploader (options) {

  const default_options = {
    alert_api: message => { window.alert(message); },
    message: 'È necessario caricare le immagini obbligatorie',
    fupl_selector: '.file-uploader2'
  };

  options = Object.assign({}, default_options, options);

  document.querySelectorAll(options.fupl_selector).forEach(item => {

    item.closest('form').addEventListener('submit', e => {

      let failed_req_uploaders = e.target.querySelectorAll(
        '.fupl-wrapper:not([disabled])[data-required="true"][data-has-values="false"]'
      );
      if(failed_req_uploaders.length) {
        options.alert_api(options.message);

        e.target.querySelectorAll('[type="submit"]').forEach(btn => {
          btn.disabled = false;
        });
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    }, false);
  });
}

export default check_required_uploader;
//# sourceMappingURL=check_required_uploader.esm.js.map
