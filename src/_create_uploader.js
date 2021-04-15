import {fupl_utilities} from './_utilities.js';
import {create_info_text} from './_create_info_text.js';
import {activate_sortable} from './_sortable.js';
import {create_item} from './_create_item.js';
import {set_listeners} from './_set_listeners.js';

export function createUploader(fupl) {

  try {

    // check for input[file] and label elements
    let _input = fupl.opts.element.querySelector('input[type="file"]'),
      original_label = fupl.opts.element.querySelector('label');

    // parsing `accept` parameter and attribute, if exist
    if( fupl.opts.filetype === 'auto' ) {

      let accept_attr = [],
        accept_params = [];

      if( fupl.opts.accept !== null ) {
        accept_params = fupl.opts.accept
          .split(',').map( item => item.trim() );
      }

      if(_input && _input.getAttribute('accept') ) {
        accept_attr = _input.getAttribute('accept')
          .split(',').map( item => item.trim() );
      }

      // https://www.peterbe.com/plog/merge-two-arrays-without-duplicates-in-javascript
      fupl.opts.accept = [...new Set([...accept_params, ...accept_attr])];

    } else {
      fupl.opts.accept = fupl_utilities.mimetypes[fupl.opts.filetype];
    }

    // `max_filesize` parsing
    let max_filesize = fupl_utilities.parse_max_filesize(fupl.opts.max_filesize, fupl.opts.locales);
    if( max_filesize === false ) {
      throw new Error( `FileUploader: incorrect value for “max_filesize” parameter (${fupl.opts.max_filesize})`);
    } else {
      fupl.opts.max_filesize = max_filesize;
    }

    // `multiple` parameter or attribute
    fupl.opts.multiple = Boolean(fupl.opts.multiple || (_input && _input.hasAttribute('multiple') ));

    // `required` parameter or attribute
    fupl.opts.required = Boolean(fupl.opts.required || (_input && _input.hasAttribute('required') ));

    // `disabled` parameter or attribute
    fupl.opts.disabled = Boolean(fupl.opts.disabled || (_input && _input.hasAttribute('disabled') ));


    // uploader mode and type
    fupl.opts._type = ['img', 'svg', 'img+svg'].indexOf(fupl.opts.filetype) !== -1? 'img' : 'doc';
    fupl.opts._mode = fupl.opts.multiple? 'multiple' : 'single';

    // label text (from element of `uploader_legend_text` parameter)
    if( !fupl.opts.uploader_legend_text && original_label) {
      fupl.opts.uploader_legend_text = original_label.innerHTML;
    }
    // label not set
    if ( !fupl.opts.uploader_legend_text ) {
      fupl.opts.uploader_legend_text = '__legend__';
    }

    // main class is added to FileUploader element
    fupl.opts.element.classList.add('fupl');

    // wrapper
    fupl.opts.wrapper = document.createElement('fieldset');
    fupl.opts.element.parentNode.insertBefore(fupl.opts.wrapper, fupl.opts.element);
    fupl.opts.wrapper.appendChild(fupl.opts.element);
    fupl.opts.wrapper.classList.add('fupl-wrapper');
    fupl.opts.wrapper.classList.add('fupl-type-' + fupl.opts._type );
    if(fupl.opts.multiple) {
      fupl.opts.wrapper.classList.add('fupl-multiple');
    }
    // custom classes
    if( fupl.opts.wrapper_extra_class ) {
      fupl.opts.wrapper.classList.add( ...fupl.opts.wrapper_extra_class.split(' ') );
    }

    // uploader legend
    if( fupl.opts.uploader_legend ) {
      let _class = ['fupl-legend'];
      if( fupl.opts.uploader_legend_class ) {
        _class.push(fupl.opts.uploader_legend_class);
      }
      if( fupl.opts.required ) {
        _class.push('required');
      }

      fupl.opts.element.insertAdjacentHTML('beforebegin',
        '<legend' + (_class.length? ' class="' + _class.join(' ') + '"' : '') + '>' +
          fupl.opts.uploader_legend_text +
        '</legend>'
      );
      fupl.opts.wrapper.classList.add( 'fupl-has-legend' );
    }

    if(fupl.opts.help_text) {
      fupl.opts.element.insertAdjacentHTML('beforebegin',
        `<div class="fupl-help-text">${fupl.opts.help_text}</div>`
      );
    }

    // uploader template
    fupl.opts.element.innerHTML = fupl.opts.template_main;

    fupl.opts.instance_input = fupl.opts.element.querySelector('.fupl-panel input[type="file"]');
    fupl.opts.instance_label = fupl.opts.element.querySelector('.fupl-panel label');
    fupl.opts.instance_dd_text = fupl.opts.element.querySelector('.fupl-panel .fupl-dd-text');
    fupl.opts.instance_info_text = fupl.opts.element.querySelector('.fupl-panel .fupl-info-text');
    fupl.opts.instance_result_wrapper = fupl.opts.element.querySelector('.fupl-result');


    // inserting text and attributes
    // if( fupl.opts.required ) {
    //   fupl.opts.instance_input.setAttribute('required', '');
    // }
    if( fupl.opts.multiple ) {
      fupl.opts.instance_input.setAttribute('multiple', '');
    }
    if( fupl.opts.accept !== null ) {
      fupl.opts.instance_input.setAttribute('accept', fupl.opts.accept.join(','));
    }

    // adding data-required attribute to wrapper
    if( fupl.opts.required ) {
      fupl.opts.wrapper.dataset.required = 'true';
    }

    // adding data-disabled attribute to wrapper
    if( fupl.opts.disabled ) {
      fupl.opts.wrapper.setAttribute('disabled', true);
      fupl.opts.wrapper.setAttribute('aria-disabled', true);
    }


    fupl.opts.instance_label.insertAdjacentHTML('beforeend',
      fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_select_text`]
    );
    if(fupl.opts.input_label_class) {
      fupl.opts.instance_label.classList.add(...fupl.opts.input_label_class.split(' '));
    }
    fupl.opts.instance_dd_text.innerHTML = fupl.strs[`${fupl.opts._type}_${fupl.opts._mode}_drag_text`];



    // info text
    if( fupl.opts.show_info_text ) {
      if(fupl.opts.custom_info_text) {
        fupl.opts.instance_info_text.innerHTML = fupl.opts.custom_info_text;
      } else {
        fupl.opts.instance_info_text.innerHTML = create_info_text(fupl);
      }
    }


    // Sortable
    if( fupl.opts.sortable) {
      if( fupl.opts.multiple && fupl.opts.sortable_varname ) {

        activate_sortable(fupl.opts);

      } else {
        throw new Error('FileUploader: incorrect “sortable” settings:\n' +
          `"sortable": ${fupl.opts.sortable? 'true' : 'false'}\n` +
          `"multiple": ${fupl.opts.multiple? 'true' : 'false'}\n` +
          `"sortable_varname": "${fupl.opts.sortable_varname}"`
        );
      }

    }

    // adding registered values
    // fupl.opts.values must be an array of objects
    // if it is a single object, it is wrapped in an array
    if(fupl.opts.values) {
      if(typeof fupl.opts.values === 'object') {
        if(!Array.isArray(fupl.opts.values)) {
          fupl.opts.values = [fupl.opts.values];
        }
      } else {
        throw new Error('FileUploader: incorrect “values” parameter');
      }
    }

    if( fupl.opts.values && fupl.opts.values.length ) {

      fupl.opts.values.forEach( item => {
        create_item(item, fupl, true); // true means that the element comes from the server
      });

    }
    fupl_utilities.set_has_values(fupl);

    // gestione aggiunta nuovi elementi
    set_listeners(fupl);


    // calling init_callback, if present
    if( fupl.opts.init_callback !== null ) {
      fupl_utilities.exec_callback(fupl.opts.init_callback, fupl);
    }

    // calling fancybox_callback_func, if present
    if( fupl.opts.fancybox && fupl.opts.fancybox_callback_func !== null ) {
      fupl_utilities.exec_callback(fupl.opts.fancybox_callback_func, fupl.opts);
    }

    //debug
    if( fupl.opts.debug ) {
      /* eslint-disable */

      const sorted_options= Object.keys(fupl.opts).sort()
        .reduce((result, key) => ( result[key] = fupl.opts[key], result), {} );

      //fupl.opts is exposed as global object for debug purposes
      if(window.fileUploderOpts === undefined) {
        window.fileUploderOpts = {};
      }
      window.fileUploderOpts[fupl.opts.varname] = sorted_options;

      console.groupCollapsed(`FileUploader ${fupl.opts._vers} options`);
        console.log(sorted_options);
      console.groupEnd();

      /* eslint-enable */
    } // end if debug

  } catch(e) { //throw "error"
    console.error( e ); // eslint-disable-line
  } // finally {}

} // end createUploader

