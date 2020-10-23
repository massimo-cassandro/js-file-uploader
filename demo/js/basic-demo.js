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

    // needed for GitHub Pages, but the POST method (the default)
    // is the best option in most cases
    ajax_method: 'GET'

  },
  local_strs: fupl_strings_en
});
