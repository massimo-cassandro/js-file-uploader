/* globals FileUploader2:true */

FileUploader2 = ((upl) => {
  "use strict";

  /*
    basato su
    - https://github.com/WolfgangKurz/grabbable

    altri riferimenti:
    - https://codepen.io/therealDaze/pen/ZaoErp
    - https://github.com/gridstack/gridstack.js
    - https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API
    - https://www.html5rocks.com/en/tutorials/dnd/basics/
  */

  upl.activateSortable = (fupl_options) => {

    // add classes
    fupl_options.istance_result_wrapper.classList.add('fupl-sortable');

    let ghost = null;

    // ghost creation
    const createGhost = function(){

      ghost = document.createElement("div");
      ghost.className = "grabbable-dummy";
      ghost.style.position = "relative";
      ghost.addEventListener("drop", function(e){
        var data = e.dataTransfer.getData("text");
        if(data!=="draggable") return;

        e.preventDefault();
        e.stopPropagation();

        while(bg.children.length>0){
          var elem = bg.children[0];
          this.parentNode.insertBefore(elem, this);
        }

        ghost.style.display = "none";
        callCallback(dummy.parentNode);
      });

      var x = document.querySelector("body");
      x.appendChild(ghost);
    };

  }; // end upl.activateSortable

  return upl;

})(FileUploader2 || {});



// 	var customCallback = null;

// 	var callCallback = function(elem){
// 		if(document.createEventObject) {
// 			elem.fireEvent("ondragged");

// 		} else {
// 			var evt = document.createEvent("HTMLEvents");
// 			evt.initEvent("dragged", false, true);
// 			elem.dispatchEvent(evt);

//       if( customCallback && typeof customCallback === 'function') {
//         customCallback();
//       }
// 		}
// 	};

// 	var dummy = null, bg = null;
	// var createDummy = function(){
	// 	bg = document.createElement("div");
	// 	bg.style.position = "absolute";
	// 	bg.style.width = "1px";
	// 	bg.style.height = "1px";
	// 	bg.style.overflow = "hidden";

	// 	dummy = document.createElement("div");
	// 	dummy.className = "grabbable-dummy";
	// 	dummy.style.position = "relative";
	// 	dummy.addEventListener("drop", function(e){
	// 		var data = e.dataTransfer.getData("text");
	// 		if(data!=="draggable") return;

	// 		e.preventDefault();
	// 		e.stopPropagation();

	// 		while(bg.children.length>0){
	// 			var elem = bg.children[0];
	// 			this.parentNode.insertBefore(elem, this);
	// 		}

	// 		dummy.style.display = "none";
	// 		callCallback(dummy.parentNode);
	// 	});

	// 	var x = document.querySelector("body");
	// 	x.appendChild(dummy);
	// 	x.appendChild(bg);
	// };
// 	var updateDummy = function(el){

// /**** fix */
// 		if(bg === null) {
//   		grabbableStyle();
//   		createDummy();
// 		}
// /**** end fix */

// 		bg.style.left = el.offsetLeft+"px";
// 		bg.style.top = el.offsetTop+"px";
// 		dummy.style.width = el.offsetWidth+"px";
// 		dummy.style.height = el.offsetHeight+"px";

// 		var style = window.getComputedStyle(el);
// 		dummy.style.display = style.display;
// 		dummy.style.margin = style.marginTop+" "+style.marginRight+" "+style.marginBottom+" "+style.marginLeft;
// 		dummy.style.padding = style.paddingTop+" "+style.paddingRight+" "+style.paddingBottom+" "+style.paddingLeft;
// 	};
// 	var initGrabbable = function(){
// 		grabbableStyle();
// 		createDummy();
// 	};

// 	var prevent = function(e){
// 		e.preventDefault();
// 		e.stopPropagation();
// 	};
// 	var allowDrop = function(e){
// 		e.preventDefault();

// 		e.stopPropagation();

// 		if(this.previousElementSibling!==dummy)
// 			this.parentNode.insertBefore(dummy, this);
// 		else
// 			this.parentNode.insertBefore(dummy, this.nextElementSibling);
// 	};
// 	var dragOn = function(e){
// 		e.dataTransfer.setData("text", "draggable");
// 	};
// 	var resetDrop = function(e){
// 		var data = e.dataTransfer.getData("text");
// 		if(data!=="draggable") return;

// 		prevent(e);

// 		while(bg.children.length>0){
// 			var elem = bg.children[0];
// 			dummy.parentNode.insertBefore(elem, dummy);
// 		}
// 		dummy.style.display = "none";
// 		callCallback(dummy.parentNode);
// 	};

// 	if(document.readyState==="complete") {
//   	initGrabbable();
// 	} else {
//   	document.addEventListener("DOMContentLoaded", function(){ initGrabbable(); });
//   }

// 	HTMLElement.prototype.grabbable = function( userCallback ){
// 		if( (" "+this.className+" ").indexOf(" grabbable ")<0 )
// 			this.className += " grabbable";

// 		if( userCallback && typeof userCallback === 'function' ) {
//   		customCallback = userCallback;
// 		}

// 		for(var i=0; i<this.children.length; i++){
// 			var el = this.children[i];
// 			if(typeof el.draggabled==="undefined"){
// 				if(el===dummy) continue;

// 				el.draggable = true;

// 				el.addEventListener("dragstart", dragOn);
// 				el.addEventListener("dragover", allowDrop);
// 				el.addEventListener("drag", function(){
// 					if(this.parentNode===bg) return;
// 					if(this===dummy) return;
// 					updateDummy(this);
// 					this.parentNode.insertBefore(dummy, this);
// 					bg.appendChild(this);
// 				});
// 				el.addEventListener("drop", function(e){
// 					prevent(e);
// 					if(document.createEventObject) {
//   					dummy.fireEvent("ondrop", e);
// 					} else {
//   					dummy.dispatchEvent(new DragEvent(e.type, e));
//   				}
// 				});
// 				el.draggabled = true;
// 			}
// 		}

// 		if(typeof document.draggabled==="undefined"){
// 			document.addEventListener("dragover", prevent);
// 			document.addEventListener("drop", resetDrop);
// 			document.draggabled = true;
// 		}
// 	};
// }();
