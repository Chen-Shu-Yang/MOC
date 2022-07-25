/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';



$(document).ready(() => {

  
  const togglePasswordForgot = document.querySelector('#togglePasswordForget');
  const passwordForgot = document.querySelector('#passwordInput');
  togglePasswordForgot.addEventListener('click', function () {
    // toggle the type attribute
    const type = passwordForgot.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordForgot.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
  });

  const togglePasswordForgotConfirm = document.querySelector('#togglePasswordForgetConfirm');
  const passwordForgotConfirm = document.querySelector('#passwordInput2');

  togglePasswordForgotConfirm.addEventListener('click', function () {
    // toggle the type attribute
    const type = passwordForgotConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordForgotConfirm.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
  });



  
  // Login
  $('#confirmPassword').click(() => {
    // data extraction
    const password = $('#passwordInput').val();
    const secondPassword = $('#passwordInput2').val();
    //  regex to check Please use more Secure password.
    // Ensure that it is 8 character, 1 Caps, 1 small and 1 Special character
    const pwdPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    // get id and token from parameters
    const idTOken = window.location.search;
    const urlParams = new URLSearchParams(idTOken);
    // get id inidividually
    const id = urlParams.get('id');
    // get token individually
    const token = urlParams.get('token');
    // data compilation
    const info = {
      password,
    };
    // call web service endpoint
    // check valid password
    if (pwdPattern.test(password)) {
      // check if both password the same
      if (password === secondPassword) {
        $.ajax({
          // token that expire in 15 min
          headers: { authorization: `Bearer ${token}` },
          url: `${backEndUrl}/resetUserPassword/${id}/${token}`,
          type: 'PUT',
          data: JSON.stringify(info),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(data) {
            if (data != null) {
              console.log('Data');
              new Noty({
                timeout: '5000',
                type: 'success',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Password Updated',
              }).show();
              window.location.replace(`${frontEndUrl}/login`);
            } else {
              console.log('Error');
            }
          },
          error(xhr, textStatus, errorThrown) {
            console.log('Frontend error');
            console.log('Error in Operation');
            console.log(`XHR: ${JSON.stringify(xhr)}`);
            console.log(`Textstatus: ${textStatus}`);
            console.log(`Errorthorwn${errorThrown}`);
            new Noty({
              timeout: '5000',
              type: 'error',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Invalid link',
            }).show();
          },
        });
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please ensure your both password is correct ',
        }).show();
      }
    } else {
      // error if password doesn't match with pattern
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please use valid Email or Please use more Secure password. Ensure that it is 8 character, 1 Caps, 1 small and 1 Special character ',
      }).show();
    }

    return false;
  });
});
