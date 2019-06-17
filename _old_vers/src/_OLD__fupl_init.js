/* globals FileUploader:true */

FileUploader = (function (_upl) {
  "use strict";


  /**
	 * ### isSuitableBrowser
	 * (funzione privata) Verifica che il browser sia in grado di gestire le funzionalità richieste.
	 *
   * - Restituisce `true` o `false`
	 */
	var isSuitableBrowser = function() {
		var div = document.createElement( 'div' );
		return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) )
		  && 'FormData' in window && 'FileReader' in window;
	},

  /**
	 * ### parse\_max\_filesize
	 * (funzione privata) elabora il parametro max_filesize (se esiste) e
	 * restituisce:
	 *   - `null` se `max_filesize === null`
	 *   - `false` se `max_filesize` non è un valore corretto
	 *   - l'oggetto `{ maxbytes: 123456, unit: 'KB', feedback_size: ''}`
	 *   in cui:
	 *   .  - `maxbytes` è il valore in bytes del limite imposto
	 *   .  - `unit` è uno tra 'KB' e 'MB'
	 *.  .  - `feedback_size` è la rappresentazione per un eventuale feedback per l'utente
	 */
  parse_max_filesize = function (upl_options) {
    // controllo max_filesize ed elaborazione parametro
    if( upl_options.max_filesize ) {
      var maxbytes, unit, feedback_size;

      if(!isNaN(upl_options.max_filesize)) { //KB
        maxbytes = upl_options.max_filesize;
        unit = 'KB';
        feedback_size = upl_options.max_filesize + unit;

      } else {

        unit = upl_options.max_filesize.substr(-2, 2).toUpperCase();
        maxbytes = +upl_options.max_filesize.substr(0, upl_options.max_filesize.length-2);
        feedback_size = upl_options.max_filesize;

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
        'maxbytes'     : maxbytes,
        'unit'         : unit,
        'feedback_size': feedback_size
      };

    } else {
      return null;
    }
  };


  //!init
  /**
	 * ### init
	 * (funzione) Seleziona gli elementi con l'attributo _upl.global_options.selector e avvia FileUploader
	 */
	_upl.init = function () {

    if( !isSuitableBrowser() ) {
      console.error( "Questo browser non ha tutte le funzionalità richieste da FileUploader" );// eslint-disable-line
      return;
    }

//TODO eliminare indice foreach ?
    $( _upl.global_options.selector ).each( function(idx) {

      var uploader_container = $(this);


      _upl[idx] = {};
      /*
        merge dei parametri inseriti tramite attributi `data`, in cui:

        * `uploader_container.data()`:
            tutti gli attributi inseriti singolarmente (es. data-filetype="img")

        * `uploader_container.data('file_uploader')`:
            attributi inseriti tramite json assegnato a `data-file_uploader
            (es data-file_uploader='{"filetype":"img"}')

        In caso di conflitto prevalgono gli ultimi
      */
      var element_data = Object.assign({}, uploader_container.data(), uploader_container.data('file_uploader'));
      delete element_data.file_uploader; // cancella la chiave `file_uploader` al solo scopo di ridurre la confusione

      _upl[idx].uploader_options = Object.assign({}, _upl.global_options, element_data);

      /**
    	 #### Parametri definiti dall'applicazione
    	 Al momento dell'inizializzazione di FileUploader vengono definiti e
    	 aggiunti ad `uploader_options`:

    	 - `element`: oggetto jQuery dell'elemento DOM a cui è associato FileUploader
    	 - `element_data`: attributi data assegnati ad `element`. Può contenere
    	   anche valori non utilizzati da FileUploader, utili per personalizzare
    	   l'applicazione


    	 */
      _upl[idx].uploader_options.element_data = element_data;
      _upl[idx].uploader_options.element = uploader_container;

      // ottimizzazione dei parametri
      _upl[idx].uploader_options.filetype = _upl[idx].uploader_options.filetype.toLowerCase();

      //debug
      if( _upl[idx].uploader_options.debug ) {
        /* eslint-disable */
        console.groupCollapsed('FileUploader debug: `uploader_options`');
        console.log(_upl[idx].uploader_options);
        console.groupEnd();
        /* eslint-enable */
      }

      try {

        // !controllo parametri obbligatori
        if( !_upl[idx].uploader_options.uploader_url ) {
          throw new Error( "`uploader_url` non impostato" );
        }
        if( !_upl[idx].uploader_options.upload_start_callback ) {
          throw new Error( "`upload_start_callback` non impostato" );
        }
        if( !_upl[idx].uploader_options.upload_complete_callback ) {
          throw new Error( "`upload_complete_callback` non impostato" );
        }
        var max_filesize = parse_max_filesize(_upl[idx].uploader_options);
        if( max_filesize === false ) {
          throw new Error( '"' + _upl[idx].uploader_options.max_filesize + '" non è un valore corretto per `max_filesize`');
        } else {
          _upl[idx].uploader_options.max_filesize = max_filesize;
        }

        //!SETUP
        // aggiunta riferimento container ad _upl.uploader_options
        _upl[idx].uploader_options.container = uploader_container;

        // aggiunta della classe per l'attivazione delle regole css
        _upl[idx].uploader_options.container.addClass('file_upl');
        // aggiunta classe personale
        if( _upl[idx].uploader_options.container_class ) {
          _upl[idx].uploader_options.container.addClass( _upl[idx].uploader_options.container_class );
        }

        // rilevamento impostazioni ed elementi (prima di init_callback)
        var _label = _upl[idx].uploader_options.container.find('label'),
          _input = _upl[idx].uploader_options.container.find('input:file');

        _upl[idx].uploader_options.is_multiple = _input.prop('multiple');

        // esecuzione init_callback, se presente
        if( _upl[idx].uploader_options.init_callback !== null ) {
          _upl[idx].uploader_options.init_callback( _upl[idx].uploader_options );
        }

        // aggiunta template
        var original_html = _upl[idx].uploader_options.container.html();
        _upl[idx].uploader_options.container.html( _upl[idx].uploader_options.template );

        _upl[idx].uploader_options.container.find('.file_upl__button').html( original_html ); //ripristino markup originale



        // rilevamento attributo name e sua eliminazione ad evitare che sia inviato con il form
        _upl[idx].uploader_options.input_name = _input.attr('name') || 'uploader_file[]';
        _input.removeAttr('name');

        // impostazione parametri accept
        if( _upl[idx].uploader_options.filetype === 'auto' ) {
          _upl[idx].uploader_options.accept = []; // raccolta di _upl.mimetypes ed estensioni per controllo sul drag&drop
          if( _input.attr('accept')) {
            _upl[idx].uploader_options.accept = _input.attr('accept').split(',').map(function (item) { return item.trim(); });
          }

        } else if( Object.keys(_upl.mimetypes).indexOf( _upl[idx].uploader_options.filetype ) !== -1) { // solo i tipi mappati

          _upl[idx].uploader_options.accept = _upl.mimetypes[_upl[idx].uploader_options.filetype].slice(0); // slice → clona
          _input.attr( 'accept', _upl[idx].uploader_options.accept.join(',') );

        } else { // filetype non corretto
          throw new Error( "`filetype` non corretto" );
        }

        // se esiste _upl[idx].uploader_options.label_text, il testo del tag label viene sostituito
        if( _upl[idx].uploader_options.label_text ) {
          _label.text( _upl[idx].uploader_options.label_text );
        }

        // se esiste _upl[idx].uploader_options.label_class, la classe viene aggiunta
        if( _upl[idx].uploader_options.label_class ) {
          _label.addClass( _upl[idx].uploader_options.label_class  );
        }

        // aggiunta del testo info per il drag & drop
        _upl[idx].uploader_options.container.find('.file_upl__dd_text').html( _upl[idx].uploader_options.is_multiple ? _upl[idx].uploader_options.dd_text_multiple : _upl[idx].uploader_options.dd_text_single );

        // aggiunta testo info file
        _upl[idx].uploader_options.container.find('.file_upl__info_text')
        .html(
          (_upl[idx].uploader_options.show_info_text ? _upl.create_info_text(_upl[idx].uploader_options) : '') +
          ((_upl[idx].uploader_options.show_info_text && _upl[idx].uploader_options.custom_info_text)? '<br>' : '') +
          (_upl[idx].uploader_options.custom_info_text ? _upl[idx].uploader_options.custom_info_text : '')
        );


        // !DRAG&DROP
        _upl[idx].uploader_options.container
        .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
          e.preventDefault();
          e.stopPropagation();
        })
        .on( 'dragover dragenter', function() {
          _upl[idx].uploader_options.container.addClass( _upl[idx].uploader_options.container_dragover_class );
        })
        .on( 'dragleave dragend drop', function() {
          _upl[idx].uploader_options.container.removeClass( _upl[idx].uploader_options.container_dragover_class );
        })
        .on( 'drop', function( e ) {
          var err = false;
          if( !_upl[idx].uploader_options.is_multiple && e.originalEvent.dataTransfer.files.length > 1 ) {

            _upl[idx].uploader_options.alertErrorAPI('Puoi selezionare un solo file!');
            err = true;
          }

          if(!err) {
            _upl.sendFiles( e.originalEvent.dataTransfer.files, _upl[idx].uploader_options ); // filelist
          }
        });

//TODO fumoso, da riscrivere
//TODO correggere selector, possibilità non abbia id
        // !selezione tramite input
        var input_selector = '#' + _input.attr('id');
        $(document).on('change', input_selector, function () {
          _upl.sendFiles( document.querySelector(input_selector).files, _upl[idx].uploader_options ); // filelist
        });


      } catch(e) { //throw "error"
          console.error( e );// eslint-disable-line
      } // finally {}

    }); // end $( _upl.global_options.selector ).each

	}; // end init

  return _upl;

})(FileUploader || {});
