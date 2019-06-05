/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.createUploader = (fupl_options) => {

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
      console.log(fupl_options);
      console.groupEnd();
      /* eslint-enable */
    } // end if debug

    // rilevamento eventuali elementi label e input
    let _label = fupl_options.element.querySelector('label'),
    _input = fupl_options.element.querySelector('input[type="file"]');

    // testo label (da tag o parametro label_text)
    if( !fupl_options.label_text && _label) {
      fupl_options.label_text = _label.innerHTML;
    }
    // caso in cui sia presente nessun valore
    if (!fupl_options.label_text) {
      fupl_options.label_text = '__label non presente__';
    }

    // eliminazione di tutti gli elementi contenuti nell'elemento uplaoder
    fupl_options.element.innerHTML = '';

    // aggiunta della classe principale
    fupl_options.element.classList.add("file-uploader");

    // aggiunta eventuale classe personale
    if( fupl_options.element_class ) {
      fupl_options.element.classList.add( fupl_options.element_class );
    }

    // aggiunta label
    if( fupl_options.add_label ) {
      fupl_options.element.insertAdjacentHTML('beforebegin',
        '<div class="file-uploader-label">' +
          '<label' + (fupl_options.required? ' class="required"' : '') + '>' +
            fupl_options.label_text +
          '</label>' +
        '</div>'
      );
      fupl_options.element.classList.add( 'has-file-uploader-label' );
    }

    // aggiunta template uploader


    // aggiunta valori


    // esecuzione init_callback, se presente
    if( fupl_options.init_callback !== null ) {
      fupl_options.init_callback( fupl_options );
    }


  }; // end upl.createUploader

  return upl;

})(FileUploader2 || {});



  // //         // aggiunta template
  // //         var original_html = fupl_options.element.html();
  // //         fupl_options.element.html( fupl_options.template );

  // //         fupl_options.element.find('.fileupl__button').html( original_html ); //ripristino markup originale

  // //         // se esiste fupl_options.label_class, la classe viene aggiunta
  // //         if( fupl_options.label_class ) {
  // //           _label.addClass( fupl_options.label_class  );
  // //         }

  // //         // aggiunta del testo info per il drag & drop
  // //         fupl_options.element.find('.fileupl__dd_text').html( fupl_options.is_multiple ? fupl_options.dd_text_multiple : fupl_options.dd_text_single );

  // //         // aggiunta testo info file
  // //         fupl_options.element.find('.fileupl__info_text')
  // //         .html(
  // //           (fupl_options.show_info_text ? upl.create_info_text(fupl_options) : '') +
  // //           ((fupl_options.show_info_text && fupl_options.custom_info_text)? '<br>' : '') +
  // //           (fupl_options.custom_info_text ? fupl_options.custom_info_text : '')
  // //         );


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
