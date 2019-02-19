/* eslint no-console: 0, no-unused-vars: 0, no-empty:  0 */
/* exported FileUploader */

// FileUploader 2.0.0

/*

  @codekit-append '_defaults.js';
  -codekit-append '_create_info_text.js';
  -codekit-append '_build_hidden_fields.js';
  -codekit-append '_sendFiles.js';
  @codekit-append '_init.js';
*/

var FileUploader = (() => {
  "use strict";

  // VARIABILI GLOBALI
  let upl = {

    /*
      opzioni risultanti dal merge di `default_global_options` e da
      quelle inviate all'inizializzazione di FileUploader.
      Il default è impostato in `_default.js`, il valore definitivo
      è impostato in `_init.js`
    */
    global_options: {},

    /*
  	 mimetypes ed estensioni da utilizzare per l'attributo `accept` del
  	 tag input in corrispondenza del parametro `filetype`
  	*/
  	mimetypes: {
    	img: ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
      	    '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],

    	pdf: ['application/pdf', '.pdf']
    },

    // classe uploader
    uploader: function () {
      /*
        opzioni risultanti dal merge di `default_options`, da quelle inviate
        all'inizializzazione di FileUploader e da quelle associate all'elemento
        FileUploader tramite attributi data.
        Il default è impostato in `_default.js`, il valore definitivo
        è impostato in `_init.js`
      */
      this.istance_options = {};
    }
  };

  return upl;
})();
