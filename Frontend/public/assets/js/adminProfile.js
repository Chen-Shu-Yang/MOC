

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

// Take value from local storage and get information on the admin with that ID
function loadProfileDetails() {
    const adminID = localStorage.getItem('AdminID')
    $.ajax({
        url: `${backEndUrl}/admin/profile/${adminID}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',

        success(data) {
            console.log('-------response data------');
            console.log(data.Email);
            console.log(`LENGTH OF DATA:${data.length}`);

            const adminDetails = data[0];
            // Loads data into input element
            $('#firstName').val(adminDetails.FirstName);
            $('#lastName').val(adminDetails.LastName);
            $('#phone').val(adminDetails.PhoneNumber);
            $('#email').val(adminDetails.Email);
        },

        error(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');

            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            console.log(xhr.responseText);
            console.log(xhr.status);
        },
    });
}

$('#updateProfile').click(() => {
    // data extraction
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    // const phoneNumber = $('#phone').val();
    const email = $('#email').val();
    const adminID = localStorage.getItem('AdminID')
    // data compilation
    const info = {
        firstName: firstName,
        lastName: lastName,
        email: email,
    };

    // call web service endpoint
    $.ajax({
        url: `${backEndUrl}/update/admin/${adminID}`,
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
                    text: 'Added successfully',
                }).show();
            } else {
                console.log('Error');
            }
        },
        error(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(`XHR: ${JSON.stringify(xhr)}`);
            console.log(`Textstatus: ${textStatus}`);
            console.log(`Errorthorwn${errorThrown}`);
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
    console.log('--------Query Params----------');
    console.log(`Query Param (source): ${window.location.search}`);
    console.log(`Query Param (extraction): ${queryParams}`);
    // On page loaded, start function below
    loadProfileDetails();
});