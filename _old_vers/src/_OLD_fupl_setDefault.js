//* eslint no-console: 0 */
/* globals FileUploader:true */

FileUploader = (function (_upl) {
  "use strict";

	var default_options = {

  	/**
    ### uploader\_url
    Url dello script lato server che esegue il caricamento del file.

    - *Default: `null`*
    */
    uploader_url: null,

    /**
    ### filetype
    Tipologia dei file selezionabili. Se si sceglie un'opzione
    diversa da `auto`, l'eventuale attributo `accept` presente nell'input
    verrà sovrascritto.
    Sono possibili queste opzioni:

    - `img`  : solo immagini jpeg, png, gif o webp
    - `pdf`  : solo documenti pdf
    - `auto` : (*Default*) utilizza l'attributo `accept` dell'input (se presente),
      altrimenti permette l'aggiunta di tutti i tipi di file.

    */
    filetype: 'auto',

    /**
  	### container\_class
  	Eventuale classe da aggiungere all'elemento contenitore di FileUploader
  	(`[data-file_uploader]`)

    - *Default: `null`*
    */
    container_class: null,

    /**
    ### template
    Template del markup da inserire all'interno dell'elemento
     contenitore, così strutturato:

    - Il markup originale viene inserito all'interno dell'elemento `.file_upl__button`
    - Il testo info per drag&drop viene inserito all'interno dell'elemento `.file_upl__dd_text`
    - Il testo di info viene inserito all'interno dell'elemento `.file_upl__info_text`.
    Se `show_info_text = false`, questo elemento può essere omesso.

    > NB: È possibile variare il markup secondo necessità, ma è necessario che le classi
    `.file_upl__*` siano mantenute.

    - *Default: template basato su Bootstrap 4*

    ``` javascript
    template: '<div class="card text-center" style="background-color: transparent">' +
    . '<div class="card-body">' +
    .     '<div class="file_upl__button"></div>' +
    .     '<div class="file_upl__dd_text"></div>' +
    .   '</div>' +
    .   '<div class="card-footer text-muted small font-italic file_upl__info_text"></div>' +
    . '</div>'
    ```
    */
    template: '<div class="card text-center" style="background-color: transparent">' +
        '<div class="card-body">' +
          '<div class="file_upl__button"></div>' +
          '<div class="file_upl__dd_text"></div>' +
        '</div>' +
        '<div class="card-footer text-muted small font-italic file_upl__info_text"></div>' +
      '</div>',


    //!-- init_callback
    /**
    ### init_callback
    Funzione richiamata ogni volta che un elemento FileUploader viene inizializzato.
    La funzione viene invocata passandole l'elemento jQuery in esame
    - *Default: `null`*
    */
    init_callback: null,

    //!-- upload_start_callback
    /**
    ### upload\_start\_callback
    Funzione richiamata ogni volta che un file viene inviato al server.
    Il suo scopo principale è mostrare un feedback all'utente e permettere alcune
    interazioni (ad esempio eliminare un file preventivamente selezionato).
    Questa funzione è obbligatoria.
    - *Default: `null`*

    La funzione viene invocata passandole un oggetto contenente:

    - `item_id`: id univoco del documento in elaborazione
    - `filelist_item`: oggetto filelist corrente,
    - `img_preview` : miniatura dell'immagine in forma di stringa Base64
      (`null` se si tratta di altre tipologie)
    - `uploader_options`: oggetto `uploader_options` corrente
    - `img_wi` e `img_he`: dimensioni in pixel dell'immagine. `null` se
      non si tratta di immagini
    */
    upload_start_callback: null,


    //!-- upload_complete_callback
    /**
    ### upload\_complete\_callback
    Funzione richiamata ogni volta che un file viene caricato.
    Il suo scopo è confermare l'avvenuta esecuzione dell'upload e aggiungere
    alla pagina, i campi hidden con i dati necessari al perfezionamento
    della registrazione.

    Questa funzione è obbligatoria, e deve gestire, utilizzando le relative funzioni,
    la creazione della miniatura delle immagini e la creazione dei campi hidden
    da restituire al server.

    - *Default: `null`*

    La funzione viene invocata passandole un oggetto contenente:

    - `item_id`: id univoco del documento in elaborazione,
    - `server_error`: `null`, se l'upload è stato completato correttamente
      oppure, in caso contrario, stringa con il messaggio di errore restituito
    - `filelist_item`: oggetto filelist corrente,
    - `hidden_fields`: stringa con i campi hidden da inviare al server
    - `uploader_options`: oggetto `uploader_options` corrente
    - `img_wi` e `img_he`: dimensioni in pixel dell'immagine. `null` se
      non si tratta di immagini
    */
    upload_complete_callback: null,


    /**
    ### container\_dragover\_class
    Eventuale classe da aggiungere all'elemento  contenitore quando un file vi
    è trascinato sopra

    - *Default: `bg-primary text-white` (Bootstrap 4)*
    */
    container_dragover_class: 'bg-light',

    /**
  	### label\_text
  	Eventuale testo da sostituire a quello contenuto nel tag label
    (`null` = nessuna sostituzione).

    - *Default: `null`*
    */
    label_text: null,

    /**
    ### label\_class
    Eventuale classe da applicare al tag label

    - *Default: `btn btn-primary btn-lg` (Bootstrap 4)*
    */
    label_class: 'btn btn-primary btn-lg',

    /**
    ### dd\_text\_single
    Testo di istruzioni per il drag and drop con input senza attributo `multiple`

    - *Default: 'oppure trascina qui un file'*
    */
    dd_text_single: 'oppure trascina qui un file',

    /**
    ### dd\_text\_multiple
    Testo di istruzioni per il drag and drop  con input `multiple`

    - *Default: 'oppure trascina qui uno o più file'*
    */
    dd_text_multiple: 'oppure trascina qui uno o più file',

    /**
    ### show\_info\_text
    (Booleano) indica se mostrare o no il testo informativo su formati accettati,
    dimensioni immagini, ecc. Se si decide di non mostralo, potrebbe essere
    necessario rimuovere dal template l'elemento `.file_upl__info_text`

    - *Default: true*
    */
    show_info_text: true,

    /**
    ### custom\_info\_text
    Eventuale testo informativo personalizzato. se presente, sostituisce il
    testo generato in base ai formati, ai limiti di dimensioni, ecc.

    - *Default: null*
    */
    custom_info_text: null,

    /**
    ### info\_text\_join\_string
    Stringa utilizzata per concatenare tra loro le varie parti del testo informativo

    - *Default: `<br>`*
    */
    info_text_join_string: '<br>',

    /**
    ### impostazioni per le immagini
    Applicate solo se `filetype == 'img'`.
    Valori numerici che corrispondono alle dimensioni in pixel richieste per l'immagine.
    I parametri `img_min_*` e `img_max_*` possono essere assegnati simultaneamente, ma
    sono ignorati se esistono i corrispondenti parametri _esatti_ (ad esempio,
    se è presente `img_w`, i parametri `img_min_w` e `img_max_w` non vengono
    presi in considerazione).
    Il valore di default di tutti i parametri è `null`, che significa
    che non vengono applicati.

    - **img\_min\_w**: larghezza minima dell'immagine
    - **img\_max\_w**: larghezza massima dell'immagine
    - **img\_w**:      larghezza esatta dell'immagine
    - **img\_min\_h**: altezza minima dell'immagine
    - **img\_max\_h**: altezza massima dell'immagine
    - **img\_h**:      altezza esatta dell'immagine
    */
    img_min_w   : null,
    img_max_w   : null,
    img_w       : null,
    img_min_h   : null,
    img_max_h   : null,
    img_h       : null,

    /**
    ### max\_filesize
    Dimensione (peso) massima dell'immagine. Può essere un
    numero, e in questo caso corrisponde ad una dimensione in KB, o una stringa
    composta da un valore numerico e da un suffisso tra 'KB' e 'MB' (anche minuscoli).
    Se il valore è null o se la stringa non viene riconosciuta, non è applicato
    nessun limite.

    - *Default: `null`*
    */
    max_filesize: null,


    /**
    ### varname
    Prefisso della variabile utilizzata per inviare al server i
    dati di ogni singolo file caricato. Il valore indicato è il nome base
    dell'array costruito per inviare i valori al server.

    - *Default: `file`*

    __esempio__ (campi hidden prodotti in un form con due elementi FileUploader):

    ```html
    <!-- FileUploader #1 -->
    <input type="hidden" name="file[0][tmp_file]" value="xyz">
    <input type="hidden" name="file[0][file_name]" value="miofile.pdf">

    ...

    <!-- FileUploader #2 -->
    <input type="hidden" name="file[1][tmp_file]" value="kjw">
    <input type="hidden" name="file[1][file_name]" value="miofile2.pdf">
    ```

    */
    varname: 'file',


    /**
  	### selector
  	Selettore degli elementi su cui applicare FileUploader.
    Questo parametro può essere utile nei casi in cui sia necessario modificare
    le impostazione globali per un singolo caso.
    Non ha nessun effetto se modificato tramite gli attributi `data` dell'elemento.

    - *Default: `[data-file_uploader]`*

    __Esempio di utilizzo con selettore personalizzato__
    (notare come in questo caso l'elemento a cui applicare
    FileUploader non ha l'attributo '[data-file_uploader]' in modo di non essere
    toccato dalle impostazioni globali):

    ```html
    <div id="special_uploader">
    .  <!-- ... -->
    </div>
    ```

    ```javascript
    FileUploader.setDefaults({
    .  selector : '#special_uploader',
    . ...
    });
    FileUploader.init();
    ```
    */
    selector: '[data-file_uploader]',

    /**
  	### debug
  	Attiva la modalità debug che mostra in console le informazioni sulla
  	configurazione corrente

    - *Default: false*
    */
    debug: false,


    /**
  	### alertErrorAPI
  	Interfaccia per l'invio di messaggi di errore
    - *Default: `function (mes) { window.alert(mes);}`*
    */
    alertErrorAPI: function (mes) { window.alert(mes);}
	};

  /**
	 * ### setDefaults
	 * (funzione) Permette l'impostazione delle opzioni globali di FileUploader
	 * valide per tutti gli uploader
	 */
	_upl.setDefaults = function ( user_global_options ) {
    //_upl.global_options = Object.assign({}, default_options, user_global_options);
    // per compatibilità con IE 11
    _upl.global_options = $.extend({}, default_options, user_global_options);
  };

  return _upl;

})(FileUploader || {});
