(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.check_required_uploader = factory());
})(this, (function () { 'use strict';

  // check for required file-uploaders
  function checkRequiredUploader (options) {

    const default_options = {
      alert_api: message => { window.alert(message); },
      message: 'È necessario caricare le immagini obbligatorie',
      fupl_selector: '.file-uploader2'
    };

    options = Object.assign({}, default_options, options);

    document.querySelectorAll(options.fupl_selector).forEach(item => {

      item.closest('form')?.addEventListener('submit', e => {

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

  return checkRequiredUploader;

}));
//# sourceMappingURL=check-required-uploader.umd.js.map
