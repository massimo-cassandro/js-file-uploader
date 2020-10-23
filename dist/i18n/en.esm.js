const fupl_strings_en = {


  // Mustache-like placeholders will be replaced with corresponding values

  alert_too_much_files: 'Only one file can be uploaded!',
  alert_xhr_error: 'An error occurred while uploading “<strong>{{file_name}}</strong>” file.',
  alert_file_format_error: 'Format of file “<strong>{{file_name}}</strong>” is not allowed',
  alert_file_size_error: 'Size of “<strong>{{file_name}}</strong>” ({{file_size}}) '+
    'exceeds the maximum allowed value ({{allowed_size}})',

  // images sizes alerts
  alert_img_err_start_string: 'Image “<strong>{{file_name}}</strong>” is incorrect:',
  alert_img_exact_width_err: 'Incorrect width ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_min_width_err: 'Width below the minimum allowed ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_max_width_err: 'Width greater than the maximum allowed ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_exact_height_err: 'Incorrect height ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_min_height_err: 'Height below the minimum allowed ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_max_height_err: 'Height greater than the maximum allowed ({{image_dimension}}px instead of {{allowed_dimension}}px)',
  alert_img_ratio_err: 'Image width/height ratio doesn\'t match the requested value of {{aspect_ratio}}',

  no_img_text: 'No image present',
  no_doc_text: 'No file present',
  remove_btn_text: 'Remove this file',


  info_text_std_imgs : '<strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> or <strong>WEBP</strong> images',
  info_text_imgs_svg : '<strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong>, <strong>WEBP</strong> or <strong>SVG</strong> images',
  info_text_imgs_svg_size_info_text: '<strong>Non-SVG images only:</strong> ',

  info_text_img_optimize_info: 'Optimize your images before uploading. ' +
    '<a href="https://squoosh.app/" target="_blank">Squoosh</a> is a great (and free) tool for doing this.',

  info_text_svg_optimize_info: 'Optimize your SVG files before uploading ' +
      '(for example using <a href="https://jakearchibald.github.io/svgomg/" target="_blank">SVGO</a>)',

  info_text_img_fixed_size: 'size: <strong>{{img_w}}&times;{{img_h}}px</strong>',
  info_text_img_equal_min_size: 'width and height not less than <strong>{{img_min_w}}px</strong>',
  info_text_img_equal_max_size: 'width and height not exceeding <strong>{{img_max_w}}px</strong>',
  info_text_img_fixed_width : 'width <strong>{{img_w}}px</strong>',
  info_text_img_fixed_height : 'height <strong>{{img_h}}px</strong>',
  info_text_img_width_range: 'width between <strong>{{img_min_w}}px</strong> and <strong>{{img_max_w}}px</strong>',
  info_text_img_min_width: 'width not less than <strong>{{img_min_w}}px</strong>',
  info_text_img_max_width: 'width not exceeding <strong>{{img_max_w}}px</strong>',
  info_text_img_height_range: 'height between <strong>{{img_min_h}}px</strong> and <strong>{{img_max_h}}px</strong>',
  info_text_img_min_height: 'height not less than <strong>{{img_min_h}}px</strong>',
  info_text_img_max_height: 'height not exceeding <strong>{{img_max_h}}px</strong>',
  info_text_pdf_file: '<strong>PDF</strong> file',
  info_text_svg_file: '<strong>SVG</strong> file',
  info_text_max_filesize: 'max <strong>{{max_filesize}}</strong>',
  info_text_img_aspect_ratio: 'image width/height ratio must be exactly <strong>{{img_aspect_ratio}}</strong>',

  // select or drag labels
  img_single_select_text   : 'Select an image',
  img_single_drag_text     : '&hellip;or drag it here',
  img_multiple_select_text : 'Select one or more images',
  img_multiple_drag_text   : '&hellip;or drag them here',
  doc_single_select_text   : 'Select a file',
  doc_single_drag_text     : '&hellip;or drag it here',
  doc_multiple_select_text : 'Select one or more files',
  doc_multiple_drag_text   : '&hellip;or drag them here',

  sortable_icon_title_text: 'Drag to change order'

};

export default fupl_strings_en;
