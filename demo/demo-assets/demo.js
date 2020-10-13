/*
uses:
https://github.com/beautify-web/js-beautify
https://prismjs.com/
*/

/* global Prism */

import {html_beautify} from 'js-beautify/js/lib/beautify-html';
// import {js_beautify} from 'js-beautify/js/lib/beautify';

import {escapeHTML} from '@massimo-cassandro/m-utilities/js-utilities/_escapeHTML';

(() => {
  'use strict';

  // get and format markup
  const demo_code_wrapper = document.querySelector('.demo_code'),
    beautify_opts = {
      'indent_size'                 : 2,
      'indent_char'                 : ' ',
      'wrap_line_length'            : 80,
      'brace_style'                 : 'expand',
      'preserve_newlines'           : true,
      'max_preserve_newlines'       : 2,
      'indent_handlebars'           : false,
      'extra_liners'                : ['/html'],
      'keep_array_indentation'      : false,
      'break_chained_methods'       : true,
      'indent_scripts'              : 'normal',
      'space_before_conditional'    : true,
      'unescape_strings'            : false,
      'jslint_happy'                : false,
      'end_with_newline'            : false,
      'comma_first'                 : false,
      'e4x'                         : false,
      'indent_empty_lines'          : false
    };

  if( demo_code_wrapper ) {
    let parser = new DOMParser(),
      fupl_node = parser.parseFromString(
        document.querySelector('.demo-wrapper').innerHTML,
        'text/html'
      ),
      fupl_markup = fupl_node.body.innerHTML.trim();

    demo_code_wrapper.insertAdjacentHTML('beforeend',
      `<h2 class="h3">Markup</h2>
      <div class="line-numbers code-box">
        <pre><code class="language-markup">` +
          escapeHTML(html_beautify(fupl_markup, beautify_opts)) +
        `</code></pre>
      </div>`
    );


    // get and format js
    const script_tag = document.querySelector('.fupl-script script');
    if(script_tag) {

      fetch( script_tag.src )
        .then(response => response.text())
        .then((data) => {
          const url = new URL(script_tag.src);
          demo_code_wrapper.insertAdjacentHTML('beforeend',
            `<h2 class="h3">Javascript <small>(${url.pathname})</small></h2>
            <div class="line-numbers code-box">
              <pre><code class="language-js">` +
                escapeHTML(data) +
              `</code></pre>
            </div>`
          );

          // code highlighting
          Prism.highlightAll(true);
        });
    } else {

      Prism.highlightAll(true);
    }
  }

})();
