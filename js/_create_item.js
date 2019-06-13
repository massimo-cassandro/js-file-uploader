/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.createItem = (item_data, fupl_options) => {

    try {

      // verifica se il template è una stringa o no
      // nel primo caso viene trasformato in oggetto DOM e vengono effettuate
      // le operazioni comuni a tutti gli elementi
      // il risultato viene quindi riassegnato all'oggetto `fupl_options`
      // per poter essere riutilizzato
      // i template per lementi multipli possono null,
      // in questo caso si utilizza quello per gli elmenti singoli
      let item = fupl_options.templates[fupl_options._type][fupl_options._mode];
      if( item === null && fupl_options._mode === 'multiple' ) {
        item = fupl_options.templates[fupl_options._type]['single'];
      }

      if( typeof item === 'string') {
        let div = document.createElement('div'); // wrapper da rimuovere al momento dell'inserimento
        div.innerHTML = item.trim();
        // aggiunta pulsante rimozione
        div.querySelector('.fupl-remove').innerHTML = fupl_options.templates.remove_btn;
        item = div;
        fupl_options.templates[fupl_options._type][fupl_options._mode] = div;
      }

      /*
        aggiunta dati specifici dell'elemento:

        elementi interni a .fupl-item:
          .fupl-file-name
          .fupl-file-size
          .fupl-img →  img
          .fupl-img → a.href
          .fupl-doc →  a.href

        struttura item_data:
          [
            {
              id    → identificativo univoco del file (può essere anche il percorso sul server)
              name  → nome del file
              url   → url per eventuale tag <a> presente nell'elemento (se immagine può essere assente o null)
              src   → attributo `src` (se immagine) oppure assente o null
              wi    → larghezza in px (se immagine) oppure assente o null
              he    → altezza in px (se immagine) oppure assente o null
              size  → dimensione in bytes
              [...] → eventuali campi aggiuntivi specifici dell'istanza
            }
            [...]
          ]
      */

      // nome file
      let fupl_file_name = item.querySelector('.fupl-file-name');
      if(fupl_file_name && item_data.name ) {
        fupl_file_name.innerHTML = item_data.name;
      }

      // info dimensioni
      let fupl_file_size = item.querySelector('.fupl-file-size');
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
        item.querySelector('.fupl-img').src = item_data.src;
      }

      // url
      let fupl_url = item.querySelector('.fupl-url');
      if( fupl_url && item_data.url) {
        fupl_url.href = item_data.url;
      }

      // id elemento per eventuale cancellazione
      if(item_data.id) {
        item.querySelector('.fupl-item').dataset[upl.data_attributes.item_id] = item_data.id;
      }

      fupl_options.istance_result_wrapper.insertAdjacentHTML('beforeend',
        item.innerHTML
      );

      // aggiunta evento trigger eliminazione elemento
      item = fupl_options.istance_result_wrapper.querySelector('.fupl-item:last-child');
      item.querySelector('.fupl-remove-trigger').addEventListener('click', () => {
        // se l'id non è impostato si tratta di un nuovo elemento,
        // e non va eseguita la cancellazione sul server
        let id = item.dataset[upl.data_attributes.item_id];
        item.remove();
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

    } catch(e) {
      console.error(e); // eslint-disable-line
    }

  }; // end upl.createItem

  return upl;

})(FileUploader2 || {});
