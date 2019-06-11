// TODO

/*
// drag&drop ordinamento
    // da https://github.com/WolfgangKurz/grabbable
    if(uploader_options.is_multiple && uploader_options.orderable && uploader_options.filetype === 'img') {

      uploader_options.order_callback_func = null;

      if(uploader_options.order_callback) {

        uploader_options.order_callback_func = window;
        uploader_options.order_callback.split('.').forEach( function(item) {
          uploader_options.order_callback_func = uploader_options.order_callback_func[item];
        });
      }

      var drag_script = document.createElement('script');
      drag_script.onload = function() {

        document.querySelector(uploader_options.results_div_selector)
          .grabbable(uploader_options.order_callback_func);
      };
      drag_script.src = adajs.maindata.risorse + '/libs/grabbable/grabbable-min.js';
      document.head.appendChild(drag_script);
    } else {
      uploader_options.orderable = false;
    }
    */
