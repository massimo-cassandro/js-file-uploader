# JS FileUploader

**HTML5 + Javascript asyncronous file upload.**
*v. 1 - Massimo Cassandro - (c) 2017/2019*

Fileuploader automates and simplifies uploading files to HTML pages.

Uploads are performed asynchronously via an Ajax call to a server-side script that must register the file and return a JSON string.

Although the default settings are based on Bootstrap 4, FileUploader is entirely and easily configurable from scratch and can be adapted to any layout.

Similarly, all the string messages can be customized using the desired language. Look at the [\_set\_options.js](js/_set_options.js) file for a complete list of all available parameters.


## Browser compatibility
FileUploader needs a modern browser and is not compatible with Internet Explorer.
Also requires Edge 16 or higher.

If the browser is not compatible, an *alert* window is showed and FileUploader stops. The message shown is the one indicated in the `alert_messages.unsuitable_browser`parameter

However, it is possible to silently degrade FileUploader and use the browser standard `input[type="file"]` tag.

To perform this option, you need to:

* set `silent_degradation` option to *true* (default is *false*);
* provide a fallback input tag inside the FileUploader element;
* set a fallback init function if necessary (`unsuitable_browser_callback` parameter). This can be useuful to activate specific fallback  behaviours;
* add the `enctype` attribute to your form (FileUploader doesn't need it)
* provide the necessary server side scripting. Very likely, the script to be used in this situation differs from the one used in the Ajax procedure.

Take a look at the [silent degradation demo](demo/silent_degradation_sample.html).


## Installation

FileUploader can be installed thru npm:

```bash
npm i --save js-file-uploader
```

## Using FileUploader

Once `file_uploader-min.js` has been added to your HTML page, FileUploader must be started setting up some parameters using the `init` function.

Minimal setup:

```html
<script src="file_uploader-min.js"></script>
```

```javascript
FileUploader.init({
  uploader_url   : 'path/to/server/script'
});
```
The argument of`init is an object that sets some parameters. A complete list of them is described in [\_set\_options.js](js/_set_options.js) file.

Once initialized, FileUploader is applied to all element with the `data-file-uploader` attribute:

--
![](readme_files/uploader_std.png)
--

The `demo` folder contains several FileUploader examples.

> NB: The default selector is `data-file-uploader`, but, if necessary, the` file-uploader` part can be replaced with any string (with *dataset* compatible syntax, see <https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset>) using the `fupl_selector` option:

```javascript
FileUploader.init({
  uploader_url   : 'path/to/server/script',
  fupl_selector  : 'my-uploader'
});
```


### Markup
To activate FileUploader, this minimum markup is required:

```html
<div data-file-uploader></div>
```

FileUploader will be activated with the global parameters defined in [\_set\_options.js](js/_set_options.js) and in `FileUploader.init` argument.

However, it is possible to customize each individual instance using data attributes matching the same global parameters.

For example, if you want to use a specific server-side script (different from the globally defined one) for a specific instance, you can indicate it this way:

```html
<div data-file-uploader data-uploader_url="path/to/alternate/server/script"></div>
```
You can also define parameters using a json string to be assigned directly to `data-file-uploader` attribute:

```html
<div data-file-uploader='{"uploader_url": "path/to/alternate/server/script"}'></div>
```

> Note that some parameters, such as `css`, make sense only if defined globally.

Finally, it is possible to insert a `input type="file"]` field inside the `data-file-uploader` element, as a fallback for older browsers (see the **Browser compatibility** paragraph). 

If FileUploader starts correctly, the input field is removed, otherwise it can be used as a standard HTML field.

To simplify configuration, all attributes of input file (multiple, required, accept, disabled) are passed to FileUploader, so you haven't to set it twice.

For example, to activate the `multiple` option, you can define it using the `data-multiple="true"` attribute in the FileUploader element, or adding the `multiple` attribute to the `input type="file"]` element (if present).

In case of conflict, generally, the last element prevails (see **Parameters setting** paragraph).

```html
<div data-file-uploader>
    <input type="file" name="fallback">
</div>
```


### CSS

The default css file is based on Bootstrap 4 (not included), but you can change it, even changing, if necessary, the generated markup, through the `templates` parameter (see [\_set\_options.js](js/_set_options js)).

It is also possible to include the FileUploader css in your project style sheets; in this case it is sufficient to set the `css` parameter to `null` (the default value).

> **All changes must take care to preserve the class names prefixed with `fupl-`.**


### Parameters setting

FileUploader configuration is based on parameters defined in [\_set\_options.js](js/_set_options.js).

The parameters can be overridden according to this cascading sequence:

* Values of `_set_options.js` file are the default ones
* Parameters assigned in `FileUploader.init` override the default ones, and are valid for all the FileUploader elements involved
* Parameters assigned to each FileUploader instance prevail and override the previous ones: in this way it is possible to have different behaviors also on the same page.

Infine, se è presente un campo `input[type="file"]` all'interno dell'elemento FileUploader, gli eventuali attributi `accept`, `required`, `multiple` o `disabled` presenti vengono presi in considerazione nella configurazione.

Ad esempio è possibile impostare un Uploader come *required* sia impostando il parametro `required = true` sia utilizzando l'attributo `required` del campo file.

>NB: if the `required`,` multiple` or `disabled` parameters are set to `true` in the FileUploader instance, it is not possible to set them to `false` via the input field attributes.


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


## Customization

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


## Recipes

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

FileUploader.init({
  
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


## References (and inspirations)
- <https://css-tricks.com/drag-and-drop-file-uploading/>
- <https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/>
- <https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Limiting_the_size_of_a_file_before_its_upload>
- <https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/>
- <https://codepen.io/therealDaze/pen/ZaoErp>
- <https://github.com/gridstack/gridstack.js>
- <https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API>
- <https://www.html5rocks.com/en/tutorials/dnd/basics/>
- <https://kryogenix.org/code/browser/custom-drag-image.html>
