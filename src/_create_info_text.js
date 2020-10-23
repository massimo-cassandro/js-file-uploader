/**
 * create_info_text
 * Creates a string of information about the file requirements
 *
 */

export function create_info_text(fupl) {

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

        if(fupl.opts.img_aspect_ratio) {
          img_size_info.push( fupl.strs.info_text_img_aspect_ratio );
        }
      }
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
