import {fupl_utilities} from './_utilities.js';
import {createUploader} from './_create_uploader.js';

export  function fupl_init(fupl) {
  'use strict';

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

