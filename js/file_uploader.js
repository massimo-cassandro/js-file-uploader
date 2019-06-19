/*!@preserve
 *
 * FileUploader 2.0
 * HTML5 / JS Async Uploader
 * Massimo Cassandro 2017-2019
 *
 */

//* eslint no-console: 0, no-unused-vars: 0, no-empty:  0 */
/* exported FileUploader2 */

/*
@codekit-append '_funcs_and_params.js'
@codekit-append '_set_options.js'
@codekit-append '_create_info_text.js'
@codekit-append '_reorder.js'
@codekit-append '_build_hidden_fields.js'
@codekit-append '_send_files.js'
@codekit-append '_set_listeners.js'
@codekit-append '_create_item.js'
@codekit-append '_create_uploader.js'

@codekit-append '_init.js'

*/
"use strict";
var FileUploader2 = (function () {

  let upl = {};

  // Eliminazione IE 11
  if( navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.appVersion.indexOf('Trident/') > -1 ||
      navigator.userAgent.indexOf('Trident/') > -1 ){

    alert("Stai utilizzando un browser non compatibile con questa applicazione.\n" +
      "Utilizza la versione più recente di Firefox, Edge, Safari, Opera o Chrome");

    upl.browser_is_not_compatible = true;
  }


  return upl;
})();
