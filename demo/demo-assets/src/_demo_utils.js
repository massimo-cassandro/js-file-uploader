import {html_beautify} from 'js-beautify/js/lib/beautify-html';
import {escapeHTML} from '@massimo-cassandro/m-utilities/js-utilities/escapeHTML';

export const demo_code_wrapper = document.querySelector('.demo_code');

export function show_markup(title) {

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
      `<h2 class="h3">${title}</h2>
      <div class="line-numbers code-box">
        <pre><code class="language-markup">` +
          escapeHTML(html_beautify(fupl_markup, beautify_opts)) +
        `</code></pre>
      </div>`
    );

  }
}
