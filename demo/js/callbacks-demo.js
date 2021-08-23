import FileUploader from '../../js/file-uploader.js';

// use this if you prefer the all-in-one es6 file:
// import FileUploader from '/dist/FileUploader.esm.min.js';

import fupl_strings_en from '../../js/i18n/en.js';

FileUploader({
  // selector: default value is used
  // css: `/demo/css/fileuploader.css` is already linked to the page
  options: {
    uploader_url: './demo-assets/server-side-demo-response.json',
    debug: true, // show a console.log of parsed options

    // needed for GitHub Pages, but the POST method (the default)
    // is the best option in most cases
    ajax_method: 'GET',

    init_callback: (params) => {
      alert('init_callback');
      /* eslint-disable */
      console.groupCollapsed('`init_callback` argument');
      console.log(params);
      console.groupEnd();
      /* eslint-enable */
    },
    upload_start_callback: (params) => {
      alert('upload_start_callback');
      /* eslint-disable */
      console.groupCollapsed('`upload_start_callback` argument');
      console.log(params);
      console.groupEnd();
      /* eslint-enable */
    },
    upload_complete_callback: (params) => {
      alert('upload_complete_callback');
      /* eslint-disable */
      console.groupCollapsed('`upload_complete_callback` argument');
      console.log(params);
      console.groupEnd();
      /* eslint-enable */
    }
  },
  local_strs: fupl_strings_en
});
