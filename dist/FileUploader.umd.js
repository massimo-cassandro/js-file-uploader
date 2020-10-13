(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FileUploader = {}));
}(this, (function (exports) { 'use strict';

  const fupl_strings_it = {

    // Mustache-like placeholders will be replaced with corresponding values

    alert_unsuitable_browser: 'Il tuo browser non ha tutte le funzionalità richieste ' +
      'da questa applicazione.\n' +
      'Utilizza la versione più recente di Firefox, Edge, Safari, Opera o Chrome',

    alert_too_much_files: 'Puoi selezionare un solo file!', // tentativo di trascinare più file con uploader singolo
    alert_xhr_error: 'Si &egrave; verificato un errore nel caricamento del file “<strong>{{file_name}}</strong>”.', // errore ajax
    alert_file_format_error: 'Il file “<strong>{{file_name}}</strong>” è di un formato non consentito',
    alert_file_size_error: 'Le dimensioni di “<strong>{{file_name}}</strong>” ({{file_size}}) '+
      'superano il valore massimo consentito ({{allowed_size}})',

    // images sizes alerts
    alert_img_err_start_string: 'L\'immagine “<strong>{{file_name}}</strong>” non è corretta:',
    alert_img_exact_width_err: 'Larghezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_min_width_err: 'Larghezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_max_width_err: 'Larghezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_exact_height_err: 'Altezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_min_height_err: 'Altezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_max_height_err: 'Altezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_ratio_err: 'La proporzione tra base e altezza dell\'immagine non corrisponde a quella richiesta ({{aspect_ratio}})',

    no_img_test: 'Nessuna immagine presente',
    no_doc_test: 'Nessun file presente',
    remove_btn_text: 'Elimina questo file',

    // info text strings
    info_text_std_imgs : 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> o <strong>WEBP</strong>',
    info_text_imgs_svg : 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong>, <strong>WEBP</strong> o <strong>SVG</strong>',
    info_text_imgs_svg_size_info_text: '<strong>Solo immagini non SVG:</strong> ',
    info_text_img_optimize_info: 'Ottimizza le tue immagini prima di caricarle. ' +
      '<a href="https://squoosh.app/" target="_blank">Squoosh</a> è un ottimo (e gratuito) ' +
      'strumento per farlo.',
    info_text_svg_optimize_info: 'È consigliabile ottimizzare i file SVG prima del caricamento, ' +
      'ad esempio tramite <a href="https://jakearchibald.github.io/svgomg/" target="_blank">SVGO</a>',
    info_text_img_fixed_size: 'dimensioni: <strong>{{img_w}}&times;{{img_h}}px</strong>',
    info_text_img_equal_min_size: 'larghezza e altezza non inferiori a <strong>{{img_min_w}}px</strong>',
    info_text_img_equal_max_size: 'larghezza e altezza non superiori a <strong>{{img_max_w}}px</strong>',
    info_text_img_fixed_width : 'larghezza <strong>{{img_w}}px</strong>',
    info_text_img_fixed_height : 'altezza <strong>{{img_h}}px</strong>',
    info_text_img_width_range: 'larghezza compresa tra <strong>{{img_min_w}}px</strong> e <strong>{{img_max_w}}px</strong>',
    info_text_img_min_width: 'larghezza non inferiore a <strong>{{img_min_w}}px</strong>',
    info_text_img_max_width: 'larghezza non superiore a <strong>{{img_max_w}}px</strong>',
    info_text_img_height_range: 'altezza compresa tra <strong>{{img_min_h}}px</strong> e <strong>{{img_max_h}}px</strong>',
    info_text_img_min_height: 'altezza non inferiore a <strong>{{img_min_h}}px</strong>',
    info_text_img_max_height: 'altezza non superiore a <strong>{{img_max_h}}px</strong>',
    info_text_pdf_file: 'file in formato <strong>PDF</strong>',
    info_text_svg_file: 'immagini in formato <strong>SVG</strong>',
    info_text_max_filesize: 'max <strong>{{max_filesize}}</strong>',
    info_text_img_aspect_ratio: 'Il rapporto tra base e altezza dell\'immagine deve essere esattamente pari a <strong>{{img_aspect_ratio}}</strong>',

    // select or drag labels
    img_single_select_text   : 'Seleziona un\'immagine',
    img_single_drag_text     : '&hellip;oppure trascinala qui',
    img_multiple_select_text : 'Seleziona una o pi&ugrave; immagini',
    img_multiple_drag_text   : '&hellip;oppure trascinale qui',
    doc_single_select_text   : 'Seleziona un documento',
    doc_single_drag_text     : '&hellip;oppure trascinalo qui',
    doc_multiple_select_text : 'Seleziona uno o pi&ugrave; documenti',
    doc_multiple_drag_text   : '&hellip;oppure trascinali qui',

    sortable_icon_title_text: 'Trascina per cambiare l\'ordinamento'
  };

  const default_options = {

    // server side script url
    uploader_url: null,

    silent_degradation: false,

    //function called when an unsuitable browser is detected
    unsuitable_browser_callback: null,

    // locales for numbers parsing
    locales: 'it-IT',

    // ff true, console shows informations about current FileUploader Configuration
    debug: false,

    // disabled state
    disabled: false,

    // error messages interface
    alert_api: (mes, opts, type = 'error') => {  // eslint-disable-line
      window.alert(mes.replace(/(<([^>]+)>)/ig, '' ));
    },

    // types of selectable files. the value must match one of the `upl.mimetypes` arrays
    filetype: 'auto',

    // string of extensions or mimetypes separated by commas
    accept: null,

    // ability to upload multiple files.
    multiple: false,

    // set the FileUploder as required
    required: false,

    // disables FileUploader submit button of the parent form element while
    // FileUploader is performing an upload.
    disable_submit: false,

    // HTML templates
    template_main: '<div class="fupl-result"></div>' +
      '<div class="fupl-panel">' +
        '<div class="fupl-button">' +
          '<label><input type="file"></label>' +
          '<div class="fupl-dd-text"></div>' +
        '</div>' +
        '<div class="fupl-info-text"></div>' +
      '</div>',

    template_empty_img: '<div class="fupl-result-empty text-muted small font-italic">{{no_img_text}}}}</div>',
    template_empty_doc: '<div class="fupl-result-empty text-muted small font-italic">{{no_doc_text}}</div>',

    // template of trigger for removing files
    // This markup will be placed inside the `.fupl-remove` element,
    // that must be present in the template of each FileUploader item
    // It must be a button element
    template_remove_btn: '<button type="button" class="close fupl-remove-trigger" aria-label="{{remove_btn_text}}" title="{{remove_btn_text}}">' +
        '<span aria-hidden="true">&times;</span>' +
      '</button>',

    // Markup to show uploading progress
    template_loading_element: '<div class="fupl-loading"><progress class="fupl-progress" max=100 value=0></progress></div>',

    //  Alternative loading feedback, used if progress.lengthComputable == false.
    //  In this case and if the `alternative_loading_func` function is not present,
    //  this string replaces the `.fupl-progress` element.
    template_alternative_loading_element: '<div class="spinner-grow text-primary" role="status">' +
      '<span class="sr-only">Loading...</span></div',

    // items templates, if tag <a> is used, avoid `href` attribute
    template_img_item_single: '<div class="fupl-item">' +
        '<div class="fupl-remove"></div>' +
        '<img alt="Immagine caricata" class="img-fluid fupl-img">' +
        '<div class="fupl-file-info">' +
          '<div class="text-truncate fupl-file-name"></div>' +
          '<div class="fupl-file-size"></div>' +
          '<div class="fupl-extra-fields"></div>' +
        '</div>' +
      '</div>',

    template_img_item_multiple: '<div class="fupl-item">' +
        '<div class="fupl-remove"></div>' +
        '<div class="fupl-img-wrapper">' +
          '<img alt="Immagine caricata" class="img-fluid fupl-img" draggable="false">' +
        '</div>' +
        '<div class="fupl-file-info">' +
          '<div class="text-truncate fupl-file-name"></div>' +
          '<div class="fupl-file-size"></div>' +
        '</div>' +
        '<div class="fupl-extra-fields"></div>' +
        '<div class="fupl-sortable-icon"></div>' +
      '</div>',

    template_doc_item_single: '<div class="fupl-item">' +
      '<div class="fupl-doc-wrapper">' +
        '<div class="fupl-remove"></div>' +
        '<div class="fupl-doc text-truncate">' +
          '<a class="text-truncate fupl-file-name fupl-url" draggable="false"></a>' +
        '</div>' +
      '</div>' +
      '<div class="small ml-1 text-nowrap fupl-file-size"></div>' +
      '<div class="fupl-extra-fields"></div>' +
      '<div class="fupl-sortable-icon"></div>' +
    '</div>',

    template_doc_item_multiple: null, // uses single doc templates

    // Extra classes to be added to the FileUploader wrapper element (classes names separated by spaces)
    wrapper_extra_class: null,

    // Class(es) to be added to the FileUploader element when a file is dragged there from desktop
    element_dragover_class: 'fupl-is-dragover',

    // If true a legend tag will be added inside the the FileUploader wrapper (fieldset)
    // It will be filled with the text of the label of the input[file] tag (if present)
    // or with the uploader_legend_text parameter content
    uploader_legend: true,

    // Text of legend element (alternative to original label text)
    uploader_legend_text: null,

    // Class to be added to uploader_legend element
    uploader_legend_class: null,

    // classes to be added to the label of the generated nput[file] tag
    input_label_class: 'btn btn-outline-primary btn-sm',

    // show the information text on accepted formats, image size, etc.
    show_info_text: true,

    // show images optimization tips
    show_optimize_info: true,

    // strings added to the beginning and end of the generated info text
    info_text_wrap_string: ['(', ')'],

    // String used to join the various parts of the generated info text
    info_text_join_string: ' - ',

    // Custom info text. If present, replaces the generated info text
    custom_info_text: null,

    // help text. If present, is added after the info_text or custom_info_text
    help_text: null,

    // Images settings (only for filetype == 'img')
    img_w            : null,
    img_h            : null,
    img_min_w        : null,
    img_min_h        : null,
    img_max_w        : null,
    img_max_h        : null,
    img_aspect_ratio : null,

    // Aspect Ratio accuracy
    aspect_ratio_accuracy: 2,

    // Maximum size (weight) of the image
    max_filesize: null,

    // Prefix of the variable used to send the data to the server.
    varname: 'file',

    // Prefix of the variable used to send the data to the server,
    registered_extra_field_varname: null,

    // Function called after the initialization of each FileUploader element.
    init_callback: null,

    // Function called each time a file upload begins
    upload_start_callback: null,

    // Function called each time a file has been uploaded
    upload_complete_callback: null,

    // Alternative upload progress function (see alternative_loading_element parameter)
    alternative_loading_func: null,

    // JSON array of preregistered element
    values: [],

    // varname use for deleted file generated hidden fields
    delete_varname: 'elimina_file[]',

    // activates fancybox integration
    fancybox: false,

    // markup of <a> tag to wrap image tags when fancybox option is true
    fancybox_anchor_markup: '<a class="fupl-url" data-fancybox="fupl-gallery"></a>',

    // optional function to be called after fancybox markup is applied
    fancybox_callback_func: null,

    // ========================================
    // SORTABLE OPTIONS
    // ========================================
    // Enable the ability to rearrange items by dragging them.
    sortable: false,

    // sortable hidden item varname
    sortable_varname: 'fupl_order',

    // markup for dragging icon
    sortable_icon: '<div title="{{sortable_icon_title_text}}></div>',

    // ========================================
    // EXTRA FIELDS
    // ========================================
    // Markup to be added at the end of every uploaded item.
    extra_fields: null
  };

  const fupl_utilities = {

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

    set_has_values: fupl_options => {
      let items = fupl_options.istance_result_wrapper.querySelectorAll('.fupl-item').length;
      fupl_options.wrapper.dataset.hasValues = items? 'true' : 'false';
      if(!items) {
        fupl_options.istance_result_wrapper.innerHTML = fupl_options.templates.no_file[fupl_options._type];
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

  function createUploader(fupl) {

    try {

      // check for input[file] and label elements
      let _input = fupl.opts.element.querySelector('input[type="file"]'),
        original_label = fupl.opts.element.querySelector('label');
  console.log(fupl.opts.element);

      // parsing `accept` parameter and attribute, if exist
      if( fupl.opts.filetype === 'auto' ) {

        let accept_attr = [],
          accept_params = [];

        if( fupl.opts.accept !== null ) {
          accept_params = fupl.opts.accept
            .split(',').map( item => item.trim() );
        }

        if(_input && _input.getAttribute('accept') ) {
          accept_attr = _input.getAttribute('accept')
            .split(',').map( item => item.trim() );
        }

        // https://www.peterbe.com/plog/merge-two-arrays-without-duplicates-in-javascript
        fupl.opts.accept = [...new Set([...accept_params, ...accept_attr])];

      } else {
        fupl.opts.accept = fupl_utilities.mimetypes[fupl.opts.filetype];
      }

      // `max_filesize` parsing
      let max_filesize = fupl_utilities.parse_max_filesize(fupl.opts.max_filesize, fupl.opts.locales);
      if( max_filesize === false ) {
        throw new Error( `FileUploader: incorrect value for “max_filesize” parameter (${fupl.opts.max_filesize})`);
      } else {
        fupl.opts.max_filesize = max_filesize;
      }

      // `multiple` parameter or attribute
      fupl.opts.multiple = Boolean(fupl.opts.multiple || (_input && _input.hasAttribute('multiple') ));

      // `required` parameter or attribute
      fupl.opts.required = Boolean(fupl.opts.required || (_input && _input.hasAttribute('required') ));

      // `disabled` parameter or attribute
      fupl.opts.disabled = Boolean(fupl.opts.disabled || (_input && _input.hasAttribute('disabled') ));


      // uploader mode and type
      fupl.opts._type = ['img', 'svg', 'img+svg'].indexOf(fupl.opts.filetype) !== -1? 'img' : 'doc';
      fupl.opts._mode = fupl.opts.multiple? 'multiple' : 'single';

      // label text (from element of `uploader_legend_text` parameter)
      if( !fupl.opts.uploader_legend_text && original_label) {
        fupl.opts.uploader_legend_text = original_label.innerHTML;
      }
      // label not set
      if ( !fupl.opts.uploader_legend_text ) {
        fupl.opts.uploader_legend_text = '__legend not present__';
      }

      // main class is added to FileUploader element
      fupl.opts.element.classList.add('fupl');

      // wrapper
      fupl.opts.wrapper = document.createElement('fieldset');
      fupl.opts.element.parentNode.insertBefore(fupl.opts.wrapper, fupl.opts.element);
      fupl.opts.wrapper.appendChild(fupl.opts.element);
      fupl.opts.wrapper.classList.add('fupl-wrapper');
      fupl.opts.wrapper.classList.add('fupl-type-' + fupl.opts._type );
      if(fupl.opts.multiple) {
        fupl.opts.wrapper.classList.add('fupl-multiple');
      }
      // custom classes
      if( fupl.opts.wrapper_extra_class ) {
        fupl.opts.wrapper.classList.add( ...fupl.opts.wrapper_extra_class.split(' ') );
      }

      // uploader legend
      if( fupl.opts.uploader_legend ) {
        let _class = ['fupl-legend'];
        if( fupl.opts.uploader_legend_class ) {
          _class.push(fupl.opts.uploader_legend_class);
        }
        if( fupl.opts.required ) {
          _class.push('required');
        }

        fupl.opts.element.insertAdjacentHTML('beforebegin',
          '<legend' + (_class.length? ' class="' + _class.join(' ') + '"' : '') + '>' +
            fupl.opts.uploader_legend_text +
          '</legend>'
        );
        fupl.opts.wrapper.classList.add( 'fupl-has-legend' );
      }

      // uploader template
      fupl.opts.element.innerHTML = fupl.opts.template_main;

      fupl.opts.istance_input = fupl.opts.element.querySelector('.fupl-panel input[type="file"]');
      fupl.opts.istance_label = fupl.opts.element.querySelector('.fupl-panel label');
      fupl.opts.istance_dd_text = fupl.opts.element.querySelector('.fupl-panel .fupl-dd-text');
      fupl.opts.istance_info_text = fupl.opts.element.querySelector('.fupl-panel .fupl-info-text');
      fupl.opts.istance_result_wrapper = fupl.opts.element.querySelector('.fupl-result');


      // inserting text and attributes
      // if( fupl.opts.required ) {
      //   fupl.opts.istance_input.setAttribute('required', '');
      // }
      if( fupl.opts.multiple ) {
        fupl.opts.istance_input.setAttribute('multiple', '');
      }
      if( fupl.opts.accept !== null ) {
        fupl.opts.istance_input.setAttribute('accept', fupl.opts.accept.join(','));
      }

      // adding data-required attribute to wrapper
      if( fupl.opts.required ) {
        fupl.opts.wrapper.dataset.required = 'true';
      }

      // adding data-disabled attribute to wrapper
      if( fupl.opts.disabled ) {
        fupl.opts.wrapper.setAttribute('disabled', true);
        fupl.opts.wrapper.setAttribute('aria-disabled', true);
      }


      fupl.opts.istance_label.insertAdjacentHTML('beforeend',
        fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_select_text`]
      );
      if(fupl.opts.input_label_class) {
        fupl.opts.istance_label.classList.add(...fupl.opts.input_label_class.split(' '));
      }
      fupl.opts.istance_dd_text.innerHTML = fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_drag_text`];



      // info text
      if( fupl.opts.show_info_text ) {
        if(fupl.opts.custom_info_text) {
          fupl.opts.istance_info_text.innerHTML = fupl.opts.custom_info_text;
        } else {
  //TODO
          // fupl.opts.istance_info_text.innerHTML = fupl_utilities.create_info_text(fupl);
        }

        if(fupl.opts.help_text) {
          fupl.opts.istance_info_text.insertAdjacentHTML('beforeend',
            `<div class="fupl-help-text">${fupl.opts.help_text}</div>`
          );
        }
      }


      // Sortable
      if( fupl.opts.sortable) {
        if( fupl.opts.multiple && fupl.opts.sortable_varname ) {

  //TODO
          // upl.activateSortable(fupl.opts);

        } else {
          throw new Error('FileUploader: incorrect “sortable” settings:\n' +
            `"sortable": ${fupl.opts.sortable? 'true' : 'false'}\n` +
            `"multiple": ${fupl.opts.multiple? 'true' : 'false'}\n` +
            `"sortable_varname": "${fupl.opts.sortable_varname}"`
          );
        }

      }

      // adding registered values
      // fupl.opts.values must be an array of objects
      // is it is a single object, it is wrapped in an array
      if(fupl.opts.values) {
        if(typeof fupl.opts.values === 'object') {
          if(!Array.isArray(fupl.opts.values)) {
            fupl.opts.values = [fupl.opts.values];
          }
        } else {
          throw new Error('FileUploader: incorrect “values” parameter');
        }
      }

  //TODO
  /*
      if( fupl.opts.values && fupl.opts.values.length ) {

        fupl.opts.values.forEach( item => {
          upl.createItem(item, fupl.opts, true); // true means that the element comes from the server
        });

      }
      upl.set_has_values(fupl.opts);

      // gestione aggiunta nuovi elementi
      upl.setListeners(fupl.opts);


      // calling init_callback, if present
      if( fupl.opts.init_callback !== null ) {
        upl.exec_callback(fupl.opts.init_callback, fupl.opts);
      }

      // calling fancybox_callback_func, if present
      if( fupl.opts.fancybox && fupl.opts.fancybox_callback_func !== null ) {
        upl.exec_callback(fupl.opts.fancybox_callback_func, fupl.opts);
      }
  */

      //debug
      if( fupl.opts.debug ) {
        /* eslint-disable */
        /* console.groupCollapsed('FileUploader options');
          // creazione di un oggetto bidimensinale per
          // semplificare la rappresentazione in tabella
          let c_options = {},
          c_keys = Object.keys(fupl.opts);
          c_keys.sort();
          c_keys.forEach(item => {
            let _toStringify = typeof fupl.opts[item] === 'object' &&
            fupl.opts[item] !== null &&
              item !== 'element';
            c_options[item] = _toStringify ? JSON.stringify(fupl.opts[item], null, ' ') : fupl.opts[item];
          });
          console.table(c_options);
          console.groupCollapsed('fupl.opts');
            console.log(fupl.opts);
          console.groupEnd();
        console.groupEnd();
        */

        console.groupCollapsed('FileUploader options');
          console.log(fupl.opts);
        console.groupEnd();

        /* eslint-enable */
      } // end if debug

    } catch(e) { //throw "error"
      console.error( e ); // eslint-disable-line
    } // finally {}

  } // end createUploader

  function fupl_init(fupl) {

    // browser check
    if( !fupl_utilities.isSuitableBrowser() ) {
      if(!fupl.opts.silent_degradation) {
        alert( fupl.strs.alert_unsuitable_browser );
      }
      if( fupl.opts.unsuitable_browser_callback ) {
        fupl_utilities.exec_callback( fupl.opts.unsuitable_browser_callback );
      }
      return;
    }

    // CSS loading
    if(fupl.css) {
      document.head.insertAdjacentHTML('beforeend',
        '<link rel="stylesheet" href="' + fupl.css + '" type="text/css" media="all">'
      );
    }

    // `fupl.selector` elements are selected and JSFileUploader is started
    // each element has its own options which merge with `fupl.opts`
    document.querySelectorAll(fupl.selector).forEach( upl_element => {

      /*
        merge of global options and instance ones
        instance options may be loaded
        * as single data elemenys (i.e. data-filetype="img"),
          each data attribute corresponds to an item of the `default_options` array

        * as `[data-file-uploader]` json value (i.e data-file-uploader='{"filetype":"img"}')
          json has the same structure of the `default_options` array

        instance options overwrites global ones (fupl.opts)
        single data attributes overwrites json items
      */

      let all_data_params = Object.assign({}, upl_element.dataset);

      // the fileUploader element contains json data and is parsed separately
      delete all_data_params.fileUploader;

      let istance_opts = Object.assign(
        {},
        fupl.opts,
        JSON.parse(upl_element.dataset.fileUploader || '{}' ),
        all_data_params
      );

      // the element itself is added to `istance_options`:
      istance_opts.element = upl_element;

      // last check and fileuploader starting
      try {
        //  uploader remote url can't be null
        if( !istance_opts.uploader_url ) {
          throw new Error( 'FileUploader: missing `uploader_url` parameter' );
        }

        // filetype parameter check
        istance_opts.filetype = istance_opts.filetype.toLowerCase();

        // aspect_ratio_accuracy
        istance_opts.aspect_ratio_accuracy = 10 ** +istance_opts.aspect_ratio_accuracy;

        // img+svg key aliases
        if(['svg+img', 'img-svg', 'svg-img'].indexOf(istance_opts.filetype) !== -1) {
          istance_opts.filetype = 'img+svg';
        }
        if( Object.keys( fupl_utilities.mimetypes ).indexOf(istance_opts.filetype) === -1 ) {
          throw new Error( 'FileUploader: incorrect `filetype` parameter' );
        }
      } catch(e) {
        console.error( e );// eslint-disable-line
      }

      // these parameters must be arrays but can retrieved as strings from data attributes
      const json_params = [
        'input_text',
        'templates',
        'info_text_wrap_string',
        'values',
        'extra_fields'
      ];


      json_params.forEach(item => {
        try {
          if(typeof istance_opts[item] === 'string' ) {
            istance_opts[item] = JSON.parse(istance_opts[item]);
          }
        } catch(e) {
          console.error(`FileUploader: the “${item}” parameter is not a valid json`); // eslint-disable-line
          console.log(istance_opts.element); // eslint-disable-line
          console.error( e );// eslint-disable-line
        }
      });

      // parsing of all boolean or null parameters
      for(let i in istance_opts) {

        if(typeof istance_opts[i] === 'string' &&
          ['true', 'false', 'null'].indexOf(istance_opts[i].toLowerCase()) !== -1
        ) {
          istance_opts[i] = JSON.parse(istance_opts[i]);
        }
      }

      // aspect ratio is ignored if exact constrains are presents
      if(istance_opts.img_aspect_ratio && istance_opts.img_w && istance_opts.img_h) {
        console.error('FileUploader: the aspect ratio parameter will be ignored, because exact constraints have been set for width and height'); // eslint-disable-line
        istance_opts.img_aspect_ratio = null;
      }

      // aspect ratio parsing
      istance_opts.parsed_img_aspect_ratio = null;
      if(istance_opts.img_aspect_ratio) {

        try {
          if(isNaN(istance_opts.img_aspect_ratio)) {
            let w,h;
            if(istance_opts.img_aspect_ratio.indexOf('/') !== -1) {
              [w,h] = istance_opts.img_aspect_ratio.split('/');
            } else if (istance_opts.img_aspect_ratio.indexOf(':') !== -1) {
              [w,h] = istance_opts.img_aspect_ratio.split(':');
            }

            if( w && h ) {
              istance_opts.parsed_img_aspect_ratio = +w/+h;
            } else {
              istance_opts.parsed_img_aspect_ratio = Number(istance_opts.img_aspect_ratio);
            }

          } else {
            istance_opts.parsed_img_aspect_ratio = +istance_opts.img_aspect_ratio;
          }

          if(istance_opts.parsed_img_aspect_ratio) {
            istance_opts.parsed_img_aspect_ratio = Math.round((istance_opts.parsed_img_aspect_ratio + Number.EPSILON) * istance_opts.aspect_ratio_accuracy) / istance_opts.aspect_ratio_accuracy;
          }

          if(isNaN(istance_opts.parsed_img_aspect_ratio) || !istance_opts.parsed_img_aspect_ratio) {
            throw new Error();
          }
        } catch(e) {
          console.error(`FileUploader: incorrect aspect ratio parameter → ${istance_opts.img_aspect_ratio}`); // eslint-disable-line
          istance_opts.img_aspect_ratio = null;
          istance_opts.parsed_img_aspect_ratio = null;
        }
      }

      // calling the createUploader function. Global options are completely overwritten
      // by istance_opts
      new createUploader({
        strs: fupl.strs,
        opts: istance_opts
      });

    }); // end document.querySelectorAll(fupl.selector).forEach

  }

  /*!@preserve
   *
   * FileUploader 2
   * HTML5 / JS Async Uploader
   * Massimo Cassandro 2017-2020
   *
   */

  function FileUploader( params ) {

    /*
    params obj => {
      selector    : [string] selector of fileuploader elements
      options     : [object] custom options
      css         : [string] css url
      local_strs  : [object] localized strings
    }
    */

    fupl_init({
      selector : params.selector || '[data-file-uploader]',
      opts     : Object.assign( {}, default_options, params.options || {} ),
      css      : params.css || null,
      strs     : Object.assign( {}, fupl_strings_it, params.local_strs || {} ),
    });
  }

  exports.FileUploader = FileUploader;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
