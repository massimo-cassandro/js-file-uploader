// TODO update to dialog element

export function fupl_alert(mes, fupl_opts) {

  const alert_dialog = `<div class="fupl-alert-overlay">
    <div class="fupl-alert">
        <div class="fupl-alert-inner"></div>
        <button type="button">OK</button>
      </div>
  </div>`;

  let alert_container = fupl_opts.element.querySelector('.fupl-alert-inner');

  if(!alert_container) {
    fupl_opts.element.insertAdjacentHTML('beforeend', alert_dialog);
    alert_container = fupl_opts.element.querySelector('.fupl-alert-inner');
  }

  alert_container.insertAdjacentHTML('afterbegin', mes);


}
