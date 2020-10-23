import FileUploader from '../../src/file_uploader.js';

// use this if you prefer the all-in-one es6 file:
// import FileUploader from '/dist/FileUploader.esm.min.js';

import fupl_strings_en from '../../src/i18n/en.js';

FileUploader({
  // selector: default value is used
  // css: `/demo/css/fileuploader.css` is already linked to the page
  options: {
    uploader_url: './demo-assets/server-side-demo-response.json',
    debug: true, // show a console.log of parsed options

    fancybox: true,
    fancybox_callback_func: (params) => {
      alert('fancybox_callback_func');
      /* eslint-disable */
      console.groupCollapsed('`fancybox_callback_func` argument');
      console.log(params);
      console.groupEnd();
      /* eslint-enable */

    }
  },
  local_strs: fupl_strings_en
});
