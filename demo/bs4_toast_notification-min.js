"use strict";function showToastNotification(a,t){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"error",r="error"===e?"danger":e,s='<div class="toast fupl-alert" role="alert" aria-live="assertive" aria-atomic="true">\n    <div class="toast-header">\n      <strong class="mr-auto lead text-'.concat(r,'">Attenzione!</strong>\n      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n      </button>\n    </div>\n    <div class="toast-body">').concat(a,"</div>\n  </div>"),o='<div class="fupl-alert-wrapper"></div>';$(".fupl-alert-wrapper",t.wrapper).length||$(o).appendTo(t.wrapper),$(s).appendTo($(".fupl-alert-wrapper",t.wrapper)),$(".fupl-alert:last").toast({animation:!0,autohide:!0,delay:1e4}).on("hidden.bs.toast",function(){$(this).remove(),$(".fupl-alert-wrapper .fupl-alert",t.wrapper).length||$(".fupl-alert-wrapper",t.wrapper).remove()}).toast("show")}
//# sourceMappingURL=bs4_toast_notification-min.js.map