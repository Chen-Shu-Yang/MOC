const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tmpToken === null || tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function loadProfileDetails() {
  const customerId = localStorage.getItem('customerID');
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/user/customer/${customerId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const custDetail = data[0];
      $('#firstName').val(custDetail.FirstName);
      $('#lastName').val(custDetail.LastName);
      $('#address').val(custDetail.Address);
      $('#postal').val(custDetail.PostalCode);
      $('#phone').val(custDetail.PhoneNumber);
      $('#email').val(custDetail.Email);
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

    },
  });
}

$('#updateProfile').click(() => {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const address = $('#address').val();
  const postal = $('#postal').val();
  const phoneNumber = $('#phone').val();
  const email = $('#email').val();
  const customerId = localStorage.getItem('customerID');
  const info = {
    firstName,
    lastName,
    address,
    postal,
    phoneNumber,
    email,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/update/customer/${customerId}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Profile updated!',
        }).show();
      } else {
        errMsg="Error in operation"
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
  
      }
    },
    error(xhr, textStatus, errorThrown) {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please check your the date and ID',
      }).show();
    },
  });
});
$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadProfileDetails();
});
