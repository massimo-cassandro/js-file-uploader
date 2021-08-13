/*
uses:
https://github.com/beautify-web/js-beautify
https://prismjs.com/
*/

/* global Prism */

import {demo_code_wrapper, show_markup} from './_demo_utils';
import {escapeHTML} from '@massimo-cassandro/m-utilities/js-utilities/escapeHTML';

(() => {
  'use strict';


  // get and format js
  const script_tag = document.querySelector('.fupl-script script');
  if(script_tag) {
    fetch( script_tag.src )
      .then(response => response.text())
      .then((data) => {
        const url = new URL(script_tag.src);
        demo_code_wrapper.insertAdjacentHTML('beforeend',
          `<h2 class="h3">Javascript <small>(${url.pathname.replace(/^\/js-file-uploader/, '')})</small></h2>
          <div class="line-numbers code-box">
            <pre><code class="language-js">` +
              escapeHTML(data.trim()) +
            `</code></pre>
          </div>`
        );

        show_markup('Generated markup');

        // window.fileUploderOpts
        if(window.fileUploderOpts) {

          demo_code_wrapper.insertAdjacentHTML('beforeend',
            `<h2 class="h3">Parsed FileUploader options</h2>
            <p class="small mb-1">(Same showed in console.
              The key of the uploader obj is the varname string)</p>
            <div class="line-numbers code-box">
              <pre><code class="language-js">` +
                escapeHTML(JSON.stringify(window.fileUploderOpts, null, 2)) +
              `</code></pre>
            </div>`
          );
        } else {

          demo_code_wrapper.insertAdjacentHTML('beforeend',
            `<div class="alert alert-info" role="alert">
              <code>FileUploader options</code> cannot be displayed.
              Maybe the <code>debug</code> parameter is not set to true
            </div>`
          );
        }


        // code highlighting
        Prism.highlightAll(true);
      });
  }

})();
