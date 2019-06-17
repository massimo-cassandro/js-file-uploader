/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  // VARIABILI E METODI PRIVATI
  /*
    isSuitableBrowser
    Verifica che il browser sia in grado di gestire le funzionalità richieste.
    Restituisce `true` o `false`
  */
  const isSuitableBrowser = () => {
    var div = document.createElement( 'div' );
    return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) )
      && 'FormData' in window
      && 'FileReader' in window
      && 'fetch' in window;
  };


  /*
    init
    Seleziona gli elementi con l'attributo `fupl_selector` e avvia FileUploader
    `user_global_options` è l'oggetto istanziato al momento di avviare FileUploader2,
    ha la stessa struttura di `default_options` (definito in _set_options.js)
    e può sovrascrivere ogni suo elemento
  */
  upl.init = (user_global_options) => {

    if(!upl.browser_is_not_compatible) {
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
      //---------------------------------------------------
      document.querySelectorAll('[data-' + upl.data_attributes.fupl_selector + ']').forEach( upl_element => {
        /*
          merge dei parametri inseriti tramite attributi `data`, in cui:

          * `upl_element.dataset`:
              tutti gli attributi inseriti singolarmente (es. data-filetype="img")

          * `upl_element.dataset[upl.data_attributes.fupl_selector]`:
              attributi inseriti tramite json assegnato a `data- + 'upl.data_attributes.fupl_selector'`
              (es data-file_uploader2='{"filetype":"img"}')

          In caso di conflitto prevalgono gli ultimi
        */

        let element_all_dataset = upl_element.dataset,
        fupl_dataset = upl_element.dataset[upl.data_attributes.fupl_selector],
        fupl_options = {};

        if(element_all_dataset === '') {
          element_all_dataset = {};
        }

        if(fupl_dataset === '') {
          fupl_dataset = {};
        } else {
          fupl_dataset = JSON.parse(fupl_dataset);
        }

        fupl_options = upl.setOptions(
          global_options,
          fupl_dataset,
          element_all_dataset
        );

        // cancella la chiave `upl.data_attributes.fupl_selector`
        // (al solo scopo di ridurre la confusione)
        delete fupl_options[upl.data_attributes.fupl_selector];

        // aggiunta dell'elemento stesso ad  `fupl_options`:
        fupl_options.element = upl_element;

        // controllo parametri e avvio uploader
        try {
          //  controllo url
          if( !fupl_options.uploader_url ) {
            throw new Error( "Parametro `uploader_url` non impostato" );
          }

          //  controllo parametro filetype
          fupl_options.filetype = fupl_options.filetype.toLowerCase();
          if( Object.keys(upl.mimetypes).indexOf(fupl_options.filetype) === -1 ) {
            throw new Error( "Parametro `filetype` non corretto" );
          }
        } catch(e) {
          console.error( e );// eslint-disable-line
        }

        // parametri che devono essere array e che potrebbero essere presenti
        // come attributi data (stringa)
        const json_params = [
          'input_text',
          'templates',
          'info_text_wrap_string',
          'values'
        ];
        json_params.forEach(item => {
          try {
            if(typeof fupl_options[item] === 'string' ) {
              fupl_options[item] = JSON.parse(fupl_options[item]);
            }
          } catch(e) {
            console.error(`L'elemento “${item}” non è un json valido`); // eslint-disable-line
            console.log(fupl_options.element); // eslint-disable-line
            console.error( e );// eslint-disable-line
          }
        });

        // interpretazione automatica di tutti i parametri booleani o null
        for(let i in fupl_options) {
          if(typeof fupl_options[i] === 'string' &&
            ['true', 'false', 'null'].indexOf(fupl_options[i].toLowerCase) !== -1) {
            fupl_options[i] = JSON.parse(fupl_options[i]);
          }
        }


        new upl.createUploader(fupl_options);

      }); // end document.querySelectorAll(fupl_selector).forEach
    } // end !upl.browser_is_not_compatible
  }; // end upl.init

  return upl;

})(FileUploader2 || {});

