export const default_options = {

  // server side script url
  uploader_url: null,

  // locales for numbers parsing
  locales: 'it-IT',

  // ff true, console shows informations about current FileUploader Configuration
  debug: false,

  // method for ajax request
  ajax_method: 'POST',

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
  sortable_icon: '<div title="{{sortable_icon_title_text}}"></div>',

  // ========================================
  // EXTRA FIELDS
  // ========================================
  // Markup to be added at the end of every uploaded item.
  extra_fields: null
};
