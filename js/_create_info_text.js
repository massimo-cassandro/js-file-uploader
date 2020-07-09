FileUploader = ((upl) => {
  'use strict';


  /**
	 * create_info_text
	 * Creates a string of information about the file requirements
	 *
	 */
  upl.create_info_text = fupl_options => {
    let info_text = [];

    switch (fupl_options.filetype) {
      case 'img':
        info_text.push( fupl_options.info_text.std_imgs);
        break;

      case 'img+svg':
        info_text.push( fupl_options.info_text.imgs_svg);
        break;

      case 'svg':
        info_text.push( fupl_options.info_text.svg);
        break;

      case 'pdf':
        info_text.push( fupl_options.info_text.pdf_file);
        break;
    }

    if( fupl_options.max_filesize !== null ) {
      info_text.push( fupl_options.info_text.max_filesize );
    }

    if( fupl_options.filetype === 'img' || fupl_options.filetype === 'img+svg' ) {

      let img_size_info = [];

      if( fupl_options.img_w && fupl_options.img_h ) {
        img_size_info.push( fupl_options.info_text.img_fixed_size );

      } else {

        if(fupl_options.img_min_w && fupl_options.img_min_h && fupl_options.img_min_w === fupl_options.img_min_h) {
          img_size_info.push( fupl_options.info_text.img_equal_min_size );

        } else if(fupl_options.img_max_w && fupl_options.img_max_h && fupl_options.img_max_w === fupl_options.img_max_h) {
          img_size_info.push( fupl_options.info_text.img_equal_max_size );

        } else {

          if( fupl_options.img_w ) {
            img_size_info.push( fupl_options.info_text.img_fixed_width );

          } else if( fupl_options.img_min_w && fupl_options.img_max_w ) {
            img_size_info.push( fupl_options.info_text.img_width_range );

          } else if( fupl_options.img_min_w ) {
            img_size_info.push( fupl_options.info_text.img_min_width );

          } else if( fupl_options.img_max_w  ) {
            img_size_info.push( fupl_options.info_text.img_max_width );
          }

          if( fupl_options.img_h ) {
            img_size_info.push( fupl_options.info_text.img_fixed_height );

          } else if( fupl_options.img_min_h && fupl_options.img_max_h ) {
            img_size_info.push( fupl_options.info_text.img_height_range );

          } else if( fupl_options.img_min_h ) {
            img_size_info.push( fupl_options.info_text.img_min_height );

          } else if( fupl_options.img_max_h ) {
            img_size_info.push( fupl_options.info_text.img_max_height );
          }

          if(fupl_options.img_aspect_ratio) {
            img_size_info.push( fupl_options.info_text.img_aspect_ratio );
          }
        }
      }

      if(img_size_info.length) {
        info_text.push(
          (fupl_options.filetype === 'img+svg' ? fupl_options.info_text.imgs_svg_size_info_text : '') +
          img_size_info.join(', ')
        );
      }
    }

    info_text = info_text.map( item => {
      return item.replace(/{{img_w}}/, fupl_options.img_w)
        .replace(/{{img_h}}/, fupl_options.img_h)
        .replace(/{{img_min_w}}/, fupl_options.img_min_w)
        .replace(/{{img_min_h}}/, fupl_options.img_min_h)
        .replace(/{{img_max_w}}/, fupl_options.img_max_w)
        .replace(/{{img_max_h}}/, fupl_options.img_max_h)
        .replace(/{{img_aspect_ratio}}/, fupl_options.img_aspect_ratio)
        .replace(/{{max_filesize}}/, fupl_options.max_filesize? fupl_options.max_filesize.feedback_size : null);
    });

    let str = info_text.join(fupl_options.info_text_join_string);
    str = str.charAt(0).toUpperCase() + str.slice(1);

    if(fupl_options.info_text_wrap_string && str) {
      str = fupl_options.info_text_wrap_string[0] + str + fupl_options.info_text_wrap_string[1];
    }

    if(fupl_options.filetype === 'svg' || fupl_options.filetype === 'img+svg') {
      str += fupl_options.info_text.svg_optimize_info;
    }

    return str;
  };

  return upl;

})(FileUploader || {});
