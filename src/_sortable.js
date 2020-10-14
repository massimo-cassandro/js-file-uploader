/*
  basato su
  - https://github.com/WolfgangKurz/grabbable

  altri riferimenti:
  - https://codepen.io/therealDaze/pen/ZaoErp
  - https://github.com/gridstack/gridstack.js
  - https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API
  - https://www.html5rocks.com/en/tutorials/dnd/basics/
  - https://kryogenix.org/code/browser/custom-drag-image.html
  - http://jsfiddle.net/zfnj5rv4/
*/

export function add_sortable_events(fupl_item, fupl_options) {
  'use strict';

  let dragged_element = null,
    uploader_is_disabled = false;

  const classes = {

      // classe aggiunta all'elemento principale (fupl_options.element) quando
      // si trascina un elemento. Viene eliminata al dragleave
      sorting_class: 'fupl-sorting',

      // stesso criterio, ma classe aggiunta all'elemento trascinato
      sorting_item_class: 'fupl-item-sorting',

      // classe aggiunta all'elemento in seguito all'evento dragover
      over_item_class: 'fupl-item-dragover'
    },

    // pulisce eventuali eventi non conclusi correttamente
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


  // trascinamento avviato
  fupl_item.addEventListener('dragstart', function(e) {

    uploader_is_disabled = fupl_options.wrapper.disabled;
    resetAll();
    if(!uploader_is_disabled) {

      dragged_element = this;

      // aggiunta classe `.fupl-sorting` all'elemento fupl per disattivare il feedback
      // del drag&drop esterno al browser (vedi scss/_fupl.scss)
      fupl_options.element.classList.add(classes.sorting_class);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', 'fupl-sorting');

      this.classList.add(classes.sorting_item_class);
    }
  }, false);

  // inizio posizionamento sopra un altro elemento
  // e.target (this) è l'elemento
  fupl_item.addEventListener('dragenter', function(e) {
    // non si attiva per file dall'esterno e per uploader disbilitato
    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
      if( this !== dragged_element ) {
        this.classList.add(classes.over_item_class);
      }
    }
  }, false);

  // posizionamento sopra un altro elemento
  // e.target è l'elemento
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

  // uscita posizionamento sopra un altro elemento
  // e.target è l'elemento
  fupl_item.addEventListener('dragleave', function() {
    this.classList.remove(classes.over_item_class);
  }, false);

  // drop e.target è l'elemento
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

        // se si tratta dell'ultimo elemento si mette alla fine
        } else {
          this.parentNode.insertAdjacentElement('beforeend', dragged_element);
        }
      }
      resetAll();
    }

    return false;

  }, false);

  // trascinamento terminato
  fupl_item.addEventListener('dragend', function(e) {

    if( e.dataTransfer.getData('text') === 'fupl-sorting' && !uploader_is_disabled) {
      fupl_options.element.classList.remove(classes.sorting_class);
      resetAll();

      //variable order
      fupl_options.instance_result_wrapper.querySelectorAll('.fupl-sortable-order').forEach((item,idx) => {
        item.value = idx;
      });
    }

  }, false);
} // end add_sortable_events


export function activate_sortable(fupl_options) {
  'use strict';

  // classe aggiunta all'elemento fupl_options.instance_result_wrapper se l'opzione
  // sortable è attiva
  fupl_options.instance_result_wrapper.classList.add( 'fupl-sortable' );

}
