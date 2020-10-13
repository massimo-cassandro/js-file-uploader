/*!@preserve
 *
 * FileUploader 2
 * HTML5 / JS Async Uploader
 * Massimo Cassandro 2017-2020
 *
 */


// @codekit-append '_create_info_text.js'
// @codekit-append '_sortable.js'
// @codekit-append '_build_hidden_fields.js'
// @codekit-append '_send_files.js'
// @codekit-append '_set_listeners.js'
// @codekit-append '_create_item.js'
// @codekit-append '_create_uploader.js'

// @codekit-append '_init.js'


import {fupl_strings_it} from './i18n/it.js';
import {default_options} from './_default_options.js';

import {fupl_init} from './_init.js';

export function FileUploader( params ) {
  'use strict';

  /*
  params obj => {
    selector    : [string] selector of fileuploader elements
    options     : [object] custom options
    css         : [string] css url
    local_strs  : [object] localized strings
  }
  */

  fupl_init({
    selector : params.selector || '[data-file-uploader]', // used in fupl_init only
    css      : params.css || null,                        // used in fupl_init only
    opts     : Object.assign( {}, default_options, params.options || {} ),
    strs     : Object.assign( {}, fupl_strings_it, params.local_strs || {} ),
  });
}
