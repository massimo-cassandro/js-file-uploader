/*
Generate hidden fields with values to be sent to server
Returns the hidden fields html string
*/
import { fupl_utilities } from './utilities.js';

export function build_hidden_fields(current_item, fupl_options) {

  // normalize ascii chars > 127 (and more)
  const normalize_file_name = filename => {
    let converted = '';
    const std_char = '-', // char for standrd substitutions
      conversionTable = { // Reference table Unicode vs ASCII
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
        '\'' : std_char, // 39
        '|' : std_char, // 124
        '!' : std_char, // 33
        '"' : std_char, // 34
        '$' : std_char, // 36
        '%' : std_char, // 37
        '&' : std_char, // 38
        '/' : std_char, // 47
        '(' : std_char, // 40
        ')' : std_char, // 41
        '=' : std_char, // 61
        '?' : std_char, // 63
        '^' : std_char, // 94
        '*' : std_char, // 42
        '[' : std_char, // 91
        ']' : std_char, // 93
        'ç' : 'c', // 231
        '@' : std_char, // 64
        '#' : std_char, // 35
        '<' : std_char, // 60
        '>' : std_char, // 62
        'ü' : 'u', // 252
        'Ü' : 'U', // 220
        'ñ' : 'n', // 241
        'Ñ' : 'N', // 209
        '~' : std_char, // 126
        ':' : std_char,
        '\\' : std_char
      };

    for(var i = 0; i < filename.length; i++) {
      if( filename[i] in conversionTable) {
        converted += conversionTable[filename[i]];

      } else if(filename.charCodeAt(i) === 768 || filename.charCodeAt(i) === 769 ) { // accento grave e accento acuto
        converted += '';

      } else if(filename.charCodeAt(i) > 127 ) {
        converted += std_char;

      } else {
        converted += filename.charAt(i);
      }
    }

    return converted.replace(/ /g, std_char)
      .replace(new RegExp(`^${std_char}+`), '')
      .replace(new RegExp(`${std_char}+`,'g'), std_char);
  };

  let hidden_fields = '',
    field_values = {
      'tmp_file'  : current_item.tmp_file,
      'file_name' : normalize_file_name(current_item.file.name),
      'size'      : current_item.file.size,
      'type'      : current_item.file.type
    };

  // if(fupl_options._type === 'img') {
  if(current_item.isBitmapImg) {
    field_values.width = current_item.width;
    field_values.height = current_item.height;

    // TODO spostare in posizione più appropriata
    // aggiunta data-width e height all'immagine per controlli extra
    const img = fupl_options.element.querySelector('.fupl-img');
    img.dataset.width = current_item.width;
    img.dataset.height = current_item.height;
    img.dataset.size = current_item.file.size;
    img.dataset.type = current_item.file.type;
  }
  for (let _key in field_values) {
    hidden_fields += '<input type="hidden" '+
      'name="' + fupl_options.varname + '[' + current_item.id +'][' + _key + ']" '+
      'value="' + ((field_values[_key] !== null && field_values[_key] !== undefined)? field_values[_key] : '') +'">';
  }

  return '<div class="fupl-hiddens">' + hidden_fields + '</div>';

}
