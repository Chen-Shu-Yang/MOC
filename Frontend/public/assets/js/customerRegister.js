const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#customerPasswordInput');

togglePassword.addEventListener('click', function () {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});
$(document).ready(() => {
  $('#SignUp').click(() => {
    const customerEmail = $('#customerEmailInput').val();
    const customerPassword = $('#customerPasswordInput').val();
    const customerFirstName = $('#firstNameInput').val();
    const customerLastName = $('#lastNameInput').val();
    const customerNumber = $('#numberInput').val();
    const customerAddress = $('#addressInput').val();
    const customerPostalCode = $('#postalCodeInput').val();
    const emailPattern = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    const pwdPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    const postalCodePattern = new RegExp('^[0-9]{6}$');
    const phoneNumberPattern = new RegExp('^(6|8|9)\\d{7}$');
    if (customerFirstName === '' && customerAddress === '' && customerEmail === '' && customerPassword === '' && customerNumber === '' && customerPostalCode === '') {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please fill up the particular',
      }).show();
    } else {
      if (emailPattern.test(customerEmail) && pwdPattern.test(customerPassword)) {
        if (phoneNumberPattern.test(customerNumber)) {
          if (postalCodePattern.test(customerPostalCode)) {
            const info = {
              FirstName: customerFirstName,
              LastName: customerLastName,
              Password: customerPassword,
              Email: customerEmail,
              Address: customerAddress,
              PhoneNumber: customerNumber,
              PostalCode: customerPostalCode,
            };
            $.ajax({
              url: `${backEndUrl}/registerCustomer`,
              type: 'POST',
              data: JSON.stringify(info),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success(data) {
                if (data != null) {
                  window.location.replace(`${frontEndUrl}/login`);
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
                if(errorThrown === 'Unprocessable Entity'){
                  new Noty({
                    timeout: '5000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'This email already has an account',
                  }).show();
                }else{
                  new Noty({
                    timeout: '5000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Invalid Input',
                  }).show();
                }
              },
            });
          } else {
            new Noty({
              timeout: '5000',
              type: 'error',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Please use valid Postal code ',
            }).show();
          }
        } else {
          new Noty({
            timeout: '5000',
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Please use valid Phone Number',
          }).show();
        }
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please use valid Email or Please use more Secure password. Ensure that it is 8 character, 1 Caps, 1 small and 1 Special character ',
        }).show();
      }
    }
    return false;
  });
});
