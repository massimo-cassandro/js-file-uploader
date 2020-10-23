/* global $ */
import FileUploader from '../../src/file_uploader.js';

// use this if you prefer the all-in-one es6 file:
// import FileUploader from '/dist/FileUploader.esm.min.js';

import fupl_strings_en from '../../src/i18n/en.js';

(() => {
  'use strict';

  function showToastNotification (message, fupl, error_type='error') {
    let alert_class= error_type === 'error' ? 'danger' : error_type, // per allineamento alle classi di bs4

      toast_notification = `<div class="toast fupl-alert" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="mr-auto lead text-${alert_class}">Warning!</strong>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">${message}</div>
      </div>`,

      alert_wrapper = '<div class="fupl-alert-wrapper"></div>';

    if(!$('.fupl-alert-wrapper', fupl.opts.wrapper).length) {
      $(alert_wrapper).appendTo(fupl.opts.wrapper);
    }

    $(toast_notification).appendTo($('.fupl-alert-wrapper', fupl.opts.wrapper));

    $('.fupl-alert:last').toast({
      animation: true,
      autohide: true,
      delay: 10000
    }).on('hidden.bs.toast', function () {
      $(this).remove();
      if( !$('.fupl-alert-wrapper .fupl-alert', fupl.opts.wrapper).length ) {
        $('.fupl-alert-wrapper', fupl.opts.wrapper).remove();
      }
    }).toast('show');
  }


  FileUploader({
    // selector: default value is used
    // css: `/demo/css/fileuploader.css` is already linked to the page
    options: {
      uploader_url: './demo-assets/server-side-demo-response.json',
      debug: true, // show a console.log of parsed options
      img_max_h: 100,
      img_max_w: 100,
      max_filesize: 100,
      alert_api: showToastNotification
    },
    local_strs: fupl_strings_en
  });

})();
