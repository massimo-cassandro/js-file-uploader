/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  // VARIABILI E METODI PRIVATI

  // mimetypes ed estensioni accettabili in base al parametro `filetype`.
  // Il parametro `auto` accetta tutti i tipi di file (salvo eventuali limitazioni
  // aggiunte tramite parametro e attributo `accept`)
  const mimetypes = {
    auto : null,
    img  : ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
            '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],
    pdf  : ['application/pdf', '.pdf']
  },

  // nome dell'attributo data da usare come selettore degli elementi su cui applicare FileUploader.
  fupl_selector_data_name = 'file_uploader2',

  /*
    isSuitableBrowser
    Verifica che il browser sia in grado di gestire le funzionalità richieste.
    Restituisce `true` o `false`
  */
  isSuitableBrowser = () => {
    var div = document.createElement( 'div' );
    return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) )
      && 'FormData' in window
      && 'FileReader' in window;
  },

  /*
   parse_max_filesize
   elabora il parametro `filesize_value` (se esiste) e restituisce:
    - `null` se `filesize_value` === null`
    - `false` se `filesize_value` non è un valore corretto
    - l'oggetto `{ maxbytes: 123456, unit: 'KB', feedback_size: ''}`
    in cui:
      - `maxbytes` è il valore in bytes del limite imposto
      - `unit` è uno tra 'KB' e 'MB'
      - `feedback_size` è la rappresentazione per un eventuale feedback per l'utente
  */
  parse_max_filesize = (filesize_value, locales) =>  {
    // controllo max_filesize ed elaborazione parametro
    if( filesize_value ) {
      var maxbytes, unit, feedback_size;

      if(!isNaN(filesize_value)) { //solo numero, si assume siano KB
        maxbytes = +filesize_value;
        unit = 'KB';
        feedback_size = filesize_value;

      } else {

        unit = filesize_value.substr(-2, 2).toUpperCase();
        maxbytes = +filesize_value.substr(0, filesize_value.length-2);
        feedback_size = maxbytes;

        if(isNaN(maxbytes) || (unit !== 'KB' && unit !== 'MB') ) {
          return false;
        }
      }

      // se l'unità è indicata in KB ma il valore è più grande
      // di un MB, il parametro viene aggiornato
      if( maxbytes >= 1024 && unit === 'KB') {
        unit = 'MB';
        feedback_size = (Math.round((maxbytes / 1024) * 100) /100);
      }

      if(unit === 'KB') {
        maxbytes = maxbytes * 1024;
      } else {
        maxbytes = maxbytes * 1024 * 1024;
      }

      return {
        //'original_value': filesize_value,
        //'unit'         : unit,
        'maxbytes'     : maxbytes,
        'feedback_size': feedback_size.toLocaleString(locales) + '&nbsp;' + unit
      };

    } else {
      return null;
    }
  };

  /*
    init
    Seleziona gli elementi con l'attributo `fupl_selector` e avvia FileUploader
  */
  upl.init = (user_global_options) => {

    const global_options = upl.setOptions(user_global_options);

    // verifica che il browser sia compatibile
    if( !isSuitableBrowser() ) {
      alert(global_options.unsuitableBrowserMessage);
      return;
    }

    // caricamento CSS
    if(global_options.css) {
      document.head.insertAdjacentHTML('beforeend',
        '<link rel="stylesheet" href="' + global_options.css + '" type="text/css" media="all">'
      );
    }

    // istanze uploader
    document.querySelectorAll('[data-' + fupl_selector_data_name + ']').forEach( upl_element => {

      /*
        merge dei parametri inseriti tramite attributi `data`, in cui:

        * `upl_element.dataset`:
            tutti gli attributi inseriti singolarmente (es. data-filetype="img")

        * `upl_element.dataset[fupl_selector_data_name]`:
            attributi inseriti tramite json assegnato a `data- + 'fupl_selector_data_name'`
            (es data-file_uploader2='{"filetype":"img"}')

        In caso di conflitto prevalgono gli ultimi
      */

      let upl_element_options = upl_element.dataset[fupl_selector_data_name];

      if(upl_element_options === '') {
        upl_element_options = {};
      } else {
        upl_element_options = JSON.parse(upl_element_options);
      }

      upl_element_options = upl.setOptions(
        {},
        global_options,
        upl_element.dataset,
        upl_element_options
      );

      // cancella la chiave `fupl_selector_data_name` al solo scopo di ridurre la confusione
      delete upl_element_options[fupl_selector_data_name];

      // aggiunta dell'elemento stesso ad  `istance_options`:
      upl_element_options.element = upl_element;

      // controllo parametri e avvio uploader
      try {

        // eventuale campo input
        let _input = upl_element.querySelector('input[type="file"]');

        //  url
        if( !upl_element_options.url ) {
          throw new Error( "Parametro `url` non impostato" );
        }

        //  parametro filetype
        upl_element_options.filetype = upl_element_options.filetype.toLowerCase();
        if( Object.keys(mimetypes).indexOf(upl_element_options.filetype) === -1 ) {

          throw new Error( "Parametro `filetype` non corretto" );
        } else {
          // implementazione eventuali parametro/attributo `accept`
          if( upl_element_options.filetype === 'auto' ) {

            let accept_attr = [],
            accept_params = [];

            if( upl_element_options.accept !== null ) {
              accept_params = upl_element_options.accept
                .split(',').map( item => item.trim() );
            }

            if(_input && _input.getAttribute('accept') ) {
              accept_attr = _input.getAttribute('accept')
                .split(',').map( item => item.trim() );
            }

            // https://www.peterbe.com/plog/merge-two-arrays-without-duplicates-in-javascript
            upl_element_options.accept = [...new Set([...accept_params, ...accept_attr])];

          } else {
            upl_element_options.accept = mimetypes[upl_element_options.filetype];
          }

          // elaborazione max_filesize
          let max_filesize = parse_max_filesize(upl_element_options.max_filesize, upl_element_options.locales);
          if( max_filesize === false ) {
            throw new Error( '"' + upl_element_options.max_filesize + '" non è un valore corretto per `max_filesize`');
          } else {
            upl_element_options.max_filesize = max_filesize;
          }

          // parametro o attributo multiple
          upl_element_options.multiple = Boolean(upl_element_options.multiple ||
            (_input && _input.hasAttribute('multiple') ));

          // parametro o attributo required
          upl_element_options.required = Boolean(upl_element_options.required ||
            (_input && _input.hasAttribute('required') ));
        }

      } catch(e) {
        console.error( e );// eslint-disable-line
      }

      new upl.createUploader(upl_element_options);

     }); // end document.querySelectorAll(fupl_selector).forEach
  }; // end upl.init

  return upl;

})(FileUploader2 || {});

