FileUploader = ((upl) => {

  upl.createUploader = (fupl_options) => {

    // eventuale campo input e relativo tag label
    let _input = fupl_options.element.querySelector('input[type="file"]'),
      original_label = fupl_options.element.querySelector('label');


    // implementazione eventuali parametro/attributo `accept`
    if( fupl_options.filetype === 'auto' ) {

      let accept_attr = [],
        accept_params = [];

      if( fupl_options.accept !== null ) {
        accept_params = fupl_options.accept
          .split(',').map( item => item.trim() );
      }

      if(_input && _input.getAttribute('accept') ) {
        accept_attr = _input.getAttribute('accept')
          .split(',').map( item => item.trim() );
      }

      // https://www.peterbe.com/plog/merge-two-arrays-without-duplicates-in-javascript
      fupl_options.accept = [...new Set([...accept_params, ...accept_attr])];

    } else {
      fupl_options.accept = upl.mimetypes[fupl_options.filetype];
    }

    // elaborazione max_filesize
    let max_filesize = upl.parse_max_filesize(fupl_options.max_filesize, fupl_options.locales);
    if( max_filesize === false ) {
      throw new Error( '"' + fupl_options.max_filesize + '" non è un valore corretto per `max_filesize`');
    } else {
      fupl_options.max_filesize = max_filesize;
    }

    // parametro o attributo multiple
    fupl_options.multiple = Boolean(fupl_options.multiple ||
      (_input && _input.hasAttribute('multiple') ));

    // parametro o attributo required
    fupl_options.required = Boolean(fupl_options.required ||
      (_input && _input.hasAttribute('required') ));

    // parametro o attributo disabled
    fupl_options.disabled = Boolean(fupl_options.disabled ||
      (_input && _input.hasAttribute('disabled') ));


    // tipologia generale dell'uploader (img o doc) e modalità
    // selezione file
    fupl_options._type = ['img', 'svg', 'img+svg'].indexOf(fupl_options.filetype) !== -1? 'img' : 'doc';
    fupl_options._mode = fupl_options.multiple? 'multiple' : 'single';

    // testo label (da tag o parametro uploader_legend_text)
    if( !fupl_options.uploader_legend_text && original_label) {
      fupl_options.uploader_legend_text = original_label.innerHTML;
    }
    // caso in cui sia presente nessun valore
    if ( !fupl_options.uploader_legend_text ) {
      fupl_options.uploader_legend_text = '__legend non presente__';
    }

    // aggiunta della classe principale
    fupl_options.element.classList.add('fupl');

    // aggiunta wrapper
    fupl_options.wrapper = document.createElement('fieldset');
    fupl_options.element.parentNode.insertBefore(fupl_options.wrapper, fupl_options.element);
    fupl_options.wrapper.appendChild(fupl_options.element);
    fupl_options.wrapper.classList.add('fupl-wrapper');
    fupl_options.wrapper.classList.add('fupl-type-' + fupl_options._type );
    if(fupl_options.multiple) {
      fupl_options.wrapper.classList.add('fupl-multiple');
    }
    // aggiunta eventuali classi personalizzate
    if( fupl_options.wrapper_extra_class ) {
      fupl_options.wrapper.classList.add( ...fupl_options.wrapper_extra_class.split(' ') );
    }

    // aggiunta legend uploader
    if( fupl_options.uploader_legend ) {
      let _class = ['fupl-legend'];
      if( fupl_options.uploader_legend_class ) {
        _class.push(fupl_options.uploader_legend_class);
      }
      if( fupl_options.required ) {
        _class.push('required');
      }

      fupl_options.element.insertAdjacentHTML('beforebegin',
        '<legend' + (_class.length? ' class="' + _class.join(' ') + '"' : '') + '>' +
          fupl_options.uploader_legend_text +
        '</legend>'
      );
      fupl_options.wrapper.classList.add( 'fupl-has-legend' );
    }

    // aggiunta template uploader
    fupl_options.element.innerHTML = fupl_options.templates.main;

    fupl_options.istance_input = fupl_options.element.querySelector('.fupl-panel input[type="file"]');
    fupl_options.istance_label = fupl_options.element.querySelector('.fupl-panel label');
    fupl_options.istance_dd_text = fupl_options.element.querySelector('.fupl-panel .fupl-dd-text');
    fupl_options.istance_info_text = fupl_options.element.querySelector('.fupl-panel .fupl-info-text');
    fupl_options.istance_result_wrapper = fupl_options.element.querySelector('.fupl-result');


    // inserimento testi e attributi
    // if( fupl_options.required ) {
    //   fupl_options.istance_input.setAttribute('required', '');
    // }
    if( fupl_options.multiple ) {
      fupl_options.istance_input.setAttribute('multiple', '');
    }
    if( fupl_options.accept !== null ) {
      fupl_options.istance_input.setAttribute('accept', fupl_options.accept.join(','));
    }

    // aggiunta attributo data al wrapper per segnalare il required
    if( fupl_options.required ) {
      fupl_options.wrapper.dataset[upl.data_attributes.required] = 'true';
    }

    // aggiunta attributo disabled al wrapper
    if( fupl_options.disabled ) {
      fupl_options.wrapper.setAttribute('disabled', true);
      fupl_options.wrapper.setAttribute('aria-disabled', true);
    }


    fupl_options.istance_label.insertAdjacentHTML('beforeend',
      fupl_options.input_text[fupl_options._type][fupl_options._mode][0]
    );
    if(fupl_options.input_label_class) {
      fupl_options.istance_label.classList.add(...fupl_options.input_label_class.split(' '));
    }
    fupl_options.istance_dd_text.innerHTML = fupl_options.input_text[fupl_options._type][fupl_options._mode][1];

    // info text
    if( fupl_options.show_info_text ) {
      if(fupl_options.custom_info_text) {
        fupl_options.istance_info_text.innerHTML = fupl_options.custom_info_text;
      } else {
        fupl_options.istance_info_text.innerHTML = upl.create_info_text(fupl_options);
      }

      if(fupl_options.help_text) {
        fupl_options.istance_info_text.insertAdjacentHTML('beforeend',
          '<br>' + fupl_options.help_text
        );
      }
    }


    // Sortable
    if( fupl_options.sortable) {
      if( fupl_options.multiple && fupl_options.sortable_varname ) {

        upl.activateSortable(fupl_options);

      } else {
        console.error('"sortable" option incorrectly set'); // eslint-disable-line
        fupl_options.sortable = false;
      }

    }

    // aggiunta valori
    // se values esiste ma è un oggetto, viene inserito in un array (non è garanzia di funzionamento)
    // se è un altro tipo di variabile viene generato un errore
    if(fupl_options.values) {
      if(typeof fupl_options.values === 'object') {
        if(!Array.isArray(fupl_options.values)) {
          fupl_options.values = [fupl_options.values];
        }
      } else {
        console.error("Il parametro `values` non è corretto"); // eslint-disable-line
      }
    }

    if( fupl_options.values && fupl_options.values.length ) {

      fupl_options.values.forEach( item => {
        upl.createItem(item, fupl_options, true); // true means that the element comes from the server
      });

    }
    upl.set_has_values(fupl_options);

    // gestione aggiunta nuovi elementi
    upl.setListeners(fupl_options);


    // calling init_callback, if present
    if( fupl_options.init_callback !== null ) {
      upl.exec_callback(fupl_options.init_callback, fupl_options);
    }

    // calling fancybox_callback_func, if present
    if( fupl_options.fancybox && fupl_options.fancybox_callback_func !== null ) {
      upl.exec_callback(fupl_options.fancybox_callback_func, fupl_options);
    }

    //debug
    if( fupl_options.debug ) {
      /* eslint-disable */
      /* console.groupCollapsed('FileUploader options');
        // creazione di un oggetto bidimensinale per
        // semplificare la rappresentazione in tabella
        let c_options = {},
        c_keys = Object.keys(fupl_options);
        c_keys.sort();
        c_keys.forEach(item => {
          let _toStringify = typeof fupl_options[item] === 'object' &&
          fupl_options[item] !== null &&
            item !== 'element';
          c_options[item] = _toStringify ? JSON.stringify(fupl_options[item], null, ' ') : fupl_options[item];
        });
        console.table(c_options);
        console.groupCollapsed('fupl_options');
          console.log(fupl_options);
        console.groupEnd();
      console.groupEnd();
      */

      console.groupCollapsed('FileUploader options');
        console.log(fupl_options);
      console.groupEnd();

      /* eslint-enable */
    } // end if debug


  }; // end upl.createUploader

  return upl;

})(FileUploader || {});
