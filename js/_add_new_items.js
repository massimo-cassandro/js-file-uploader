/* globals FileUploader2:true */

FileUploader2 = ((upl) => {

  upl.addNewItemHandlers = (fupl_options) => {


  }; // end upl.createItem

  return upl;

})(FileUploader2 || {});




  // //         // !DRAG&DROP
  // //         fupl_options.element
  // //         .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
  // //           e.preventDefault();
  // //           e.stopPropagation();
  // //         })
  // //         .on( 'dragover dragenter', function() {
  // //           fupl_options.element.addClass( fupl_options.element_dragover_class );
  // //         })
  // //         .on( 'dragleave dragend drop', function() {
  // //           fupl_options.element.removeClass( fupl_options.element_dragover_class );
  // //         })
  // //         .on( 'drop', function( e ) {
  // //           var err = false;
  // //           if( !fupl_options.is_multiple && e.originalEvent.dataTransfer.files.length > 1 ) {

  // //             fupl_options.alertErrorAPI('Puoi selezionare un solo file!');
  // //             err = true;
  // //           }

  // //           if(!err) {
  // //             upl.sendFiles( e.originalEvent.dataTransfer.files, fupl_options ); // filelist
  // //           }
  // //         });

  // // //TODO fumoso, da riscrivere
  // // //TODO correggere selector, possibilità non abbia id
  // //         // !selezione tramite input
  // //         var input_selector = '#' + _input.attr('id');
  // //         $(document).on('change', input_selector, function () {
  // //           upl.sendFiles( document.querySelector(input_selector).files, fupl_options ); // filelist
  // //         });


  //       } catch(e) { //throw "error"
  //         console.error( e );// eslint-disable-line
  //       } // finally {}

  //     }); // end document.querySelectorAll(upl.global_options.selector).forEach

  //   }; // end init

  //   return upl;

  // })(FileUploader2 || {});
