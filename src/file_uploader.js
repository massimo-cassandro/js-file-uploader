/*!@preserve
 *
 * FileUploader 2
 * HTML5 / JS Async Uploader
 * Massimo Cassandro 2017-2020
 *
 */

import fupl_strings_it from './i18n/it.js';
import {default_options} from './_default_options.js';

import {fupl_init} from './_init.js';

export default function FileUploader( params ) {

  /*
  params obj => {
    selector    : [string] selector of fileuploader elements
    options     : [object] custom options
    css         : [string] css url
    local_strs  : [object] localized strings
  }
  */

  const version =  '2.2';

  fupl_init({
    selector : params.selector || '.file-uploader2',            // used in fupl_init only
    css      : params.css || null,                     // used in fupl_init only
    opts     : Object.assign( {_vers: version}, default_options, params.options || {} ),
    strs     : Object.assign( {}, fupl_strings_it, params.local_strs || {} )
  });
}
