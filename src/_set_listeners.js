import {send_files} from './_send_files.js';
import {fupl_alert} from './_alert.js';

// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
export function set_listeners(fupl) {

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fupl.opts.element.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragover', 'dragenter'].forEach(eventName => {
    fupl.opts.element.addEventListener(eventName, () => {
      fupl.opts.element.classList.add( fupl.opts.element_dragover_class );
    }, false);
  });

  ['dragleave', 'dragend'].forEach(eventName => {
    fupl.opts.element.addEventListener(eventName, () => {
      fupl.opts.element.classList.remove( fupl.opts.element_dragover_class );
    }, false);
  });

  fupl.opts.element.addEventListener('drop', (e) => {
    fupl.opts.element.classList.remove( fupl.opts.element_dragover_class );
    if(!fupl.opts.wrapper.hasAttribute('disabled')) {
      let files = e.dataTransfer.files;

      if(files.length) { // if 0 is a reordering or another event
        if( !fupl.opts.multiple && files.length > 1 ) {
          fupl_alert(fupl.strs.alert_too_much_files, fupl.opts);
        } else {
          send_files( files, fupl );
        }
      }
    }
  }, false);

  // selecting thru input element
  fupl.opts.instance_input.addEventListener('change', () => {
    send_files( fupl.opts.instance_input.files, fupl );
  });

}
