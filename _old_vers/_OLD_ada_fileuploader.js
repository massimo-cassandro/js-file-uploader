//* eslint no-console: 0, no-unused-vars: 0, no-empty:  0 */

/*
  @codekit-prepend 'componenti/file_uploader/_file_uploader.js';
*/

/*

markup 1 immagine:
-----------------------

<div class="file_uploader_results my-3">
	{%- if entity.files -%}
	  <div class="file_uploader_item">
      <div class="file_uploader_elimina">
        <button type="button" class="close" aria-label="Elimina" title="Elimina questo file" data-file_id="{{ entity.files.id }}"><span aria-hidden="true">×</span></button>
      </div>
      <img src="{{ shared_apps }}/viewer/{{ entity.files.id }}" alt="Banner" class="img-fluid">
    </div>
  {%- else -%}
    <div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>
	{%- endif -%}
</div>
<div data-file_uploader="{{ {
  filetype         : 'img',
  max_filesize     : '500kb',
  img_min_w        : 600,
  img_min_h        : 600,
}|json_encode|e() }}" class="form-group mb-3">
  <label for="input_file">Seleziona un’immagine</label>
  <input id="input_file" type="file" name="myfile" class="form-control">
</div>


markup documenti:
-----------------------
<div class="file_uploader_results file_uploader_multiple file_uploader_docs">
	{%- for row in entity.files -%}
	  <div class="file_uploader_item">
      <div class="file_uploader_elimina">
        <button type="button" class="close" aria-label="Elimina" title="Elimina questo file" data-file_id="{{ row.id }}"><span aria-hidden="true">×</span></button>
      </div>
      <div class="preview_icon">
        <svg><use xlink:href="{{ ada_vars.icon_file }}#documento"></use></svg>
      </div>
      <div class="text-truncate small my-2" title="{{ row.nome }}"><a href="{{ shared_apps }}/viewer/{{ row.id }}">{{ row.nome }}</a></div>
    </div>

  {%- else -%}
    <div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>
	{%- endfor -%}
</div>
<div data-file_uploader="{{ {
  filetype         : 'auto',
  max_filesize     : '2MB',
}|json_encode|e() }}" class="form-group mb-3">
  <label for="input_file_doc">Seleziona i documenti da allegare</label>
  <input id="input_file_doc" type="file" name="myfile" class="form-control" multiple>
</div>

MARKUP PIÙ IMMAGINI
--------------------------------------------------------------------------

<label class="required">xxxxx</label>

<div class="file_uploader_results file_uploader_cards my-3 {%- if entity.files %} file_uploader_multiple{% endif %}" id="file_uploader_result">
	{%- if entity.files -%}
	  {%- for row in entity.files -%}
  	  <div class="file_uploader_item">
  	    <div class="file_uploader_item__border">
          <div class="file_uploader_item__display">

            <div class="file_uploader_elimina">
              <button type="button" class="close" aria-label="Elimina" title="Elimina questo file" data-file_id="{{ row.id }}"><span aria-hidden="true">×</span></button>
            </div>
            <div class="file_uploader_item_preview">
              <a href="{{ shared_apps }}/viewer/{{ row.file.id }}?bb=800x600" data-fancybox="gallery" data-type="image">
                <img src="{{ shared_apps }}/viewer/{{ row.file.id }}?bb=400x400" alt="immagine" class="img-fluid">
              </a>
            </div>
          </div>

        </div>
      </div>
    {%- endfor -%}
  {%- else -%}
    <div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>
	{%- endif -%}
</div>
<div data-file_uploader="{{ {
  filetype         : 'img',
  max_filesize     : cont.imgMaxK,
  img_min_w        : cont.imgMinW,
  img_min_h        : cont.imgMinH,
  varname          : "img",
  results_div_selector:  "#file_uploader_results"
}|json_encode|e() }}" class="form-group mb-3">
  <label for="input_file">Seleziona una o più immagini</label>
  <input id="input_file" type="file" name="myfile" class="form-control" multiple>
</div>


MARKUP PIÙ IMMAGINI CON CAMPI EXTRA e CALLBACK AGGIUNTIVO PERSONALIZZATO
--------------------------------------------------------------------------
{% macro fupl_item_tpl_extra(item_id, varname, row, globals) -%}

  {% set noMonitor = row is not null and (row.file.width|default() < globals.foto_params.minW_monitor or row.file.height|default() < globals.foto_params.minH_monitor) %}

  <div class="form-group form-check mt-1">
  	<label class="form-check-label">
  		<input class="form-check-input fupl_principale" type="checkbox" value="1" {{- ' ' -}}
  		  name="{{ varname|raw }}&#91;{{ item_id|raw }}&#93;[principale]"
  		  {{- row.principale|default()? ' checked' : '' }}>
      Principale
  	</label>
  </div>
  <div class="form-group form-check mt-1">
  	<label class="form-check-label {{-  noMonitor ? ' disabled' : '' -}}">
  		<input class="form-check-input" type="checkbox" value="1" {{- ' ' -}}
  		  name="{{ varname|raw }}&#91;{{ item_id|raw }}&#93;[usoMonitor]"
  		  {{-  noMonitor ? ' disabled="true"' : '' -}}
  		  {{- row.usoMonitor|default()? ' checked' : '' }}>
      Usa per monitor
  	</label>
  </div>
  <div class="form-group">
  	<label for="dida_{{ item_id }}">Didascalia</label>
  	<input class="form-control form-control-sm" id="dida_{{ item_id|raw }}" name="{{ varname|raw }}&#91;{{ item_id|raw }}&#93;[dida]" value="{{ row.dida|default() }}" maxlength="255" type="text">
  </div>
  <div class="form-group">
  	<label for="alt_{{ item_id }}">Testo alt.</label>
  	<input class="form-control form-control-sm" id="alt_{{ item_id|raw }}" name="{{ varname|raw }}&#91;{{ item_id|raw }}&#93;[alt]" value="{{ row.alt|default() }}" maxlength="255" type="text">
  </div>
{%- endmacro %}

{% macro stampa_bytes(bytes) -%}
  {%- if bytes >= 1024*1024 -%}
  	{{ (bytes/(1024*1024))|number_format(2, ',', '.') }} <span class="initialism">MB</span>
  {%- else -%}
  	{{ (bytes/1024)|number_format(0, ',', '.') }} <span class="initialism">KB</span>
  {%- endif -%}
{%- endmacro %}

{% import _self as m %}


<div class="file_uploader_results file_uploader_cards my-3 {%- if entity.files %} file_uploader_multiple{% endif %}">
	{%- if entity.files -%}
	  {%- for row in entity.files -%}
  	  <div class="file_uploader_item">
  	    <div class="file_uploader_item__border">
          <div class="file_uploader_item__display">

{# icona-drag : solo per ordinamento #}
            <div class="file_uploader_elimina clearfix icona-drag">
              <button type="button" class="close" aria-label="Elimina" title="Elimina questo file" data-file_id="{{ row.id }}"><span aria-hidden="true">×</span></button>
            </div>
            <div class="file_uploader_item_preview">
              <a href="{{ shared_apps }}/viewer/{{ row.file.id }}?bb=800x600" data-caption="{{ row.dida }}" data-fancybox="gallery" data-type="image">
                <img src="{{ shared_apps }}/viewer/{{ row.file.id }}?bb=400x400" alt="immagine" class="img-fluid">
              </a>
            </div>
            <div class="text-truncate small my-2">#{{ row.file.id }}</div>
            <div class="small my-2 text-monospace text-truncate">
              {{ row.file.width }}&times;{{ row.file.height }} px / {{ m.stampa_bytes(row.file.size) }}
            </div>
            {{ m.fupl_item_tpl_extra(row.id, 'registered_files', row, _context) }}
          </div>

          <div class="mt-1 small text-center">
            <a href="{{ shared_apps }}/viewer/{{ row.file.id }}?d=1&amp;raw=1">[Download]</a>
          </div>
        </div>
      </div>
    {%- endfor -%}
  {%- else -%}
    <div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>
	{%- endif -%}
</div>
<div data-file_uploader="{{ {
  filetype         : 'img',
  max_filesize     : '12MB',
  img_min_w        : foto_params.minw,
  img_min_h        : foto_params.minh,
  item_tpl_extra   :  m.fupl_item_tpl_extra('[[item_id]]', '[[varname]]', null, _context),

// opzionali:
  extra_callback   : 'STR_CBK.setup_uploaded_imgs',
  orderable        : true,
  order_callback   : 'STR_CBK.order_callback'
}|json_encode|e() }}" class="form-group mb-3">
  <label for="input_file">Seleziona una o più immagini</label>
  <input id="input_file" type="file" name="myfile" class="form-control" multiple>
</div>




MARKUP PIÙ DOCUMENTI CON CAMPI EXTRA
-----------------------------------------
{% macro fupl_item_tpl_extra(item_id, varname, mostraAdv_is_checked) -%}{% spaceless %}
  <div class="form-check mt-1">
  	<label class="form-check-label">
  		<input class="form-check-input" type="checkbox" value="1" name="{{ varname|raw }}&#91;{{ item_id|raw }}&#93;[mostraAdv]" {{- mostraAdv_is_checked? ' checked' : '' }}>
      Mostra all'agenzia
  	</label>
  </div>
{% endspaceless %}{%- endmacro %}

{% import _self as m %}

<div class="file_uploader_results file_uploader_docs file_uploader_cards file_uploader_multiple">
	{%- for row in entity.files -%}
	  <div class="file_uploader_item">
	    <div class="file_uploader_item__border">
        <div class="file_uploader_item__display">
          <div class="file_uploader_elimina">
            <button type="button" class="close" aria-label="Elimina" title="Elimina questo file" data-file_id="{{ row.id }}"><span aria-hidden="true">×</span></button>
          </div>
          <div class="preview_icon">
            <svg><use xlink:href="{{ ada_vars.icon_file }}#documento"></use></svg>
          </div>
          <div class="text-truncate small my-2" title="{{ row.file.nome }}">
            <a href="{{ shared_apps }}/viewer/{{ row.file.id }}">{{ row.file.nome }}</a>
          </div>
        </div>
        {{ m.fupl_item_tpl_extra(row.id, 'registered_files', row.file.mostraAdv) }}
      </div>
    </div>

  {%- else -%}
    <div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>
	{%- endfor -%}
</div>

<div data-file_uploader="{{ {
  'filetype'         : 'auto',
  'max_filesize'     : '2MB',
  'item_tpl_extra'   :  m.fupl_item_tpl_extra('[[item_id]]', '[[varname]]', false)
}|json_encode|e() }}" class="form-group mb-3">
  <label for="input_file_doc">Seleziona i documenti da allegare</label>
  <input id="input_file_doc" type="file" name="myfile" class="form-control" multiple>
</div>



attributi custom facoltativi:
-----------------------
item_tpl        : se presente, sostituisce il template standard per i nuovi elementi

//TODO extra_fields -> rimuovere

extra_fields    : array di campi extra predefiniti da aggiungere ad ogni elemento.
                  Valori possibili:
                      - pubblica (checkbox)

item_tpl_extra  : markup aggiuntivo da appendere ad ogni elemento

results_div_selector: selettore del div delle anteprime, necessario se sono presenti più uploader nella stessa pagina



classi aggiuntive per file_uploader_results
-----------------------
file_uploader_docs   : visualizzazione per documenti
file_uploader_cards  : visualizza come card (bordo + padding)




*/


// configurazione
FileUploader.setDefaults({
  uploader_url : adajs.maindata.baseUrl + '/file-uploader',
  max_filesize: '8MB',             // impostazione globale di default
  varname: 'user_file',            // impostazione globale di default

  debug: (adajs.maindata !== undefined && adajs.maindata.test),

  container_class: 'd-md-flex flex-row justify-content-center align-items-center',
  info_text_join_string: ', ',

  //NB: le funzione di callback vanno instaziate prima del caricamento dello script fileuploader

  extra_callback: null, // eventuale callback da chiamare al completamento dell'upload (stringa nome funzione)

  orderable: false, // se true, se sono immagini e il caricamento è multiplo, attiva
                    // il drag&drop pwer ordinare gli elementi

  order_callback: null,  // se orderable == true, funzione di callback (in forma di stringa) di grabbable
                         // nb: non permette l'aggiunta di argomenti


  container_dragover_class: 'is-dragover',
  label_class: 'btn btn-outline-secondary',

  template: '<div>' + adajs.print_icon('upload') + '</div>' +
            '<div>' +
              '<div>' +
                '<span class="file_upl__button btn btn-sm btn-outline-secondary pb-0"></span>' +
                //'<span class="file_upl__dd_text ml-md-2 d-block mt-1 mt-md-0 d-md-inline"></span>' +
                '<div class="file_upl__dd_text mt-1"></div>' +
              '</div>' +
              '<div class="small font-italic file_upl__info_text mt-2"></div>' +
            '</div>',

  alertErrorAPI: function (mes) {
    swal( Object.assign({}, adajs.swal_defaults.error, {
      titleText  : mes,
      text       : null,
      toast      : true
    }));
  },

  init_callback: function ( uploader_options ) {
    uploader_options.container.removeClass('form-group');

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

/*

//TODO
    if(uploader_options.is_multiple) {
      $(uploader_options.results_div_selector).addClass('file_uploader_multiple');
    }
*/

  },

  upload_start_callback: function ( params ) {
    /*
      params:
      {
        'item_id'         : id univoco del documento in elaborazione
        'filelist_item'   : oggetto filelist corrente,
        'img_preview'     : null | 'stringa immagine',
        'uploader_options': uploader_options
        'img_wi'          : width img o null
        'img_he'          : height img o null
      }
    */
    var item_string,
    stampaBytes = function (bytes) {
      var mega = 1024*1024;
      if(bytes >= mega ) {
        return (bytes/mega).toFixed(2) + '<span class="initialism text-muted ml-1">MB</span>';
      } else {
        return Math.round(bytes/1024) + '<span class="initialism text-muted ml-1">KB</span>';
      }
    };

    if(params.uploader_options.element_data.item_tpl) {

      item_string = params.uploader_options.element_data.item_tpl;

    } else {
      item_string =
        '<div class="file_uploader_item" id="[[item_id]]"[[& img_data_size]]>' +
          '<div class="file_uploader_item__border">' +
            '<div class="file_uploader_item__display">' +
              '<div class="file_uploader_elimina clearfix' + ( params.uploader_options.orderable? ' icona-drag' : '') + '">' +
                '<button type="button" class="close" aria-label="Elimina" title="Elimina questo file">' +
                  '<span aria-hidden="true">&times;</span>' +
                '</button>' +
              '</div>' +
              '[[& anteprima]]' +
              '<div class="text-truncate small my-2" title="[[item_name]]">' +
                '[[item_name]]' +
              '</div>' +
              '[[& img_size]]' +
            '</div>' +
            '[[& pubblica]]' +
            ( params.uploader_options.element_data.item_tpl_extra ? params.uploader_options.element_data.item_tpl_extra : '') +
          '</div>' +
        '</div>';
    }



    Mustache.parse( item_string );

    var item_string_data = {
      anteprima     : params.img_preview? '<div class="file_uploader_item_preview">' +
                        '<img src="' + params.img_preview + '"></div>' :
                      '<div class = "preview_icon">' + adajs.print_icon('documento') + '</div>',
      item_id       : params.item_id,
      item_name     : params.filelist_item.name,
      img_size      : params.img_preview? '<div class="small my-2 text-monospace text-truncate">' +
                        params.img_wi + '&times;' + params.img_he + '<span class="text-muted ml-1">px</span><br>' + stampaBytes(params.filelist_item.size) +
                      '</div>' : '',
      img_data_size : params.img_preview? ' data-width="' + params.img_wi + '" data-height="' + params.img_he + '"' : '',
      pubblica      : '',
      varname       : params.uploader_options.varname // utilizzato dal markup extra
    };

    if( params.uploader_options.element_data.extra_fields &&
      params.uploader_options.element_data.extra_fields.indexOf('pubblica') !== -1 ) {

      item_string_data.pubblica =
        '<div class="form-check mt-1">' +
        	'<label class="form-check-label">' +
        		'<input class="form-check-input" type="checkbox" value="1" name="' + params.uploader_options.varname + '[' + params.item_id + '][pubblica]">' +
            'Pubblica'+
        	'</label>' +
        '</div>';
    }

    item_string = Mustache.render(item_string, item_string_data, {}, ['[[', ']]']);

    if(params.uploader_options.is_multiple) {
      $(params.uploader_options.results_div_selector)
        .addClass('file_uploader_multiple')
        .find('.file_uploader_results__empty').remove();

      $(params.uploader_options.results_div_selector).append( item_string );
      if(params.uploader_options.orderable) {
        document.querySelector(params.uploader_options.results_div_selector)
          .grabbable(params.uploader_options.order_callback_func);
      }
    } else {
      $(params.uploader_options.results_div_selector).html( item_string );
    }

  },

  upload_complete_callback: function (params) {
    /*
      params:
      {
        item_id
        server_error
        filelist_item
        hidden_fields
        uploader_options
        img_wi
        img_he
      }
    */

    var item = $('#' + params.item_id);

    if( params.server_error ) {
      /* eslint-disable */
      console.error(params.filelist_item.name + ': ' + params.server_error);
      /* eslint-enable */

      item.append('<div class="esito error">' + adajs.print_icon('ui-errore') + '</div>');

    } else {
      item
      .append( params.hidden_fields )
      .append('<div class="esito success">' + adajs.print_icon('ui-success') + '</div>')
      .children('.esito')
        .delay(1000)
        .fadeOut(function () {
          $(this).remove();
        });


      // eventuale extra callback dell'istanza
      if(params.uploader_options.extra_callback && typeof params.uploader_options.extra_callback === "string") {
        JSutils.executeFunctionByName(params.uploader_options.extra_callback, window, params);
      }
    }
  },

  // parametri non standard (usati dai callback)
  // nel caso di più fileUploader nella stessa pagina, potrebbe essere
  // necessario riassegnare un selettore diversi per ogni contenitore di risultati
  results_div_selector: '.file_uploader_results'

});

/*
// pulsante elimina
$(document).on('click', '.file_uploader_elimina', function () {
  $(this).parents('.file_uploader_item').eq(0).remove();
});

// pulsante elimina registrati
$(document).on('click', '.file_uploader_elimina_registrato button', function () {
  var _this = $(this),
    file_id = _this.data('file_id'),
    file_uploader_item = _this.parents('.file_uploader_item').eq(0),
    file_uploader_results = _this.parents('.file_uploader_results ').eq(0);

  if( file_uploader_item.hasClass('file_uploader_deleted') ) {
    $('.file_uploader_da_eliminare[value="' + file_id + '"]', file_uploader_results).remove();
    file_uploader_item.removeClass('file_uploader_deleted');

  } else {
    file_uploader_results.append(
      '<input type="hidden" class="file_uploader_da_eliminare" name="elimina_file[]" value="' + file_id + '">'
    );
    file_uploader_item.addClass('file_uploader_deleted');
  }
});
*/

// pulsante elimina
//NB: file_uploader_elimina_registrato solo per compatibilità con versioni precedenti
// da rimuovere
$(document).on('click', '.file_uploader_elimina button, .file_uploader_elimina_registrato button', function () {
  var _this = $(this),
  file_id = _this.data('file_id'),
  results_div_selector =  _this.closest('.file_uploader_results');

  // file già registrati
  if(file_id) {
    results_div_selector.after(
      '<input type="hidden" class="file_uploader_da_eliminare" name="elimina_file[]" value="' + file_id + '">'
    );
  }

  _this.closest('.file_uploader_item').remove();

  if( !$('.file_uploader_item', results_div_selector).length ) {
    results_div_selector.html('<div class="file_uploader_results__empty text-muted font-italic small">Nessun file presente</div>');
  }
});


//init
FileUploader.init();
