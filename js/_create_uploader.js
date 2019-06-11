/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.createUploader = (fupl_options) => {

    // eventuale campo input e relativo tag label
    let _input = fupl_options.element.querySelector('input[type="file"]'),
      original_label = fupl_options.element.querySelector('label');


    // implementazione eventuali parametro/attributo `accept`
    if( fupl_options.filetype === 'auto' ) {

      let accept_attr = [],
      accept_params = [];

      if( fupl_options.accept !== null ) {
        accept_params = fupl_options.accept
          .split(',').map( item => item.trim() );
      }

      if(_input && _input.getAttribute('accept') ) {
        accept_attr = _input.getAttribute('accept')
          .split(',').map( item => item.trim() );
      }

      // https://www.peterbe.com/plog/merge-two-arrays-without-duplicates-in-javascript
      fupl_options.accept = [...new Set([...accept_params, ...accept_attr])];

    } else {
      fupl_options.accept = upl.mimetypes[fupl_options.filetype];
    }

    // elaborazione max_filesize
    let max_filesize = upl.parse_max_filesize(fupl_options.max_filesize, fupl_options.locales);
    if( max_filesize === false ) {
      throw new Error( '"' + fupl_options.max_filesize + '" non è un valore corretto per `max_filesize`');
    } else {
      fupl_options.max_filesize = max_filesize;
    }

    // parametro o attributo multiple
    fupl_options.multiple = Boolean(fupl_options.multiple ||
      (_input && _input.hasAttribute('multiple') ));

    // parametro o attributo required
    fupl_options.required = Boolean(fupl_options.required ||
      (_input && _input.hasAttribute('required') ));


    // tipologia generale dell'uploader (img o doc) e modalità
    // selezione file
    fupl_options._type = fupl_options.filetype === 'img'? 'img' : 'doc';
    fupl_options._mode = fupl_options.multiple? 'single' : 'multiple';

    // testo label (da tag o parametro uploader_label_text)
    if( !fupl_options.uploader_label_text && original_label) {
      fupl_options.uploader_label_text = original_label.innerHTML;
    }
    // caso in cui sia presente nessun valore
    if ( !fupl_options.uploader_label_text ) {
      fupl_options.uploader_label_text = '__label non presente__';
    }

    // aggiunta della classe principale
    fupl_options.element.classList.add("fupl");

    // aggiunta wrapper
    fupl_options.wrapper = document.createElement('div');
    fupl_options.element.parentNode.insertBefore(fupl_options.wrapper, fupl_options.element);
    fupl_options.wrapper.appendChild(fupl_options.element);
    fupl_options.wrapper.classList.add("fupl-wrapper");
    fupl_options.wrapper.classList.add("fupl-type-" + fupl_options._type );
    if(fupl_options.multiple) {
      fupl_options.wrapper.classList.add("fupl-multiple");
    }
    // aggiunta eventuali class' personale
    if( fupl_options.element_class ) {
      fupl_options.element.classList.add( ...fupl_options.element_class.split(' ') );
    }

    // aggiunta label uploader
    if( fupl_options.uploader_add_label ) {
      let _class = ['fupl-label'];
      if( fupl_options.uploader_label_class ) {
        _class.push(fupl_options.uploader_label_class);
      }
      if( fupl_options.required ) {
        _class.push('required');
      }
      fupl_options.element.insertAdjacentHTML('beforebegin',
        '<div class="fupl-label">' +
          '<label' + (_class.length? ' class="' + _class.join(' ') + '"' : '') + '>' +
            fupl_options.uploader_label_text +
          '</label>' +
        '</div>'
      );
      fupl_options.wrapper.classList.add( 'fupl-has-label' );
    }

    // aggiunta template uploader
    fupl_options.element.innerHTML = fupl_options.templates.main;

    fupl_options.istance_input = fupl_options.element.querySelector('.fupl-panel input[type="file"]');
    fupl_options.istance_label = fupl_options.element.querySelector('.fupl-panel label');
    fupl_options.istance_dd_text = fupl_options.element.querySelector('.fupl-panel .fupl-dd-text');
    fupl_options.istance_info_text = fupl_options.element.querySelector('.fupl-panel .fupl-info-text');
    fupl_options.istance_result_wrapper = fupl_options.element.querySelector('.fupl-result');


    // inserimento testi e attributi
    // if( fupl_options.required ) {
    //   fupl_options.istance_input.setAttribute('required', '');
    // }
    if( fupl_options.multiple ) {
      fupl_options.istance_input.setAttribute('multiple', '');
    }
    if( fupl_options.accept !== null ) {
      fupl_options.istance_input.setAttribute('accept', fupl_options.accept.join(','));
    }

    fupl_options.istance_label.insertAdjacentHTML('beforeend',
      fupl_options.input_text[fupl_options._type][fupl_options._mode][0]
    );
    if(fupl_options.input_label_class) {
      fupl_options.istance_label.classList.add(...fupl_options.input_label_class.split(' '));
    }
    fupl_options.istance_dd_text.innerHTML = fupl_options.input_text[fupl_options._type][fupl_options._mode][1];

    // info text
    fupl_options.istance_info_text.innerHTML = 'xxx';
    if( fupl_options.show_info_text ) {
      if(fupl_options.custom_info_text) {
        fupl_options.istance_info_text.innerHTML = fupl_options.custom_info_text;
      } else {
        fupl_options.istance_info_text.innerHTML = upl.create_info_text(fupl_options);
      }
    }

    // aggiunta valori
    if( !fupl_options.values || !fupl_options.values.length ) {
      fupl_options.istance_result_wrapper.innerHTML = fupl_options.templates.no_file[fupl_options._type];

    } else {
      fupl_options.values.forEach( item => {
        upl.createItem(item, fupl_options);
      });

      // aggiunta parametro data per segnalare che sono presenti valori
      fupl_options.wrapper.dataset.hasValues = 'true';
    }


    // esecuzione init_callback, se presente
    if( fupl_options.init_callback !== null ) {
      fupl_options.init_callback( fupl_options );
    }


    //debug
    if( fupl_options.debug ) {
      /* eslint-disable */
      console.groupCollapsed('FileUploader options');
      // creazione di un oggetto bidimensinale per
      // semplificare la rappresentazione in tabella
      let c_options = {},
      c_keys = Object.keys(fupl_options);
      c_keys.sort();
      c_keys.forEach(item => {
        let _toStringify = typeof fupl_options[item] === 'object' &&
        fupl_options[item] !== null &&
          item !== 'element';
        c_options[item] = _toStringify ? JSON.stringify(fupl_options[item], null, ' ') : fupl_options[item];
      });
      console.table(c_options);
      console.groupCollapsed('fupl_options');
        console.log(fupl_options);
      console.groupEnd();
      console.groupEnd();
      /* eslint-enable */
    } // end if debug


  }; // end upl.createUploader

  return upl;

})(FileUploader2 || {});



  // //         // !DRAG&DROP
  // //         fupl_options.element
  // //         .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
  // //           e.preventDefault();
  // //           e.stopPropagation();
  // //         })
  // //         .on( 'dragover dragenter', function() {
  // //           fupl_options.element.addClass( fupl_options.element_dragover_class );
  // //         })
  // //         .on( 'dragleave dragend drop', function() {
  // //           fupl_options.element.removeClass( fupl_options.element_dragover_class );
  // //         })
  // //         .on( 'drop', function( e ) {
  // //           var err = false;
  // //           if( !fupl_options.is_multiple && e.originalEvent.dataTransfer.files.length > 1 ) {

  // //             fupl_options.alertErrorAPI('Puoi selezionare un solo file!');
  // //             err = true;
  // //           }

  // //           if(!err) {
  // //             upl.sendFiles( e.originalEvent.dataTransfer.files, fupl_options ); // filelist
  // //           }
  // //         });

  // // //TODO fumoso, da riscrivere
  // // //TODO correggere selector, possibilità non abbia id
  // //         // !selezione tramite input
  // //         var input_selector = '#' + _input.attr('id');
  // //         $(document).on('change', input_selector, function () {
  // //           upl.sendFiles( document.querySelector(input_selector).files, fupl_options ); // filelist
  // //         });


  //       } catch(e) { //throw "error"
  //         console.error( e );// eslint-disable-line
  //       } // finally {}

  //     }); // end document.querySelectorAll(upl.global_options.selector).forEach

  //   }; // end init

  //   return upl;

  // })(FileUploader2 || {});
