/*
  based on
  - https://github.com/WolfgangKurz/grabbable

  references:
  - https://codepen.io/therealDaze/pen/ZaoErp
  - https://github.com/gridstack/gridstack.js
  - https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API
  - https://www.html5rocks.com/en/tutorials/dnd/basics/
  - https://kryogenix.org/code/browser/custom-drag-image.html
  - http://jsfiddle.net/zfnj5rv4/
*/

let dragged_element = null,
  uploader_is_disabled = false;

const classes = {

    // class added to the FileUploader elment (fupl_options.element)
    // when a drag is started. It is removed at dragleave
    sorting_class: 'fupl-sorting',

    // same way, class added to the dragged element
    sorting_item_class: 'fupl-item-sorting',

    // class added to an item on dragover
    over_item_class: 'fupl-item-dragover'
  },

  // broken events cleaning
  resetAll = () => {

    if( dragged_element ) {
      dragged_element.classList.remove(classes.sorting_item_class);

      dragged_element.parentNode.querySelectorAll('.' + classes.over_item_class).forEach(item => {
        item.classList.remove(classes.over_item_class);
      });

      dragged_element.closest('.fupl').classList.remove(classes.sorting_class);
    }

    dragged_element = null;
  };

export function add_sortable_events(fupl_item, fupl_options) {

  // start dragging
  fupl_item.addEventListener('dragstart', function(e) {
    uploader_is_disabled = fupl_options.wrapper.disabled;
    resetAll();
    if(!uploader_is_disabled) {

      dragged_element = this;

      // `classes.sorting_class` is added to the dragged element
      // this prevents the feedback triggered when external files are dropped
      // in the broswer (look at scss/_fupl.scss)
      fupl_options.element.classList.add(classes.sorting_class);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', 'fupl-sorting');

      this.classList.add(classes.sorting_item_class);
    }

  }, false);

  // enter positioning over another element (→ e.target == this)
  fupl_item.addEventListener('dragenter', function(e) {

    // disabled for external files or when the uploader is disabled
    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
      if( this !== dragged_element ) {
        this.classList.add(classes.over_item_class);
      }
    }

  }, false);

  // positioning over another element (→ e.target)
  fupl_item.addEventListener('dragover', function(e) {
    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled ) {

      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      if( this !== dragged_element ) {
        this.classList.add(classes.over_item_class);
      }
    }

    return false;
  }, false);

  // exit positioning over another element
  fupl_item.addEventListener('dragleave', function() {

    this.classList.remove(classes.over_item_class);
  }, false);

  // drop
  fupl_item.addEventListener('drop', function(e) {
    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }

      e.preventDefault();

      if(dragged_element) {
        if(this.previousElementSibling === dragged_element && this.nextElementSibling ) {
          this.parentNode.insertBefore(dragged_element, this.nextElementSibling);

        } else if( this.nextElementSibling ) {
          this.parentNode.insertBefore(dragged_element, this);

        // if target element is the last one, the dropped one is positioned after it
        } else {
          this.parentNode.insertAdjacentElement('beforeend', dragged_element);
        }
      }
      resetAll();
    }

    return false;

  }, false);

  // end dragging
  fupl_item.addEventListener('dragend', function(e) {

    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
      fupl_options.element.classList.remove(classes.sorting_class);
      resetAll();

      // order variable
      fupl_options.instance_result_wrapper.querySelectorAll('.fupl-sortable-order').forEach((item,idx) => {
        item.value = idx;
      });
    }

  }, false);
} // end add_sortable_events


export function activate_sortable(fupl_options) {

  // class added to `fupl_options.instance_result_wrapper`
  // when `sortable` option is activated
  fupl_options.instance_result_wrapper.classList.add( 'fupl-sortable' );

}
