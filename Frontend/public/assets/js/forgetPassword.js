const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';



$(document).ready(() => {
  $('#confirmEmail').click(() => {
    const emails = $('#emailInput').val();
    const info = {
      email: emails,
    };
    $.ajax({
      url: `${backEndUrl}/forgetPassword`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        if (data != null) {
          console.log('Data');
          console.log(data);
          new Noty({
            timeout: '5000',
            type: 'success',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Email Sent',
          }).show();
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
          text: 'Please check your Email',
        }).show();
      },
    });
    return false;
  });
});
