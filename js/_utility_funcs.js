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

      if(!Number.isInteger(feedback_size)) {
        feedback_size = feedback_size.toFixed(1);
      }

      return {
        //'original_value': filesize_value,
        //'unit'         : unit,
        'maxbytes'     : maxbytes,
        'feedback_size': feedback_size.toLocaleString(locales) + '&nbsp;' + unit
      };

    } else {
      return null;
    }
  };

  return upl;

})(FileUploader2 || {});
