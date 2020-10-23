/* global FileUploader, fupl_strings_en */

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
