const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function storeContractAbnormality() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/abnormality/contracts/checks`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      window.location.replace(`${frontEndUrl}/admin/abnormality/contract`);
    },
    error(xhr, textStatus, errorThrown) {
      errMsg="Error in operation"
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    }
  });
}
$(document).ready(() => {
  $('#contractAbnormality').click(() => {
    storeContractAbnormality();
  });
});
