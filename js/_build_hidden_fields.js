FileUploader2 = ((upl) => {

  /*
    elimina i caratteri ascii > 127
    Restituisce la stringa normalizzata
  */
  const normalize_file_name = function (filename) {
    let converted = "";
    const conversionTable = { // Reference table Unicode vs ASCII
      'à' : 'a', // 224
      'è' : 'e', // 232
      'é' : 'e', // 233
      'ì' : 'i', // 236
      'ò' : 'o', // 242
      'ù' : 'u', // 249
      'À' : 'A', // 192
      'È' : 'E', // 200
      'É' : 'E', // 201
      'Ì' : 'I', // 204
      'Ò' : 'O', // 210
      'Ù' : 'U', // 217
      "'" : '_', // 39
      '|' : '_', // 124
      '!' : '_', // 33
      '"' : '_', // 34
      '$' : '_', // 36
      '%' : '_', // 37
      '&' : '_', // 38
      '/' : '_', // 47
      '(' : '_', // 40
      ')' : '_', // 41
      '=' : '_', // 61
      '?' : '_', // 63
      '^' : '_', // 94
      '*' : '_', // 42
      '[' : '_', // 91
      ']' : '_', // 93
      'ç' : 'c', // 231
      '@' : '_', // 64
      '#' : '_', // 35
      '<' : '_', // 60
      '>' : '_', // 62
      'ü' : 'u', // 252
      'Ü' : 'U', // 220
      'ñ' : 'n', // 241
      'Ñ' : 'N', // 209
      '~' : '_', // 126
      ':' : '_',
      '\\' : '_'
    };

    for(var i = 0; i < filename.length; i++) {
      if( filename[i] in conversionTable) {
        converted += conversionTable[filename[i]];

      } else if(filename.charCodeAt(i) === 768 || filename.charCodeAt(i) === 769 ) { // accento grave e accento acuto
        converted += '';

      } else if(filename.charCodeAt(i) > 127 ) {
        converted += '_';

      } else {
        converted += filename.charAt(i);
      }
    }

    return converted.replace(/ /g, '_').replace(/_+/g, '_');
  };

  /*
  buildHiddenFields
  genera i campi hidden con i valori da restituire al server.
  Restituisce la stringa dei campi hidden
  */
  upl.buildHiddenFields = (current_item, fupl_options) => {

    let hidden_fields = '',
    field_values = {
      'tmp_file'  : current_item.tmp_file,
      'file_name' : normalize_file_name(current_item.file.name),
      'size'      : current_item.file.size,
      'type'      : current_item.file.type
    };

    if(fupl_options._type === 'img') {
      field_values.width = current_item.width;
      field_values.height = current_item.height;
    }

    for (let _key in field_values) {
      hidden_fields += '<input type="hidden" '+
        'name="' + fupl_options.varname + '[' + current_item.id +'][' + _key + ']" '+
        'value="' + field_values[_key] +'">';
    }

    return '<div class="fupl-hiddens">' + hidden_fields + '</div>';

  };

  return upl;

})(FileUploader2 || {});
