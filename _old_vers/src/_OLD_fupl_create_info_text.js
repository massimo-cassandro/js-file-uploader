//* eslint no-console: 0 */
/* globals FileUploader:true */

FileUploader = (function (_upl) {
  "use strict";

  //TODO rendere privata

  /**
	 * ### create\_info\_text
	 * (funzione) Genera la stringa riepilogativa delle limitazioni da rispettare
	 * per la selezione delle immagini
	 *
   * - Restituisce la stringa informativa
	 */
	_upl.create_info_text = function (upl_options) {
  	var info_text = [];

  	if( upl_options.filetype === 'img' ) {
      info_text.push( 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> o <strong>WEBP</strong>' );

      if( upl_options.img_w && upl_options.img_h ) {
        info_text.push( 'dimensioni: <strong>' +  upl_options.img_w + '&times;' + upl_options.img_h + 'px</strong>');

      } else {
        var dim = [];

        if(upl_options.img_w && upl_options.img_h && upl_options.img_w === upl_options.img_h) {
            dim.push( 'larghezza e altezza <strong>' +  upl_options.img_h + 'px</strong>');

        } else if(upl_options.img_min_w && upl_options.img_min_h && upl_options.img_min_w === upl_options.img_min_h) {
            dim.push( 'larghezza e altezza non inferiori a <strong>' +  upl_options.img_min_w + 'px</strong>');

        } else if(upl_options.img_max_w && upl_options.img_max_h && upl_options.img_max_w === upl_options.img_max_h) {
            dim.push( 'larghezza e altezza non superiori a <strong>' +  upl_options.img_max_w + 'px</strong>');

        } else {

          if( upl_options.img_w ) {
            dim.push( 'larghezza <strong>' +  upl_options.img_w + 'px</strong>');

          } else if( upl_options.img_min_w && upl_options.img_max_w ) {
            dim.push( 'larghezza compresa tra <strong>' +  upl_options.img_min_w + 'px</strong> e <strong>' + upl_options.img_max_w + 'px</strong>');

          } else if( upl_options.img_min_w ) {
            dim.push( 'larghezza non inferiore a <strong>' +  upl_options.img_min_w + 'px</strong>');

          } else if( upl_options.img_max_w  ) {
            dim.push( 'larghezza non superiore a <strong>' +  upl_options.img_max_w + 'px</strong>');
          }

          if( upl_options.img_h ) {
            dim.push( 'altezza <strong>' +  upl_options.img_h + 'px</strong>');

          } else if( upl_options.img_min_h && upl_options.img_max_h ) {
            dim.push( 'altezza compresa tra <strong>' +  upl_options.img_min_h + 'px</strong> e <strong>' + upl_options.img_max_h + 'px</strong>');

          } else if( upl_options.img_min_h ) {
            dim.push( 'altezza non inferiore a <strong>' +  upl_options.img_min_h + 'px</strong>');

          } else if( upl_options.img_max_h  ) {
            dim.push( 'altezza non superiore a <strong>' +  upl_options.img_max_h + 'px</strong>');
          }
        }

        if(dim.length) {
          info_text.push( dim.join(', ') );
        }

      }

    } else if( upl_options.filetype === 'pdf' ) {
      info_text.push( 'file in formato <strong>PDF</strong>' );
    }

    if( upl_options.max_filesize !== null ) {
      info_text.push( 'max <strong>' + upl_options.max_filesize.feedback_size + '</strong>' );
    }

    var str = info_text.join(upl_options.info_text_join_string);
    return str.charAt(0).toUpperCase() + str.slice(1);
	};

  return _upl;

})(FileUploader || {});
