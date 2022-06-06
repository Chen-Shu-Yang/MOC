/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

// const res = require("express/lib/response");

// backend url
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

$(document).ready(() => {
  // Login
  $('#Login').click(() => {
    // data extraction
    const emails = $('#emailInput').val();
    const pwd = $('#pwdInput').val();

    // data compilation
    const info = {
      email: emails,
      password: pwd,
    };
    // call web service endpoint
    $.ajax({
      url: `${backEndUrl}/login`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success(data) {
        if (data != null) {
          localStorage.setItem('UserID', JSON.stringify(data.UserID));
          localStorage.setItem('token', JSON.stringify(data.token));
          localStorage.setItem('CustomerID', JSON.stringify(data.CustomerID));
          localStorage.setItem('SuperAdminID', JSON.stringify(data.SuperAdminID));
          window.location.replace(`${frontEndUrl}/homepage`);
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
          text: 'Please check your Username and Password',
        }).show();
      },
    });

    return false;
  });
});
