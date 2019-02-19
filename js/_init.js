/* globals FileUploader:true */

FileUploader = ((upl) => {
  "use strict";

  /**
	 * isSuitableBrowser
	 * Verifica che il browser sia in grado di gestire le funzionalità richieste.
	 *
   * - Restituisce `true` o `false`
	 */
	const isSuitableBrowser = () => {
		var div = document.createElement( 'div' );
		return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) )
      && 'FormData' in window
      && 'FileReader' in window;
	},

  /**
	 * parse_max_filesize
	 * elabora il parametro max_filesize (se esiste) e restituisce:
	 *   - `null` se `max_filesize === null`
	 *   - `false` se `max_filesize` non è un valore corretto
	 *   - l'oggetto `{ maxbytes: 123456, unit: 'KB', feedback_size: ''}`
	 *   in cui:
	 *     - `maxbytes` è il valore in bytes del limite imposto
	 *     - `unit` è uno tra 'KB' e 'MB'
	 *.    - `feedback_size` è la rappresentazione per un eventuale feedback per l'utente
	 */
  parse_max_filesize = (upl_options) =>  {
    // controllo max_filesize ed elaborazione parametro
    if( upl_options.max_filesize ) {
      var maxbytes, unit, feedback_size;

      if(!isNaN(upl_options.max_filesize)) { //KB
        maxbytes = +upl_options.max_filesize;
        unit = 'KB';
        feedback_size = upl_options.max_filesize;

        // se l'unità è indicata in KB ma il valore è più grande
        // di un MB, il parametro viene aggiornato
        if( maxbytes >= 1024 ) {
          unit = 'MB';
          feedback_size = (Math.round((maxbytes / 1024) * 100) /100);
        }

      } else {

        unit = upl_options.max_filesize.substr(-2, 2).toUpperCase();
        maxbytes = +upl_options.max_filesize.substr(0, upl_options.max_filesize.length-2);
        feedback_size = maxbytes;

        if(isNaN(maxbytes) || (unit !== 'KB' && unit !== 'MB') ) {
          return false;
        }
      }

      if(unit === 'KB') {
        maxbytes = maxbytes * 1024;
      } else {
        maxbytes = maxbytes * 1024 * 1024;
      }

      return {
        'originalValue': upl_options.max_filesize,
        'maxbytes'     : maxbytes,
        'unit'         : unit,
        'feedback_size': String(feedback_size).replace(/\./, ',') + ' ' + unit
      };

    } else {
      return null;
    }
  };


  //!init
  /**
	 * init
	 * Seleziona gli elementi con l'attributo upl.global_options.selector e avvia FileUploader
	 */
	upl.init = (user_global_options, user_istance_options) => {

    if( !isSuitableBrowser() ) {
      console.error( "Questo browser non ha tutte le funzionalità richieste da FileUploader" );// eslint-disable-line
      return;
    }

    // impostazioen parametri globali
    if( typeof Object.assign === "function") {
      upl.global_options = Object.assign({}, upl.global_options, user_global_options);
    } else { // IE
      for(let i in upl.global_options) {
        if( user_global_options[i] ) {
          upl.global_options[i] = user_global_options[i];
        }
      }
    }

    // caricamento CSS
    if(upl.global_options.fileUploader_css) {
      document.head.insertAdjacentHTML('beforeend',
        '<link rel="stylesheet" href="' + upl.global_options.fileUploader_css + '" type="text/css" media="all">'
      );
    }

    document.querySelectorAll(upl.global_options.selector).forEach( (upl_el) => {

      // upl_el → elemento corrente su cui è istanziato FileUploader

      let this_upl = new upl.uploader();

      /*
        merge dei parametri inseriti tramite attributi `data`, in cui:

        * `upl_el.dataset`:
            tutti gli attributi inseriti singolarmente (es. data-filetype="img")

        * `upl_el.dataset.file_uploader`:
            attributi inseriti tramite json assegnato a `data-fileuploader
            (es data-fileuploader='{"filetype":"img"}')

        In caso di conflitto prevalgono gli ultimi
      */

      let file_uploader_data = upl_el.dataset.file_uploader;
      if(file_uploader_data === '') {
        file_uploader_data = {};
      }

      if( typeof Object.assign === "function") {

        this_upl.istance_options = Object.assign({},
          upl.default_istance_options,
          user_istance_options,
          upl_el.dataset,
          file_uploader_data
        );

      } else { // IE

        for(let i in upl.default_istance_options) {
          if( upl_el.dataset.file_uploader[i] ) {
            this_upl.istance_options[i] = upl_el.dataset.file_uploader[i];
          } else if( upl_el.dataset[i] ) {
            this_upl.istance_options[i] = upl_el.dataset[i];
          } else if( user_istance_options[i] ) {
            this_upl.istance_options[i] = user_istance_options[i];
          } else {
            this_upl.istance_options[i] = upl.default_istance_options[i];
          }
        }
      }

      // cancella la chiave `file_uploader` al solo scopo di ridurre la confusione
      delete this_upl.istance_options.file_uploader;

      // aggiunta dell'elemento stesso ad  `istance_options`:
      this_upl.istance_options.element = upl_el;

      // ottimizzazione dei parametri
      this_upl.istance_options.filetype = this_upl.istance_options.filetype.toLowerCase();

      //debug
      if( upl.global_options.debug ) {
        /* eslint-disable */
        console.groupCollapsed('FileUploader global & istance options');
        console.table(upl.global_options);
        if( window.navigator.userAgent.toLowerCase().indexOf('chrome') === -1 ) {
          console.table(Object.assign({}, this_upl.istance_options));
        }
        console.log(this_upl.istance_options);
        console.groupEnd();
        /* eslint-enable */
      }

      try {
        // !controllo parametri obbligatori
        if( !this_upl.istance_options.uploader_url ) {
          throw new Error( "`uploader_url` non impostato" );
        }
        if( !this_upl.istance_options.upload_start_callback ) {
          throw new Error( "`upload_start_callback` non impostato" );
        }
        if( !this_upl.istance_options.upload_complete_callback ) {
          throw new Error( "`upload_complete_callback` non impostato" );
        }
        var max_filesize = parse_max_filesize(this_upl.istance_options);
        if( max_filesize === false ) {
          throw new Error( '"' + this_upl.istance_options.max_filesize + '" non è un valore corretto per `max_filesize`');
        } else {
          this_upl.istance_options.max_filesize = max_filesize;
        }

        //         //!SETUP
//         // aggiunta riferimento container ad upl.istance_options
//         this_upl.istance_options.container = upl_el;

//         // aggiunta della classe per l'attivazione delle regole css
//         this_upl.istance_options.container.addClass('fileupl');
//         // aggiunta classe personale
//         if( this_upl.istance_options.container_class ) {
//           this_upl.istance_options.container.addClass( this_upl.istance_options.container_class );
//         }

//         // rilevamento impostazioni ed elementi (prima di init_callback)
//         var _label = this_upl.istance_options.container.find('label'),
//           _input = this_upl.istance_options.container.find('input:file');

//         this_upl.istance_options.is_multiple = _input.prop('multiple');

//         // esecuzione init_callback, se presente
//         if( this_upl.istance_options.init_callback !== null ) {
//           this_upl.istance_options.init_callback( this_upl.istance_options );
//         }

//         // aggiunta template
//         var original_html = this_upl.istance_options.container.html();
//         this_upl.istance_options.container.html( this_upl.istance_options.template );

//         this_upl.istance_options.container.find('.fileupl__button').html( original_html ); //ripristino markup originale



//         // rilevamento attributo name e sua eliminazione ad evitare che sia inviato con il form
//         this_upl.istance_options.input_name = _input.attr('name') || 'uploader_file[]';
//         _input.removeAttr('name');

//         // impostazione parametri accept
//         if( this_upl.istance_options.filetype === 'auto' ) {
//           this_upl.istance_options.accept = []; // raccolta di upl.mimetypes ed estensioni per controllo sul drag&drop
//           if( _input.attr('accept')) {
//             this_upl.istance_options.accept = _input.attr('accept').split(',').map(function (item) { return item.trim(); });
//           }

//         } else if( Object.keys(upl.mimetypes).indexOf( this_upl.istance_options.filetype ) !== -1) { // solo i tipi mappati

//           this_upl.istance_options.accept = upl.mimetypes[this_upl.istance_options.filetype].slice(0); // slice → clona
//           _input.attr( 'accept', this_upl.istance_options.accept.join(',') );

//         } else { // filetype non corretto
//           throw new Error( "`filetype` non corretto" );
//         }

//         // se esiste this_upl.istance_options.label_text, il testo del tag label viene sostituito
//         if( this_upl.istance_options.label_text ) {
//           _label.text( this_upl.istance_options.label_text );
//         }

//         // se esiste this_upl.istance_options.label_class, la classe viene aggiunta
//         if( this_upl.istance_options.label_class ) {
//           _label.addClass( this_upl.istance_options.label_class  );
//         }

//         // aggiunta del testo info per il drag & drop
//         this_upl.istance_options.container.find('.fileupl__dd_text').html( this_upl.istance_options.is_multiple ? this_upl.istance_options.dd_text_multiple : this_upl.istance_options.dd_text_single );

//         // aggiunta testo info file
//         this_upl.istance_options.container.find('.fileupl__info_text')
//         .html(
//           (this_upl.istance_options.show_info_text ? upl.create_info_text(this_upl.istance_options) : '') +
//           ((this_upl.istance_options.show_info_text && this_upl.istance_options.custom_info_text)? '<br>' : '') +
//           (this_upl.istance_options.custom_info_text ? this_upl.istance_options.custom_info_text : '')
//         );


//         // !DRAG&DROP
//         this_upl.istance_options.container
//         .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
//           e.preventDefault();
//           e.stopPropagation();
//         })
//         .on( 'dragover dragenter', function() {
//           this_upl.istance_options.container.addClass( this_upl.istance_options.container_dragover_class );
//         })
//         .on( 'dragleave dragend drop', function() {
//           this_upl.istance_options.container.removeClass( this_upl.istance_options.container_dragover_class );
//         })
//         .on( 'drop', function( e ) {
//           var err = false;
//           if( !this_upl.istance_options.is_multiple && e.originalEvent.dataTransfer.files.length > 1 ) {

//             this_upl.istance_options.alertErrorAPI('Puoi selezionare un solo file!');
//             err = true;
//           }

//           if(!err) {
//             upl.sendFiles( e.originalEvent.dataTransfer.files, this_upl.istance_options ); // filelist
//           }
//         });

// //TODO fumoso, da riscrivere
// //TODO correggere selector, possibilità non abbia id
//         // !selezione tramite input
//         var input_selector = '#' + _input.attr('id');
//         $(document).on('change', input_selector, function () {
//           upl.sendFiles( document.querySelector(input_selector).files, this_upl.istance_options ); // filelist
//         });


      } catch(e) { //throw "error"
        console.error( e );// eslint-disable-line
      } // finally {}

    }); // end document.querySelectorAll(upl.global_options.selector).forEach

	}; // end init

  return upl;

})(FileUploader || {});
