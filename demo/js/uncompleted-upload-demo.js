import FileUploader from '../../src/file_uploader.js';
import check_uncompleted_uploads from '../../src-utilities/check_uncompleted_uploads.js';

// use this if you prefer the all-in-one es6 file:
// import FileUploader from '/dist/FileUploader.esm.min.js';

import fupl_strings_en from '../../src/i18n/en.js';
(() => {
  'use strict';

  FileUploader({
    // selector: default value is used
    // css: `/demo/css/fileuploader.css` is already linked to the page
    options: {
      uploader_url: './demo-assets/server-side-demo-response.json',
      debug: true, // show a console.log of parsed options

      // needed for GitHub Pages, but the POST method (the default)
      // is the best option in most cases
      ajax_method: 'GET',

      filetype         : 'img',
      max_filesize     : '30MB',
      uploader_legend  : 'true',
      multiple         : false,

      // change for image constrains demo
      img_w            : null,
      img_h            : null,
      img_min_w        : 2000,
      img_min_h        : null,
      img_max_w        : null,
      img_max_h        : null,
      img_aspect_ratio : null
    },
    local_strs: fupl_strings_en
  });

  check_uncompleted_uploads({
    message: 'Wait up! The image is still uploading ...'
    // fupl_selector: default value is used
    // alert_api: default value is used
  });
})();
