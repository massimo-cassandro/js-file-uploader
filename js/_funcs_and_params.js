/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  // mimetypes ed estensioni accettabili in base al parametro `filetype`.
  // Il parametro `auto` accetta tutti i tipi di file (salvo eventuali limitazioni
  // aggiunte tramite parametro e attributo `accept`)
  upl.mimetypes = {
    auto : null,
    img  : ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
            '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],
    pdf  : ['application/pdf', '.pdf']
  };

  // nomi degli attributi data utilizzati per controllare alcuni stati o eventi dell'uploader
  upl.data_attributes = {
    fupl_selector : 'file_uploader2', // nome dell'attributo data usato come selector (e acui si possonoa ssociare delle opzioni json)
    required      : 'required', // true se il caricamento del file è obbligatorio
    hasValues     : 'hasValues', // true se l'uploader congtiene dei file (prergistrati o meno)
    item_id       : 'id' // id dell'elemento aggiunto all'uploader (se preregistrato)
  };

  upl.set_has_values = fupl_options => {
    let items = fupl_options.istance_result_wrapper.querySelectorAll('.fupl-item').length;
    fupl_options.wrapper.dataset[upl.data_attributes.hasValues] = items? 'true' : 'false';
    if(!items) {
      fupl_options.istance_result_wrapper.innerHTML = fupl_options.templates.no_file[fupl_options._type];
    }
  };


  upl.parse_filesize = (bytes, locales) => {
    bytes = +bytes;
    let mega = 1024*1024;
    if(bytes >= mega ) {
      return (bytes/mega).toLocaleString(locales, {maximumFractionDigits: 1}) + '<span class="fupl-unit">MB</span>';
    } else {
      return Math.round(bytes/1024).toLocaleString(locales, {maximumFractionDigits: 0}) + '<span class="fupl-unit">KB</span>';
    }
  };


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
  upl.parse_max_filesize = (filesize_value, locales) =>  {
    // controllo max_filesize ed elaborazione parametro
    if( filesize_value ) {
      var maxbytes, unit, feedback_size;

      if(!isNaN(filesize_value)) { //solo numero, si assume siano KB
        maxbytes = +filesize_value;
        unit = 'KB';
        feedback_size = maxbytes;

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
        'feedback_size': feedback_size.toLocaleString(
          locales, {maximumFractionDigits: (unit === 'KB'? 0 : 1)}
        ) + '<span class="fupl-unit">' + unit + '</span>'
      };

    } else {
      return null;
    }
  };

  return upl;

})(FileUploader2 || {});
