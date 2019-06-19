/* globals FileUploader2:true */

FileUploader2 = ((upl) => {


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

  upl.createItem = (item_data, fupl_options) => {

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
          .fupl-img →  img
          .fupl-img → a.href
          .fupl-doc →  a.href

      */

      // nome file
      let fupl_file_name = fupl_item_wrapper.querySelector('.fupl-file-name');
      if(fupl_file_name && item_data.name ) {
        fupl_file_name.innerHTML = item_data.name;
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
      // id elemento per eventuale cancellazione
      if(item_data.id) {
        fupl_item.dataset[upl.data_attributes.item_id] = item_data.id;
      }

      if(item_data.loading) {
        fupl_item.classList.add('fupl-is-uploading');
        fupl_item.insertAdjacentHTML('beforeend',
          fupl_options.templates.loading_element
        );
      }

      if(fupl_options._mode === 'single') {
        fupl_options.istance_result_wrapper.innerHTML = fupl_item_wrapper.innerHTML;
      } else {
        fupl_options.istance_result_wrapper.insertAdjacentHTML('beforeend',
          fupl_item_wrapper.innerHTML
        );
      }

      // aggiunta evento trigger eliminazione elemento
      fupl_item_wrapper = fupl_options.istance_result_wrapper.querySelector('.fupl-item:last-child');
      fupl_item_wrapper.querySelector('.fupl-remove-trigger').addEventListener('click', () => {
        // se l'id non è impostato si tratta di un nuovo elemento,
        // e non va eseguita la cancellazione sul server
        let id = fupl_item_wrapper.dataset[upl.data_attributes.item_id];
        fupl_item_wrapper.remove();
        if(id) {
          fupl_options.wrapper.insertAdjacentHTML('beforeend',
            `<input type="hidden" name="${fupl_options.delete_varname}" value="${id}">`
          );
        }

        // controllo se istance_result_wrapper è vuoto
        // in caso positivo aggiunta testo `no_file` ed impostazione su false
        // di fupl_options.wrapper.dataset[upl.data_attributes.hasValues]
        if( !fupl_options.istance_result_wrapper.querySelectorAll('.fupl-item').length ) {
          fupl_options.istance_result_wrapper.innerHTML = fupl_options.templates.no_file[fupl_options._type];
          fupl_options.wrapper.dataset[upl.data_attributes.hasValues] = 'false';
        }

      });

      return fupl_options.istance_result_wrapper.querySelector('.fupl-item:last-child');

    } catch(e) {
      console.error(e); // eslint-disable-line
    }

  }; // end upl.createItem

  return upl;

})(FileUploader2 || {});
