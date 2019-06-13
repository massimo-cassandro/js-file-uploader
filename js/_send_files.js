/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  /*
	sendFiles
	Esegue i controlli impostati, quindi la chiamata ajax e produce
	il feedback per l'utente
	*/
  upl.sendFiles = (filelist, fupl_options) => {

    // sendAjaxRequest
    // esegue l'upload Ajax - versione compatibile per IE
    // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

// TODO utilizzo `fetch` (però non compatibile IE)
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch

    const sendAjaxRequest = ( current_item, callback ) => {
      const ajax = new XMLHttpRequest(),
      show_error = (error_message) => {
        fupl_options.alert_api( error_message, fupl_options );
        /* eslint-disable */
        if(fupl_options.debug) {
          console.error( ajax.status, ajax.statusText );
          console.error( ajax.responseText );
        }
        /* eslint-enable */
      };

      ajax.open( 'POST', fupl_options.uploader_url, true );

      ajax.onload = function() {

        if( ajax.status >= 200 && ajax.status < 400 ) {

          let response = JSON.parse( ajax.responseText ),
          hidden_fields = upl.buildHiddenFields(current_item, fupl_options, response.tmp_file);

          fupl_options.upload_complete_callback({
            'item'          : current_item,
            'server_error'  : response.error,
            'hidden_fields' : hidden_fields,
            'fupl_options'  : fupl_options
          });

        } else {
          show_error(fupl_options.alert_messages.xhrError);
        }
        if( callback && typeof callback === "function") {
          callback();
        }
      };

      ajax.onerror = function() {
        show_error(fupl_options.alert_messages.xhrError);

        if( callback && typeof callback === "function") {
          callback();
        }
      };

      let fileData = new FormData();
      fileData.append('file', current_item.file);
      ajax.send( fileData );
    },


    disable_submit = (modo) => {
      // modo === true → disable, false → enable
      const _form = fupl_options.element.closest('form');
      if(fupl_options.disable_submit && _form) {
        const submit_btns = _form.querySelectorAll('[type="submit"');
        submit_btns.forEach( btn => {
          btn.disabled = modo;
        });

        const submitHandler = (e) => {
          e.preventDefault();
          console.log('submit'); // eslint-disable-line
          return false;
        };
        if(modo === true) {
          _form.addEventListener('submit', submitHandler, false);
        } else {
          _form.removeEventListener('submit', submitHandler, false);
        }

      }
    };

    // disabilitazione form
    disable_submit(true);

    if( filelist.length ) {


    // https://stackoverflow.com/questions/38362231/how-to-use-promise-in-foreach-loop-of-array-to-populate-an-object
    [...filelist].forEach(function (item, idx) {
      try {

        let current_item = {file: item};

        // generazione id unico
        current_item.id = 'fupl_item_' + (+new Date()) + '_' + idx;

        //BUG i valori da attributo accept inseriti come estensioni non vengono accettati
        // controllo filetype (per drag&drop e browser che non supportano accept)
        if( fupl_options.accept.length ) {
          let ext = item.name.split('.').pop().toLowerCase();
          if( fupl_options.accept.indexOf( item.type ) === -1 && fupl_options.accept.indexOf( ext ) === -1) {

            throw fupl_options.alert_messages.fileFormatError
              .replace(/{{file_name}}/, item.name );
          }
        } // end controllo filetype

        // controllo maxfilesize
        if( fupl_options.max_filesize !== null ) {
          if( item.size > fupl_options.max_filesize.maxbytes ) {
            let item_parsed_size = upl.parse_filesize(item.size, fupl_options.locales);

            throw fupl_options.alert_messages.fileSizeError
              .replace(/{{file_name}}/, item.name )
              .replace(/{{file_size}}/, item_parsed_size )
              .replace(/{{allowed_size}}/, fupl_options.max_filesize.feedback_size );

          }
        } // end controllo maxfilesize

      } catch (errormessage) {
        console.log(errormessage); // eslint-disable-line
        fupl_options.alert_api( errormessage, fupl_options );
      }



//           if(!is_error ) {

//           	new Promise(function(resolve, reject) {
//             	if(upl_options.filetype === 'img') {

//               	var reader  = new FileReader();
//                 reader.addEventListener("load", function () {

//                   var image = new Image();
//                   image.src = reader.result;
//                   image.addEventListener("load", function () {

//                     var err_mes = [];

//     								if( upl_options.img_w && image.width !== upl_options.img_w ) {
//     									err_mes.push("larghezza non corrispondente (" + image.width + 'px invece di ' + upl_options.img_w + 'px)');

//     								} else if(upl_options.img_min_w && image.width < upl_options.img_min_w) {
//     									err_mes.push('larghezza inferiore a quella minima consentita (' + image.width + 'px invece di ' +  upl_options.img_min_w + 'px)');

//     								} else if(upl_options.img_max_w && image.width > upl_options.img_max_w) {
//     									err_mes.push('larghezza superiore a quella massima consentita (' + image.width + 'px invece di ' +  upl_options.img_max_w + 'px)');
//     								}

//     								if (upl_options.img_h && image.height !== upl_options.img_h) {
//     									err_mes.push('altezza non corrispondente (' + image.height + 'px invece di ' + upl_options.img_h + 'px)');

//     								} else if(upl_options.img_min_h && image.height < upl_options.img_min_h) {
//     									err_mes.push('altezza inferiore a quella minima consentita (' + image.height + 'px invece di ' + upl_options.img_min_h + 'px)');

//     								} else if(upl_options.img_max_h && image.height > upl_options.img_max_h) {
//     									err_mes.push('altezza superiore a quella massima consentita (' + image.height + 'px invece di ' + upl_options.img_max_h + 'px)');
//     								}

//     								if( err_mes.length ) {
//                       reject(err_mes);
//     								} else {

//                       sendAjaxRequest( upl_options, item,  item_id, image.width, image.height,
//                         resolve ( [reader.result, image.width, image.height] )
//                       );
//     								}

//                   }, false); // end image.addEventListener("load"

//                 }, false); // end reader.addEventListener("load"

//                 reader.readAsDataURL( item );

//             	} else { // non immagine

//                 sendAjaxRequest( upl_options, item,  item_id,
//                   resolve (null)
//                 );
//               }
//             }) // end Promise
//             .then(
//               // resolve
//               function ( img_data ) {

//                 parsedFilesCount++;
//                 upl_options.upload_start_callback({
//                   'item_id'           : item_id,
//                   'filelist_item'     : item,
//                   'img_preview'       : img_data? img_data[0] : null,
//                   'uploader_options'  : upl_options,
//                   'img_wi'            : img_data? img_data[1] : null,
//                   'img_he'            : img_data? img_data[2] : null
//                 });
//               },
//               //reject
//               function ( mes_array ) {
//                 send_error('Dimensioni immagine “' + item.name + '”non corrette:\n' + mes_array.join('\n') );
//               }
//             )
//             .finally( function () {
//               // se necessario riattiva il pulsante submit
//               if(submit_btn && !submit_btn_prev_disabled) {
//                 submit_btn.prop('disabled', false);
//               }
//             });
//           } // end if(!is_error )
       }); // end foreach

    } // end if( filelist.length )

  }; // end upl.sendFiles

  return upl;

})(FileUploader2 || {});
