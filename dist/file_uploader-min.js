/*!@preserve
 *
 * FileUploader 1
 * HTML5 / JS Async Uploader
 * Massimo Cassandro 2017-2019
 *
 */
"use strict";var FileUploader=function(){var e;return{}}();function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,i=new Array(e.length);t<e.length;t++)i[t]=e[t];return i}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,i=new Array(e.length);t<e.length;t++)i[t]=e[t];return i}}FileUploader=function(e){var t=function e(){if(-1!==navigator.userAgent.indexOf("MSIE")||navigator.appVersion.indexOf("Trident/")>-1||navigator.userAgent.indexOf("Trident/")>-1)return!1;var t=document.createElement("div");return("draggable"in t||"ondragstart"in t&&"ondrop"in t)&&"FormData"in window&&"FileReader"in window&&"fetch"in window};return e.init=function(i){var a=e.setOptions(i);if(!t())return a.silent_degradation||alert(a.alert_messages.unsuitable_browser),void(a.unsuitable_browser_callback&&e.exec_callback(a.unsuitable_browser_callback));a.css&&document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="'+a.css+'" type="text/css" media="all">'),document.querySelectorAll("[data-"+a.fupl_selector+"]").forEach((function(t){var i=t.dataset,r=a.fupl_selector.replace(/-([a-z])/g,(function(e){return e[1].toUpperCase()})),n=t.dataset[r],l={};""===i&&(i={}),n=""===n?{}:JSON.parse(n),delete(l=e.setOptions(a,n,i))[r],l.element=t;try{if(!l.uploader_url)throw new Error("Parametro `uploader_url` non impostato");if(l.filetype=l.filetype.toLowerCase(),-1===Object.keys(e.mimetypes).indexOf(l.filetype))throw new Error("Parametro `filetype` non corretto")}catch(e){console.error(e)}var s=["input_text","templates","info_text_wrap_string","values","extra_fields"];for(var o in s.forEach((function(e){try{"string"==typeof l[e]&&(l[e]=JSON.parse(l[e]))}catch(t){console.error("L'elemento “".concat(e,"” non è un json valido")),console.log(l.element),console.error(t)}})),l)"string"==typeof l[o]&&-1!==["true","false","null"].indexOf(l[o].toLowerCase())&&(l[o]=JSON.parse(l[o]));new e.createUploader(l)}))},e}((FileUploader=function(e){return e.createUploader=function(t){var i=t.element.querySelector('input[type="file"]'),a=t.element.querySelector("label");if("auto"===t.filetype){var r=[],n=[];null!==t.accept&&(n=t.accept.split(",").map((function(e){return e.trim()}))),i&&i.getAttribute("accept")&&(r=i.getAttribute("accept").split(",").map((function(e){return e.trim()}))),t.accept=_toConsumableArray(new Set([].concat(_toConsumableArray(n),_toConsumableArray(r))))}else t.accept=e.mimetypes[t.filetype];var l=e.parse_max_filesize(t.max_filesize,t.locales),s,o;if(!1===l)throw new Error('"'+t.max_filesize+'" non è un valore corretto per `max_filesize`');(t.max_filesize=l,t.multiple=Boolean(t.multiple||i&&i.hasAttribute("multiple")),t.required=Boolean(t.required||i&&i.hasAttribute("required")),t.disabled=Boolean(t.disabled||i&&i.hasAttribute("disabled")),t._type="img"===t.filetype?"img":"doc",t._mode=t.multiple?"multiple":"single",!t.uploader_legend_text&&a&&(t.uploader_legend_text=a.innerHTML),t.uploader_legend_text||(t.uploader_legend_text="__legend non presente__"),t.element.classList.add("fupl"),t.wrapper=document.createElement("fieldset"),t.element.parentNode.insertBefore(t.wrapper,t.element),t.wrapper.appendChild(t.element),t.wrapper.classList.add("fupl-wrapper"),t.wrapper.classList.add("fupl-type-"+t._type),t.multiple&&t.wrapper.classList.add("fupl-multiple"),t.wrapper_extra_class)&&(s=t.wrapper.classList).add.apply(s,_toConsumableArray(t.wrapper_extra_class.split(" ")));if(t.uploader_legend){var _=["fupl-legend"];t.uploader_legend_class&&_.push(t.uploader_legend_class),t.required&&_.push("required"),t.element.insertAdjacentHTML("beforebegin","<legend"+(_.length?' class="'+_.join(" ")+'"':"")+">"+t.uploader_legend_text+"</legend>"),t.wrapper.classList.add("fupl-has-legend")}(t.element.innerHTML=t.templates.main,t.istance_input=t.element.querySelector('.fupl-panel input[type="file"]'),t.istance_label=t.element.querySelector(".fupl-panel label"),t.istance_dd_text=t.element.querySelector(".fupl-panel .fupl-dd-text"),t.istance_info_text=t.element.querySelector(".fupl-panel .fupl-info-text"),t.istance_result_wrapper=t.element.querySelector(".fupl-result"),t.multiple&&t.istance_input.setAttribute("multiple",""),null!==t.accept&&t.istance_input.setAttribute("accept",t.accept.join(",")),t.required&&(t.wrapper.dataset[e.data_attributes.required]="true"),t.disabled&&(t.wrapper.setAttribute("disabled",!0),t.wrapper.setAttribute("aria-disabled",!0)),t.istance_label.insertAdjacentHTML("beforeend",t.input_text[t._type][t._mode][0]),t.input_label_class)&&(o=t.istance_label.classList).add.apply(o,_toConsumableArray(t.input_label_class.split(" ")));t.istance_dd_text.innerHTML=t.input_text[t._type][t._mode][1],t.show_info_text&&(t.custom_info_text?t.istance_info_text.innerHTML=t.custom_info_text:t.istance_info_text.innerHTML=e.create_info_text(t)),t.sortable&&(t.multiple&&t.sortable_varname?e.activateSortable(t):(console.error('"sortable" option incorrectly set'),t.sortable=!1)),t.values&&("object"===_typeof(t.values)?Array.isArray(t.values)||(t.values=[t.values]):console.error("Il parametro `values` non è corretto")),t.values&&t.values.length&&t.values.forEach((function(i){e.createItem(i,t,!0)})),e.set_has_values(t),e.setListeners(t),null!==t.init_callback&&e.exec_callback(t.init_callback,t),t.fancybox&&null!==t.fancybox_callback_func&&e.exec_callback(t.fancybox_callback_func,t),t.debug&&(console.groupCollapsed("FileUploader options"),console.log(t),console.groupEnd())},e}((FileUploader=function(e){return e.createItem=function(t,i){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];try{var r=i.templates[i._type][i._mode];null===r&&"multiple"===i._mode&&(r=i.templates[i._type].single);var n=document.createElement("div");n.innerHTML=r;var l=n.querySelector(".fupl-remove");l&&(l.innerHTML=i.templates.remove_btn);var s=n.querySelector(".fupl-file-name");s&&t.name&&(s.innerHTML=t.name,s.title=t.name);var o=n.querySelector(".fupl-file-size");if(o){var _="";"img"===i._type&&t.wi&&t.he&&(_=t.wi+"&times;"+t.he+'<span class="fupl-unit">px</span>',t.size&&(_+=" &ndash; ")),t.size&&(_+=e.parse_filesize(t.size,i.locales)),o.innerHTML=_}"img"===i._type&&(n.querySelector(".fupl-img").src=t.src);var u=n.querySelector(".fupl-url");u&&t.url&&(u.href=t.url);var p=n.querySelector(".fupl-item");t.loading&&(p.classList.add("fupl-is-uploading"),p.insertAdjacentHTML("beforeend",i.templates.loading_element)),"single"===i._mode?i.istance_result_wrapper.innerHTML=n.innerHTML:(i.istance_result_wrapper.querySelector(".fupl-item")||(i.istance_result_wrapper.innerHTML=""),i.istance_result_wrapper.insertAdjacentHTML("beforeend",n.innerHTML));var c=i.istance_result_wrapper.querySelector(".fupl-item:last-child");c.dataset[e.data_attributes.item_id]=t.id;var m=c.querySelector(".fupl-remove-trigger");if(m&&m.addEventListener("click",(function(){c.remove();var r=t.rel_id?t.rel_id:t.id;r&&a&&i.wrapper.insertAdjacentHTML("beforeend",'<input type="hidden" name="'.concat(i.delete_varname,'" value="').concat(r,'">')),e.set_has_values(i)})),i.fancybox&&"img"===i._type&&t.url&&i.fancybox_anchor_markup){if(!c.querySelector("a.fupl-url")){var d=c.querySelector(".fupl-img"),f=document.createElement("div");f.innerHTML=i.fancybox_anchor_markup,f=f.firstChild,d.parentNode.insertBefore(f,d),f.appendChild(d)}c.querySelector("a.fupl-url").setAttribute("href",t.url)}var g=c.querySelector(".fupl-extra-fields");if(null!==i.extra_fields&&g&&(i.extra_fields.forEach((function(e){g.insertAdjacentHTML("beforeend",e.markup.replace(/{{idx}}/g,t.id).replace(/{{val}}/g,a&&t[e.value_key]?t[e.value_key]:"").replace(/{{checked}}/g,a&&+t[e.value_key]?"checked":"").replace(/{{name}}/g,(a&&i.registered_extra_field_varname?i.registered_extra_field_varname:i.varname)+"["+(e.use_rel_id&&t.rel_id?t.rel_id:t.id)+"]["+e.value_key+"]"))})),i.sortable&&g.querySelectorAll("select, input, textarea").forEach((function(e){e.setAttribute("draggable","false"),["dragstart","drag","mousedown"].forEach((function(t){e.addEventListener(t,(function(e){"mousedown"!==t&&e.preventDefault(),e.stopPropagation()}))}))}))),i.sortable){c.setAttribute("draggable",!0);var h=i.istance_result_wrapper.querySelectorAll(".fupl-item").length-1;c.insertAdjacentHTML("beforeend",'<input type="hidden" class="fupl-sortable-order" name="'+(a&&i.registered_extra_field_varname?i.registered_extra_field_varname:i.varname)+"[".concat(t.id,"][").concat(i.sortable_varname,']" value="').concat(h,'">')),i.sortable_icon&&(c.querySelector(".fupl-sortable-icon").innerHTML=i.sortable_icon),e.addSortableEvents(c,i)}return i.istance_result_wrapper.querySelector(".fupl-item:last-child")}catch(e){console.error(e)}},e}((FileUploader=function(e){return e.setListeners=function(t){["dragenter","dragover","dragleave","drop"].forEach((function(e){t.element.addEventListener(e,(function(e){e.preventDefault(),e.stopPropagation()}),!1)})),["dragover","dragenter"].forEach((function(e){t.element.addEventListener(e,(function(){t.element.classList.add(t.element_dragover_class)}),!1)})),["dragleave","dragend"].forEach((function(e){t.element.addEventListener(e,(function(){t.element.classList.remove(t.element_dragover_class)}),!1)})),t.element.addEventListener("drop",(function(i){if(t.element.classList.remove(t.element_dragover_class),!t.wrapper.hasAttribute("disabled")){var a=i.dataTransfer.files;a.length&&(!t.multiple&&a.length>1?t.alert_api(t.alert_messages.too_much_files,t):e.sendFiles(a,t))}}),!1),t.istance_input.addEventListener("change",(function(){e.sendFiles(t.istance_input.files,t)}))},e}((FileUploader=function(e){return e.sendFiles=function(t,i){var a=function e(t){var a=i.element.closest("form"),r;i.disable_submit&&a&&a.querySelectorAll('[type="submit"]').forEach((function(e){e.disabled=t}))},r=function t(r,n){a(!0);var l=e.createItem({id:r.id,name:r.file.name,url:null,src:n,wi:r.width,he:r.height,size:r.file.size,loading:!0},i),s=l.querySelector(".fupl-progress"),o=l.querySelector(".fupl-loading"),_=i.alert_messages.xhr_error.replace(/{{file_name}}/,r.file.name),u=function e(){l.querySelector(".fupl-remove-trigger").click()};i.upload_start_callback&&e.exec_callback(i.upload_start_callback,{item:r,img_preview:n,uploader_options:i}),new Promise((function(t,a){var n=new XMLHttpRequest;n.open("POST",i.uploader_url,!0),n.onload=function(){if(n.status>=200&&n.status<400){var l=JSON.parse(n.responseText);l.error?(i.alert_api(_,i),console.error(l.error),a()):(r.tmp_file=l.tmp_file,t()),i.upload_complete_callback&&e.exec_callback(i.upload_complete_callback,{item:r,server_error:l.error,fupl_options:i})}else i.alert_api(_,i),console.error(n.status,n.statusText),console.error(n.responseText);a()},n.onerror=function(){i.alert_api(_,i),i.debug&&(console.error(n.status,n.statusText),console.error(n.responseText)),a()},n.upload.addEventListener("progress",(function(t){if(i.alternative_loading_func)e.exec_callback.apply(e,[i.alternative_loading_func].concat([t,i]));else{var a=Math.round(t.loaded/t.total*100)||0;s&&(t.lengthComputable?(a=a===1/0?100:a,l.querySelector(".fupl-progress").value=a):(o.innerHTML=i.templates.alternative_loading_element,s=null))}}),!1);var u=new FormData;u.append("file",r.file),n.send(u)})).then((function(){l.classList.remove("fupl-is-uploading"),l.querySelector(".fupl-loading").remove(),l.insertAdjacentHTML("beforeend",e.buildHiddenFields(r,i)),e.set_has_values(i),a(!1)}),(function(){u(),e.set_has_values(i)}))};t.length&&_toConsumableArray(t).forEach((function(t,a){try{var n={id:"fupl_item_"+Date.now()+"_"+a,file:t,width:null,height:null,tmp_file:null};if(i.accept.length){var l=t.name.split(".").pop().toLowerCase();if(-1===i.accept.indexOf(t.type)&&-1===i.accept.indexOf("."+l))throw i.alert_messages.file_format_error.replace(/{{file_name}}/,t.name)}if(null!==i.max_filesize&&t.size>i.max_filesize.maxbytes){var s=e.parse_filesize(t.size,i.locales);throw i.alert_messages.file_size_error.replace(/{{file_name}}/,t.name).replace(/{{file_size}}/,s).replace(/{{allowed_size}}/,i.max_filesize.feedback_size)}if("img"===i.filetype){var o=new FileReader;o.addEventListener("load",(function(){var e=new Image;e.src=o.result,e.addEventListener("load",(function(){var a=[];n.width=e.width,n.height=e.height,i.img_w&&e.width!==i.img_w?a.push(i.alert_messages.img_exact_width_err.replace(/{{image_dimension}}/,e.width).replace(/{{allowed_dimension}}/,i.img_w)):i.img_min_w&&e.width<i.img_min_w?a.push(i.alert_messages.img_min_width_err.replace(/{{image_dimension}}/,e.width).replace(/{{allowed_dimension}}/,i.img_min_w)):i.img_max_w&&e.width>i.img_max_w&&a.push(i.alert_messages.img_max_width_err.replace(/{{image_dimension}}/,e.width).replace(/{{allowed_dimension}}/,i.img_max_w)),i.img_h&&e.height!==i.img_h?a.push(i.alert_messages.img_exact_height_err.replace(/{{image_dimension}}/,e.height).replace(/{{allowed_dimension}}/,i.img_h)):i.img_min_h&&e.height<i.img_min_h?a.push(i.alert_messages.img_min_height_err.replace(/{{image_dimension}}/,e.height).replace(/{{allowed_dimension}}/,i.img_min_h)):i.img_max_h&&e.height>i.img_max_h&&a.push(i.alert_messages.img_max_height_err.replace(/{{image_dimension}}/,e.height).replace(/{{allowed_dimension}}/,i.img_max_h)),a.length?i.alert_api(i.alert_messages.img_err_start_string.replace(/{{file_name}}/,t.name)+"<br><ul><li>"+a.join("</li><li>")+"</li></ul>",i):r(n,o.result)}),!1)}),!1),o.readAsDataURL(t)}else r(n)}catch(e){i.alert_api(e,i,"error")}}))},e}((FileUploader=function(e){var t=function e(t){for(var i="",a={"à":"a","è":"e","é":"e","ì":"i","ò":"o","ù":"u","À":"A","È":"E","É":"E","Ì":"I","Ò":"O","Ù":"U","'":"_","|":"_","!":"_",'"':"_",$:"_","%":"_","&":"_","/":"_","(":"_",")":"_","=":"_","?":"_","^":"_","*":"_","[":"_","]":"_","ç":"c","@":"_","#":"_","<":"_",">":"_","ü":"u","Ü":"U","ñ":"n","Ñ":"N","~":"_",":":"_","\\":"_"},r=0;r<t.length;r++)t[r]in a?i+=a[t[r]]:768===t.charCodeAt(r)||769===t.charCodeAt(r)?i+="":t.charCodeAt(r)>127?i+="_":i+=t.charAt(r);return i.replace(/ /g,"_").replace(/_+/g,"_")};return e.buildHiddenFields=function(e,i){var a="",r={tmp_file:e.tmp_file,file_name:t(e.file.name),size:e.file.size,type:e.file.type};for(var n in"img"===i._type&&(r.width=e.width,r.height=e.height),r)a+='<input type="hidden" name="'+i.varname+"["+e.id+"]["+n+']" value="'+r[n]+'">';return'<div class="fupl-hiddens">'+a+"</div>"},e}((FileUploader=function(e){var t="fupl-sortable",i="fupl-sorting",a="fupl-item-sorting",r="fupl-item-dragover",n=null,l=!1,s=function e(){n&&(n.classList.remove(a),n.parentNode.querySelectorAll("."+r).forEach((function(e){e.classList.remove(r)})),n.closest(".fupl").classList.remove(i)),n=null};return e.addSortableEvents=function(e,t){e.addEventListener("dragstart",(function(e){l=t.wrapper.disabled,s(),l||(n=this,t.element.classList.add(i),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text","fupl-sorting"),this.classList.add(a))}),!1),e.addEventListener("dragenter",(function(e){"fupl-sorting"!==e.dataTransfer.getData("text")||l||(e.stopPropagation&&e.stopPropagation(),this!==n&&this.classList.add(r))}),!1),e.addEventListener("dragover",(function(e){return"fupl-sorting"!==e.dataTransfer.getData("text")||l||(e.preventDefault&&e.preventDefault(),e.dataTransfer.dropEffect="move",this!==n&&this.classList.add(r)),!1}),!1),e.addEventListener("dragleave",(function(){this.classList.remove(r)}),!1),e.addEventListener("drop",(function(e){return"fupl-sorting"!==e.dataTransfer.getData("text")||l||(e.stopPropagation&&e.stopPropagation(),e.preventDefault(),n&&(this.previousElementSibling===n&&this.nextElementSibling?this.parentNode.insertBefore(n,this.nextElementSibling):this.nextElementSibling?this.parentNode.insertBefore(n,this):this.parentNode.insertAdjacentElement("beforeend",n)),s()),!1}),!1),e.addEventListener("dragend",(function(e){"fupl-sorting"!==e.dataTransfer.getData("text")||l||(t.element.classList.remove(i),s(),t.istance_result_wrapper.querySelectorAll(".fupl-sortable-order").forEach((function(e,t){e.value=t})))}),!1)},e.activateSortable=function(e){e.istance_result_wrapper.classList.add(t)},e}((FileUploader=function(e){return e.create_info_text=function(e){var t=[];"img"===e.filetype?(t.push(e.info_text.std_imgs),e.img_w&&e.img_h?t.push(e.info_text.img_fixed_size):e.img_min_w&&e.img_min_h&&e.img_min_w===e.img_min_h?t.push(e.info_text.img_equal_min_size):e.img_max_w&&e.img_max_h&&e.img_max_w===e.img_max_h?t.push(e.info_text.img_equal_max_size):(e.img_w?t.push(e.info_text.img_fixed_width):e.img_min_w&&e.img_max_w?t.push(e.info_text.img_width_range):e.img_min_w?t.push(e.info_text.img_min_width):e.img_max_w&&t.push(e.info_text.img_max_width),e.img_h?t.push(e.info_text.img_fixed_height):e.img_min_h&&e.img_max_h?t.push(e.info_text.img_height_range):e.img_min_h?t.push(e.info_text.img_min_height):e.img_max_h&&t.push(e.info_text.img_max_height))):"pdf"===e.filetype&&t.push(e.info_text.pdf_file),null!==e.max_filesize&&t.push(e.info_text.max_filesize);var i=(t=t.map((function(t){return t.replace(/{{img_w}}/,e.img_w).replace(/{{img_h}}/,e.img_h).replace(/{{img_min_w}}/,e.img_min_w).replace(/{{img_min_h}}/,e.img_min_h).replace(/{{img_max_w}}/,e.img_max_w).replace(/{{img_max_h}}/,e.img_max_h).replace(/{{max_filesize}}/,e.max_filesize?e.max_filesize.feedback_size:null)}))).join(e.info_text_join_string);return i=i.charAt(0).toUpperCase()+i.slice(1),e.info_text_wrap_string&&i&&(i=e.info_text_wrap_string[0]+i+e.info_text_wrap_string[1]),i},e}((FileUploader=function(e){var t={fupl_selector:"file-uploader",silent_degradation:!1,unsuitable_browser_callback:null,css:null,debug:!1,locales:"it-IT",disabled:!1,alert_api:function e(t,i){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"error";window.alert(t.replace(/(<([^>]+)>)/gi,""))},alert_messages:{unsuitable_browser:"Il tuo browser non ha tutte le funzionalità richieste da questa applicazione.\nUtilizza la versione più recente di Firefox, Edge, Safari, Opera o Chrome",too_much_files:"Puoi selezionare un solo file!",xhr_error:"Si &egrave; verificato un errore nel caricamento del file “<strong>{{file_name}}</strong>”.",file_format_error:"Il file “<strong>{{file_name}}</strong>” è di un formato non consentito",file_size_error:"Le dimensioni di “<strong>{{file_name}}</strong>” ({{file_size}}) superano il valore massimo consentito ({{allowed_size}})",img_err_start_string:"L'immagine “<strong>{{file_name}}</strong>” non è corretta:",img_exact_width_err:"Larghezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)",img_min_width_err:"Larghezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",img_max_width_err:"Larghezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",img_exact_height_err:"Altezza non corrispondente ({{image_dimension}}px invece di {{allowed_dimension}}px)",img_min_height_err:"Altezza inferiore a quella minima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)",img_max_height_err:"Altezza superiore a quella massima consentita ({{image_dimension}}px invece di {{allowed_dimension}}px)"},uploader_url:null,filetype:"auto",accept:null,multiple:!1,required:!1,disable_submit:!1,templates:{main:'<div class="fupl-result"></div><div class="fupl-panel"><div class="fupl-button"><label><input type="file"></label><div class="fupl-dd-text"></div></div><div class="fupl-info-text"></div></div>',no_file:{img:'<div class="fupl-result-empty text-muted small font-italic">Nessuna immagine presente</div>',doc:'<div class="fupl-result-empty text-muted small font-italic">Nessun file presente</div>'},remove_btn:'<button type="button" class="close fupl-remove-trigger" aria-label="Elimina" title="Elimina questo file"><span aria-hidden="true">&times;</span></button>',loading_element:'<div class="fupl-loading"><progress class="fupl-progress" max=100 value=0></progress></div>',alternative_loading_element:'<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div',img:{single:'<div class="fupl-item"><div class="fupl-remove"></div><img alt="Immagine caricata" class="img-fluid fupl-img"><div class="fupl-file-info"><div class="text-truncate fupl-file-name"></div><div class="fupl-file-size"></div><div class="fupl-extra-fields"></div></div></div>',multiple:'<div class="fupl-item"><div class="fupl-remove"></div><div class="fupl-img-wrapper"><img alt="Immagine caricata" class="img-fluid fupl-img" draggable="false"></div><div class="fupl-file-info"><div class="text-truncate fupl-file-name"></div><div class="fupl-file-size"></div></div><div class="fupl-extra-fields"></div><div class="fupl-sortable-icon"></div></div>'},doc:{single:'<div class="fupl-item"><div class="fupl-doc-wrapper"><div class="fupl-remove"></div><div class="fupl-doc text-truncate"><a class="text-truncate fupl-file-name fupl-url" draggable="false"></a></div></div><div class="small ml-1 text-nowrap fupl-file-size"></div><div class="fupl-extra-fields"></div><div class="fupl-sortable-icon"></div></div>',multiple:null}},info_text:{std_imgs:"immagini in formato <strong>JPEG</strong>, <strong>PNG</strong>, <strong>GIF</strong> o <strong>WEBP</strong>",img_fixed_size:"dimensioni: <strong>{{img_w}}&times;{{img_h}}px</strong>",img_equal_min_size:"larghezza e altezza non inferiori a <strong>{{img_min_w}}px</strong>",img_equal_max_size:"larghezza e altezza non superiori a <strong>{{img_max_w}}px</strong>",img_fixed_width:"larghezza <strong>{{img_w}}px</strong>",img_fixed_height:"altezza <strong>{{img_h}}px</strong>",img_width_range:"larghezza compresa tra <strong>{{img_min_w}}px</strong> e <strong>{{img_max_w}}px</strong>",img_min_width:"larghezza non inferiore a <strong>{{img_min_w}}px</strong>",img_max_width:"larghezza non superiore a <strong>{{img_max_w}}px</strong>",img_height_range:"altezza compresa tra <strong>{{img_min_h}}px</strong> e <strong>{{img_max_h}}px</strong>",img_min_height:"altezza non inferiore a <strong>{{img_min_h}}px</strong>",img_max_height:"altezza non superiore a <strong>{{img_max_h}}px</strong>",pdf_file:"file in formato <strong>PDF</strong>",max_filesize:"max <strong>{{max_filesize}}</strong>"},wrapper_extra_class:null,element_dragover_class:"fupl-is-dragover",uploader_legend:!0,uploader_legend_text:null,uploader_legend_class:null,input_text:{img:{single:["Seleziona un'immagine","…oppure trascinala qui"],multiple:["Seleziona una o pi&ugrave; immagini","…oppure trascinale qui"]},doc:{single:["Seleziona un documento","…oppure trascinalo qui"],multiple:["Seleziona uno o pi&ugrave; documenti","…oppure trascinali qui"]}},input_label_class:"btn btn-outline-primary btn-sm",show_info_text:!0,info_text_wrap_string:["(",")"],info_text_join_string:", ",custom_info_text:null,img_min_w:null,img_max_w:null,img_w:null,img_min_h:null,img_max_h:null,img_h:null,max_filesize:null,varname:"file",registered_extra_field_varname:null,init_callback:null,upload_start_callback:null,upload_complete_callback:null,alternative_loading_func:null,values:[],delete_varname:"elimina_file[]",fancybox:!1,fancybox_anchor_markup:'<a class="fupl-url" data-fancybox="fupl-gallery"></a>',fancybox_callback_func:null,sortable:!1,sortable_varname:"fupl_order",sortable_icon:'<div title="Trascina per cambiare l\'ordinamento"></div>',extra_fields:null};return e.setOptions=function(){for(var e=arguments.length,i=new Array(e),a=0;a<e;a++)i[a]=arguments[a];if(Object.assign&&"function"==typeof Object.assign)return Object.assign.apply(Object,[{},t].concat(i));var r=function(){var e={},a=function a(r){e[r]=t[r],i.forEach((function(t){void 0!==t[r]&&(e[r]=t[r])}))};for(var r in t)a(r);return{v:e}}();return"object"===_typeof(r)?r.v:void 0},e}((FileUploader=function(e){return e.mimetypes={auto:null,img:["image/png","image/jpeg","image/pjpeg","image/gif","image/webp",".png",".jpg",".jpeg",".pjpg",".pjpeg",".gif",".webp"],pdf:["application/pdf",".pdf"]},e.data_attributes={required:"required",hasValues:"hasValues",item_id:"id"},e.set_has_values=function(t){var i=t.istance_result_wrapper.querySelectorAll(".fupl-item").length;t.wrapper.dataset[e.data_attributes.hasValues]=i?"true":"false",i||(t.istance_result_wrapper.innerHTML=t.templates.no_file[t._type])},e.parse_filesize=function(e,t){var i=1048576;return(e=+e)>=i?(e/i).toLocaleString(t,{maximumFractionDigits:1})+'<span class="fupl-unit">MB</span>':e<1024?Number((e/1024).toFixed(2)).toLocaleString(t,{maximumFractionDigits:2})+'<span class="fupl-unit">KB</span>':Math.round(e/1024).toLocaleString(t,{maximumFractionDigits:0})+'<span class="fupl-unit">KB</span>'},e.parse_max_filesize=function(e,t){if(e){var i,a,r;if(isNaN(e)){if(a=e.substr(-2,2).toUpperCase(),r=i=+e.substr(0,e.length-2),isNaN(i)||"KB"!==a&&"MB"!==a)return!1}else a="KB",r=i=+e;return i>=1024&&"KB"===a&&(a="MB",r=Math.round(i/1024*100)/100),"KB"===a?i*=1024:i=1024*i*1024,{maxbytes:i,feedback_size:r.toLocaleString(t,{maximumFractionDigits:"KB"===a?0:1})+'<span class="fupl-unit">'+a+"</span>"}}return null},e.exec_callback=function(e,t){try{if("string"==typeof e){var i=window;e.split(".").forEach((function(e){i=i[e]})),i(t)}else e(t)}catch(t){alert("Si è verificato un errore: la funzione “".concat(e,"” non esiste")),console.error(t)}},e}(FileUploader||{}))||{}))||{}))||{}))||{}))||{}))||{}))||{}))||{}))||{});
//# sourceMappingURL=file_uploader-min.js.map