/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.buildHiddenFields = () => {
    console.log('buildHiddenFields'); // eslint-disable-line
  }; // end upl.sendFiles

  return upl;

})(FileUploader2 || {});



// FileUploader = (function (_upl) {
//   "use strict";

//   /**
// 	 * ### normalize\_file\_name
// 	 * (funzione privata) elimina i caratteri ascii > 127
// 	 *
//    * - Restituisce la stringa normalizzata
// 	 */
// 	var normalize_file_name = function (filename) {
//       var converted = "",
//         conversionTable = { // Reference table Unicode vs ASCII
//           'à' : 'a', // 224
//           'è' : 'e', // 232
//           'é' : 'e', // 233
//           'ì' : 'i', // 236
//           'ò' : 'o', // 242
//           'ù' : 'u', // 249
//           'À' : 'A', // 192
//           'È' : 'E', // 200
//           'É' : 'E', // 201
//           'Ì' : 'I', // 204
//           'Ò' : 'O', // 210
//           'Ù' : 'U', // 217
//           "'" : '_', // 39
//           '|' : '_', // 124
//           '!' : '_', // 33
//           '"' : '_', // 34
//           '$' : '_', // 36
//           '%' : '_', // 37
//           '&' : '_', // 38
//           '/' : '_', // 47
//           '(' : '_', // 40
//           ')' : '_', // 41
//           '=' : '_', // 61
//           '?' : '_', // 63
//           '^' : '_', // 94
//           '*' : '_', // 42
//           '[' : '_', // 91
//           ']' : '_', // 93
//           'ç' : 'c', // 231
//           '@' : '_', // 64
//           '#' : '_', // 35
//           '<' : '_', // 60
//           '>' : '_', // 62
//           'ü' : 'u', // 252
//           'Ü' : 'U', // 220
//           'ñ' : 'n', // 241
//           'Ñ' : 'N', // 209
//           '~' : '_', // 126
//           ':' : '_',
//           '\\' : '_'
//         }
//       ;

//       for(var i = 0; i < filename.length; i++) {
//         if( filename[i] in conversionTable) {
//           converted += conversionTable[filename[i]];

//         } else if(filename.charCodeAt(i) === 768 || filename.charCodeAt(i) === 769 ) { // accento grave e accento acuto
//           converted += '';

//         } else if(filename.charCodeAt(i) > 127 ) {
//           converted += '_';

//         } else {
//           converted += filename.charAt(i);
//         }
//       }

//   	return converted.replace(/ /g, '_').replace(/_+/g, '_');

//   };


//   /**
// 	 * ### build\_hidden\_fields
// 	 * (funzione) genera i campi hidden con i valori da restituire al server.
// 	 *
//    * - Restituisce la stringa dei campi hidden con i vari parametri
// 	 */
// 	_upl.build_hidden_fields = function (item_id, upl_options, filelist_item, tmp_file, image_width, image_height) {

// /*
//     ELIMINATO, usato item_id al suo posto

//     files_count = conteggio dei blocchi di campi hidden, utilizzato
//     per determinare l'indice corrente
//     var files_count =  $('.file_uploader_hiddens').length,
// */

//     var hidden_fields = '',
//       _values = {
//         'tmp_file'  : tmp_file,
//         'file_name' : normalize_file_name(filelist_item.name),
//         'size'      : filelist_item.size,
//         'type'      : filelist_item.type
//       };

//     if(image_width && image_height) {
//       _values.width = image_width;
//       _values.height = image_height;
//     }

//     for (var _key in _values) {
//       hidden_fields += '<input type="hidden" '+
//         'name="' + upl_options.varname + '[' + item_id +'][' + _key + ']" '+
//         'value="' + _values[_key] +'">';
//     }

//     return '<div class="file_uploader_hiddens">' + hidden_fields + '</div>';

// 	};

//   return _upl;

// })(FileUploader || {});
