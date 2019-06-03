/* exported FileUploader */

var FileUploader = {

  // VARIABILI GLOBALI
  /*
    mimetypes ed estensioni da utilizzare per l'attributo `accept` del
    tag input in corrispondenza del parametro `filetype`
  */
  mimetypes: {
    img: ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
          '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],

    pdf: ['application/pdf', '.pdf']
  },

  // parametri di default condivisi da tutte le istanze
  default_global_options: {

    // percorso del css FileUploader
    fileUploader_css: null,

    // Funzione richiamata ogni volta che FileUploader viene inizializzato
    init_callback: null,

    // Selettore degli elementi su cui applicare FileUploader.
    selector: '[data-file_uploader]',

    // Attiva  la modalità debug che mostra in console le informazioni sulla
    debug: false,

    // Interfaccia per l'invio di messaggi di errore
    alert_api: (mes) => { window.alert(mes);}
  },

  // parametri personalizzabili per ogni singola istanza
  default_istance_options: {

    // Url dello script lato server che esegue il caricamento del file
    uploader_url: null,

    // Tipologia dei file selezionabili
    filetype: 'auto',

      // Eventuale classe da aggiungere all'elemento contenitore di FileUploader
    container_class: null,

    // Template del markup da inserire all'interno dell'elemento contenitore
    template: '<div class="card text-center" style="background-color: transparent">' +
        '<div class="card-body">' +
          '<div class="file_upl__button"></div>' +
          '<div class="file_upl__dd_text"></div>' +
        '</div>' +
        '<div class="card-footer text-muted small font-italic file_upl__info_text"></div>' +
      '</div>',

    //Funzione richiamata ogni volta che un file viene inviato al server.
    upload_complete_callback: null,

    // Eventuale classe da aggiungere all'elemento  contenitore quando un file vi
    container_dragover_class: 'bg-light',

    // Eventuale testo da sostituire a quello contenuto nel tag label
    label_text: null,

    // Eventuale classe da applicare al tag label
    label_class: 'btn btn-primary btn-lg',

    // Testo di istruzioni per il drag and drop con input senza attributo `multiple`
    dd_text_single: 'oppure trascina qui un file',

    // Testo di istruzioni per il drag and drop  con input `multiple`
    dd_text_multiple: 'oppure trascina qui uno o più file',

    // Indica se mostrare o no il testo informativo su formati accettati
    show_info_text: true,

    // Eventuale testo informativo personalizzato. se presente, sostituisce il
    custom_info_text: null,

    // Stringa utilizzata per concatenare tra loro le varie parti del testo informativo
    info_text_join_string: '<br>',

    // impostazioni per le immagini. Applicate solo se `filetype == 'img'`.
    img_min_w   : null,
    img_max_w   : null,
    img_w       : null,
    img_min_h   : null,
    img_max_h   : null,
    img_h       : null,

    // Dimensione (peso) massima dell'immagine.
    max_filesize: null,

    // Prefisso della variabile utilizzata per inviare al server i dati
    varname: 'file'
  }

};
