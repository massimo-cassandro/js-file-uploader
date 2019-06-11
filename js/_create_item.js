/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.createItem = (item_data, fupl_options) => {

    const stampaBytes = bytes => {
      bytes = +bytes;
      let mega = 1024*1024;
      if(bytes >= mega ) {
        return (bytes/mega).toLocaleString(fupl_options.locales, {maximumFractionDigits: 1}) + '<span class="fupl-unit">MB</span>';
      } else {
        return Math.round(bytes/1024).toLocaleString(fupl_options.locales, {maximumFractionDigits: 0}) + '<span class="fupl-unit">KB</span>';
      }
    };

    try {

      // verifica se il template è una stringa o no
      // nel primo caso viene trasformato in oggetoo DOM e vengono effettuate
      // le operazioni comuni a tutti gli elementi
      let item = fupl_options.templates[fupl_options._type][fupl_options._mode];

      if( typeof item === 'string') {
        let div = document.createElement('div'); // wrapper da rimuovere al momento dell'inserimento
        div.innerHTML = item.trim();
        // aggiunta pulsante rimozione
        div.querySelector('.fupl-elimina').innerHTML = fupl_options.templates.remove_btn;
        item = div;
        fupl_options.templates[fupl_options._type][fupl_options._mode] = div;
      }

      /*
        aggiunta dati specifici dell'elemento:

        .fupl-file-name
        .fupl-file-size
        .fupl-img →  img
        .fupl-img → a.href
        .fupl-doc →  a.href
      */

      let fupl_file_name = item.querySelector('.fupl-file-name');
      if(fupl_file_name && item_data.name ) {
        fupl_file_name.innerHTML = item_data.name;
      }

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
          size_string += stampaBytes(item_data.size);
        }

        fupl_file_size.innerHTML = size_string;
      }

      fupl_options.istance_result_wrapper.insertAdjacentHTML('beforeend',
        item.innerHTML
      );
    } catch(e) {
      console.error(e); // eslint-disable-line
    }

  }; // end upl.createItem

  return upl;

})(FileUploader2 || {});
