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
    alert_api: (mes) => { window.alert(mes);},

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
    Template del markup da inserire all'interno dell'elemento contenitore,
    così strutturato:

    * Il markup originale viene inserito all'interno dell'elemento .file_upl__button
    * Il testo info per drag&drop viene inserito all'interno dell'elemento .file_upl__dd_text
    * Il testo di info viene inserito all'interno dell'elemento .file_upl__info_text.
      Se show_info_text = false, questo elemento può essere omesso.

    NB: È possibile variare il markup secondo necessità,
    ma è necessario che le classi .file_upl__* siano mantenute.
    */
    template: '<div class="card text-center" style="background-color: transparent">' +
        '<div class="card-body">' +
          '<div class="file_upl__button"></div>' +
          '<div class="file_upl__dd_text"></div>' +
        '</div>' +
        '<div class="card-footer text-muted small font-italic file_upl__info_text"></div>' +
      '</div>',


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

    // Eventuale classe da aggiungere all'elemento FileUploader al
    // momento dell'inizializzazione
    element_class: null,

    // Eventuale classe da aggiungere all'elemento FileUploader quando un file
    // vi è trascinato sopra
    element_dragover_class: null,

    // Label da applicare da applicare all'elemento FileUploader.
    // Se `null` e se esiste un elemento `label` all'interno dell'uploader,
    // viene preso il testo dell'elemento
    uploader_label_text: null,

    // Opzione per l'aggiunta di un tag label prima dell'elemento uploader
    uploader_add_label: true,

    // Eventuale classe da aggiungere ad uploader_label
    uploader_label_class: null,

    // classi da applicare al tag label dell'input[file] utilizzato
    // come pulsante per la selezione dei file
    label_btn_class: 'btn btn-primary btn-lg',

    // Testo di istruzioni per il drag and drop con input senza attributo `multiple`
    dd_text_single: 'oppure trascina qui un file',

    // Testo di istruzioni per il drag and drop  con input `multiple`
    dd_text_multiple: 'oppure trascina qui uno o più file',

    // indica se mostrare o no il testo informativo su formati accettati,
    // dimensioni immagini, ecc. Se si decide di non mostralo, potrebbe essere
    // necessario rimuovere dal template l'elemento .file_upl__info_text
    show_info_text: true,

    // Eventuale testo informativo personalizzato. se presente,
    // sostituisce il testo generato in base ai formati, ai limiti di dimensioni, ecc.
    custom_info_text: null,

    // Stringa utilizzata per concatenare tra loro le varie parti del testo informativo
    info_text_join_string: '<br>',

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

    /*
    Array degli eventuali elementi preregistrati, nella forma:
      [
        {

        }
        [...]
      ]
    */
    values: []
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
