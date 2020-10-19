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
    instance_opts.parsed_img_aspect_ratio = null;
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
            instance_opts.parsed_img_aspect_ratio = +w/+h;
          } else {
            instance_opts.parsed_img_aspect_ratio = Number(instance_opts.img_aspect_ratio);
          }

        } else {
          instance_opts.parsed_img_aspect_ratio = +instance_opts.img_aspect_ratio;
        }

        if(instance_opts.parsed_img_aspect_ratio) {
          instance_opts.parsed_img_aspect_ratio = Math.round((instance_opts.parsed_img_aspect_ratio + Number.EPSILON) * instance_opts.aspect_ratio_accuracy) / instance_opts.aspect_ratio_accuracy;
        }

        if(isNaN(instance_opts.parsed_img_aspect_ratio) || !instance_opts.parsed_img_aspect_ratio) {
          throw new Error();
        }
      } catch(e) {
        console.error(`FileUploader: incorrect aspect ratio parameter → ${instance_opts.img_aspect_ratio}`); // eslint-disable-line
        instance_opts.img_aspect_ratio = null;
        instance_opts.parsed_img_aspect_ratio = null;
      }
    }

    // calling the createUploader function. Global options are completely overwritten
    // by instance_opts
    new createUploader({
      strs: fupl.strs,
      opts: instance_opts
    });

  }); // end document.querySelectorAll(fupl.selector).forEach

}

