//* eslint no-console: 0 */
/* globals FileUploader:true */
/* exported */

//TODO rivedere meccanismo visualizzazione errori usando meglio le promesse
//TODO verificare che al server vengano inviati tutti i parametri richiesti
// (dim massima, formati ammessi ecc.)

//TODO rivedere e sistemare meccanismo per cui si blocca il submit se upload non terminato
//     in special modo se ci sono diversi file da caricare

FileUploader = (function (_upl) {
  "use strict";

  /**
	 * ### sendAjaxRequest
	 * (funzione privata) esegue l'upload Ajax
	 */
  var sendAjaxRequest = function ( upl_options, current_item, item_id, image_width, image_height, callback ) {
    var ajax = new XMLHttpRequest();
      ajax.open( 'post', upl_options.uploader_url, true );

      ajax.onload = function() {

        if( ajax.status >= 200 && ajax.status < 400 ) {

          var response = JSON.parse( ajax.responseText ),
            hidden_fields = _upl.build_hidden_fields(item_id, upl_options, current_item, response.tmp_file, image_width, image_height);
          upl_options.upload_complete_callback({
            'item_id'          : item_id,
            'server_error'     : response.error,
            'filelist_item'    : current_item,
            'hidden_fields'    : hidden_fields,
            'uploader_options' : upl_options,
            'img_wi'           : image_width ? image_width : null,
            'img_he'           : image_height ? image_height : null
          });



        } else {
          upl_options.alertErrorAPI( 'Si è verificato un errore nell\'invio dei dati.' );
          /* eslint-disable */
          console.error( ajax.status, ajax.statusText );
          console.error( ajax.responseText );
          /* eslint-enable */
        }

        if( callback && typeof callback === "function") {
          callback();
        }

      };

      ajax.onerror = function() {
        upl_options.alertErrorAPI( 'Si è verificato un errore nell\'invio dei dati. (onerror)' );
        /* eslint-disable */
        console.error( ajax.status,  ajax.statusText );
        console.error( ajax.responseText );
        /* eslint-enable */

        if( callback && typeof callback === "function") {
          callback();
        }
      };

      var fileData = new FormData();
      fileData.append('file', current_item);
      ajax.send( fileData );
  };



  /**
	 * ### sendFiles
	 * (funzione) Esegue i controlli impostati, quindi la chiamata ajax e produce
	 * il feedback per l'utente
	 */
	_upl.sendFiles = function (filelist, upl_options, _form) {

    var submit_btn = null, submit_btn_prev_disabled;

    if(_form === undefined) {
      _form = upl_options.container.parents('form').eq(0);
      if(_form.length ) {
        _form = _form.eq(0);
        submit_btn = $(':submit', _form);
        submit_btn_prev_disabled = submit_btn.prop('disabled');
      } else {
        _form = null;
      }
    }

    if( filelist.length ) {

      var error_list = [],

      // contatore dei file elaborati, sia con esito positivo che negativo
      parsedFilesCount = 0,
      // flag per mostrare una sola volta i messaggi di errore
      error_displayed = false,

      // mostra il messaggio di errore se tutti i file sono stati elaborati
      display_error = function () {
        if(parsedFilesCount === filelist.length && !error_displayed && error_list.length ) {
          upl_options.alertErrorAPI( error_list.join('\n\n') );
          error_displayed = true;
        }
// TODO RICONTROLLARE
        if(submit_btn && !submit_btn_prev_disabled) {
          submit_btn.prop('disabled', false);
        }
      },

      // aggiorna l'array dei messaggi di errore, incrementa il contatore dei file elaborati
      send_error = function (mes) {
        error_list.push(mes);
        parsedFilesCount++;
        display_error();
      };

      // verifica se è presente pulsante submit e se necessario lo disattiva
      if(submit_btn && !submit_btn_prev_disabled) {
        submit_btn.prop('disabled', true);
      }

      // https://stackoverflow.com/questions/38362231/how-to-use-promise-in-foreach-loop-of-array-to-populate-an-object
      Array.from(filelist).forEach(function (item, idx) {

        // generazione id unico
        var item_id = 'fupl' + new Date().getTime() + '_' + idx,
          is_error = false;

//BUG i valori da attributo accept inseriti come estensioni non vengono accettati


          // controllo filetype (per drag&drop e browser che non supportano accept)
          if( upl_options.accept.length ) {
            var ext = item.name.split('.').pop().toLowerCase();
            if( upl_options.accept.indexOf( item.type ) === -1 &&  upl_options.accept.indexOf( ext ) === -1) {
              is_error = true;
              send_error('Il file “' + item.name + '” è di un formato non consentito');
            }
          } // end filetype

          // maxfilesize
          if(!is_error && upl_options.max_filesize !== null ) {
            if( item.size > upl_options.max_filesize.maxbytes ) {
              var feedback_size;
              // conversione di items.size nell'unità di misura indicata per il feedback all'utente
              if ( upl_options.max_filesize.unit === 'KB' ) {
                feedback_size = Math.round(item.size / 1024);
              } else {
                feedback_size = Math.round(item.size / (1024 * 1024));
              }
              is_error = true;
              send_error(
                'Le dimensioni di “' + item.name + '” (' + feedback_size + upl_options.max_filesize.unit + ') '+
                'superano il valore massimo consentito (' + upl_options.max_filesize.feedback_size + ')'
              );
            }
          } // end maxfilesize

          if(!is_error ) {

          	new Promise(function(resolve, reject) {
            	if(upl_options.filetype === 'img') {

              	var reader  = new FileReader();
                reader.addEventListener("load", function () {

                  var image = new Image();
                  image.src = reader.result;
                  image.addEventListener("load", function () {

                    var err_mes = [];

    								if( upl_options.img_w && image.width !== upl_options.img_w ) {
    									err_mes.push("larghezza non corrispondente (" + image.width + 'px invece di ' + upl_options.img_w + 'px)');

    								} else if(upl_options.img_min_w && image.width < upl_options.img_min_w) {
    									err_mes.push('larghezza inferiore a quella minima consentita (' + image.width + 'px invece di ' +  upl_options.img_min_w + 'px)');

    								} else if(upl_options.img_max_w && image.width > upl_options.img_max_w) {
    									err_mes.push('larghezza superiore a quella massima consentita (' + image.width + 'px invece di ' +  upl_options.img_max_w + 'px)');
    								}

    								if (upl_options.img_h && image.height !== upl_options.img_h) {
    									err_mes.push('altezza non corrispondente (' + image.height + 'px invece di ' + upl_options.img_h + 'px)');

    								} else if(upl_options.img_min_h && image.height < upl_options.img_min_h) {
    									err_mes.push('altezza inferiore a quella minima consentita (' + image.height + 'px invece di ' + upl_options.img_min_h + 'px)');

    								} else if(upl_options.img_max_h && image.height > upl_options.img_max_h) {
    									err_mes.push('altezza superiore a quella massima consentita (' + image.height + 'px invece di ' + upl_options.img_max_h + 'px)');
    								}

    								if( err_mes.length ) {
                      reject(err_mes);
    								} else {

                      sendAjaxRequest( upl_options, item,  item_id, image.width, image.height,
                        resolve ( [reader.result, image.width, image.height] )
                      );
    								}

                  }, false); // end image.addEventListener("load"

                }, false); // end reader.addEventListener("load"

                reader.readAsDataURL( item );

            	} else { // non immagine

                sendAjaxRequest( upl_options, item,  item_id,
                  resolve (null)
                );
              }
            }) // end Promise
            .then(
              // resolve
              function ( img_data ) {

                parsedFilesCount++;
                upl_options.upload_start_callback({
                  'item_id'           : item_id,
                  'filelist_item'     : item,
                  'img_preview'       : img_data? img_data[0] : null,
                  'uploader_options'  : upl_options,
                  'img_wi'            : img_data? img_data[1] : null,
                  'img_he'            : img_data? img_data[2] : null
                });
              },
              //reject
              function ( mes_array ) {
                send_error('Dimensioni immagine “' + item.name + '”non corrette:\n' + mes_array.join('\n') );
              }
            )
            .finally( function () {
              // se necessario riattiva il pulsante submit
              if(submit_btn && !submit_btn_prev_disabled) {
                submit_btn.prop('disabled', false);
              }
            });
          } // end if(!is_error )
      }); // end foreach

      // a fine ciclo mostra eventuali errori non legati alla promessa
      display_error();

    } // end if( filelist.length )
  }; // end sendFiles

  return _upl;

})(FileUploader || {});
