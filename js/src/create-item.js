/*
  Add an element to fupl.opts.instance_result_wrapper
  and set all needed listeners

  `item_data` obj contains all element data:
    {
      id      → file unique id (can be file path too)
      name    → file name
      url     → url for any <a> tag present in the element (if it is an image can be a null or not set)
      src     → `src` attribute. Required if element is an image, otherwise null or not set
      wi      → image px width (null or not set if not image)
      he      → image px height (null or not set if not image)
      size    → file size (bytes)
      loading → `true` if it is an item being uploaded
      ...     → any additional instance-specific fields
    }

  `fupl`                    : is the fupl object
  `preregistered` === true  : means that the element was previously saved and comes
                              from the `fupl.opts.values` array

*/

import {fupl_utilities} from './utilities.js';
import {add_sortable_events} from './sortable.js';

export function create_item(item_data, fupl, preregistered = false) {

  try {

    let item_markup = fupl.opts[`template_${fupl.opts._type}_item_${fupl.opts._mode}`];
    if( item_markup === null && fupl.opts._mode === 'multiple' ) {
      item_markup = fupl.opts[`template_${fupl.opts._type}_item_single`];
    }

    let fupl_item_wrapper = document.createElement('div'); // wrapper to be removed after inserting
    fupl_item_wrapper.innerHTML = item_markup;

    // delete button
    let fupl_remove = fupl_item_wrapper.querySelector('.fupl-remove');
    if(fupl_remove) {
      fupl_remove.innerHTML = fupl.opts.template_remove_btn
        .replace(/{{remove_btn_text}}/g, fupl.strs.remove_btn_text);
    }

    /*
      element data
      ============================

      each fupl-item element contains:
        .fupl-file-name
        .fupl-file-size
        .fupl-img → img
        .fupl-img → a.href
        .fupl-doc → a.href

    */

    // file name
    let fupl_file_name = fupl_item_wrapper.querySelector('.fupl-file-name');
    if(fupl_file_name && item_data.name ) {
      fupl_file_name.innerHTML = item_data.name;
      fupl_file_name.title = item_data.name;
    }

    // size info
    let fupl_file_size = fupl_item_wrapper.querySelector('.fupl-file-size');
    if(fupl_file_size ) {
      let size_string = '';
      if(fupl.opts._type === 'img' && item_data.wi && item_data.he) {
        size_string = item_data.wi + '&times;' + item_data.he + '<span class="fupl-unit">px</span>';
        if(item_data.size) {
          size_string += ' &ndash; ';
        }
      }
      if(item_data.size) {
        size_string += fupl_utilities.parse_bytes_value(item_data.size, fupl.opts.locales);
      }

      fupl_file_size.innerHTML = size_string;
    }

    // image
    if( fupl.opts._type === 'img' ) {
      fupl_item_wrapper.querySelector('.fupl-img').src = item_data.src;
    }

    // url
    let fupl_url = fupl_item_wrapper.querySelector('.fupl-url');
    if( fupl_url) {
      if(item_data.url) {
        fupl_url.href = item_data.url;
      } else {
        // cambia il tag <a> in <span> se non c'è l'url (al momento del caricamento)
        let span = document.createElement('span');
        span.innerHTML = fupl_url.innerHTML;
        fupl_url.parentNode.replaceChild(span, fupl_url);
      }
    }

    let fupl_item = fupl_item_wrapper.querySelector('.fupl-item');


    if(item_data.loading) {
      fupl_item.classList.add('fupl-is-uploading');
      fupl_item.insertAdjacentHTML('beforeend',
        fupl.opts.template_loading_element
      );
    }

    if(fupl.opts._mode === 'single') {
      fupl.opts.instance_result_wrapper.innerHTML = fupl_item_wrapper.innerHTML;
    } else {

      // instance_result_wrapper cleaning (to remove 'no file' string, if present)
      if( !fupl.opts.instance_result_wrapper.querySelector('.fupl-item')) {
        fupl.opts.instance_result_wrapper.innerHTML = '';
      }

      fupl.opts.instance_result_wrapper.insertAdjacentHTML('beforeend',
        fupl_item_wrapper.innerHTML
      );
    }


    let fupl_item_dom = fupl.opts.instance_result_wrapper.querySelector('.fupl-item:last-child');
    fupl_item_dom.dataset.id = item_data.id;

    // remove element listener
    let fupl_remove_trigger = fupl_item_dom.querySelector('.fupl-remove-trigger');
    if(fupl_remove_trigger) {
      fupl_remove_trigger.addEventListener('click', () => {
        fupl_item_dom.remove();

        let prereg_id = item_data.rel_id? item_data.rel_id : item_data.id;

        if(prereg_id && preregistered) {
          fupl.opts.wrapper.insertAdjacentHTML('beforeend',
            `<input type="hidden" name="${fupl.opts.delete_varname}" value="${prereg_id}">`
          );
        }

        // controllo se instance_result_wrapper è vuoto
        // e impostazione di attributo e contenuti
        fupl_utilities.set_has_values(fupl);

      });
    }

    //fancybox integration
    if( fupl.opts.fancybox && fupl.opts._type === 'img' && item_data.url && fupl.opts.fancybox_anchor_markup) {
      // check for `a.fupl-url` tag and add it if necessary
      if( !fupl_item_dom.querySelector('a.fupl-url') ) {

        let img_element = fupl_item_dom.querySelector('.fupl-img'),
          fancybox_wrapper = document.createElement('div');
        fancybox_wrapper.innerHTML = fupl.opts.fancybox_anchor_markup;

        fancybox_wrapper = fancybox_wrapper.firstChild;
        img_element.parentNode.insertBefore(fancybox_wrapper, img_element);
        fancybox_wrapper.appendChild(img_element);
      }

      fupl_item_dom.querySelector('a.fupl-url').setAttribute('href', item_data.url);

    }

    // extra fields
    let extra_fields_wrapper = fupl_item_dom.querySelector('.fupl-extra-fields');
    if(fupl.opts.extra_fields !== null && extra_fields_wrapper) {

      fupl.opts.extra_fields.forEach( item => {
        extra_fields_wrapper.insertAdjacentHTML('beforeend',
          item.markup.replace(/{{idx}}/g, item_data.id)
            .replace(/{{val}}/g, preregistered && item_data[item.value_key]? item_data[item.value_key] : '')
            .replace(/{{checked}}/g, preregistered && +item_data[item.value_key]? ' checked ' : ' ')
            // .replace(/{{selected}}/g, preregistered && +item_data[item.value_key]? ' selected ' : ' ')
            .replace(/{{name}}/g,
              (preregistered && fupl.opts.registered_extra_field_varname?
                fupl.opts.registered_extra_field_varname : fupl.opts.varname) +
              '[' +
              ((item.use_rel_id && item_data.rel_id)? item_data.rel_id : item_data.id) +
              '][' + item.value_key + ']'
            )
        );
      });
      // add `selected` attribute to select extra fields
      extra_fields_wrapper.querySelectorAll('select[data-selected]:not([data-selected=""]').forEach(sel => {
        const value = sel.dataset.selected;
        sel.querySelector(`option[value="${value}"]`)?.setAttribute('selected', true);
      });

      // stop bubbling when sortable
      if( fupl.opts.sortable ) {
        extra_fields_wrapper.querySelectorAll('select, input, textarea').forEach(item => {
          item.setAttribute('draggable', 'false');
          ['dragstart', 'drag', 'mousedown'].forEach( ev => {
            item.addEventListener(ev, e => {
              if(ev !== 'mousedown') {e.preventDefault();}
              e.stopPropagation();
            });
          });
        });
      }
    }

    // sortable
    if( fupl.opts.sortable ) {
      fupl_item_dom.setAttribute('draggable', true);

      // order_value starts from zero
      let order_value = fupl.opts.instance_result_wrapper.querySelectorAll('.fupl-item').length -1;

      fupl_item_dom.insertAdjacentHTML('beforeend',
        '<input type="hidden" class="fupl-sortable-order" name="' +
            (preregistered && fupl.opts.registered_extra_field_varname?
              fupl.opts.registered_extra_field_varname :
              fupl.opts.varname) +
            `[${item_data.id}][${fupl.opts.sortable_varname}]" value="${order_value}">`
      );

      if(fupl.opts.sortable_icon) {
        fupl_item_dom.querySelector('.fupl-sortable-icon').innerHTML =
          fupl.opts.sortable_icon
            .replace('{{sortable_icon_title_text}}', fupl.strs.sortable_icon_title_text);
      }
      add_sortable_events(fupl_item_dom, fupl.opts);
    }

    return fupl.opts.instance_result_wrapper.querySelector('.fupl-item:last-child');

  } catch(e) {
    console.error(e); // eslint-disable-line
  }

}
