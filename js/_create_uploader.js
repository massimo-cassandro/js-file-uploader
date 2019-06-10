/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.createUploader = (fupl_options) => {

    // tipologia generale dell'uploader (img o doc)
    let upl_istance = {
      _type: fupl_options.filetype === 'img'? 'img' : 'doc',
      _mode: fupl_options.multiple? 'single' : 'multiple'
    },
    // rilevamento eventuali elemento label
    original_label = fupl_options.element.querySelector('label');

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
    let wrapper = document.createElement('div');
    fupl_options.element.parentNode.insertBefore(wrapper, fupl_options.element);
    wrapper.appendChild(fupl_options.element);
    wrapper.classList.add("fupl-wrapper");
    wrapper.classList.add("fupl-type-" + upl_istance._type );
    if(fupl_options.multiple) {
      wrapper.classList.add("fupl-multiple");
    }
    // aggiunta eventuali class' personale
    if( fupl_options.element_class ) {
      fupl_options.element.classList.add( ...fupl_options.element_class.split(' ') );
    }

    // aggiunta label uplaoder
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
      wrapper.classList.add( 'fupl-has-label' );
    }

    // aggiunta template uploader
    fupl_options.element.innerHTML = fupl_options.templates.main;

    upl_istance = Object.assign(upl_istance, {
      input: fupl_options.element.querySelector('.fupl-panel input[type="file"]'),
      label: fupl_options.element.querySelector('.fupl-panel label'),
      dd_text: fupl_options.element.querySelector('.fupl-panel .fupl-dd-text'),
      info_text: fupl_options.element.querySelector('.fupl-panel .fupl-info-text'),
      result_wrapper: fupl_options.element.querySelector('.fupl-result')
    });

    // inserimento testi e attributi
    if( fupl_options.required ) {
      upl_istance.input.setAttribute('required', '');
    }
    if( fupl_options.multiple ) {
      upl_istance.input.setAttribute('multiple', '');
    }
    upl_istance.label.insertAdjacentHTML('beforeend',
      fupl_options.input_text[upl_istance._type][upl_istance._mode][0]
    );
    if(fupl_options.input_label_class) {
      upl_istance.label.classList.add(...fupl_options.input_label_class.split(' '));
    }
    upl_istance.dd_text.innerHTML = fupl_options.input_text[upl_istance._type][upl_istance._mode][1];

    // info text
    upl_istance.info_text.innerHTML = 'xxx';

    // aggiunta valori


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
      console.log('fupl_options');
      console.table(c_options);
      console.log('upl_istance');
      console.table(upl_istance);
      console.groupCollapsed('fupl_options');
        console.log(fupl_options);
      console.groupEnd();
      console.groupCollapsed('upl_istance');
        console.log(upl_istance);
      console.groupEnd();
      console.groupEnd();
      /* eslint-enable */
    } // end if debug


  }; // end upl.createUploader

  return upl;

})(FileUploader2 || {});



  // //         // aggiunta template
  // //         var original_html = fupl_options.element.html();
  // //         fupl_options.element.html( fupl_options.template );

  // //         fupl_options.element.find('.fileupl__button').html( original_html ); //ripristino markup originale

  // //         // se esiste fupl_options.label_class, la classe viene aggiunta
  // //         if( fupl_options.label_class ) {
  // //           original_label.addClass( fupl_options.label_class  );
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
