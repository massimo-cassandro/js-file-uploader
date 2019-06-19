# FileUploader

Upload asincrono tramite HTML5 e Javascript

v. 2.0.0 - Massimo Cassandro - 2018/2019

[TOC]

## Panoramica
File Uploader è uno script JS per automatizzare e semplificare l'upload di file attraverso una pagina HTML.

L'upload dei file è effettuato in modo asincrono tramite una chiamata Ajax ad uno script lato server che provvede alla registrazione del file, restituendo un JSON di informazioni.

FileUploader richiede un browser di ultima generazione

## Riferimenti (e ispirazioni)
- <https://css-tricks.com/drag-and-drop-file-uploading/>
- <https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/>
- <https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Limiting_the_size_of_a_file_before_its_upload>
- <https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/>

## Markup
Perché FileUploader sia attivato è necessario che sia presente questo markup:

```html
<div data-file_uploader>
  <label for="input_file">Seleziona un file</label>
  <input id="input_file" type="file" name="myfile">
</div>
```

## Script lato server
È necessario impostare uno script lato server che esegua l'upload dei file.

Lo scopo di FileUploader è di permettere la registrazione asincrona dei file solo dopo l'invio del form che contiene l'input file. Quindi lo script deve collocare il file in una directory temporanea (`/tmp`), assegnandogli un nome provvisorio.

Solo dopo la registrazione del form, il file può essere spostato nella sua destinazione definitiva; in questo modo eventuali form non completati non lasceranno file *orfani*, visto che la directory `tmp` viene periodicamente svuotata.

FileUploader riceve quindi dallo script lato server, le informazioni necessarie a completare la registrazione, le inserisce in un input hidden, e le restituisce al server al momento della registrazione.

Per ogni file selezionato, lo script riceve una chiamata *POST* alla quale è associata una variabile `file` a cui è, a sua volta, associato il file selezionato dall'utente.

La variabile PHP `$_FILES`, ad esempio, restituisce qualcosa del genere:

```php
Array
(
    [file] => Array
        (
            [name] => miofile.jpg
            [type] => image/jpeg
            [tmp_name] => /tmp/php/phpGu39M5
            [error] => 0
            [size] => 8772
        )

)
```

Lo script deve processare la richiesta e restituire un json così formattato:

```json
{
  "tmp_file": "path/to/tmp/file",
  "error": null
}
```
In cui:

* `tmp_file` è il percorso al file temporanea registrato sul server
* `error` è `null` in caso di successo, oppure contiene il messaggio di errore prodotto dal server.

Dopo la registrazione, FileUploader restituirà per ogni file caricato i seguenti valori:

* `tmp_file`: nome del file temporaneo ricevuto dallo script
* `file_name`: nome del file originale normalizzato per il web
* `size`: dimensione in bytes del file
* `type`: mimetype del file

Nel caso di immagini, saranno anche presenti i valori `width` e `height` dell'immagine stessa.

Tutti i valori saranno inseriti in una serie di campi *hidden* il cui attributo `name` sarà composto dal valore indicato nel parametro `varname` + l'indice dell'elemento FileUploader + il nome della variabile in oggetto.

Esempio (con parametro `varname='custom_file'`:

```html
<input type="hidden" name="custom_file[0][tmp_file]" value="...">
```

Vedi anche il paragrafo **Parametri di default → varname**

## CSS
FileUploder non fornisce volutamente nessuna impostazione grafica predefinita se non quella elementare ottenuta applicando le classi di Bootstrap 4.

Il css `file_uploader.css` contiene solo poche inpostazioni essenziali al funzionamento del plugin, ed è quindi necessario creare volta per volta la veste grafica più coerente al proprio progetto.

Per lo stesso motivo, non viene fornito un callback predefinito per il trattamento dei file selezionati.

Al momento dell'attivazione al container FileUploader viene assegnata la classe `file_upl` (e volendo si può aggiungere un'ulteriore classe personalizzata), ed è quindi possibile agire su questa classe per effettuare tutte le personalizzazioni del caso.

Non è necessario includere il file css nel progetto: verrà caricato da FileUploader dove necessario.

## Utilizzo di FileUploader

FileUploader va istanziato impostando i parametri necessari tramite la funzione ``init`;

Setup minimo:

```html
<script src="file_uploader-min.js"></script>
```

```javascript
FileUploader.init({
  fileUploader_css         : '/path/to/FileUploader.css'
},{
  uploader_url             : '/path/to/uploader',
  upload_start_callback    : function () { ... },
  upload_complete_callback : function () { ... }
});
```

### Esempio di applicazione

L'idea di base è che i parametri globali (impostati tramite l'argomento di `FileUploader.init`) siano utilizzati per le impostazioni condivise in tutto il progetto, mentre quelle locali servano per specifiche esigenze, caso per caso.

Un esempio di applicazione in un progetto che utilizza Boostrap potrebbe quindi essere:

**parametri globali:**

```javascript
FileUploader.init({
  fileUploader_css         : '/path/to/FileUploader.css'
}, {
  uploader_url             : '/path/to/uploader'
  upload_start_callback    : function () { ... },
  upload_complete_callback : function () { ... }
  label_class              : 'btn btn-primary'
});
```

**input per il caricamento di un'immagine:**

```html
<div data-file_uploader data-filetype="img" data-img_min_w="500" data-max_filesize="100" class="form-group">
  <label for="input_file">Seleziona un'immagine</label>
  <input class="form-control" id="input_file" type="file" name="myfile">
</div>
```

Tutti gli elementi hanno le classi form di Bootstrap, in modo che l'input possa essere utilizzato come un normale elemento HTML qualora il browser non supporti le funzionalità richieste.



### Callback
Ai due parametri `upload_start_callback` e `upload_complete_callback` (default `null`), vanno assegnate due funzioni che svolgano il ruolo di interfaccia tra FileUploader e la pagina corrente.

Per altri dettagli i paragrafi **upload\_start\_callback** e **upload\_complete\_callback**.


```html
<div class="file_uploader_results">
  <div class="file_uploader_results__empty">Nessun file presente</div>
</div>
<div data-file_uploader="[... parametri ...]" class="form-group">
  <label for="input_file">Seleziona un’immagine</label>
  <input id="input_file" type="file" name="myfile" class="form-control">
</div>
```

```javascript
/*
  @codekit-prepend 'componenti/file_uploader/_file_uploader.js';
*/

// configurazione
FileUploader.init({
  
  /* 
  	parametri standard
  	...
  */
  

  // init_callback: rimozione classe `form-group`
  init_callback: function ( uploader_options ) {
    uploader_options.container.removeClass('form-group');
  },
  
  // callback avvio upload
  upload_start_callback: function ( params ) {
    /*
      params:
      {
        'item_id'         : id univoco del documento in elaborazione
        'filelist_item'   : oggetto filelist corrente,
        'img_preview'     : null | 'stringa immagine',
        'uploader_options': uploader_options
      }
    */

    if(params.uploader_options.is_multiple) {
      $(params.uploader_options.results_div_selector)
        .addClass('file_uploader_multiple')
        .find('.file_uploader_results__empty').remove();

      $(params.uploader_options.results_div_selector).append(
        '<div id="' + params.item_id + '">' +
          (params.img_preview ? '<img src="' + params.img_preview +'">' : '') +
          '<div class="text-truncate small my-2">' + params.filelist_item.name + '</div>' +
        '</div>'
      );

    } else {
      $(params.uploader_options.results_div_selector).html(
        '<div id="' + params.item_id + '">' +
          (params.img_preview ? '<img src="' + params.img_preview +'" class="img-fluid">' : '') +
          '<div class="text-truncate small my-2">' + params.filelist_item.name + '</div>' +
        '</div>'
      );
    }

  },
  
  // callback upload completato
  upload_complete_callback: function (params) {
    /*
      params:
      {
        item_id
        server_error
        filelist_item
        hidden_fields
        uploader_options  
      }
    */
    
    if( !params.server_error ) {
      
      // azioni upload con successo
      
    } else {
      
      // azioni upload con errore
      
    }
    
  },
  
  // parametro personalizzato
  results_div_selector: '.file_uploader_results'
});

```

## Parametri FileUploader

### Caratteristiche generali

Tutti i parametri di FileUploader (vedi *Parametri di default*) possono essere sovrascritti globalmente utilizzando la funzione `FileUploader.init`, oppure, caso per caso, tramite gli attributi *data* del div `[data-file_uploader]` (es. `data-filetype="img"`) o ancora tramite json assegnato a `data-file_uploader` (es `data-file_uploader='{"filetype":"img"}'`)

In caso di conflitto, i parametri `data` prevalgono su quelli globali, e il json assegnato `data-file_uploader` prevale su tutto.

Devono essere impostati almeno i tre parametri obbligatori (il cui default è per tutti `null`): `uploader_url`, `upload_start_callback` e `upload_complete_callback`.

Oltre ai parametri impostati direttamente, FileUploader ne genera alcuni dinamicamente al momento di avviare l'applicazione: vedi **Parametri definiti dall'applicazione**.

**Impostazione globale**

```javascript
FileUploader.init({
  uploader_url             : '/path/to/uploader',
  upload_start_callback    : function () { ... },
  upload_complete_callback : function () { ... }
});
```

**Impostazione tramite attributi `data`**

```html
<div data-file_uploader data-uploader_url="/path/to/uploader">
  <!-- ... -->
</div>
```

oppure

```twig
<div data-file_uploader="{{ {uploader_url: '/path/to/uploader'}|json_encode|e('html') }}">
  <!-- ... -->
</div>
```

Ai parametri dei default (elencati di seguito), vanno aggiunti `container`, corrispondente all'elemento su cui è applicato FileUploader ed eventuali parametri personali, che possono essere aggiunti tramite `init` o tramite attributi data che saranno sempre aggiunti all'oggeto dei parametri disponibile in tutti i callback.

### Parametri

#### `uploader_url`
Url dello script lato server che esegue il caricamento del file.

- *Default: `null`*

#### `fileUploader_css`
Percorso del css FileUploader (obbligatorio)

- *Default: `null`*

#### `filetype`
Tipologia dei file selezionabili. Se si sceglie un'opzione diversa da `auto`, l'eventuale attributo `accept` presente nell'input
verrà sovrascritto.
Sono possibili queste opzioni:

- `img`  : solo immagini jpeg, png, gif o webp
- `pdf`  : solo documenti pdf
- `auto` : (*Default*) utilizza l'attributo `accept` dell'input (se presente),
altrimenti permette l'aggiunta di tutti i tipi di file.


#### `container_class`
Eventuale classe da aggiungere all'elemento contenitore di FileUploader (l'elemento con attributo `[data-file_uploader]`)

- *Default: `null`*

#### `template`
Template del markup da inserire all'interno dell'elemento
contenitore, così strutturato:

- Il markup originale viene inserito all'interno dell'elemento `.file_upl__button`
- Il testo info per drag&drop viene inserito all'interno dell'elemento `.file_upl__dd_text`
- Il testo di info viene inserito all'interno dell'elemento `.file_upl__info_text`.
Se `show_info_text = false`, questo elemento può essere omesso.

> NB: È possibile variare il markup secondo necessità, ma è necessario che le classi `.file_upl__*` siano mantenute.

- *Default: template basato su Bootstrap 4*

``` javascript
template: '<div class="card text-center" style="background-color: transparent">' +
 '<div class="card-body">' +
     '<div class="file_upl__button"></div>' +
     '<div class="file_upl__dd_text"></div>' +
   '</div>' +
   '<div class="card-footer text-muted small font-italic file_upl__info_text"></div>' +
 '</div>'
```

#### `init_callback`
Funzione richiamata ogni volta che un elemento FileUploader viene inizializzato. La funzione viene invocata con l'elemento in esame come argomento
- *Default: `null`*

#### `upload_start_callback`
Funzione richiamata ogni volta che un file viene inviato al server. Il suo scopo principale è mostrare un feedback all'utente e permettere alcune interazioni (ad esempio eliminare un file preventivamente selezionato).

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

#### `upload_complete_callback`
Funzione richiamata ogni volta che un file viene caricato. Il suo scopo è confermare l'avvenuta esecuzione dell'upload e aggiungere alla pagina, i campi hidden con i dati necessari al perfezionamento della registrazione.

Questa funzione è obbligatoria, e deve gestire, utilizzando le relative funzioni, la creazione della miniatura delle immagini e la creazione dei campi hidden da restituire al server.

- *Default: `null`*

La funzione viene invocata passandole un oggetto contenente:

- `item_id`: id univoco del documento in elaborazione,
- `server_error`: `null`, se l'upload è stato completato correttamente oppure, in caso contrario, stringa con il messaggio di errore restituito
- `filelist_item`: oggetto filelist corrente,
- `hidden_fields`: stringa con i campi hidden da inviare al server
- `uploader_options`: oggetto `uploader_options` corrente
- `img_wi` e `img_he`: dimensioni in pixel dell'immagine. `null` se
non si tratta di immagini

#### `container_dragover_class`
Eventuale classe da aggiungere all'elemento  contenitore quando un file vi è trascinato sopra

- *Default: `bg-primary text-white` (Bootstrap 4)*

#### `label_text`
Eventuale testo da sostituire a quello contenuto nel tag label (`null` = nessuna sostituzione).

- *Default: `null`*

#### `label_class`
Eventuale classe da applicare al tag label

- *Default: `btn btn-primary btn-lg` (Bootstrap 4)*

#### `dd_text_single`
Testo di istruzioni per il drag and drop con input senza attributo `multiple`

- *Default: 'oppure trascina qui un file'*

#### `dd_text_multiple`
Testo di istruzioni per il drag and drop  con input `multiple`

- *Default: 'oppure trascina qui uno o più file'*

#### `show_info_text`
(Booleano) indica se mostrare o no il testo informativo su formati accettati,
dimensioni immagini, ecc. Se si decide di non mostralo, potrebbe essere
necessario rimuovere dal template l'elemento `.file_upl__info_text`

- *Default: true*

#### `custom_info_text`
Eventuale testo informativo personalizzato. se presente, sostituisce il
testo generato in base ai formati, ai limiti di dimensioni, ecc.

- *Default: null*

#### `info_text_join_string`
Stringa utilizzata per concatenare tra loro le varie parti del testo informativo

- *Default: `<br>`*

#### impostazioni per le immagini
Applicate solo se `filetype == 'img'`.
Valori numerici che corrispondono alle dimensioni in pixel richieste per l'immagine.
I parametri `img_min_*` e `img_max_*` possono essere assegnati simultaneamente, ma
sono ignorati se esistono i corrispondenti parametri _esatti_ (ad esempio,
se è presente `img_w`, i parametri `img_min_w` e `img_max_w` non vengono
presi in considerazione).
Il valore di default di tutti i parametri è `null`, che significa
che non vengono applicati.

- `img_min_w`: larghezza minima dell'immagine
- `img_max_w`: larghezza massima dell'immagine
- `img_w`:     larghezza esatta dell'immagine
- `img_min_h`: altezza minima dell'immagine
- `img_max_h`: altezza massima dell'immagine
- `img_h`:     altezza esatta dell'immagine

#### `max_filesize`
Dimensione (peso) massima dell'immagine. Può essere un
numero, e in questo caso corrisponde ad una dimensione in KB, o una stringa
composta da un valore numerico e da un suffisso tra 'KB' e 'MB' (anche minuscoli).
Se il valore è null o se la stringa non viene riconosciuta, non è applicato
nessun limite.

- *Default: `null`*

#### `varname`
Prefisso della variabile utilizzata per inviare al server i
dati di ogni singolo file caricato. Il valore indicato è il nome base
dell'array costruito per inviare i valori al server.

- *Default: `file`*

__esempio__ (campi hidden prodotti in un form con due elementi FileUploader):

```html
<!-- FileUploader #1 -->
<input type="hidden" name="file[0][tmp_file]" value="xyz">
<input type="hidden" name="file[0][file_name]" value="miofile.pdf">

..

<!-- FileUploader #2 -->
<input type="hidden" name="file[1][tmp_file]" value="kjw">
<input type="hidden" name="file[1][file_name]" value="miofile2.pdf">
```


#### `selector`
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
  <!-- ... -->
</div>
```

```javascript
FileUploader.init({
  selector : '#special_uploader',
 ...
});
```

#### `debug`
Attiva la modalità debug che mostra in console le informazioni sulla
configurazione corrente

- *Default: false*

#### `alertErrorAPI`
Interfaccia per l'invio di messaggi di errore
- *Default: `function (mes) { window.alert(mes);}`*


## Utilizzo

### Controllo caricamento completato

xxxx

### Controllo contenuti `required`

Dato che è possibile caricare contenuti tramite *Drag&Drop*, non è possibile utilizzare il controllo nativo del browser che utilizza l'attributo `required` del campo file.

Il controllo può però essere effettuato utilizzando gli attributi `data` aggiunti dinamicamente all'elemento `.fupl-wrapper` dell'uploader: `data-required="true"` e `data-has-values="true|false"`.

Quindi, se per controllare la presenza di un contenuto per l'elemento `#mio-uploader` sarebbe sufficiente verificare questa condizione:

```javascript
document.getElementById('mio-uploader')
    .closest('.fupl-wrapper[data-required="true"][data-has-values="true"]') !== null
```

Oppure, per effettuare un controllo generale su tutto il form:

```javascript
document.querySelectorAll('.fupl-wrapper[data-required="true"][data-has-values="false"]').length === 0
```
