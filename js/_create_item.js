FileUploader = ((upl) => {


  /*
  Aggiunge un elemento a fupl_options.istance_result_wrapper
  e imposta i necessari listeners

  item_data è l'oggetto con i dati dell'elemento:

  {
    id    → identificativo univoco del file (può essere anche il percorso sul server)
    name  → nome del file
    url   → url per eventuale tag <a> presente nell'elemento (se immagine può essere assente o null)
    src   → attributo `src` obbligatorio se immagine, oppure assente o null
    wi    → larghezza in px se immagine oppure assente o null
    he    → altezza in px se immagine oppure assente o null
    size  → dimensione in bytes
    loading → true se se si tratta di un elemento in fase di upload
    [...] → eventuali campi aggiuntivi specifici dell'istanza
  }

  */

  upl.createItem = (item_data, fupl_options, preregistered = false) => {

    try {

      let item_markup = fupl_options.templates[fupl_options._type][fupl_options._mode];
      if( item_markup === null && fupl_options._mode === 'multiple' ) {
        item_markup = fupl_options.templates[fupl_options._type]['single'];
      }

      let fupl_item_wrapper = document.createElement('div'); // wrapper da rimuovere al momento dell'inserimento
      fupl_item_wrapper.innerHTML = item_markup;

      // aggiunta pulsante rimozione
      fupl_item_wrapper.querySelector('.fupl-remove').innerHTML = fupl_options.templates.remove_btn;



      /*
        aggiunta dati specifici dell'elemento:

        elementi interni a fupl-item:
          .fupl-file-name
          .fupl-file-size
          .fupl-img → img
          .fupl-img → a.href
          .fupl-doc → a.href

      */

      // nome file
      let fupl_file_name = fupl_item_wrapper.querySelector('.fupl-file-name');
      if(fupl_file_name && item_data.name ) {
        fupl_file_name.innerHTML = item_data.name;
        fupl_file_name.title = item_data.name;
      }

      // info dimensioni
      let fupl_file_size = fupl_item_wrapper.querySelector('.fupl-file-size');
      if(fupl_file_size ) {
        let size_string = '';
        if(fupl_options._type === 'img' && item_data.wi && item_data.he) {
          size_string = item_data.wi + '&times;' + item_data.he + '<span class="fupl-unit">px</span>';
          if(item_data.size) {
            size_string += ' &ndash; ';
          }
        }
        if(item_data.size) {
          size_string += upl.parse_filesize(item_data.size, fupl_options.locales);
        }

        fupl_file_size.innerHTML = size_string;
      }

      // immagine
      if( fupl_options._type === 'img' ) {
        fupl_item_wrapper.querySelector('.fupl-img').src = item_data.src;
      }

      // url
      let fupl_url = fupl_item_wrapper.querySelector('.fupl-url');
      if( fupl_url && item_data.url) {
        fupl_url.href = item_data.url;
      }

      let fupl_item = fupl_item_wrapper.querySelector('.fupl-item');


      if(item_data.loading) {
        fupl_item.classList.add('fupl-is-uploading');
        fupl_item.insertAdjacentHTML('beforeend',
          fupl_options.templates.loading_element
        );
      }

      if(fupl_options._mode === 'single') {
        fupl_options.istance_result_wrapper.innerHTML = fupl_item_wrapper.innerHTML;
      } else {

        // se non esistono elementi caricati predentemente, si svuota il div per
        // eliminare la scritta no file
        if( !fupl_options.istance_result_wrapper.querySelector('.fupl-item')) {
          fupl_options.istance_result_wrapper.innerHTML = '';
        }

        fupl_options.istance_result_wrapper.insertAdjacentHTML('beforeend',
          fupl_item_wrapper.innerHTML
        );
      }

      let fupl_item_dom = fupl_options.istance_result_wrapper.querySelector('.fupl-item:last-child');
      fupl_item_dom.dataset[upl.data_attributes.item_id] = item_data.id;

      // aggiunta evento trigger eliminazione elemento
      fupl_item_dom.querySelector('.fupl-remove-trigger').addEventListener('click', () => {
        fupl_item_dom.remove();

        let prereg_id = item_data.rel_id? item_data.rel_id : item_data.id;

        if(prereg_id && preregistered) {
          fupl_options.wrapper.insertAdjacentHTML('beforeend',
            `<input type="hidden" name="${fupl_options.delete_varname}" value="${prereg_id}">`
          );
        }

        // controllo se istance_result_wrapper è vuoto
        // e impostazione di attributo e contenuti
        upl.set_has_values(fupl_options);

      });

      //fancybox
      if( fupl_options.fancybox && fupl_options._type === 'img' && item_data.url && fupl_options.fancybox_anchor_markup) {
        // controllo esistenza tag `a.fupl-url` e aggiunta se necessario
        if( !fupl_item_dom.querySelector('a.fupl-url') ) {

          let img_element = fupl_item_dom.querySelector('.fupl-img'),
            fancybox_wrapper = document.createElement('div');
          fancybox_wrapper.innerHTML = fupl_options.fancybox_anchor_markup;

          fancybox_wrapper = fancybox_wrapper.firstChild;
          img_element.parentNode.insertBefore(fancybox_wrapper, img_element);
          fancybox_wrapper.appendChild(img_element);
        }

        fupl_item_dom.querySelector('a.fupl-url').setAttribute('href', item_data.url);

      }

      // extra fields
      let extra_fields_wrapper = fupl_item_dom.querySelector('.fupl-extra-fields');
      if(fupl_options.extra_fields !== null && extra_fields_wrapper) {

        fupl_options.extra_fields.forEach( item => {
          extra_fields_wrapper.insertAdjacentHTML('beforeend',
            item.markup.replace(/{{idx}}/g, item_data.id)
              .replace(/{{val}}/g, preregistered && item_data[item.value_key]? item_data[item.value_key] : '')
              .replace(/{{checked}}/g, preregistered && +item_data[item.value_key]? 'checked' : '')
              .replace(/{{name}}/g,
                (preregistered && fupl_options.registered_extra_field_varname?
                  fupl_options.registered_extra_field_varname : fupl_options.varname) +
                '[' +
                ((item.use_rel_id && item_data.rel_id)? item_data.rel_id : item_data.id) +
                '][' + item.value_key + ']'
              )
          );
        });
      }

      // sortable
      if( fupl_options.sortable ) {
        fupl_item_dom.setAttribute('draggable', true);

        // il valore ordine comincia da zero
        let order_value = fupl_options.istance_result_wrapper.querySelectorAll('.fupl-item').length -1;

        fupl_item_dom.insertAdjacentHTML('beforeend',
          '<input type="hidden" class="fupl-sortable-order" ' +
            `name="${fupl_options.sortable_varname}[${item_data.id}]" value="${order_value}">`
        );
        if(fupl_options.sortable_icon) {
          fupl_item_dom.querySelector('.fupl-sortable-icon').innerHTML = fupl_options.sortable_icon;
        }
        upl.addSortableEvents(fupl_item_dom, fupl_options);
      }

      return fupl_options.istance_result_wrapper.querySelector('.fupl-item:last-child');

    } catch(e) {
      console.error(e); // eslint-disable-line
    }

  }; // end upl.createItem

  return upl;

})(FileUploader || {});
