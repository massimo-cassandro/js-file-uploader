/* globals FileUploader2:true */

FileUploader2 = ( (upl) => {
  "use strict";

  // parametri di default condivisi da tutte le istanze
  const default_options = {

    // percorso del css FileUploader
    css: null,

    // Attiva la modalità debug che mostra in console le informazioni
    // sulla configurazione corrente
    debug: false,

    // locales string, usata per la formattazione della stringa numerica
    // mostrata all'utente ricavata da `max_filesize`
    locales: 'it-IT',

    // messaggio browser non compatibile
    unsuitableBrowserMessage: 'Il tuo browser non ha tutte le funzionalità richieste da FileUploader',

    // Interfaccia per l'invio di messaggi di errore
    // mes  →  chiave dell'oggetto `alert_messages` con il testo del messaggio di errore
    // type →  uno tra info, error, warning
    // opts →  l'oggetto file uploader options corrente
    alert_api: (mes, type, opts) => { window.alert(opts.alert_messages.mes);},

    // testo dei messaggi errore
    alert_messages: {
      tooMuchFiles: 'Puoi selezionare un solo file!' // tentativo di trascinare più file con uploader singolo
    },

    // Url dello script lato server che esegue il caricamento del file
    // per l'istanza in esame. Ha la precedenza sull'impostazione globale
    // obbligatorio
    url: null,

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
      un elemento type[file] per eventuale procedura di fallback)

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

    // Eventuale classe da aggiungere all'elemento FileUploader al
    // momento dell'inizializzazione
    element_class: null,

    // Classe da aggiungere all'elemento FileUploader quando un file
    // vi è trascinato sopra
    element_dragover_class: 'fupl-is-dragover',

    // Label da applicare da applicare all'elemento FileUploader.
    // Se `null` e se esiste un elemento `label` all'interno dell'uploader,
    // viene preso il testo dell'elemento
    uploader_label_text: null,

    // Opzione per l'aggiunta di un tag label prima dell'elemento uploader
    uploader_add_label: true,

    // Eventuale classe da aggiungere ad uploader_label
    uploader_label_class: null,

    /*
    Array (o stringa json) dei testi del label del tag input (il primo elemento dell'array) e del testo
    informativo per il drag &drop da inserire in `.fupl-dd-text` (il secondo elemento)
    nelle varie combinazioni (img singola e multiple, doc singole e multipli)
    segnaposti: ['{{input_label}}', '{{dd_text}}']
    */
    input_text: {
      img: {
        single:   ["Seleziona un'immagine", "\u2026oppure trascinala qui"],
        multiple: ["Seleziona una o più immagini", "\u2026oppure trascinale qui"]
      },
      doc: {
        single: ["Seleziona un documento", "\u2026oppure trascinalo qui"],
        multiple: ["Seleziona uno o più documenti", "\u2026oppure trascinali qui"]
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
      * `item_id`: id univoco del documento in elaborazione
      * `filelist_item`: oggetto filelist corrente,
      * `img_preview` : miniatura dell'immagine in forma di stringa Base64
        (null se si tratta di altre tipologie)
      * `uploader_options`: oggetto `options` corrente
      * `img_wi` e `img_he`: dimensioni in pixel dell'immagine.
        null se non si tratta di immagini
    */
    upload_start_callback: null,

    /*
    Funzione richiamata ogni volta che un file viene caricato.
    La funzione viene invocata passandole un oggetto contenente:
      * `item_id`: id univoco del documento in elaborazione,
      * `server_error`: null, se l'upload è stato completato correttamente oppure,
        in caso contrario, stringa con il messaggio di errore restituito
      * `filelist_item`: oggetto filelist corrente,
      * `hidden_fields`: stringa con i campi hidden da inviare al server
      * `uploader_options`: oggetto `options` corrente
      * `img_wi` e img_he: dimensioni in pixel dell'immagine.
        null se non si tratta di immagini
    */
    upload_complete_callback: null,

    /*
    Array json degli eventuali elementi preregistrati, nella forma:
      [
        {
          id    → identificativo univoco del file (può essere anche il percorso sul server) OBBL
          name  → nome del file
          url   → url per eventuale tag <a> presente nell'elemento (se immagine può essere assente o null)
          src   → attributo `src` obbligatorio se immagine, oppure assente o null
          wi    → larghezza in px se immagine oppure assente o null
          he    → altezza in px se immagine oppure assente o null
          size  → dimensione in bytes
          [...] → eventuali campi aggiuntivi specifici dell'istanza
        }
        [...]
      ]

      l'id viene aggiunto come attributo `data` al pulsante di eliminazione del file
      (genera un hidden con l'id del file da eliminare dal server)
    */
    values: [],

    // varname degli hidden con gli id dei file già registrati  da eliminare
    delete_varname: 'elimina_file[]',

// TODO
    // attiva la possibilità di riordinare gli elementi trascinandoli
    // se true, i valori degli eventuali elementi preregistrati devono essere
    // elencati nel josn `values` nell'ordine correttp
    reorder: false,

    // name della variabile hidden usata per registrare l'ordinamento
    reorder_varname: 'order'

// TODO gestione campi aggiuntivi
  };

  upl.setOptions = (...custom_options) => {

    if( typeof Object.assign === "function") {
      return Object.assign(
        {},
        default_options,
        ...custom_options
      );

    } else { // IE 11
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
