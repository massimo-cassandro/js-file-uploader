(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FileUploader = factory());
}(this, (function () { 'use strict';

  const fupl_strings_it = {

    // Mustache-like placeholders will be replaced with corresponding values

    alert_too_much_files: 'Puoi selezionare un solo file!', // tentativo di trascinare più file con uploader singolo
    alert_xhr_error: 'Si &egrave; verificato un errore nel caricamento del file “<strong>{{file_name}}</strong>”.', // errore ajax
    alert_file_format_error: 'Il file “<strong>{{file_name}}</strong>” è di un formato non consentito',
    alert_file_size_error: 'Le dimensioni di “<strong>{{file_name}}</strong>” ({{file_size}}) '+
      'superano il valore massimo consentito ({{allowed_size}})',

    fupl_alert_header: 'Errore',
    fupl_alert_btn_text: 'OK',

    // images sizes alerts
    alert_img_exact_width_err: '<strong>{{file_name}}</strong>: larghezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_min_width_err: '<strong>{{file_name}}</strong>: larghezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_max_width_err: '<strong>{{file_name}}</strong>: larghezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_exact_height_err: '<strong>{{file_name}}</strong>: altezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_min_height_err: '<strong>{{file_name}}</strong>: altezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_max_height_err: '<strong>{{file_name}}</strong>: altezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)',
    alert_img_ratio_err: '<strong>{{file_name}}</strong>: la proporzione tra base e altezza dell’immagine non corrisponde a quella richiesta ({{aspect_ratio}})',

    no_img_text: 'Nessuna immagine presente',
    no_doc_text: 'Nessun file presente',
    remove_btn_text: 'Elimina questo file',

    // info text strings
    info_text_std_imgs : 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> o <strong>WEBP</strong>',
    info_text_imgs_svg : 'immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong>, <strong>WEBP</strong> o <strong>SVG</strong>',
    info_text_imgs_svg_size_info_text: '<strong>Solo per le immagini non SVG:</strong> ',

    info_text_img_optimize_info: 'Per modificare e comprimere le immagini puoi utilizzare <a href="https://www.iloveimg.com/it" target="_blank" rel="noopener noreferrer">I Love IMG</a>.<br>' +
      'Puoi ridurre le dimensioni dei documenti PDF con <a href="https://www.ilovepdf.com/it/comprimere_pdf" target="_blank" rel="noopener noreferrer">I Love PDF</a>.',

    info_text_svg_optimize_info: 'È consigliabile ottimizzare i file SVG prima del caricamento, ' +
      'ad esempio tramite <a href="https://jakearchibald.github.io/svgomg/" target="_blank" rel="noopener noreferrer">SVGO</a>',

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
    info_text_img_aspect_ratio: 'Il rapporto tra base e altezza dell’immagine deve essere esattamente pari a <strong>{{img_aspect_ratio}}</strong>',

    // select or drag labels
    img_single_select_text   : 'Seleziona un’immagine',
    img_single_drag_text     : '&hellip;oppure trascinala qui',
    img_multiple_select_text : 'Seleziona una o pi&ugrave; immagini',
    img_multiple_drag_text   : '&hellip;oppure trascinale qui',
    doc_single_select_text   : 'Seleziona un documento',
    doc_single_drag_text     : '&hellip;oppure trascinalo qui',
    doc_multiple_select_text : 'Seleziona uno o pi&ugrave; documenti',
    doc_multiple_drag_text   : '&hellip;oppure trascinali qui',

    sortable_icon_title_text: 'Trascina per cambiare l’ordinamento'
  };

  /*
    Some options contain Mustache-like variables (e.g.: {{xxx}}) that will be replaced
    with the corresponding values of the localized strings items.

    Variable name (the `xxx` part) must be the same as the string item name

  */

  const default_options = {

    // server side script url
    uploader_url: null,

    // locales for numbers parsing
    locales: 'it-IT',

    // ff true, console shows informations about current FileUploader Configuration
    debug: false,

    // method for ajax request
    ajax_method: 'POST',

    // disabled state
    /*
      If true, it prevents items from being loaded

      The presence of the disabled attribute in the .fupl-wrapper element disables the element
      input [type = file] generated by FileUploader (HTML 5 std behavior) and prevents drag & drop.

      The disabled parameter can also be set via the element attribute
      input [type = file] of fallback, if present.
      Be carefully about changing disabled state of the input field on the fly:
      to have it affect the FileUploader instance, you must also modify the disabled attribute
      of the fieldset.fupl-wrapper element.
    */
    disabled: false,

    // types of selectable files. the value must match one of the `upl.mimetypes` arrays
    filetype: 'auto',

    /*
      String of extensions or mimetypes separated by commas that identify
      alloewd files to be uploaded,
      in addition or replacement of what is set via the `filetype` parameter.

      The `accept` attribute of the input field contained
      in the FileUploader element (if present), performs the same function.

      In both cases, the values are taken into account only if `filetype == 'auto'`

      In the presence of both the `accept` parameter and the `accept` attribute,
      a merge is performed, and the accept attribute takes precedence over the parameter.
      If this parameter is `null`, the` accept` attribute is not present,
      and  `filetype` parameter is `auto` all file types are accepted.

    */
    accept: null,

    /*
      Enable the ability to uploader multiple files.
      This option can also be activated via the `multiple` attribute
      of the `input` field (if present)
    */
    multiple: false,

    /*
      Set the FileUploder as required
      This option can also be activated via the `multiple` attribute
      of the `input` field (if present)
    */
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

    template_empty_img: '<div class="fupl-result-empty text-muted small font-italic">{{no_img_text}}</div>',
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

    // Alternative loading feedback, used if progress.lengthComputable == false.
    // In this case and if the `alternative_loading_func` function is not present,
    // this string replaces the `.fupl-progress` element.
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

    // template for error messages dialog
    // if changed, .fupl-x classes must be maintained
    fupl_alert_template:
      `<div class="fupl-alert-overlay">
      <div class="fupl-alert">
        <div class="fupl-alert-header">{{fupl_alert_header}}</div>
        <div class="fupl-alert-body"></div>
        <div class="fupl-alert-footer">
          <button type="button" class="fupl-alert-btn">{{fupl_alert_btn_text}}</button>
        </div>
      </div>
    </div>`,

    // classes to be added to alert button
    // they can be changed without redefine entire alert template
    // merging is perfomed in the `init` module
    fupl_alert_btn_class: 'btn btn-secondary',


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

    /*
      Images settings (only for filetype == 'img')

      Numeric values that correspond to the pixel dimensions required for the image.
      The img_min_* and img_max_* parameters can be assigned simultaneously,
      but they are ignored if the corresponding exact parameters exist
      (for example, if img_w is present, the parameters img_min_w and img_max_w
      or img_aspect_ratio are not taken into consideration).
      The default value of all parameters is null, which means that they are not applied.
      Aspect ratio must be a number or string in w/h or w:h format or the result of w/h division.
      Aspect ratio values are rounded to three decimal places

        * `img_w`            : exact image width
        * `img_h`            : exact image height
        * `img_min_w`        : min image width
        * `img_min_h`        : min image height
        * `img_max_w`        : max image width
        * `img_max_h`        : max image height
        * `img_aspect_ratio` : aspect ratio w/h value (16/9, 4:3, 0.5, ecc)
    */
    img_w            : null,
    img_h            : null,
    img_min_w        : null,
    img_min_h        : null,
    img_max_w        : null,
    img_max_h        : null,
    img_aspect_ratio : null,

    /*
      Aspect Ratio accuracy.
      It is a number that indicates the decimal numbers to which the image size
      ratio will be rounded for comparison with the `img_aspect_ratio` parameter
    */
    aspect_ratio_accuracy: 2,

    /*
      Maximum size (weight) of the image. It can be a number,
      and in this case it corresponds to a dimension in KB, or a string
      composed of a numeric value and a suffix between ‘KB’ and ‘MB’ (also lowercase).
      If the value is null or if the string is not recognized,
      no limit is applied.
    */
    max_filesize: null,

    /*
      Prefix of the variable used to send the data to the server.
      The value indicates the base name of the generated varname
    */
    varname: 'file',

    /*
      Prefix of the variable used to send the data to the server,
      for extra fields of preregistered files only
      (For compatibility with beta version)
    */
    registered_extra_field_varname: null,

    /*
      Function called after the initialization of each FileUploader element.
      Function is invoked passing the complete `fupl` obj as argument
    */
    init_callback: null,

    /*
      Function called each time a file upload begins.
      Function argument is an object that contains:
        * `item`: current item object, it contains:
            - `id`: element unique id
            - `file`: current filelist object
            - `width` and `height`: null or image dimensions (pixel)
        * `img_preview` : base64 image preview (null if not an image)
        * `fupl`: options & strings of current FileUploader instance
    */
    upload_start_callback: null,

    /*
      Function called each time a file has been uploaded.
        Function argument is an object that contains:
        * `item`: current item object, it contains:
            - `id`: element unique id
            - `file`: current filelist object
            - `width` and `height`: null or image dimensions (pixel)
            - `tmp_file`: name of temporary file saved on the server
        * `server_error`: error message strimg (null if no error occurred)
        * `fupl`: options & strings of current FileUploader instance
    */
    upload_complete_callback: null,

    /*
      Alternative upload progress function (see alternative_loading_element parameter)
      If present, it replaces the standard one
      Function argument is an object that contains:
        - `progress_event`: upload progress event
        - `fupl`: options & strings of current FileUploader instance
    */
    alternative_loading_func: null,

    /*
      JSON array of preregistered element:
      [
        {
          rel_id → id of the record related to the file (it's facultative and can be null).
                    It's usefully for many-to-many tables, and, if present,
                    is the one provided to delete a file from the server
          id     → unique id of the file (required)
          name   → file name (required)
          url    → url for <a> tag href attribute (if present) (facultative)
          src    → image `src` attribute (required for images only)
          wi     → image pixel width  (for images only)
          he     → image pixel height  (for images only)
          size   → bytes size
          [...]  → extra fields, if present
        }
        [...]
      ]
    */
    values: [],

    // varname use for deleted file generated hidden fields
    delete_varname: 'elimina_file[]',

    /*
      if true fancybox integration is activated for images
      fancybox is not present in FileUploader, and must be loaded in the page
      Furthermore, to activate this option, an `url` parameter must be provided
      (see `values` option)
    */
    fancybox: false,

    /*
      markup of <a> tag to wrap image tags when fancybox option is active
      if a `a.fupl-url` element is present in img templates string, this options
      will not be used
    */
    fancybox_anchor_markup: '<a class="fupl-url" data-fancybox="fupl-gallery"></a>',

    /*
      optional function to be called after fancybox markup is applied
      to all elements and after `init_callback`.
      Function is invoked passing the complete `fupl_options` obj as argument
    */
    fancybox_callback_func: null,

    // ========================================
    // SORTABLE OPTIONS
    // ========================================
    /*
      Enable the ability to rearrange items by dragging them.

      This options adds one more hidden field for each file to the form, using the
      `reorder_varname` parameter for generated varnames.

      The reorder option is enabled if the reorder parameter is true, if
      the multiple parameter is true and if the sortable_varname parameter is present

      If the option is active, the values of any pre-recorded items
      must be provided in the json `values` in the correct order

      See `demo / reorder_demo.html` for a usage example
    */
    sortable: false,

    /*
      sortable hidden item varname
      it will be combined with main varname to obtain a string like
        varname[item_id][sortable_varname]
    */
    sortable_varname: 'fupl_order',

    /*
      markup for dragging icon
      to be inserted in `.fupl-sortable-icon` element,
      that must be present in the multiple item template
    */
    sortable_icon: '<div title="{{sortable_icon_title_text}}"></div>',

    // ========================================
    // EXTRA FIELDS
    // ========================================
    /*
      Markup to be added at the end of every uploaded item.
      It is an array of objects each of which describes a field element:
        [
          {
            "value_key": field key,
            "markup": html string
          },
          ...
        ]

      * `value_key` identifies the field element and corresponds to the key used
                    also in the values object.
      * `use_rel_id` (default false), if true, and the `values` parameter contains the
                      `rel_id` items, the `{{name}}` variable will be generated
                      using `rel_id` instead of `id`.
                      Only pre-registered items will be affected by this setting (since new items
                      never have a `rel_id`).
                      If `use_rel_id` is true but the `rel_id`  item doesn't exist,
                      the `id`  will be used

      * `markup` is a HTML string which contains some Mustache-like placeholder:
        - `{{idx}}`         → unique id of the element
        - `{{val}}`         → content of `value` attribute, it corresponds to
                              `values[...][value_key]` value
        - `{{checked}}`     → if `values[...][value_key]` exists and it's different from
                              `0`, `null` or empty string, it is replaced with the `checked` attribute,
                              otherwise, with a space
        - `{{selected}}`    → same of the previous one, it is replaced with the `selected` attribute,
                              otherwise, with a a space
        - `{{name}}`        → is replaced with a PHP name string formed by
                                  * the `varname` parameter
                                  * the unique id or rel_id (according to use_rel_id setting) of the element
                                  * the `value_key` string
                              Example: `file[fupl_00001][caption]`

      Take a look to `extra_fields_demo.html` for a working demo.
    */
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

    set_has_values: fupl => {
      let items = fupl.opts.instance_result_wrapper.querySelectorAll('.fupl-item').length;
      fupl.opts.wrapper.dataset.hasValues = items? 'true' : 'false';
      if(!items) {
        // fupl.opts.instance_result_wrapper.innerHTML = fupl.strs[`no_${fupl.opts._type}_text`];
        fupl.opts.instance_result_wrapper.innerHTML =
          fupl.opts._type === 'img'?
            fupl.opts.template_empty_img.replace(/{{no_img_text}}/g, fupl.strs.no_img_text) :
            fupl.opts.template_empty_doc.replace(/{{no_doc_text}}/g, fupl.strs.no_doc_text);
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

  /**
   * create_info_text
   * Creates a string of information about the file requirements
   *
   */

  function create_info_text(fupl) {


    let info_text = [];

    switch (fupl.opts.filetype) {
      case 'img':
        info_text.push( fupl.strs.info_text_std_imgs );
        break;

      case 'img+svg':
        info_text.push( fupl.strs.info_text_imgs_svg);
        break;

      case 'svg':
        info_text.push( fupl.strs.info_text_svg_file);
        break;

      case 'pdf':
        info_text.push( fupl.strs.info_text_pdf_file);
        break;
    }

    if( fupl.opts.max_filesize !== null ) {
      info_text.push( fupl.strs.info_text_max_filesize );
    }

    if( fupl.opts.filetype === 'img' || fupl.opts.filetype === 'img+svg' ) {

      let img_size_info = [];

      if( fupl.opts.img_w && fupl.opts.img_h ) {
        img_size_info.push( fupl.strs.info_text_img_fixed_size );

      } else {

        if(fupl.opts.img_min_w && fupl.opts.img_min_h && fupl.opts.img_min_w === fupl.opts.img_min_h) {
          img_size_info.push( fupl.strs.info_text_img_equal_min_size );

        } else if(fupl.opts.img_max_w && fupl.opts.img_max_h && fupl.opts.img_max_w === fupl.opts.img_max_h) {
          img_size_info.push( fupl.strs.info_text_img_equal_max_size );

        } else {

          if( fupl.opts.img_w ) {
            img_size_info.push( fupl.strs.info_text_img_fixed_width );

          } else if( fupl.opts.img_min_w && fupl.opts.img_max_w ) {
            img_size_info.push( fupl.strs.info_text_img_width_range );

          } else if( fupl.opts.img_min_w ) {
            img_size_info.push( fupl.strs.info_text_img_min_width );

          } else if( fupl.opts.img_max_w  ) {
            img_size_info.push( fupl.strs.info_text_img_max_width );
          }

          if( fupl.opts.img_h ) {
            img_size_info.push( fupl.strs.info_text_img_fixed_height );

          } else if( fupl.opts.img_min_h && fupl.opts.img_max_h ) {
            img_size_info.push( fupl.strs.info_text_img_height_range );

          } else if( fupl.opts.img_min_h ) {
            img_size_info.push( fupl.strs.info_text_img_min_height );

          } else if( fupl.opts.img_max_h ) {
            img_size_info.push( fupl.strs.info_text_img_max_height );
          }

        }
      }

      if(fupl.opts.img_aspect_ratio !== null) {
        img_size_info.push( fupl.strs.info_text_img_aspect_ratio );
      }

      if(img_size_info.length) {
        info_text.push(
          (fupl.opts.filetype === 'img+svg' ? fupl.strs.info_text_imgs_svg_size_info_text : '') +
          img_size_info.join(', ')
        );
      }
    }

    info_text = info_text.map( item => {
      return item.replace(/{{img_w}}/, fupl.opts.img_w)
        .replace(/{{img_h}}/, fupl.opts.img_h)
        .replace(/{{img_min_w}}/, fupl.opts.img_min_w)
        .replace(/{{img_min_h}}/, fupl.opts.img_min_h)
        .replace(/{{img_max_w}}/, fupl.opts.img_max_w)
        .replace(/{{img_max_h}}/, fupl.opts.img_max_h)
        .replace(/{{img_aspect_ratio}}/, fupl.opts.img_aspect_ratio)
        .replace(/{{max_filesize}}/, fupl.opts.max_filesize? fupl.opts.max_filesize.feedback_size : null);
    });

    let str = info_text.join(fupl.opts.info_text_join_string);
    str = str.charAt(0).toUpperCase() + str.slice(1);

    if( fupl.opts.info_text_wrap_string && str ) {
      str = fupl.opts.info_text_wrap_string[0] + str + fupl.opts.info_text_wrap_string[1];
    }

    if(fupl.opts.filetype === 'img' || fupl.opts.filetype === 'img+svg') {
      str += '<div>' + fupl.strs.info_text_img_optimize_info + '</div>';
    }

    if(fupl.opts.filetype === 'svg' || fupl.opts.filetype === 'img+svg') {
      str += '<div>' + fupl.strs.info_text_svg_optimize_info + '</div>';
    }

    return str;
  }

  /*
    based on
    - https://github.com/WolfgangKurz/grabbable

    references:
    - https://codepen.io/therealDaze/pen/ZaoErp
    - https://github.com/gridstack/gridstack.js
    - https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API
    - https://www.html5rocks.com/en/tutorials/dnd/basics/
    - https://kryogenix.org/code/browser/custom-drag-image.html
    - http://jsfiddle.net/zfnj5rv4/
  */

  let dragged_element = null,
    uploader_is_disabled = false;

  const classes = {

      // class added to the FileUploader elment (fupl_options.element)
      // when a drag is started. It is removed at dragleave
      sorting_class: 'fupl-sorting',

      // same way, class added to the dragged element
      sorting_item_class: 'fupl-item-sorting',

      // class added to an item on dragover
      over_item_class: 'fupl-item-dragover'
    },

    // broken events cleaning
    resetAll = () => {

      if( dragged_element ) {
        dragged_element.classList.remove(classes.sorting_item_class);

        dragged_element.parentNode.querySelectorAll('.' + classes.over_item_class).forEach(item => {
          item.classList.remove(classes.over_item_class);
        });

        dragged_element.closest('.fupl').classList.remove(classes.sorting_class);
      }

      dragged_element = null;
    };

  function add_sortable_events(fupl_item, fupl_options) {

    // start dragging
    fupl_item.addEventListener('dragstart', function(e) {
      uploader_is_disabled = fupl_options.wrapper.disabled;
      resetAll();
      if(!uploader_is_disabled) {

        dragged_element = this;

        // `classes.sorting_class` is added to the dragged element
        // this prevents the feedback triggered when external files are dropped
        // in the broswer (look at scss/_fupl.scss)
        fupl_options.element.classList.add(classes.sorting_class);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', 'fupl-sorting');

        this.classList.add(classes.sorting_item_class);
      }

    }, false);

    // enter positioning over another element (→ e.target == this)
    fupl_item.addEventListener('dragenter', function(e) {

      // disabled for external files or when the uploader is disabled
      if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }
        if( this !== dragged_element ) {
          this.classList.add(classes.over_item_class);
        }
      }

    }, false);

    // positioning over another element (→ e.target)
    fupl_item.addEventListener('dragover', function(e) {
      if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled ) {

        if (e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        if( this !== dragged_element ) {
          this.classList.add(classes.over_item_class);
        }
      }

      return false;
    }, false);

    // exit positioning over another element
    fupl_item.addEventListener('dragleave', function() {

      this.classList.remove(classes.over_item_class);
    }, false);

    // drop
    fupl_item.addEventListener('drop', function(e) {
      if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }

        e.preventDefault();

        if(dragged_element) {
          if(this.previousElementSibling === dragged_element && this.nextElementSibling ) {
            this.parentNode.insertBefore(dragged_element, this.nextElementSibling);

          } else if( this.nextElementSibling ) {
            this.parentNode.insertBefore(dragged_element, this);

          // if target element is the last one, the dropped one is positioned after it
          } else {
            this.parentNode.insertAdjacentElement('beforeend', dragged_element);
          }
        }
        resetAll();
      }

      return false;

    }, false);

    // end dragging
    fupl_item.addEventListener('dragend', function(e) {

      if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
        fupl_options.element.classList.remove(classes.sorting_class);
        resetAll();

        // order variable
        fupl_options.instance_result_wrapper.querySelectorAll('.fupl-sortable-order').forEach((item,idx) => {
          item.value = idx;
        });
      }

    }, false);
  } // end add_sortable_events


  function activate_sortable(fupl_options) {

    // class added to `fupl_options.instance_result_wrapper`
    // when `sortable` option is activated
    fupl_options.instance_result_wrapper.classList.add( 'fupl-sortable' );

  }

  /*
    Add an element to fupl.opts.instance_result_wrapper
    and set all needed listeners

    `item_data` obj contains all element data:
      {
        id      → file unique id (can be file path too)
        name    → file name
        url     → url for any <a> tag present in the element (if it is an image can be a null or not set)
        src     → `src` attribute. Required if element is an image, otherwise null or not set
        wi      → image px width (null or not set if not image)
        he      → image px height (null or not set if not image)
        size    → file size (bytes)
        loading → `true` if it is an item being uploaded
        ...     → any additional instance-specific fields
      }

    `fupl`                    : is the fupl object
    `preregistered` === true  : means that the element was previously saved and comes
                                from the `fupl.opts.values` array

  */

  function create_item(item_data, fupl, preregistered = false) {

    try {

      let item_markup = fupl.opts[`template_${fupl.opts._type}_item_${fupl.opts._mode}`];
      if( item_markup === null && fupl.opts._mode === 'multiple' ) {
        item_markup = fupl.opts[`template_${fupl.opts._type}_item_single`];
      }

      let fupl_item_wrapper = document.createElement('div'); // wrapper to be removed after inserting
      fupl_item_wrapper.innerHTML = item_markup;

      // delete button
      let fupl_remove = fupl_item_wrapper.querySelector('.fupl-remove');
      if(fupl_remove) {
        fupl_remove.innerHTML = fupl.opts.template_remove_btn
          .replace(/{{remove_btn_text}}/g, fupl.strs.remove_btn_text);
      }

      /*
        element data
        ============================

        each fupl-item element contains:
          .fupl-file-name
          .fupl-file-size
          .fupl-img → img
          .fupl-img → a.href
          .fupl-doc → a.href

      */

      // file name
      let fupl_file_name = fupl_item_wrapper.querySelector('.fupl-file-name');
      if(fupl_file_name && item_data.name ) {
        fupl_file_name.innerHTML = item_data.name;
        fupl_file_name.title = item_data.name;
      }

      // size info
      let fupl_file_size = fupl_item_wrapper.querySelector('.fupl-file-size');
      if(fupl_file_size ) {
        let size_string = '';
        if(fupl.opts._type === 'img' && item_data.wi && item_data.he) {
          size_string = item_data.wi + '&times;' + item_data.he + '<span class="fupl-unit">px</span>';
          if(item_data.size) {
            size_string += ' &ndash; ';
          }
        }
        if(item_data.size) {
          size_string += fupl_utilities.parse_bytes_value(item_data.size, fupl.opts.locales);
        }

        fupl_file_size.innerHTML = size_string;
      }

      // image
      if( fupl.opts._type === 'img' ) {
        fupl_item_wrapper.querySelector('.fupl-img').src = item_data.src;
      }

      // url
      let fupl_url = fupl_item_wrapper.querySelector('.fupl-url');
      if( fupl_url && item_data.url) {
        fupl_url.href = item_data.url;
      }

      let fupl_item = fupl_item_wrapper.querySelector('.fupl-item');


      if(item_data.loading) {
        fupl_item.classList.add('fupl-is-uploading');
        fupl_item.insertAdjacentHTML('beforeend',
          fupl.opts.template_loading_element
        );
      }

      if(fupl.opts._mode === 'single') {
        fupl.opts.instance_result_wrapper.innerHTML = fupl_item_wrapper.innerHTML;
      } else {

        // instance_result_wrapper cleaning (to remove 'no file' string, if present)
        if( !fupl.opts.instance_result_wrapper.querySelector('.fupl-item')) {
          fupl.opts.instance_result_wrapper.innerHTML = '';
        }

        fupl.opts.instance_result_wrapper.insertAdjacentHTML('beforeend',
          fupl_item_wrapper.innerHTML
        );
      }


      let fupl_item_dom = fupl.opts.instance_result_wrapper.querySelector('.fupl-item:last-child');
      fupl_item_dom.dataset.id = item_data.id;

      // remove element listener
      let fupl_remove_trigger = fupl_item_dom.querySelector('.fupl-remove-trigger');
      if(fupl_remove_trigger) {
        fupl_remove_trigger.addEventListener('click', () => {
          fupl_item_dom.remove();

          let prereg_id = item_data.rel_id? item_data.rel_id : item_data.id;

          if(prereg_id && preregistered) {
            fupl.opts.wrapper.insertAdjacentHTML('beforeend',
              `<input type="hidden" name="${fupl.opts.delete_varname}" value="${prereg_id}">`
            );
          }

          // controllo se instance_result_wrapper è vuoto
          // e impostazione di attributo e contenuti
          fupl_utilities.set_has_values(fupl);

        });
      }

      //fancybox integration
      if( fupl.opts.fancybox && fupl.opts._type === 'img' && item_data.url && fupl.opts.fancybox_anchor_markup) {
        // check for `a.fupl-url` tag and add it if necessary
        if( !fupl_item_dom.querySelector('a.fupl-url') ) {

          let img_element = fupl_item_dom.querySelector('.fupl-img'),
            fancybox_wrapper = document.createElement('div');
          fancybox_wrapper.innerHTML = fupl.opts.fancybox_anchor_markup;

          fancybox_wrapper = fancybox_wrapper.firstChild;
          img_element.parentNode.insertBefore(fancybox_wrapper, img_element);
          fancybox_wrapper.appendChild(img_element);
        }

        fupl_item_dom.querySelector('a.fupl-url').setAttribute('href', item_data.url);

      }

      // extra fields
      let extra_fields_wrapper = fupl_item_dom.querySelector('.fupl-extra-fields');
      if(fupl.opts.extra_fields !== null && extra_fields_wrapper) {

        fupl.opts.extra_fields.forEach( item => {
          extra_fields_wrapper.insertAdjacentHTML('beforeend',
            item.markup.replace(/{{idx}}/g, item_data.id)
              .replace(/{{val}}/g, preregistered && item_data[item.value_key]? item_data[item.value_key] : '')
              .replace(/{{checked}}/g, preregistered && +item_data[item.value_key]? ' checked ' : ' ')
              .replace(/{{name}}/g,
                (preregistered && fupl.opts.registered_extra_field_varname?
                  fupl.opts.registered_extra_field_varname : fupl.opts.varname) +
                '[' +
                ((item.use_rel_id && item_data.rel_id)? item_data.rel_id : item_data.id) +
                '][' + item.value_key + ']'
              )
          );
        });
        // add `selected` attribute to select extra fields
        extra_fields_wrapper.querySelectorAll('select[data-selected]:not([data-selected=""]').forEach(sel => {
          const value = sel.dataset.selected;
          sel.querySelector(`option[value="${value}"]`)?.setAttribute('selected', true);
        });

        // stop bubbling when sortable
        if( fupl.opts.sortable ) {
          extra_fields_wrapper.querySelectorAll('select, input, textarea').forEach(item => {
            item.setAttribute('draggable', 'false');
            ['dragstart', 'drag', 'mousedown'].forEach( ev => {
              item.addEventListener(ev, e => {
                if(ev !== 'mousedown') {e.preventDefault();}
                e.stopPropagation();
              });
            });
          });
        }
      }

      // sortable
      if( fupl.opts.sortable ) {
        fupl_item_dom.setAttribute('draggable', true);

        // order_value starts from zero
        let order_value = fupl.opts.instance_result_wrapper.querySelectorAll('.fupl-item').length -1;

        fupl_item_dom.insertAdjacentHTML('beforeend',
          '<input type="hidden" class="fupl-sortable-order" name="' +
              (preregistered && fupl.opts.registered_extra_field_varname?
                fupl.opts.registered_extra_field_varname :
                fupl.opts.varname) +
              `[${item_data.id}][${fupl.opts.sortable_varname}]" value="${order_value}">`
        );

        if(fupl.opts.sortable_icon) {
          fupl_item_dom.querySelector('.fupl-sortable-icon').innerHTML =
            fupl.opts.sortable_icon
              .replace('{{sortable_icon_title_text}}', fupl.strs.sortable_icon_title_text);
        }
        add_sortable_events(fupl_item_dom, fupl.opts);
      }

      return fupl.opts.instance_result_wrapper.querySelector('.fupl-item:last-child');

    } catch(e) {
      console.error(e); // eslint-disable-line
    }

  }

  /*
  Generate hidden fields with values to be sent to server
  Returns the hidden fields html string
  */

  function build_hidden_fields(current_item, fupl_options) {

    // normalize ascii chars > 127 (and more)
    const normalize_file_name = filename => {
      let converted = '';
      const std_char = '-', // char for standrd substitutions
        conversionTable = { // Reference table Unicode vs ASCII
          'à' : 'a', // 224
          'è' : 'e', // 232
          'é' : 'e', // 233
          'ì' : 'i', // 236
          'ò' : 'o', // 242
          'ù' : 'u', // 249
          'À' : 'A', // 192
          'È' : 'E', // 200
          'É' : 'E', // 201
          'Ì' : 'I', // 204
          'Ò' : 'O', // 210
          'Ù' : 'U', // 217
          '\'' : std_char, // 39
          '|' : std_char, // 124
          '!' : std_char, // 33
          '"' : std_char, // 34
          '$' : std_char, // 36
          '%' : std_char, // 37
          '&' : std_char, // 38
          '/' : std_char, // 47
          '(' : std_char, // 40
          ')' : std_char, // 41
          '=' : std_char, // 61
          '?' : std_char, // 63
          '^' : std_char, // 94
          '*' : std_char, // 42
          '[' : std_char, // 91
          ']' : std_char, // 93
          'ç' : 'c', // 231
          '@' : std_char, // 64
          '#' : std_char, // 35
          '<' : std_char, // 60
          '>' : std_char, // 62
          'ü' : 'u', // 252
          'Ü' : 'U', // 220
          'ñ' : 'n', // 241
          'Ñ' : 'N', // 209
          '~' : std_char, // 126
          ':' : std_char,
          '\\' : std_char
        };

      for(var i = 0; i < filename.length; i++) {
        if( filename[i] in conversionTable) {
          converted += conversionTable[filename[i]];

        } else if(filename.charCodeAt(i) === 768 || filename.charCodeAt(i) === 769 ) { // accento grave e accento acuto
          converted += '';

        } else if(filename.charCodeAt(i) > 127 ) {
          converted += std_char;

        } else {
          converted += filename.charAt(i);
        }
      }

      return converted.replace(/ /g, std_char)
        .replace(new RegExp(`^${std_char}+`), '')
        .replace(new RegExp(`${std_char}+`,'g'), std_char);
    };

    let hidden_fields = '',
      field_values = {
        'tmp_file'  : current_item.tmp_file,
        'file_name' : normalize_file_name(current_item.file.name),
        'size'      : current_item.file.size,
        'type'      : current_item.file.type
      };

    // if(fupl_options._type === 'img') {
    if(current_item.isBitmapImg) {
      field_values.width = current_item.width;
      field_values.height = current_item.height;
    }
    for (let _key in field_values) {
      hidden_fields += '<input type="hidden" '+
        'name="' + fupl_options.varname + '[' + current_item.id +'][' + _key + ']" '+
        'value="' + ((field_values[_key] !== null && field_values[_key] !== undefined)? field_values[_key] : '') +'">';
    }

    return '<div class="fupl-hiddens">' + hidden_fields + '</div>';

  }

  // TODO update to dialog element

  function fupl_alert(mes, fupl_opts) {

    let alert_container = fupl_opts.element.querySelector('.fupl-alert-body ul');

    if(typeof mes === 'string') {
      mes = [mes];
    }


    if(!alert_container) {
      fupl_opts.element.insertAdjacentHTML('beforeend',
        fupl_opts.fupl_alert_template
      );

      fupl_opts.element.querySelector('.fupl-alert-body').innerHTML = '<ul></ul>';

      alert_container = fupl_opts.element.querySelector('.fupl-alert-body ul');

      fupl_opts.element.querySelector('.fupl-alert button').addEventListener('click', () => {
        fupl_opts.element.querySelector('.fupl-alert-overlay').remove();
      }, false);
    }

    mes.forEach(item => {
      alert_container.insertAdjacentHTML('afterbegin', `<li>${item}</li>`);
    });


  }

  /*
  Performs all the checks, calls the remote url via ajax
  and generates the feedback for the user
  */


  function send_files(filelist, fupl) {

    // disable the form submit button until the upload is completed
    const disable_submit = (mode) => {
        // mode === true → disable, false → enable
        const _form = fupl.opts.element.closest('form');

        if(fupl.opts.disable_submit && _form) {
          const submit_btns = _form.querySelectorAll('[type="submit"]');

          submit_btns.forEach( btn => {
            btn.disabled = mode;
          });

          // TODO: removeEventListener doesn't work
          // const submitHandler = (e) => {
          //   e.preventDefault();
          //   //return false;
          // };
          // if(mode === true) {
          //   _form.addEventListener('submit', submitHandler, false);
          // } else {
          //   if( !fupl.opts.instance_result_wrapper.querySelector('.fupl-item.fupl-is-uploading')) {
          //     _form.removeEventListener('submit', submitHandler, false);
          //   }
          // }
        }
      },

      /*
      uploadFile
      ajax upload
      https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

      current_item contains:
        - `id`: element unique id
        - `file`: filelist obj
        - `width` e height: image pixel sizes. null if not an image
        - `tmp_file`: temporary server file name (new uplaods only)

      */
      uploadFile = function ( current_item, img_preview ) {

        // disabling form
        disable_submit(true);

        // aggiunta elemento all'uploader
        let this_item = create_item({
            id       : current_item.id,
            name     : current_item.file.name,
            url      : null,
            src      : img_preview,
            wi       : current_item.width,
            he       : current_item.height,
            size     : current_item.file.size,
            // img_type : current_item.file.img_type, // TODO non necessario, controllare
            loading  : true
          }, fupl),


          fupl_progress= this_item.querySelector('.fupl-progress'),
          fupl_loading_wrapper = this_item.querySelector('.fupl-loading'),

          xhr_error_message = fupl.strs.alert_xhr_error.replace(/{{file_name}}/, current_item.file.name);

        //console.log(this_item); // eslint-disable-line

        const remove_item_on_error = () => {
          this_item.querySelector('.fupl-remove-trigger').click();
        };

        // custom callback function
        if( fupl.opts.upload_start_callback ) {
          fupl_utilities.exec_callback(fupl.opts.upload_start_callback, {
            item              : current_item,
            img_preview       : img_preview,
            uploader_options  : fupl
          });
        }

        new Promise(function(resolve, reject) {
          let ajax = new XMLHttpRequest();
          ajax.open( fupl.opts.ajax_method, fupl.opts.uploader_url, true );

          ajax.onload = function() {

            if( ajax.status >= 200 && ajax.status < 400 ) {

              const response = JSON.parse( ajax.responseText );

              /*
              jsonResponse:
                {
                  "tmp_file": "temp_file_name",
                  "error": null
                }
              */
              if(response.error) {

                fupl_alert( xhr_error_message, fupl.opts );
                console.error( response.error ); // eslint-disable-line
                reject();

              } else {
                current_item.tmp_file = response.tmp_file;
                resolve();
              }

              // custom callback function
              if( fupl.opts.upload_complete_callback ) {
                fupl_utilities.exec_callback(fupl.opts.upload_complete_callback, {
                  item          : current_item,
                  server_error  : response.error,
                  fupl          : fupl
                });
              }

              if(fupl.opts.debug) {
                /* eslint-disable */
                console.groupCollapsed(`FileUploader ${fupl.opts._vers} ajax response`);
                console.log(response);
                console.groupEnd();
                /* eslint-enable */
              }

            } else {
              fupl_alert( xhr_error_message, fupl.opts );
              /* eslint-disable */
              console.error( ajax.status, ajax.statusText );
              console.error( ajax.responseText );
              /* eslint-enable */
            }

            reject();
          };

          ajax.onerror = function() {
            fupl_alert( xhr_error_message, fupl.opts );
            /* eslint-disable */
            if(fupl.opts.debug) {
              console.error( ajax.status,  ajax.statusText );
              console.error( ajax.responseText );
            }
            /* eslint-enable */

            reject();
          };

          ajax.upload.addEventListener('progress', function (e) {
            if( fupl.opts.alternative_loading_func ) {

              fupl_utilities.exec_callback(fupl.opts.alternative_loading_func, ...[e, fupl]);

            } else {
              let perc_loaded = Math.round(e.loaded / e.total * 100.0) || 0;

              //console.log(e.loaded ,e.total, perc_loaded); // eslint-disable-line
              if(fupl_progress) {
                if(e.lengthComputable) {
                  perc_loaded = perc_loaded === Infinity? 100 : perc_loaded;
                  this_item.querySelector('.fupl-progress').value = perc_loaded;
                } else {
                  fupl_loading_wrapper.innerHTML = fupl.opts.template_alternative_loading_element;
                  fupl_progress = null;
                }
              }
            }
          }, false);


          let fileData = new FormData();
          fileData.append('file', current_item.file);
          ajax.send( fileData );
        }) // end promise
          .then(
            // resolve
            function (  ) {
              //console.log('resolve'); // eslint-disable-line
              this_item.classList.remove('fupl-is-uploading');
              this_item.querySelector('.fupl-loading').remove(); // elemento loading

              this_item.insertAdjacentHTML('beforeend',
                build_hidden_fields(current_item, fupl.opts)
              );

              fupl_utilities.set_has_values(fupl);

              // restoring submit
              disable_submit(false);

            },
            //reject
            function (  ) {
              //console.log('reject'); // eslint-disable-line
              remove_item_on_error();
              fupl_utilities.set_has_values(fupl);
            }
          );

      };

    if( filelist.length ) {

      // https://stackoverflow.com/questions/38362231/
      // how-to-use-promise-in-foreach-loop-of-array-to-populate-an-object
      [...filelist].forEach(function (filelist_item, idx) {
        try {

          const ext = filelist_item.name.split('.').pop().toLowerCase();

          let current_item = {
            id: 'fupl_item_' + Date.now() + '_' + idx, // id unico
            file: filelist_item,
            width: null,
            height: null,
            tmp_file: null,

            // TODO i file svg, se con attributo width e height, permettono la rilevazione delle dimensioni, utilizzare?

            // isImg: fupl_utilities.mimetypes['img+svg'].indexOf(filelist_item.type) !== -1 ||
            //   fupl_utilities.mimetypes['img+svg'].indexOf( '.' + ext ) !== -1,

            isBitmapImg: fupl_utilities.mimetypes.img.indexOf(filelist_item.type) !== -1 ||
              fupl_utilities.mimetypes.img.indexOf( '.' + ext ) !== -1
            // img_type: fupl.opts._type === 'img'?
            //   (filelist_item.type === 'image/svg+xml' ? 'svg' : 'bitmap') : null
          };

          // TODO unificare questo controllo e il successivo

          // filetype check (for drag & drop and browsers that don't support accept)
          if( fupl.opts.accept.length ) {
            if( fupl.opts.accept.indexOf( filelist_item.type ) === -1 &&
              fupl.opts.accept.indexOf( '.' + ext ) === -1) {
              console.log(filelist_item.type);
              throw fupl.strs.alert_file_format_error
                .replace(/{{file_name}}/, filelist_item.name );
            }
          } // end filetype check

          // controllo formati immagine ammessi
          if( fupl.opts._type === 'img' && (fupl_utilities.mimetypes.img.indexOf( filelist_item.type ) === -1 ||
            fupl_utilities.mimetypes.img.indexOf( '.' + ext ) === -1)
          ) {

            throw fupl.strs.alert_file_format_error
              .replace(/{{file_name}}/, filelist_item.name );
          }

          // maxfilesize check
          if( fupl.opts.max_filesize !== null ) {
            if( filelist_item.size > fupl.opts.max_filesize.maxbytes ) {
              let item_parsed_size = fupl_utilities.parse_bytes_value(filelist_item.size, fupl.opts.locales);

              throw fupl.strs.alert_file_size_error
                .replace(/{{file_name}}/, filelist_item.name )
                .replace(/{{file_size}}/, item_parsed_size )
                .replace(/{{allowed_size}}/, fupl.opts.max_filesize.feedback_size );
            }
          } // end maxfilesize check

          // images


          if( current_item.isBitmapImg ) {
            let reader  = new FileReader();
            reader.addEventListener('load', function () {

              let image = new Image();
              image.src = reader.result;
              image.addEventListener('load', function () {

                let error_messages = [];
                current_item.width=image.width;
                current_item.height=image.height;

                if( fupl.opts.img_w && image.width !== fupl.opts.img_w ) {
                  error_messages.push(
                    fupl.strs.alert_img_exact_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_w)
                  );

                } else if(fupl.opts.img_min_w && image.width < fupl.opts.img_min_w) {
                  error_messages.push(
                    fupl.strs.alert_img_min_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_min_w)
                  );

                } else if(fupl.opts.img_max_w && image.width > fupl.opts.img_max_w) {
                  error_messages.push(
                    fupl.strs.alert_img_max_width_err
                      .replace(/{{image_dimension}}/, image.width)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_max_w)
                  );
                }

                if (fupl.opts.img_h && image.height !== fupl.opts.img_h) {
                  error_messages.push(
                    fupl.strs.alert_img_exact_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_h)
                  );

                } else if(fupl.opts.img_min_h && image.height < fupl.opts.img_min_h) {
                  error_messages.push(
                    fupl.strs.alert_img_min_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_min_h)
                  );

                } else if(fupl.opts.img_max_h && image.height > fupl.opts.img_max_h) {
                  error_messages.push(
                    fupl.strs.alert_img_max_height_err
                      .replace(/{{image_dimension}}/, image.height)
                      .replace(/{{allowed_dimension}}/, fupl.opts.img_max_h)
                  );

                }

                // aspect ratio
                if(fupl.opts.img_aspect_ratio_parsed) {
                  let img_ratio = Math.round(((image.width / image.height) + Number.EPSILON) * fupl.opts.aspect_ratio_accuracy) / fupl.opts.aspect_ratio_accuracy;
                  if(img_ratio !== fupl.opts.img_aspect_ratio_parsed) {
                    error_messages.push(
                      fupl.strs.alert_img_ratio_err
                        .replace(/{{aspect_ratio}}/, fupl.opts.img_aspect_ratio)
                    );
                  }
                }

                if( error_messages.length ) {
                  error_messages = error_messages
                    .map(item => item.replace(/{{file_name}}/, filelist_item.name ) );
                  fupl_alert(error_messages, fupl.opts );

                } else {
                  uploadFile( current_item, reader.result );
                }

              }, false); // end image.addEventListener("load"

            }, false); // end reader.addEventListener("load"

            reader.readAsDataURL( filelist_item );

            // } else if(current_item.img_type === 'svg') { // svg

            //   let reader = new FileReader();

            //   reader.addEventListener('load', () => {

            //     let image = new Image();
            //     image.src = reader.result;

            //     image.addEventListener('load', function () {
            //       current_item.width=image.width;
            //       current_item.height=image.height;
            //     });

            //     uploadFile( current_item,
            //       reader.result
            //       //'data:image/svg+xml;base64,' +  window.btoa(event.target.result)
            //     );
            //   });
            //   reader.readAsDataURL(filelist_item);

          } else { // not image
            uploadFile( current_item );

          } // end if image

        } catch (errormessage) {
          fupl_alert( errormessage, fupl.opts);
        }
      }); // end foreach

    } // end if( filelist.length )

  }

  // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
  function set_listeners(fupl) {

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      fupl.opts.element.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    ['dragover', 'dragenter'].forEach(eventName => {
      fupl.opts.element.addEventListener(eventName, () => {
        fupl.opts.element.classList.add( fupl.opts.element_dragover_class );
      }, false);
    });

    ['dragleave', 'dragend'].forEach(eventName => {
      fupl.opts.element.addEventListener(eventName, () => {
        fupl.opts.element.classList.remove( fupl.opts.element_dragover_class );
      }, false);
    });

    fupl.opts.element.addEventListener('drop', (e) => {
      fupl.opts.element.classList.remove( fupl.opts.element_dragover_class );
      if(!fupl.opts.wrapper.hasAttribute('disabled')) {
        let files = e.dataTransfer.files;

        if(files.length) { // if 0 is a reordering or another event
          if( !fupl.opts.multiple && files.length > 1 ) {
            fupl_alert(fupl.strs.alert_too_much_files, fupl.opts);
          } else {
            send_files( files, fupl );
          }
        }
      }
    }, false);

    // selecting thru input element
    fupl.opts.instance_input.addEventListener('change', () => {
      send_files( fupl.opts.instance_input.files, fupl );
    });

  }

  function createUploader(fupl) {

    try {

      // check for input[file] and label elements
      let _input = fupl.opts.element.querySelector('input[type="file"]'),
        original_label = fupl.opts.element.querySelector('label');

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
        fupl.opts.uploader_legend_text = '__legend__';
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

      if(fupl.opts.help_text) {
        fupl.opts.element.insertAdjacentHTML('beforebegin',
          `<div class="fupl-help-text">${fupl.opts.help_text}</div>`
        );
      }

      // uploader template
      fupl.opts.element.innerHTML = fupl.opts.template_main;

      fupl.opts.instance_input = fupl.opts.element.querySelector('.fupl-panel input[type="file"]');
      fupl.opts.instance_label = fupl.opts.element.querySelector('.fupl-panel label');
      fupl.opts.instance_dd_text = fupl.opts.element.querySelector('.fupl-panel .fupl-dd-text');
      fupl.opts.instance_info_text = fupl.opts.element.querySelector('.fupl-panel .fupl-info-text');
      fupl.opts.instance_result_wrapper = fupl.opts.element.querySelector('.fupl-result');


      // inserting text and attributes
      // if( fupl.opts.required ) {
      //   fupl.opts.instance_input.setAttribute('required', '');
      // }
      if( fupl.opts.multiple ) {
        fupl.opts.instance_input.setAttribute('multiple', '');
      }
      if( fupl.opts.accept !== null ) {
        fupl.opts.instance_input.setAttribute('accept', fupl.opts.accept.join(','));
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


      fupl.opts.instance_label.insertAdjacentHTML('beforeend',
        fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_select_text`]
      );
      if(fupl.opts.input_label_class) {
        fupl.opts.instance_label.classList.add(...fupl.opts.input_label_class.split(' '));
      }
      fupl.opts.instance_dd_text.innerHTML = fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_drag_text`];



      // info text
      if( fupl.opts.show_info_text ) {
        if(fupl.opts.custom_info_text) {
          fupl.opts.instance_info_text.innerHTML = fupl.opts.custom_info_text;
        } else {
          fupl.opts.instance_info_text.innerHTML = create_info_text(fupl);
        }
      }


      // Sortable
      if( fupl.opts.sortable) {
        if( fupl.opts.multiple && fupl.opts.sortable_varname ) {

          activate_sortable(fupl.opts);

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
      // if it is a single object, it is wrapped in an array
      if(fupl.opts.values) {
        if(typeof fupl.opts.values === 'object') {
          if(!Array.isArray(fupl.opts.values)) {
            fupl.opts.values = [fupl.opts.values];
          }
        } else {
          throw new Error('FileUploader: incorrect “values” parameter');
        }
      }

      if( fupl.opts.values && fupl.opts.values.length ) {

        fupl.opts.values.forEach( item => {
          create_item(item, fupl, true); // true means that the element comes from the server
        });

      }
      fupl_utilities.set_has_values(fupl);

      // gestione aggiunta nuovi elementi
      set_listeners(fupl);


      // calling init_callback, if present
      if( fupl.opts.init_callback !== null ) {
        fupl_utilities.exec_callback(fupl.opts.init_callback, fupl);
      }

      // calling fancybox_callback_func, if present
      if( fupl.opts.fancybox && fupl.opts.fancybox_callback_func !== null ) {
        fupl_utilities.exec_callback(fupl.opts.fancybox_callback_func, fupl.opts);
      }

      //debug
      if( fupl.opts.debug ) {

        const parsed_options= Object.keys(fupl.opts).sort()
          .reduce((result, key) => ( result[key] = JSON.stringify(fupl.opts[key]), result), {} );

        //parsed_options is exposed as global object for debug purposes
        if(window.fileUploderOpts === undefined) {
          window.fileUploderOpts = {};
        }
        window.fileUploderOpts[fupl.opts.varname] = parsed_options;

        /* eslint-disable */
        console.groupCollapsed(`FileUploader ${fupl.opts._vers} options`);
        console.table(parsed_options);
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
      if ( 'console' in window ) {
        console.error('This browser can\'t run FileUploader'); // eslint-disable-line
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

      let instance_opts = Object.assign(
        {},
        fupl.opts,
        JSON.parse(upl_element.dataset.fileUploader || '{}' ),
        all_data_params
      );

      // the element itself is added to `instance_options`:
      instance_opts.element = upl_element;

      // last check and fileuploader starting
      try {
        //  uploader remote url can't be null
        if( !instance_opts.uploader_url ) {
          throw new Error( 'FileUploader: missing `uploader_url` parameter' );
        }

        // filetype parameter check
        instance_opts.filetype = instance_opts.filetype.toLowerCase();

        // aspect_ratio_accuracy
        instance_opts.aspect_ratio_accuracy = 10 ** +instance_opts.aspect_ratio_accuracy;

        // img+svg key aliases
        if(['svg+img', 'img-svg', 'svg-img'].indexOf(instance_opts.filetype) !== -1) {
          instance_opts.filetype = 'img+svg';
        }
        if( Object.keys( fupl_utilities.mimetypes ).indexOf(instance_opts.filetype) === -1 ) {
          throw new Error( 'FileUploader: incorrect `filetype` parameter' );
        }
      } catch(e) {
        console.error( e );// eslint-disable-line
      }

      // these parameters must be arrays but can retrieved as strings from data attributes
      const json_params = [
        'info_text_wrap_string',
        'values',
        'extra_fields'
      ];


      json_params.forEach(item => {
        try {
          if(typeof instance_opts[item] === 'string' ) {
            instance_opts[item] = JSON.parse(instance_opts[item]);
          }
        } catch(e) {
          console.error(`FileUploader: the “${item}” parameter is not a valid json`); // eslint-disable-line
          console.log(instance_opts.element); // eslint-disable-line
          console.error( e );// eslint-disable-line
        }
      });

      // parsing of all boolean or null parameters
      for(let i in instance_opts) {

        if(typeof instance_opts[i] === 'string' &&
          ['true', 'false', 'null'].indexOf(instance_opts[i].toLowerCase()) !== -1
        ) {
          instance_opts[i] = JSON.parse(instance_opts[i]);
        }
      }

      // aspect ratio is ignored if exact constrains are presents
      if(instance_opts.img_aspect_ratio && instance_opts.img_w && instance_opts.img_h) {
        console.error('FileUploader: the aspect ratio parameter will be ignored, because exact constraints have been set for width and height'); // eslint-disable-line
        instance_opts.img_aspect_ratio = null;
      }

      // aspect ratio parsing
      instance_opts.img_aspect_ratio_parsed = null;
      if(instance_opts.img_aspect_ratio) {

        try {
          if(isNaN(instance_opts.img_aspect_ratio)) {
            let w,h;
            if(instance_opts.img_aspect_ratio.indexOf('/') !== -1) {
              [w,h] = instance_opts.img_aspect_ratio.split('/');
            } else if (instance_opts.img_aspect_ratio.indexOf(':') !== -1) {
              [w,h] = instance_opts.img_aspect_ratio.split(':');
            }

            if( w && h ) {
              instance_opts.img_aspect_ratio_parsed = +w/+h;
              instance_opts.img_aspect_ratio = `${w}:${h}`; // force colon format
            } else {
              instance_opts.img_aspect_ratio_parsed = Number(instance_opts.img_aspect_ratio);
            }

          } else {
            instance_opts.img_aspect_ratio_parsed = +instance_opts.img_aspect_ratio;
          }

          if(instance_opts.img_aspect_ratio_parsed) {
            instance_opts.img_aspect_ratio_parsed = Math.round((instance_opts.img_aspect_ratio_parsed + Number.EPSILON) * instance_opts.aspect_ratio_accuracy) / instance_opts.aspect_ratio_accuracy;
          }

          if(isNaN(instance_opts.img_aspect_ratio_parsed) || !instance_opts.img_aspect_ratio_parsed) {
            throw new Error();
          }
        } catch(e) {
          console.error(`FileUploader: incorrect aspect ratio parameter → ${instance_opts.img_aspect_ratio}`); // eslint-disable-line
          instance_opts.img_aspect_ratio = null;
          instance_opts.img_aspect_ratio_parsed = null;
        }
      }

      // classes and all needed merging
      if(instance_opts.fupl_alert_btn_class) {
        instance_opts.fupl_alert_template = instance_opts.fupl_alert_template
          .replace('fupl-alert-btn', 'fupl-alert-btn ' + instance_opts.fupl_alert_btn_class);
      }

      // calling the createUploader function. Global options are completely overwritten
      // by instance_opts
      new createUploader({
        strs: fupl.strs,
        opts: instance_opts
      });

    }); // end document.querySelectorAll(fupl.selector).forEach

  }

  /*!@preserve
   *
   * FileUploader 2
   * HTML5 / JS Async Uploader
   * Massimo Cassandro 2017-2021
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

    const _VERSION = '3.4.1';

    const strs = Object.assign( {}, fupl_strings_it, params.local_strs || {} );

    let opts = Object.assign( {_vers: _VERSION}, default_options, params.options || {});

    // change all Mustache-Like Variables with corresponding strings
    for(let i in opts) {
      if(typeof opts[i] === 'string') {
        opts[i] = opts[i].replace(/\{\{(.*?)\}\}/g, (match, substr) => strs[substr]);
      }
    }

    fupl_init({
      selector : params.selector || '.file-uploader2', // used in fupl_init only
      css      : params.css || null,                   // used in fupl_init only
      opts     : opts,
      strs     : strs
    });
  }

  return FileUploader;

})));
//# sourceMappingURL=FileUploader.umd.js.map
