/* globals FileUploader2:true */

FileUploader2 = ((upl) => {



  upl.uploader = (options) => {
    //debug
    if( options.debug ) {
      /* eslint-disable */
      console.groupCollapsed('FileUploader options');
      console.table(options);
      console.log(options);
      console.groupEnd();
      /* eslint-enable */
    }
  };

  return upl;

})(FileUploader2 || {});










  //


  //       try {
  //

  //         //         //!SETUP
  // //         // aggiunta riferimento container ad upl.istance_options
  // //         this_upl.istance_options.container = upl_el;

  // //         // aggiunta della classe per l'attivazione delle regole css
  // //         this_upl.istance_options.container.addClass('fileupl');
  // //         // aggiunta classe personale
  // //         if( this_upl.istance_options.container_class ) {
  // //           this_upl.istance_options.container.addClass( this_upl.istance_options.container_class );
  // //         }

  // //         // rilevamento impostazioni ed elementi (prima di init_callback)
  // //         var _label = this_upl.istance_options.container.find('label'),
  // //           _input = this_upl.istance_options.container.find('input:file');

  // //         this_upl.istance_options.is_multiple = _input.prop('multiple');

  // //         // esecuzione init_callback, se presente
  // //         if( this_upl.istance_options.init_callback !== null ) {
  // //           this_upl.istance_options.init_callback( this_upl.istance_options );
  // //         }

  // //         // aggiunta template
  // //         var original_html = this_upl.istance_options.container.html();
  // //         this_upl.istance_options.container.html( this_upl.istance_options.template );

  // //         this_upl.istance_options.container.find('.fileupl__button').html( original_html ); //ripristino markup originale



  // //         // rilevamento attributo name e sua eliminazione ad evitare che sia inviato con il form
  // //         this_upl.istance_options.input_name = _input.attr('name') || 'uploader_file[]';
  // //         _input.removeAttr('name');

  // //

  // //         // se esiste this_upl.istance_options.label_text, il testo del tag label viene sostituito
  // //         if( this_upl.istance_options.label_text ) {
  // //           _label.text( this_upl.istance_options.label_text );
  // //         }

  // //         // se esiste this_upl.istance_options.label_class, la classe viene aggiunta
  // //         if( this_upl.istance_options.label_class ) {
  // //           _label.addClass( this_upl.istance_options.label_class  );
  // //         }

  // //         // aggiunta del testo info per il drag & drop
  // //         this_upl.istance_options.container.find('.fileupl__dd_text').html( this_upl.istance_options.is_multiple ? this_upl.istance_options.dd_text_multiple : this_upl.istance_options.dd_text_single );

  // //         // aggiunta testo info file
  // //         this_upl.istance_options.container.find('.fileupl__info_text')
  // //         .html(
  // //           (this_upl.istance_options.show_info_text ? upl.create_info_text(this_upl.istance_options) : '') +
  // //           ((this_upl.istance_options.show_info_text && this_upl.istance_options.custom_info_text)? '<br>' : '') +
  // //           (this_upl.istance_options.custom_info_text ? this_upl.istance_options.custom_info_text : '')
  // //         );


  // //         // !DRAG&DROP
  // //         this_upl.istance_options.container
  // //         .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
  // //           e.preventDefault();
  // //           e.stopPropagation();
  // //         })
  // //         .on( 'dragover dragenter', function() {
  // //           this_upl.istance_options.container.addClass( this_upl.istance_options.container_dragover_class );
  // //         })
  // //         .on( 'dragleave dragend drop', function() {
  // //           this_upl.istance_options.container.removeClass( this_upl.istance_options.container_dragover_class );
  // //         })
  // //         .on( 'drop', function( e ) {
  // //           var err = false;
  // //           if( !this_upl.istance_options.is_multiple && e.originalEvent.dataTransfer.files.length > 1 ) {

  // //             this_upl.istance_options.alertErrorAPI('Puoi selezionare un solo file!');
  // //             err = true;
  // //           }

  // //           if(!err) {
  // //             upl.sendFiles( e.originalEvent.dataTransfer.files, this_upl.istance_options ); // filelist
  // //           }
  // //         });

  // // //TODO fumoso, da riscrivere
  // // //TODO correggere selector, possibilità non abbia id
  // //         // !selezione tramite input
  // //         var input_selector = '#' + _input.attr('id');
  // //         $(document).on('change', input_selector, function () {
  // //           upl.sendFiles( document.querySelector(input_selector).files, this_upl.istance_options ); // filelist
  // //         });


  //       } catch(e) { //throw "error"
  //         console.error( e );// eslint-disable-line
  //       } // finally {}

  //     }); // end document.querySelectorAll(upl.global_options.selector).forEach

  //   }; // end init

  //   return upl;

  // })(FileUploader2 || {});
