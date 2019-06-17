//* eslint no-console: 0, no-unused-vars: 0 */
/* exported FileUploader */

// FileUploader 1.0.1

//TODO modalità autoinput
/*
  modalità autoinput:
  permette l'attivazione di fileuploader partendo dal solo div contenitore
  input e label vengono aggiunti dallo script.
  Questa modalità impedisce il fallback all'elemento html nativo e fa sì che non
  sia possibile caricare file senza l'attivazione dello script

  Questa modalità deve prevedere l'impostazione dell'attributo name dell'input
  e richiedere la presenza del parametro label_text
*/

//TODO più uploader nella stessa pagina: rivedere completamente pattern, eliminare indice opzioni
//TODO versione jQuery free
//TODO esempio funzionante al completo
//TODO cambiare pattern?
//TODO ES6
//TODO sistema alert integrato?
//TODO sendFiles: rivedere meccanismo visualizzazione errori usando meglio le promesse
//TODO opzione per aggiungere variabili extra tramite parametri data
/*

  @codekit-append 'src/_fupl_setDefault.js';
  @codekit-append 'src/_fupl_create_info_text.js';
  @codekit-append 'src/_fupl_build_hidden_fields.js';
  @codekit-append 'src/_fupl_sendFiles.js';
  @codekit-append 'src/__fupl_init.js';
*/

var FileUploader = (function () {
  "use strict";

  // VARIABILI GLOBALI
  // TODO rendere private
  var _upl = {

    /*
      opzioni risultanti dal merge delle opzioni di default e da
      quelle inviate tramite setOptions
    */
    global_options: {},

    /*
      opzioni risultanti dal merge di global_options e da
      quelle associate all'elemento FileUploader tramite attributi data
    */
    uploader_options: {},

    /*
  	 mimetypes ed estensioni da utilizzare per l'attributo `accept` del
  	 tag input in corrispondenza del parametro `filetype`
  	*/
  	mimetypes: {
    	img: ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
      	    '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],

    	pdf: ['application/pdf', '.pdf']
  	}

  };

  return _upl;
}());
