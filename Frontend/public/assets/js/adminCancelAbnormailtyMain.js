const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createTable(cardInfo) {
  const card = `
  <tr>
  <td>${cardInfo.CancelBookingAbn}</td>
  <td>${cardInfo.Customer}</td>
  <td>${cardInfo.FirstName}</td>
  <td>${cardInfo.LastName}</td>
  <td> <button type="button" id="suspendBtn" class="btn btn-danger"  onClick="suspendUser(${cardInfo.Customer})">Suspend</button></td>
  <td> <button type="button" id="resolveBtn" class="btn btn-success"  onClick="resolveIssue(${cardInfo.Customer})">Resolve</button></td>
  </tr>
  `;
  return card;
}

function loadAllClassOfServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/cancelledBookingAbnormality`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const cancelAbnormalityInfo = data[i];
        const RowInfo = {
          CancelBookingAbn: cancelAbnormalityInfo.CancelBookingAbn,
          Customer: cancelAbnormalityInfo.Customer,
          FirstName: cancelAbnormalityInfo.FirstName,
          LastName: cancelAbnormalityInfo.LastName,
        };
        const newRow = createTable(RowInfo);
        $('#cancelAbnormalTableBody').append(newRow);
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      else{
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
  });
}

function resolveIssue(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateCancelAbnormality/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      if (xhr.status === 404) {
        let errMsg = '';
        errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#cancelAbnormalTableBody').html('');
        loadAllClassOfServices();
      } else if (xhr.status === 202) {
        msg = 'Successfully resolved!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        $('#cancelAbnormalTableBody').html('');
        loadAllClassOfServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
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

function suspendUser(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateCustomerStatus/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      if (xhr.status === 404) {
        let errMsg = '';
        errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#cancelAbnormalTableBody').html('');
      } else if (xhr.status === 202) {
        const msg = 'User suspended!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
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

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadAllClassOfServices();
});
