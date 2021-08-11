// check for form submit while file-uploader is loading

function checkUncompletedUploads (options) {
  const default_options = {
    alert_api: message => { window.alert(message); },
    message: 'Devi attendere che il caricamento delle immagini sia completato',
    fupl_selector: '.file-uploader2'
  };

  options = Object.assign({}, default_options, options);

  document.querySelectorAll(options.fupl_selector).forEach(item => {

    item.closest('form').addEventListener('submit', e => {

      if(e.target.querySelector('.fupl-is-uploading')) {
        e.preventDefault();
        e.target.querySelectorAll('[type=submit]').forEach(item => { item.disabled=false;});
        options.alert_api(options.message);
      }
    });
  });
}

export default checkUncompletedUploads;
//# sourceMappingURL=check-uncompleted-uploads.esm.js.map
