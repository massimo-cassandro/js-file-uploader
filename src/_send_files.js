/*
Performs all the checks, calls the remote url via ajax
and generates the feedback for the user
*/

import {create_item} from './_create_item.js';
import {fupl_utilities} from './_utilities.js';
import {build_hidden_fields} from './_build_hidden_fields.js';

export function send_files(filelist, fupl) {

  // disable the form submit button until the upload is completed
  const disable_submit = (mode) => {
      // mode === true → disable, false → enable
      const _form = fupl.opts.element.closest('form');

      if(fupl.opts.disable_submit && _form) {
        const submit_btns = _form.querySelectorAll('[type="submit"]');

        submit_btns.forEach( btn => {
          btn.disabled = mode;
        });

        // TODO: removeEventListener doesn't work
        // const submitHandler = (e) => {
        //   e.preventDefault();
        //   //return false;
        // };
        // if(mode === true) {
        //   _form.addEventListener('submit', submitHandler, false);
        // } else {
        //   if( !fupl.opts.instance_result_wrapper.querySelector('.fupl-item.fupl-is-uploading')) {
        //     _form.removeEventListener('submit', submitHandler, false);
        //   }
        // }
      }
    },

    /*
    uploadFile
    ajax upload
    https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

    current_item contains:
      - `id`: element unique id
      - `file`: filelist obj
      - `width` e height: image pixel sizes. null if not an image
      - `tmp_file`: temporary server file name (new uplaods only)

    */
    uploadFile = function ( current_item, img_preview ) {

      // disabling form
      disable_submit(true);

      // aggiunta elemento all'uploader
      let this_item = create_item({
          id       : current_item.id,
          name     : current_item.file.name,
          url      : null,
          src      : img_preview,
          wi       : current_item.width,
          he       : current_item.height,
          size     : current_item.file.size,
          img_type : current_item.file.img_type,
          loading  : true
        }, fupl),


        fupl_progress= this_item.querySelector('.fupl-progress'),
        fupl_loading_wrapper = this_item.querySelector('.fupl-loading'),

        xhr_error_message = fupl.strs.alert_xhr_error.replace(/{{file_name}}/, current_item.file.name);

      //console.log(this_item); // eslint-disable-line

      const remove_item_on_error = () => {
        this_item.querySelector('.fupl-remove-trigger').click();
      };

      // custom callback function
      if( fupl.opts.upload_start_callback ) {
        fupl_utilities.exec_callback(fupl.opts.upload_start_callback, {
          item              : current_item,
          img_preview       : img_preview,
          uploader_options  : fupl
        });
      }

      new Promise(function(resolve, reject) {
        let ajax = new XMLHttpRequest();
        ajax.open( 'POST', fupl.opts.uploader_url, true );

        ajax.onload = function() {

          if( ajax.status >= 200 && ajax.status < 400 ) {

            const response = JSON.parse( ajax.responseText );

            /*
            jsonResponse:
              {
                "tmp_file": "temp_file_name",
                "error": null
              }
            */
            if(response.error) {

              fupl.opts.alert_api( xhr_error_message, fupl );
              console.error( response.error ); // eslint-disable-line
              reject();

            } else {
              current_item.tmp_file = response.tmp_file;
              resolve();
            }

            // custom callback function
            if( fupl.opts.upload_complete_callback ) {
              fupl_utilities.exec_callback(fupl.opts.upload_complete_callback, {
                item          : current_item,
                server_error  : response.error,
                fupl          : fupl
              });
            }

            if(fupl.opts.debug) {
              /* eslint-disable */
              console.groupCollapsed('FileUploader ajax response');
              console.log(response);
              console.groupEnd();
              /* eslint-enable */
            }

          } else {
            fupl.opts.alert_api( xhr_error_message, fupl );
            /* eslint-disable */
            console.error( ajax.status, ajax.statusText );
            console.error( ajax.responseText );
            /* eslint-enable */
          }

          reject();
        };

        ajax.onerror = function() {
          fupl.opts.alert_api( xhr_error_message, fupl );
          /* eslint-disable */
          if(fupl.opts.debug) {
            console.error( ajax.status,  ajax.statusText );
            console.error( ajax.responseText );
          }
          /* eslint-enable */

          reject();
        };

        ajax.upload.addEventListener('progress', function (e) {
          if( fupl.opts.alternative_loading_func ) {

            fupl_utilities.exec_callback(fupl.opts.alternative_loading_func, ...[e, fupl]);

          } else {
            let perc_loaded = Math.round(e.loaded / e.total * 100.0) || 0;

            //console.log(e.loaded ,e.total, perc_loaded); // eslint-disable-line
            if(fupl_progress) {
              if(e.lengthComputable) {
                perc_loaded = perc_loaded === Infinity? 100 : perc_loaded;
                this_item.querySelector('.fupl-progress').value = perc_loaded;
              } else {
                fupl_loading_wrapper.innerHTML = fupl.opts.template_alternative_loading_element;
                fupl_progress = null;
              }
            }
          }
        }, false);


        let fileData = new FormData();
        fileData.append('file', current_item.file);
        ajax.send( fileData );
      }) // end promise
        .then(
          // resolve
          function (  ) {
            //console.log('resolve'); // eslint-disable-line
            this_item.classList.remove('fupl-is-uploading');
            this_item.querySelector('.fupl-loading').remove(); // elemento loading

            this_item.insertAdjacentHTML('beforeend',

              build_hidden_fields(current_item, fupl.opts)
            );

            fupl_utilities.set_has_values(fupl);

            // restoring submit
            disable_submit(false);

          },
          //reject
          function (  ) {
            //console.log('reject'); // eslint-disable-line
            remove_item_on_error();
            fupl_utilities.set_has_values(fupl);
          }
        );

    };

  if( filelist.length ) {

    // https://stackoverflow.com/questions/38362231/
    // how-to-use-promise-in-foreach-loop-of-array-to-populate-an-object
    [...filelist].forEach(function (filelist_item, idx) {
      try {

        let current_item = {
          id: 'fupl_item_' + Date.now() + '_' + idx, // id unico
          file: filelist_item,
          width: null,
          height: null,
          tmp_file: null,
          img_type: fupl.opts._type === 'img'?
            (filelist_item.type === 'image/svg+xml' ? 'svg' : 'bmp') : null
        };

        // filetype check (for drag & drop and browsers that don't support accept)
        if( fupl.opts.accept.length ) {
          let ext = filelist_item.name.split('.').pop().toLowerCase();
          if( fupl.opts.accept.indexOf( filelist_item.type ) === -1 &&
            fupl.opts.accept.indexOf( '.' + ext ) === -1) {

            throw fupl.strs.alert_file_format_error
              .replace(/{{file_name}}/, filelist_item.name );
          }
        } // end filetype check

        // maxfilesize check
        if( fupl.opts.max_filesize !== null ) {
          if( filelist_item.size > fupl.opts.max_filesize.maxbytes ) {
            let item_parsed_size = fupl_utilities.parse_bytes_value(filelist_item.size, fupl.opts.locales);

            throw fupl.strs.alert_file_size_error
              .replace(/{{file_name}}/, filelist_item.name )
              .replace(/{{file_size}}/, item_parsed_size )
              .replace(/{{allowed_size}}/, fupl.opts.max_filesize.feedback_size );
          }
        } // end maxfilesize check

        // images
        if( fupl.opts._type === 'img') {
          let reader  = new FileReader();
          reader.addEventListener('load', function () {

            let image = new Image();
            image.src = reader.result;
            image.addEventListener('load', function () {

              let err_mes = [];
              current_item.width=image.width;
              current_item.height=image.height;
              if(current_item.img_type === 'bmp') {
                if( fupl.opts.img_w && image.width !== fupl.opts.img_w ) {
                  err_mes.push(
                    fupl.strs.alert_img_exact_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_w)
                  );

                } else if(fupl.opts.img_min_w && image.width < fupl.opts.img_min_w) {
                  err_mes.push(
                    fupl.strs.alert_img_min_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_min_w)
                  );

                } else if(fupl.opts.img_max_w && image.width > fupl.opts.img_max_w) {
                  err_mes.push(
                    fupl.strs.alert_img_max_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_max_w)
                  );
                }

                if (fupl.opts.img_h && image.height !== fupl.opts.img_h) {
                  err_mes.push(
                    fupl.strs.alert_img_exact_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_h)
                  );

                } else if(fupl.opts.img_min_h && image.height < fupl.opts.img_min_h) {
                  err_mes.push(
                    fupl.strs.alert_img_min_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_min_h)
                  );

                } else if(fupl.opts.img_max_h && image.height > fupl.opts.img_max_h) {
                  err_mes.push(
                    fupl.strs.alert_img_max_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_max_h)
                  );

                }
              }

              // aspect ratio
              if(fupl.opts.parsed_img_aspect_ratio) {
                let img_ratio = Math.round(((image.width / image.height) + Number.EPSILON) * fupl.opts.aspect_ratio_accuracy) / fupl.opts.aspect_ratio_accuracy;
                if(img_ratio !== fupl.opts.parsed_img_aspect_ratio) {
                  err_mes.push(
                    fupl.strs.alert_img_ratio_err
                      .replace(/{{aspect_ratio}}/, fupl.opts.img_aspect_ratio)
                  );
                }
              }

              if( err_mes.length ) {
                fupl.opts.alert_api(
                  fupl.strs.alert_img_err_start_string
                    .replace(/{{file_name}}/, filelist_item.name ) + '<br>\n' +
                  '<ul><li>' + err_mes.join('</li>\n<li>') + '</li></ul>',
                  fupl );

              } else {
                uploadFile( current_item, reader.result );
              }

            }, false); // end image.addEventListener("load"

          }, false); // end reader.addEventListener("load"

          reader.readAsDataURL( filelist_item );

          // } else if(current_item.img_type === 'svg') { // svg

          //   let reader = new FileReader();

          //   reader.addEventListener('load', () => {

          //     let image = new Image();
          //     image.src = reader.result;

          //     image.addEventListener('load', function () {
          //       current_item.width=image.width;
          //       current_item.height=image.height;
          //     });

          //     uploadFile( current_item,
          //       reader.result
          //       //'data:image/svg+xml;base64,' +  window.btoa(event.target.result)
          //     );
          //   });
          //   reader.readAsDataURL(filelist_item);

        } else { // not image
          uploadFile( current_item );

        } // end if image

      } catch (errormessage) {
        fupl.opts.alert_api( errormessage, fupl ,'error');
      }
    }); // end foreach

  } // end if( filelist.length )

}
