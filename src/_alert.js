// TODO update to dialog element

export function fupl_alert(mes, fupl_opts) {

  let alert_container = fupl_opts.element.querySelector('.fupl-alert-body ul');

  if(typeof mes === 'string') {
    mes = [mes];
  }


  if(!alert_container) {
    fupl_opts.element.insertAdjacentHTML('beforeend',
      fupl_opts.fupl_alert_template
    );

    fupl_opts.element.querySelector('.fupl-alert-body').innerHTML = '<ul></ul>';

    alert_container = fupl_opts.element.querySelector('.fupl-alert-body ul');

    fupl_opts.element.querySelector('.fupl-alert button').addEventListener('click', () => {
      fupl_opts.element.querySelector('.fupl-alert-overlay').remove();
    }, false);
  }

  mes.forEach(item => {
    alert_container.insertAdjacentHTML('afterbegin', `<li>${item}</li>`);
  });


}
