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
    extra_fields:[
      {
        'value_key': 'publish',
        'use_rel_id': true,
        'markup':  `<div class="form-check form-group">
            <input class="form-check-input" type="checkbox"
              value="1" id="publish-{{idx}}" name="{{name}}" {{checked}}>
            <label class="form-check-label" for="publish-{{idx}}">
              Publish this photo
            </label>
          </div>`
      },
      {
        'value_key': 'caption',
        'use_rel_id': true,
        'markup': `<div class="form-group">
            <label for="caption-{{idx}}">Caption</label>
            <input type="text" class="form-control form-control-sm" id="caption-{{idx}}"
              value="{{val}}" name="{{name}}">
          </div>`
      }
    ]
  },
  local_strs: fupl_strings_en
});
