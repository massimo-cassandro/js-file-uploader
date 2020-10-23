export const fupl_utilities = {

  /*
    Mimetypes and extensions allowed according to `filetype` parameter
    The `auto` parameter accepts all file types (except for limitations
    added by `accept` parameter/attribute)
  */
  mimetypes: (() => {
    let mimetypes = {
      auto      : null,
      img       : ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp',
        '.png', '.jpg', '.jpeg', '.pjpg', '.pjpeg', '.gif', '.webp'],
      pdf       : ['application/pdf', '.pdf'],
      svg       : ['image/svg+xml', '.svg', '.svgz']
    };

    mimetypes['img+svg'] = mimetypes['img'].concat(mimetypes['svg']);

    return mimetypes;

  })(),

  /*
    isSuitableBrowser
    Check the browser
    returns `true` or `false`
  */
  isSuitableBrowser: () => {
    // IE
    if( navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident/') > -1 ||
    navigator.userAgent.indexOf('Trident/') > -1 ){
      return false;
    }

    var div = document.createElement( 'div' );
    return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) //TODO rimuovere ondragstart/ondrop (IE)?
      && 'FormData' in window
      && 'FileReader' in window
      && 'fetch' in window;
  },

  set_has_values: fupl => {
    let items = fupl.opts.instance_result_wrapper.querySelectorAll('.fupl-item').length;
    fupl.opts.wrapper.dataset.hasValues = items? 'true' : 'false';
    if(!items) {
      fupl.opts.instance_result_wrapper.innerHTML = fupl.strs[`no_${fupl.opts._type}_text`];
    }
  },

  parse_bytes_value: (bytes, locales) => {
    bytes = +bytes;
    let mega = 1024*1024;
    if(bytes >= mega ) {
      return (bytes/mega).toLocaleString(locales, {maximumFractionDigits: 1}) + '<span class="fupl-unit">MB</span>';

    } else if (bytes < 1024) {
      return Number((bytes/1024).toFixed(2)).toLocaleString(locales, {maximumFractionDigits: 2}) +
        '<span class="fupl-unit">KB</span>';

    } else {
      return Math.round(bytes/1024).toLocaleString(locales, {maximumFractionDigits: 0}) +
        '<span class="fupl-unit">KB</span>';
    }
  },

  /*
   Parse the `max_filesize` parameter (if exists) and returns:
    - `null` if max_filesize === null
    - `false` if `max_filesize` is not a correct value
    - the object `{ maxbytes: 123456, unit: 'KB', feedback_size: '1.2KB'}`
    where
      - `maxbytes` is max_filesize value in bytes
      - `unit` is one of 'KB' and 'MB'
      - `feedback_size` is a textual representation of max_filesize
         for the purpose of providing end user informations
  */
  parse_max_filesize: (filesize_value, locales) =>  {
    // max_filesize checking and parsing
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

      // If unit is KB but value is bigger than 1MB,
      // unit is changed
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
  },

  exec_callback: (callback_function, params) => {
    try {
      if(typeof callback_function === 'string') {

        let cbk_func = window;
        callback_function.split('.').forEach( function(item) {
          cbk_func = cbk_func[item];
        });
        cbk_func(params);

      } else {
        callback_function(params);
      }

    } catch(error) {
      alert(`Error: “${callback_function}” callback function doesn't exist`);
      console.error(error); // eslint-disable-line
    }
  }

};
