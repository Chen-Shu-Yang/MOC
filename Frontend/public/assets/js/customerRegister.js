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
    $('#SignUp').click(() => {
        // data extraction
        const customerEmail = $('#customerEmailInput').val();
        const customerPassword = $('#customerPasswordInput').val();
        const customerFirstName = $('#firstNameInput').val();
        const customerLastName = $('#lastNameInput').val();
        const customerNumber = $('#numberInput').val();
        const customerAddress = $('#addressInput').val();
        const customerPostalCode = $('#postalCodeInput').val();

        // data compilation
        const info = {
            FirstName: customerFirstName,
            LastName: customerLastName,
            Password: customerPassword,
            Email: customerEmail,
            Address: customerAddress,
            PhoneNumber: customerNumber,
            PostalCode: customerPostalCode,

        };
        // call web service endpoint
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
