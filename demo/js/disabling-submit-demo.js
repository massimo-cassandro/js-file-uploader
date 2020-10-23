import FileUploader from '/src/file_uploader.js';

// use this if you prefer the all-in-one es6 file:
// import FileUploader from '/dist/FileUploader.esm.min.js';

import fupl_strings_en from '/src/i18n/en.js';

(() => {
  'use strict';

  FileUploader({
    // selector: default value is used
    // css: `/demo/css/fileuploader.css` is already linked to the page
    options: {
      uploader_url: './demo-assets/server-side-demo-response.json',
      debug: true // show a console.log of parsed options
    },
    local_strs: fupl_strings_en
  });


  // Set up a new MutationObserver
  // (from https://stackoverflow.com/questions/31028169/listening-for-an-element-disable-event)
  const submitBtn = document.getElementById('submitButton'),
    mo = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // Check the modified attributeName is "disabled"
        if(mutation.attributeName === 'disabled') {
          console.log('#submitButton.disabled -> ' + submitBtn.disabled ); // eslint-disable-line
        }
      });
    });

  // Start observing (only listen to attribute changes)
  mo.observe( submitBtn, { attributes: true });

})();
