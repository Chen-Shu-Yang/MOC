/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

// const res = require("express/lib/response");

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

$(document).ready(() => {
  // Login
  $('#confirmPassword').click(() => {
    // data extraction
    const password = $('#passwordInput').val();
    const idTOken = window.location.search;
    const urlParams = new URLSearchParams(idTOken);
    const id = urlParams.get('id');
    const token = urlParams.get('token');
    console.log(token);
    const tmpToken = token.replaceAll('"', '');
    console.log(tmpToken);
    console.log(token);
    // data compilation
    const info = {
      password,
    };
    // call web service endpoint
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
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
          text: 'Please check your Username and Password',
        }).show();
      },
    });
    return false;
  });
});
