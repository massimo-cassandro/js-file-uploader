# JS FileUploader

**HTML5 + Javascript asyncronous file upload.**
*v. 2 - Massimo Cassandro - 2017/2019*

Fileuploader automates and simplifies uploading files to HTML pages.

Uploads are performed asynchronously via an Ajax call to a server-side script that must register the file and return a JSON string.

Although the default settings are based on Bootstrap 4, FileUploader is entirely and easily configurable from scratch and can be adapted to any layout.


## Compatibilità
FileUploader richiede un browser di ultima generazione, e non è compatibile con nessuna versione di Explorer.
Richiede inoltre la versione 16 o successiva di Edge.

In caso di browser non compatibile viene mostrato un *alert* con il messaggio di errore indicato nel parametro `alert_messages.unsuitable_browser` delle opzioni e la procedura viene bloccata.

È però possibile far degradare in modo silenzioso l'uploader e utilizzare il tag `input[type="file"]` in modo nativo.

Per utilizzare questa opzione è necessario:

* impostare su *true* l'opzione `silent_degradation` (default *false*)
* inserire all'interno dell'elemento uploader l'elemento input di fallback
* imposta se necessario la funzione `unsuitable_browser_callback` per attivare comportamenti specifici validi solo in queste situazioni
* aggiungere al form il necessario attributo `enctype` (non richiesto da FileUploader)
* gestire questa eventualità lato server. È molto probabile che lo script da usare in questa situazione differisca da quello usato per la procedura Ajax.

## Installazione

FileUploader può essere installato tramite `npm`:

```bash
npm i --save js-file-uploader
```

## Utilizzo di FileUploader

Una volta aggiunto lo script JS alla pagina HTMl, FileUploader va istanziato impostando i parametri necessari tramite la funzione `init`;

Setup minimo:

```html
<script src="file_uploader-min.js"></script>
```

```javascript
FileUploader2.init({
  uploader_url   : 'path/to/server/script'
});
```
L'argomento di `init` è un oggetto di parametri specifici dell'inizializzazione.

L'elenco dei parametri configurabili è descritto nelle sezioni successive e nel file [\_set\_options.js](https://github.com/massimo-cassandro/file-uploader2/blob/master/js/_set_options.js).

Una volta inizializzato, l'uploader viene applicato automaticamente agli elementi che abbiano l'attributo `data-file-uploader`:

--
![](readme_files/uploader_std.png)
--

Nella cartella `demo` sono presenti diversi esempi di applicazione di FileUploader.

> NB: Il selettore predefinito è `data-file-uploader`, ma, se necessario, la parte `file-uploader` può essere
sostituita con qualsiasi stringa (con sintassi compatibile, vedi <https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset>) da indicare usando l'opzione `fupl_selector`:

```javascript
FileUploader2.init({
  uploader_url   : 'path/to/server/script',
  fupl_selector  : 'my-uploader'
});
```


### Markup
Perché FileUploader sia attivato è necessario che sia presente questo markup minimo:

```html
<div data-file-uploader></div>
```

In questo modo, FileUploader verrà attivato con i parametri globali definiti in [\_set\_options.js](https://github.com/massimo-cassandro/file-uploader2/blob/master/js/_set_options.js) e in `FileUploader2.init`.

È però possibile personalizzare ogni singola istanza utilizzando degli attributi data che corrispondono gli stessi parametri.

Se ad esempio si vuole utilizzare uno script lato server specifico, è possibile indicarlo in questo modo:

```html
<div data-file-uploader data-uploader_url="path/to/alternate/server/script"></div>
```

È anche possibile assegnare i parametri direttamente all'attributo `data-file-uploader` come valori json:

```html
<div data-file-uploader='{"uploader_url": "path/to/alternate/server/script"}'></div>
```

Si tenga presente però che alcuni parametri, come ad esempio `css` hanno senso solo se definiti globalmente.

Infine, è possibile inserire all'interno dell'elemento `data-file-uploader` un campo `input[type="file"]` come fallback per browser più vecchi (vedi il precedente paragrafo **Compatibilità**). Se FileUploader viene avviato correttamente, il campo input viene rimosso, in caso contrario può essere utilizzato in modo tradizionale.


### CSS
Il file css fornito è basato sul Framework Bootstrap 4 (non incluso), è però possibile modificarlo come desiderato, agendo se necessario anche sul markup generato, ridefinendo il parametro `templates` (vedi [\_set\_options.js](https://github.com/massimo-cassandro/file-uploader2/blob/master/js/_set_options.js)).

Non è necessario includere il file css nel progetto: verrà caricato da FileUploader al momento dell'inizializzazione.

È anche possibile includere il css di FileUploader nei fogli stile dell'intero progetto, in questo caso è sufficiente impostare il parametro `css = null` (default) in modo che il file non venga caricato nuovamente.

>**Qualsiasi modifica effettuata, deve aver cura di mantenere i nomi delle classi con prefisso `fupl-`, utilizzate dalla procedura per identificare i vari elementi.**


### Impostazione dei parametri
La configurazione di FileUploader è basata sui parametri definiti in [\_set\_options.js](https://github.com/massimo-cassandro/file-uploader2/blob/master/js/_set_options.js).

I parametri possono essere sovrascritti a cascata secondo questa sequenza:

* I valori inseriti nel file `_set_options.js` sono i valori di default.
* I parametri assegnati in `FileUploader2.init` sovrascrivono quelli di default e valgono per tutti gli elementi FileUploader2 interessati
* I parametri assegnati ad ogni istanza FileUploader prevalgono e sovrascrivono i precedenti: in questo modo è possibile avere comportamenti differenziati anche nella stessa pagina.

Infine, se è presente un campo `input[type="file"]` all'interno dell'elemento FileUploader, gli eventuali attributi `required`, `multiple` o `disabled` presenti vengono presi in considerazione nella configurazione.

Ad esempio è possibile impostare un Uploader come *required* sia impostando il parametro `required = true` sia utilizzando l'attributo `required` del campo file.

>NB: se i parametri `required`, `multiple` o `disabled` sono impostati come `true` nell'istanza FileUploader, non è possibile impostarli su `false` tramite gli attributi del campo input.


## Script lato server
È necessario impostare uno script lato server che esegua l'upload dei file.

Lo scopo di FileUploader è di permettere la registrazione asincrona dei file solo dopo l'invio del form che contiene l'input file. Quindi lo script deve collocare il file in una directory temporanea (ad esempio `tmp`), assegnandogli un nome provvisorio.

Solo dopo la registrazione del form, il file può essere spostato nella sua destinazione definitiva; in questo modo eventuali form non completati non lasceranno file *orfani*, visto che la directory `tmp` viene periodicamente svuotata.

A caricamento completato, FileUploader riceve dallo script lato server, le informazioni necessarie a completare la registrazione, le inserisce in una serie di input hidden, e le restituisce al server al momento del submit del form.

Per ogni file selezionato, lo script riceve una chiamata *POST* alla quale è associata una variabile `file` a cui è, a sua volta, associato il file selezionato dall'utente.

La variabile PHP `$_FILES`, ad esempio, restituisce qualcosa del genere:

```php
Array
(
    [file] => Array
        (
            [name] => myfile.jpg
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

Tutti i valori saranno inseriti in una serie di campi *hidden* il cui attributo `name` sarà composto da:

* il valore indicato nel parametro `varname` + 
* id unico dell'elemento in esame + 
* il nome della variabile in oggetto.

Esempio (con parametro `varname='custom_file'` e id unico = `__unique_id__`):

```html
<input type="hidden" name="custom_file[__unique_id__][tmp_file]" value="...">
```


## Personalizzazione

Tra i vari parametri disponibili per personalizzare FileUploader, ce ne sono alcuni che permettono di modificare radicalmente l'aspetto proposto dalle impostazioni di default.

Per una personalizzazione profonda, oltre ad agire sul css, si può intervenire sul markup generato dalla procedura e si possono impostare alcuni callback per effettuare operazioni aggiuntive.

Quando un elemento FileUploader viene generato, all'elemento originale (in nero nello schema seguente) viene aggiunta la classe `fupl`. Viene quindi generato del markup aggiuntivo dentro e fuori l'elemento `.fupl`. Quello interno (in blu) è completamente configurabile modificando il parametro `templates` delle opzioni.

![Schema markup](readme_files/markup_schema.png)

L'unica accortezza da avere è quella di mantenere gli elementi con classe `fupl-*`che sono utilizzati dalla procedura e dal css.


### Callback

Qualora fossero richiesti comportamenti aggiuntivi, è possibile definire alcuni callback, invocati in corrispondenza di alcuni eventi dell'uploader:

* `init_callback` (default null): Funzione richiamata dopo l'inizializzazione di ogni elemento FileUploader. La funzione viene invocata con l'oggetto di tutte le opzioni come argomento

* `unsuitable_browser_callback` (default null): funzione richiamata se vieme rilevato un browser non adatto

* `upload_start_callback` (default null): Funzione richiamata ogni volta che un file viene inviato al server.  La funzione viene invocata passandole un oggetto contenente:
    * `item`: oggetto con i dati dell'elemento in esame:
        - id: id univoco dell'elemento
        - file: oggetto *filelist* corrente
        - `width` e `height`: null o dimensioni in pixel dell'immagine
        - `tmp_file`: nel caso di nuovi elementi: nome del file temporaneo
    * `img_preview` : miniatura dell'immagine in forma di stringa Base64
        (null se si tratta di altre tipologie)
    * `fupl_options`: oggetto `options` corrente
  
* `upload_complete_callback` (default null):  Funzione richiamata ogni volta che un file viene caricato. La funzione viene invocata passandole un oggetto contenente:

    * `item`: oggetto con i dati dell'elemento in esame:
        - `id`: id univoco dell'elemento
        - `file`: oggetto filelist
        - `width` e `height`: null o dimensioni in pixel dell'immagine
        - `tmp_file`: nel caso di nuovi elementi: nome del file temporaneo
    * `server_error`: null, se l'upload è stato completato correttamente. oppure stringa con il messaggio di errore restituito
    * `fupl_options`: oggetto `options` corrente
    
* `alternate_loading_func` (default null): Non un callback, ma una funzione per una visualizzazione alternativa del progresso di caricamento. Se presente, viene sostituita a quella standard.
Viene invocata con due parametri:
    - `progress_event`: evento progress del caricamento
    - `fupl_options`: oggetto `options` corrente


## Fancybox integration

FileUploader can be integrated with [Fancybox (v. 3)](https://www.fancyapps.com/fancybox/3/), simply setting
the `fancybox` option to `true`.

Fancybox application files are not loaded by FileUploader and have to be present in the HTML page before FileUploader loads.

Fancybox is applied only to previously registered images.


## Ricette

### Controllo caricamento completato

Appena un elemento viene aggiunto all'uploader, viene inviata la richiesta Ajax al server per la registrazione del file. A operazione completata, il server restituisce il json con i dati del file registrati, come indicato nei punti precedenti.

Dal momento in cui la richiesta viene inviata e fino a quando il server non risponde, l'utente può comunque effettuare il submit del form, ma in questo caso non saranno presenti tutti gli elementi hidden relativi al file che non verrà quindi registrato.

Per evitare questo problema, si può attivare l'opzione `disable_submit` che disabilita il pulsante *Submit* del form finché il server non ha inviato la sua risposta.

Questa opzione non è comunque sufficiente a garantire che siano evitati problemi di questo tipo (in alcuni casi, l'utente potrebbe effettuare il submit con il tasto Invio), ed è inoltre possibile che altre impostazioni riabilitino il pulsante indipendentemente dall'esito dell'upload.

La soluzione più sicura è quindi bloccare il submit se sono presenti elementi con classe `fupl-is-uploading`, classe assegnato ad ogni nuovo elemento aggiunto all'uploader ed eliminata a caricamento completato:

```javascript
let myForm = document.getElementById('myForm');
myForm.addEventListener('submit', () => {
    if(myForm.querySelectorAll('.fupl-is-uploading').length) {
        alert('Caricamento non completato');
        return false;
    }
});
```

Se FileUploader è usato in più pagine, possibile impostare un controllo centralizzato su tutti gli elementi form:

```javascript
document.querySelectorAll('form').forEach( this_form => {
    this_form.addEventListener('submit', () => {
        if(this_form.querySelectorAll('.fupl-is-uploading').length) {
            alert('Devi attendere che il caricamento delle immagini sia completato');
            return false;
        }
    });
});
```

Utilizzando jQuery:

```javascript
$('form').each(function() {
    $(this).submit(function() {
        if($('.fupl-is-uploading', this).length) {
            alert('Devi attendere che il caricamento delle immagini sia completato');
            return false;
        }
    });
});

```

### Blocco browser non compatibili

Per impedire il submit dei form nei browser non compatibili (jQuery):

```js

FileUploader2.init({
  
  [...]

  // aggiunge la classe 'unsuitable_browser' 
  // e rimuove il pulsante submit, ma non impedisce il submit del form
  unsuitable_browser_callback: function () {
    $('[data-file-uploader]')
      .closest('form')
        .addClass('unsuitable_browser')
        .find(':submit').each( function() {
          $(this).replaceWith( '<div class="alert alert-danger my-4">Stai usando un browser non compatibile</div>' );
        });
  }

});

// impedisce il submit del form
$('form').each(function() {
    
  $(this).submit(function() {

    if($(this).hasClass('unsuitable_browser')) {
      alert("Stai utilizzando un browser non compatibile. Impossibile caricare le immagini");
      return false;
    }
  });
});
```

### Controllo contenuti `required`

Dato che è possibile caricare contenuti tramite *Drag&Drop*, non è possibile utilizzare il controllo nativo del browser che utilizza l'attributo `required` del campo file.

Questo controllo può però essere effettuato utilizzando gli attributi `data` aggiunti dinamicamente all'elemento `.fupl-wrapper` dell'uploader: `data-required="true"` e `data-has-values="true|false"`.

Quindi, se per controllare la presenza di un contenuto per l'elemento `#my-uploader` sarebbe sufficiente verificare questa condizione:

```javascript
document.getElementById('mio-uploader')
    .closest('.fupl-wrapper:not([disabled])[data-required="true"][data-has-values="true"]') !== null
```

Oppure, per effettuare un controllo generale su tutto il form:

```javascript
document.querySelectorAll('.fupl-wrapper:not([disabled])[data-required="true"][data-has-values="false"]').length === 0
```


## Riferimenti (e ispirazioni)
- <https://css-tricks.com/drag-and-drop-file-uploading/>
- <https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/>
- <https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Limiting_the_size_of_a_file_before_its_upload>
- <https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/>
- <https://codepen.io/therealDaze/pen/ZaoErp>
- <https://github.com/gridstack/gridstack.js>
- <https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API>
- <https://www.html5rocks.com/en/tutorials/dnd/basics/>
- <https://kryogenix.org/code/browser/custom-drag-image.html>
