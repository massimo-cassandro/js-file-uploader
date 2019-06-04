/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  // VARIABILI E METODI PRIVATI

  // nome dell'attributo data da usare come selettore degli elementi su cui applicare FileUploader.
  const fupl_selector_data_name = 'file_uploader2',

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
  parse_max_filesize = (filesize_value) =>  {
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
        'feedback_size': feedback_size.toLocaleString(upl.options.locales) + '&nbsp;' + unit
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

      let file_uploader_data = upl_element.dataset[fupl_selector_data_name];

      if(file_uploader_data === '') {
        file_uploader_data = {};
      } else {
        file_uploader_data = JSON.parse(file_uploader_data);
      }

      file_uploader_data = upl.setOptions(
        {},
        global_options,
        upl_element.dataset,
        file_uploader_data
      );

      // cancella la chiave `fupl_selector_data_name` al solo scopo di ridurre la confusione
      delete file_uploader_data[fupl_selector_data_name];

      // aggiunta dell'elemento stesso ad  `istance_options`:
      file_uploader_data.element = upl_element;

      // controllo parametri e avvio uploader
      try {

        //  url
        if( !file_uploader_data.uploader_url ) {
          throw new Error( "Parametro `url` non impostato" );
        }

        //  parametro filetype
        file_uploader_data.filetype = file_uploader_data.filetype.toLowerCase();
        if( Object.keys(file_uploader_data.mimetypes).indexOf(file_uploader_data.filetype) === -1 ) {

          throw new Error( "Parametro `filetype` non corretto" );
        } else {
          // implementazione eventuali parametro/attributo `accept`
          if( file_uploader_data.filetype === 'auto' ) {

            let _input = upl_element.querySelector('input[type="file"]'),
            accept_attr = [];
            if(_input && _input.getAttribute('accept') )
              accept_attr.accept = _input.getAttribute('accept')
                .split(',').map( item => item.trim() );
            }
            file_uploader_data.accept =

          } else {
            file_uploader_data.accept = upl.mimetypes[file_uploader_data.filetype];
          }

        }







  //         var max_filesize = parse_max_filesize(file_uploader_data);
  //         if( max_filesize === false ) {
  //           throw new Error( '"' + file_uploader_data.max_filesize + '" non è un valore corretto per `max_filesize`');
  //         } else {
  //           file_uploader_data.max_filesize = max_filesize;
  //         }



      } catch(e) {
        console.error( e );// eslint-disable-line
      }

      new upl.uploader(upl_element);

     }); // end document.querySelectorAll(fupl_selector).forEach
  }; // end upl.init

  return upl;

})(FileUploader2 || {});

