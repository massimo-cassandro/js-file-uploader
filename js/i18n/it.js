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

  info_text_img_optimize_info: 'Ottimizza le tue immagini prima di caricarle. ' +
    '<a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer">Squoosh</a> è un ottimo (e gratuito) ' +
    'strumento per farlo.'+
    '<br>Per l’editing puoi utilizzare <a href="https://www.befunky.com/create/photo-editor/" target="_blank" rel="noopener noreferrer">Befunky</a>',

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

export default fupl_strings_it;
