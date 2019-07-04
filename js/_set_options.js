/* globals FileUploader2:true */

FileUploader2 = ( (upl) => {

  // parametri di default condivisi da tutte le istanze
  const default_options = {

    /*
    silent_degradation
    se true e il browser non ha le funzionalità richieste, fileuploader
    non dà nessun messaggio di errore ed è possibile gestire l'upload dei file con
    un classico input file. È però necessario che sia presente nel markup
    (all'interno dell'elemento a cui si istanzia l'uploader) e che la cosa sia
    gestita anche lato server
    */
    silent_degradation: false,

    // callback da richiamere se viene rilevato un browser non adatto
    unsuitable_browser_callback: null,

    // percorso del css FileUploader
    css: null,

    // Attiva la modalità debug che mostra in console le informazioni
    // sulla configurazione corrente
    debug: false,

    // locales string, usata per la formattazione della stringa numerica
    // mostrata all'utente ricavata da `max_filesize`
    locales: 'it-IT',

    /*
    Se true impedisce il caricamento di elementi
    NB: in questa versione di FileUploader non eiste una vera gestione dello stato disabled,
    la modifica di questa parametro influisce solo inizialmente sull'evento drag&drop
    e sull'impostazione dello stato disabled del fieldset che racchiude l'uploader (.fupl-wrapper).
    Eventuali modifiche "in corsa" dello stato disabled vanno gestite dalle singole applicazioni
    agendo sull'attributo disabled dell'elemento fieldset.fupl-wrapper

    Il parametro disabled può essere impostato anche tramite attributo dell'elemento
    input[type=file] di fallback, se presente

    La presenza dell'attributo disabled nell'elemento .fupl-wrapper disabilita l'elemento
    input[type=file] generato da FileUploader (comportamento std di HTML 5) e impedisce il drag&drop
    */
    disabled: false,

    // Interfaccia per l'invio di messaggi di errore
    // mes  →  chiave dell'oggetto `alert_messages` con il testo del messaggio di errore
    // type →  uno tra info, error, warning
    // opts →  l'oggetto file uploader options corrente
    alert_api: (mes, opts, type = error) => { window.alert(opts.alert_messages.mes);}, // eslint-disable-line

    // testo dei messaggi errore
    // eventuali segnaposti sono sotituiti nell'applicazione
    alert_messages: {
      // messaggio browser non compatibile
      unsuitable_browser: 'Il tuo browser non ha tutte le funzionalità richieste ' +
      'da questa applicazione.\n' +
      'Utilizza la versione più recente di Firefox, Edge, Safari, Opera o Chrome',

      too_much_files: 'Puoi selezionare un solo file!', // tentativo di trascinare più file con uploader singolo
      xhr_error: 'Si &egrave; verificato un errore nel caricamento del file &ldquo;<strong>{{file_name}}</strong>&rdquo;.', // errore ajax
      file_format_error: 'Il file &ldquo;<strong>{{file_name}}</strong>&rdquo; &egrave; di un formato non consentito',
      file_size_error: 'Le dimensioni di &ldquo;<strong>{{file_name}}</strong>&rdquo; ({{file_size}}) '+
        'superano il valore massimo consentito ({{allowed_size}})',

      // immagini
      img_err_start_string: "L'immagine &ldquo;<strong>{{file_name}}</strong>&rdquo; non è corretta:",
      img_exact_width_err: "Larghezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)",
      img_min_width_err: "Larghezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",
      img_max_width_err: "Larghezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",
      img_exact_height_err: "Altezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)",
      img_min_height_err: "Altezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",
      img_max_height_err: "Altezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)"
    },

    // Url dello script lato server che esegue il caricamento del file
    // per l'istanza in esame. Ha la precedenza sull'impostazione globale
    // obbligatorio
    uploader_url: null,

    // Tipologia dei file selezionabili
    // il valore deve corrispondere ad una delle chievi dell'array `mimetypes`
    filetype: 'auto',

    /*
    Stringa di estensioni o mimetypes separati da virgola accettabili per l'uploader
    corrente in aggiunta o sostituzione di quanto impostato tramite il parametro `filetype`.

    L'eventuale attributo `accept` del campo input contenuto
    nel contenitore uploader (se presente), svolge la stessa funzione.

    In entrambi i casi, i valori sono presi in considerazione solo se `filetype == 'auto'`

    In presenza sia del parametro che dell'attributo `accept`, viene effettuato un merge,
    e l'attributo ha la precedenza sul parametro.
    Se il parametro è `null` e l'attributo `accept` non è presente,
    con `filetype == auto` vengono accettati tutti i tipi di file.
    */
    accept: null,

    /*
    Parametro multiple.
    Attiva la possibilità di acquisire più file con lo stesso uploader.
    L'attivazione di questa opzione può essere effettuata anche tramite il parametro
    del campo `input` /se presente)
    */
    multiple: false,

    /*
    Parametro required.
    Eventuale impostazione del campo come obbligatorio.
    L'attivazione di questa opzione può essere effettuata anche tramite il parametro
    del campo `input` /se presente)
    */
    required: false,

    /*
    Disabilita (se presente) il form in cui è incluso l'uploader (disabilita anche il pulsante submit)
    da usare solo se nel form non sono presenti altri interazioni che potrebbero
    entrare in collisione con questa opzione
    */
    disable_submit: false,

    /*
      Template dei markup utilizzati
      - `main`         : markup principale inserito dentro l'elemento indicato da
                         `upl.global_options.selector`. L'elemento, a cui viene inoltre
                         aggiunta la classe `flup`, viene inoltre racchiuso in un elemento
                         `div.flup-wrapper`

      - `single_img`   : template aggiuntivo per immagini singole
      - `multiple_imgs`: template aggiuntivo per immagini multiple
      - `single_doc`   : template aggiuntivo per documenti singoli
      - `multiple_docs`: template aggiuntivo per documenti multipli
      - `no_file`      : template per indicare l'assenza di file

      Consulta il readme per ulteriori dettagli.

      Il markup di default utilizza classi di Boostrap 4.

      L'eventuale contenuto dell'elemento originale viene eliminato (può contenere
      un elemento input[type=file] per eventuale procedura di fallback)

      I template possono essere alterati a piacimento, purché si mantengano le classi
      `fupl-*` utilizzate nella procedura.

      I template delle immagini, devono contenere il tag img

      doc e img multipli possono essere null, in questo caso vengono utilizzati
      gli stessi markup per singolo file
    */
    templates: {
      // wrapped in <div class="fupl-wrapper"><div class="fupl"></div></div>
      main: '<div class="fupl-result"></div>' +
        '<div class="fupl-panel">' +
          '<div class="fupl-button">' +
            '<label><input type="file"></label>' +
            '<div class="fupl-dd-text">{</div>' +
          '</div>' +
          '<div class="fupl-info-text"></div>' +
        '</div>',

      // contenuto di fupl-result quando non sono presenti files
      no_file: {
        img: '<div class="fupl-result-empty text-muted small font-italic">Nessuna immagine presente</div>',
        doc: '<div class="fupl-result-empty text-muted small font-italic">Nessun file presente</div>'
      },

      // trigger per la rimozione di un elemento da .fupl_results
      // è aggiunto all'interno dell'elemento `.fupl-remove`, presente in ognuno
      // degli elementi successivi
      // Deve essere un elemento button
      remove_btn: '<button type="button" class="close fupl-remove-trigger" aria-label="Elimina" title="Elimina questo file">' +
            '<span aria-hidden="true">&times;</span>' +
          '</button>',

      // markup aggiunto agli elementi in fase di caricamento
      loading_element: '<div class="fupl-loading"><progress class="fupl-progress" max=100 value=0></progress></div>',

      // feedback di caricamento alternativo se progress.lengthComputable == false
      // se necessario e se la funzione `alternate_loading_func` non è presente,
      // sostituisce l'elemento `.fupl-progress`
      alternate_loading_progress: '<div class="spinner-grow text-primary" role="status">' +
          '<span class="sr-only">Loading...</span></div',

      img: {
        single: '<div class="fupl-item">' +
          '<div class="fupl-remove"></div>' +
          '<img alt="Immagine caricata" class="img-fluid fupl-img">' +
          '<div class="fupl-file-info">' +
            '<div class="text-truncate fupl-file-name"></div>' +
            '<div class="fupl-file-size"></div>' +
          '</div>' +
        '</div>',

        multiple: '<div class="fupl-item">' +
            '<div class="fupl-remove"></div>' +
            '<div class="fupl-img-wrapper">' +
              '<img alt="Immagine caricata" class="img-fluid fupl-img">' +
            '</div>' +
            '<div class="fupl-file-info">' +
              '<div class="text-truncate fupl-file-name"></div>' +
              '<div class="fupl-file-size"></div>' +
            '</div>' +
          '</div>'
      },

      doc : {
        single: '<div class="fupl-item">' +
            '<div class="fupl-remove"></div>' +
            '<div class="fupl-doc text-truncate">' +
              '<a href="#" class="text-truncate fupl-file-name fupl-url"></a>' +
            '</div>' +
            '<span class="small ml-1 text-nowrap fupl-file-size"></span>' +
          '</div>',

        multiple: null // usa single_doc
      }
    },

    // Eventuale classi da aggiungere all'elemento wrapper di FileUploader
    // (stringa separata da spazi)
    wrapper_extra_class: null,

    // Classe da aggiungere all'elemento FileUploader quando un file
    // vi è trascinato sopra
    element_dragover_class: 'fupl-is-dragover',

    // Opzione per l'aggiunta di un tag legend prima dell'elemento uploader
    uploader_legend: true,

    // tetso dell'elemento legend da applicare da applicare all'elemento FileUploader.
    // Se `null` e se esiste un elemento `label` all'interno dell'uploader,
    // viene preso il testo dell'elemento
    uploader_legend_text: null,

    // Eventuale classe da aggiungere ad uploader_legend
    uploader_legend_class: null,

    /*
    Array (o stringa json) dei testi del label del tag input (il primo elemento dell'array) e del testo
    informativo per il drag&drop da inserire in `.fupl-dd-text` (il secondo elemento)
    nelle varie combinazioni (img singola e multiple, doc singole e multipli)
    segnaposti: ['{{input_label}}', '{{dd_text}}']
    */
    input_text: {
      img: {
        single:   ["Seleziona un'immagine", "\u2026oppure trascinala qui"],
        multiple: ["Seleziona una o pi&ugrave; immagini", "\u2026oppure trascinale qui"]
      },
      doc: {
        single: ["Seleziona un documento", "\u2026oppure trascinalo qui"],
        multiple: ["Seleziona uno o pi&ugrave; documenti", "\u2026oppure trascinali qui"]
      }
    },

    // classi da applicare al tag label dell'input[file] generato, utilizzato
    // come pulsante per la selezione dei file
    input_label_class: 'btn btn-outline-primary btn-sm',

    // indica se mostrare o no il testo informativo su formati accettati,
    // dimensioni immagini, ecc. Se si decide di non mostrarlo, potrebbe essere
    // necessario rimuovere dal template l'elemento `.fupl-info-text`
    show_info_text: true,

    // stringhe aggiunte all'inizio e alla fine del testo informativo generato
    // utilizzate solo se `custom_info_text` non è impostato
    info_text_wrap_string: ['(', ')'],

    // Stringa utilizzata per concatenare tra loro le varie parti del testo informativo generato
    // utilizzata solo se `custom_info_text` non è impostato
    info_text_join_string: ', ',

    // Eventuale testo informativo personalizzato. se presente,
    // sostituisce il testo generato in base ai formati, ai limiti di dimensioni, ecc.
    custom_info_text: null,

    /*
    impostazioni per le immagini.
    Applicate solo se filetype == 'img'.
    Valori numerici che corrispondono alle dimensioni in pixel richieste per l'immagine.
    I parametri img_min_* e img_max_* possono essere assegnati simultaneamente,
    ma sono ignorati se esistono i corrispondenti parametri esatti (ad esempio,
    se è presente img_w, i parametri img_min_w e img_max_w non vengono presi in considerazione).
    Il valore di default di tutti i parametri è null, che significa che non vengono applicati.

      * `img_min_w`: larghezza minima dell'immagine
      * `img_max_w`: larghezza massima dell'immagine
      * `img_w`: larghezza esatta dell'immagine
      * `img_min_h`: altezza minima dell'immagine
      * `img_max_h`: altezza massima dell'immagine
      * `img_h`: altezza esatta dell'immagine
    */
    img_min_w   : null,
    img_max_w   : null,
    img_w       : null,
    img_min_h   : null,
    img_max_h   : null,
    img_h       : null,


    /*
    Dimensione (peso) massima dell'immagine. Può essere un numero,
    e in questo caso corrisponde ad una dimensione in KB, o una stringa
    composta da un valore numerico e da un suffisso tra ‘KB’ e ‘MB’ (anche minuscoli).
    Se il valore è null o se la stringa non viene riconosciuta,
    non è applicato nessun limite.
    */
    max_filesize: null,

    // Prefisso della variabile utilizzata per inviare al server i dati
    // di ogni singolo file caricato. Il valore indicato è il nome base dell'array
    // costruito per inviare i valori al server.
    varname: 'file',

    // Funzione richiamata dopo l'inizializzazione di ogni elemento FileUploader.
    // La funzione viene invocata con l'oggetto di tutte le opzioni come argomento
    init_callback: null,

    /*
    Funzione richiamata ogni volta che un file viene inviato al server.
    La funzione viene invocata passandole un oggetto contenente:
      * `item`: oggetto con i dati dell'elemento in esame:
        - id: id univoco dell'elemento
        - file: oggetto filelist corrente
        - `width` e `height`: null o dimensioni in pixel dell'immagine
        - `tmp_file`: nel caso di nuovi elementi: nome del file temporaneo
      * `img_preview` : miniatura dell'immagine in forma di stringa Base64
        (null se si tratta di altre tipologie)
      * `fupl_options`: oggetto `options` corrente
    */
    upload_start_callback: null,

    /*
    Funzione richiamata ogni volta che un file viene caricato.
    La funzione viene invocata passandole un oggetto contenente:
      * `item`: oggetto con i dati dell'elemento in esame:
        - `id`: id univoco dell'elemento
        - `file`: oggetto filelist
        - `width` e `height`: null o dimensioni in pixel dell'immagine
        - `tmp_file`: nel caso di nuovi elementi: nome del file temporaneo
      * `server_error`: null, se l'upload è stato completato correttamente. oppure
          stringa con il messaggio di errore restituito
      * `fupl_options`: oggetto `options` corrente
    */
    upload_complete_callback: null,

    /*
      Funzione di visulizzazione alternativa del progresso di caricamento
      Se presente, viene sostituita a quella standard.
      Viene invocata con due parametri:
        - `progress_event`: evento progress del caricamento
        - `fupl_options`: oggetto `options` corrente
    */
    alternate_loading_func: null,

    /*
    Array json degli eventuali elementi preregistrati, nella forma:
      [
        {
          rel_id → eventuale id del record relazionato al file (può essere null o assente)
                   se esiste, viene utilizzato al posto di `id` per indicare il record da cancellare
          id     → identificativo univoco del file (può essere anche il percorso sul server)
          name   → nome del file
          url    → url per eventuale tag <a> presente nell'elemento (se immagine può essere assente o null)
          src    → attributo `src` obbligatorio se immagine, oppure assente o null
          wi     → larghezza in px se immagine oppure assente o null
          he     → altezza in px se immagine oppure assente o null
          size   → dimensione in bytes
          [...]  → eventuali campi aggiuntivi specifici dell'istanza
        }
        [...]
      ]

      l'id viene aggiunto come attributo `data` al pulsante di eliminazione del file
      (genera un hidden con l'id del file da eliminare dal server)
    */
    values: [],

    // varname degli hidden con gli id dei file già registrati  da eliminare
    delete_varname: 'elimina_file[]',

    // ========================================
    // OPZIONE DI RIORDINO DEGLI ELEMENTI
    // ========================================
    /*
      Attiva la possibilità di riordinare gli elementi trascinandoli.
      - La funzione aggiunge una la variabile definita in `reorder_varname` a
        quelle inviate con le altre procedure.
      - L'opzione di reorder si attiva se il parametro reorder è true e solo se
        il parametro multiple è true e tutti gli altri parametri necessari
        sono presenti
      - Se l'opzione è attiva, i valori degli eventuali elementi preregistrati
        devono essere forniti nel json `values` nell'ordine corretto
      - la funzione indicata nel parametro `reorder_init_function` viene chiamata
        alla creazione dell'uploader (il default utilizza grabbable2,
        https://github.com/massimo-cassandro/grabbable2), gli script necessari
        vanno caricati autonomanente. `reorder_function` viene invocata passando
        come argomento l'oggetto options corrente.
        Vedi `demo/reorder_demo.html` per un esempio di utilizzo
    */
    reorder: false,

    // name della variabile hidden usata per registrare l'ordinamento
    reorder_varname: 'order',

    /*
      Funzione richiamata all'avvio di uploader se l'opzione di reorder è attiva.
      La funzione viene invocata passandole come argomento
      `fupl_options`: oggetto `options` corrente
    */
    reorder_init_function: function(fupl_options) {
      fupl_options.istance_result_wrapper.grabbable();
    }

    // ========================================
    // GESTIONE CAMPI AGGIUNTIVI
    // ========================================
// TODO
  };

  upl.setOptions = (...custom_options) => {

    if( Object.assign && typeof Object.assign === "function") {
      return Object.assign(
        {},
        default_options,
        ...custom_options
      );

    } else { // IE 11, necessario anche se non c'è il supporto IE
      let opts = {};
      for(let i in default_options) {
        opts[i] = default_options[i];
        custom_options.forEach( item => {
          if(item[i] !== undefined) {
            opts[i] = item[i];
          }
        });
      }
      return opts;
    }
  };

  return upl;

})(FileUploader2 || {});
