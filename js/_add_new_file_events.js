/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
  upl.addNewItemHandlers = (fupl_options) => {

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      fupl_options.element.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    ['dragover', 'dragenter'].forEach(eventName => {
      fupl_options.element.addEventListener(eventName, () => {
        fupl_options.element.classList.add( fupl_options.element_dragover_class );
      }, false);
    });

    ['dragleave', 'dragend'].forEach(eventName => {
      fupl_options.element.addEventListener(eventName, () => {
        fupl_options.element.classList.remove( fupl_options.element_dragover_class );
      }, false);
    });

    fupl_options.element.addEventListener('drop', (e) => {
      fupl_options.element.classList.remove( fupl_options.element_dragover_class );

      let files = e.dataTransfer.files;

      if( !fupl_options.multiple && files.length > 1 ) {
        fupl_options.alert_api(fupl_options.alert_messages.tooMuchFiles, fupl_options);
      } else {
        upl.sendFiles( files, fupl_options );
      }
    }, false);

    // selezione tramite input
    fupl_options.istance_input.addEventListener('change', () => {
      upl.sendFiles( fupl_options.istance_input.files, fupl_options );
    });

  }; // end upl.createItem

  return upl;

})(FileUploader2 || {});
