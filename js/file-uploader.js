/*!@preserve
 *
 * FileUploader 2
 * HTML5 / JS Async Uploader
 * Massimo Cassandro 2017-2021
 *
 */

import fupl_strings_it from './i18n/it.js';
import {default_options} from './src/default-options.js';

import {fupl_init} from './src/init.js';

export default function FileUploader( params ) {

  /*
  params obj => {
    selector    : [string] selector of fileuploader elements
    options     : [object] custom options
    css         : [string] css url
    local_strs  : [object] localized strings
  }
  */

  const _VERSION = '3.1.3';

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
