/* globals FileUploader2:true */

FileUploader2 = ((upl) => {
  "use strict";


  /**
	 * create_info_text
	 * (funzione) Genera la stringa riepilogativa delle limitazioni da rispettare
	 * per la selezione dei file
	 *
   * - Restituisce la stringa informativa
	 */
	upl.create_info_text = fupl_options => {
    let info_text = [];

    if( fupl_options.filetype === 'img' ) {
      info_text.push( 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> o <strong>WEBP</strong>' );

      if( fupl_options.img_w && fupl_options.img_h ) {
        info_text.push( 'dimensioni: <strong>' +  fupl_options.img_w + '&times;' + fupl_options.img_h + 'px</strong>');

      } else {

        if(fupl_options.img_w && fupl_options.img_h && fupl_options.img_w === fupl_options.img_h) {
          info_text.push( 'larghezza e altezza <strong>' +  fupl_options.img_h + 'px</strong>');

        } else if(fupl_options.img_min_w && fupl_options.img_min_h && fupl_options.img_min_w === fupl_options.img_min_h) {
          info_text.push( 'larghezza e altezza non inferiori a <strong>' +  fupl_options.img_min_w + 'px</strong>');

        } else if(fupl_options.img_max_w && fupl_options.img_max_h && fupl_options.img_max_w === fupl_options.img_max_h) {
          info_text.push( 'larghezza e altezza non superiori a <strong>' +  fupl_options.img_max_w + 'px</strong>');

        } else {

          if( fupl_options.img_w ) {
            info_text.push( 'larghezza <strong>' +  fupl_options.img_w + 'px</strong>');

          } else if( fupl_options.img_min_w && fupl_options.img_max_w ) {
            info_text.push( 'larghezza compresa tra <strong>' +  fupl_options.img_min_w + 'px</strong> e <strong>' + fupl_options.img_max_w + 'px</strong>');

          } else if( fupl_options.img_min_w ) {
            info_text.push( 'larghezza non inferiore a <strong>' +  fupl_options.img_min_w + 'px</strong>');

          } else if( fupl_options.img_max_w  ) {
            info_text.push( 'larghezza non superiore a <strong>' +  fupl_options.img_max_w + 'px</strong>');
          }

          if( fupl_options.img_h ) {
            info_text.push( 'altezza <strong>' +  fupl_options.img_h + 'px</strong>');

          } else if( fupl_options.img_min_h && fupl_options.img_max_h ) {
            info_text.push( 'altezza compresa tra <strong>' +  fupl_options.img_min_h + 'px</strong> e <strong>' + fupl_options.img_max_h + 'px</strong>');

          } else if( fupl_options.img_min_h ) {
            info_text.push( 'altezza non inferiore a <strong>' +  fupl_options.img_min_h + 'px</strong>');

          } else if( fupl_options.img_max_h  ) {
            info_text.push( 'altezza non superiore a <strong>' +  fupl_options.img_max_h + 'px</strong>');
          }
        }
      }

    } else if( fupl_options.filetype === 'pdf' ) {
      info_text.push( 'file in formato <strong>PDF</strong>' );
    }

    if( fupl_options.max_filesize !== null ) {
      info_text.push( 'max <strong>' + fupl_options.max_filesize.feedback_size + '</strong>' );
    }

    let str = info_text.join(fupl_options.info_text_join_string);
    str = str.charAt(0).toUpperCase() + str.slice(1);

    if(fupl_options.info_text_wrap_string && str) {
      str = fupl_options.info_text_wrap_string[0] + str + fupl_options.info_text_wrap_string[1];
    }
    return str;
	};

  return upl;

})(FileUploader2 || {});
