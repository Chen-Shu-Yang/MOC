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
function createRow(cardInfo) {
  const card = `
      <tr>
        <td>${cardInfo.CustomerID}</td>
        <td>${cardInfo.FirstName}</td>
        <td> ${cardInfo.LastName}</td>
        <td>${cardInfo.PhoneNumber}</td>
        <td><button onClick="deleteCustomer(${cardInfo.CustomerID})" id="deleteCustomerBtn" class="btn btn-danger">Delete</button></td>
        <td><button onClick="activateUser(${cardInfo.CustomerID})" id="activateCustomerBtn" class="btn btn-success">Activate</button></td>
      </tr>
      `;
  return card;
}
function pageBtnCreate(totalNumberOfPages) {
  $('#pagination').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}
function loadAllInactiveCustomers() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inactiveCustomers`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages);
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

function loadAllInactiveCustomerByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inactiveCustomers/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#customerTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const inactiveCustomer = data[i];
          const contractstbl = {
            CustomerID: inactiveCustomer.CustomerID,
            FirstName: inactiveCustomer.FirstName,
            LastName: inactiveCustomer.LastName,
            PhoneNumber: inactiveCustomer.PhoneNumber,
          };
          const newRow = createRow(contractstbl);
          $('#customerTableBody').append(newRow);
        }
      }
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

function activateUser(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/activateCustomer/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      $('#customerTableBody').html('');
      loadAllInactiveCustomerByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
    },
    error(xhr, textStatus, errorThrown) {;
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#customerTableBody').html('');
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

function deleteCustomer(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inActiveCustomer/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      $('#customerTableBody').html('');
      loadAllInactiveCustomerByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#customerTableBody').html('');
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}
$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadAllInactiveCustomerByLimit('1');
  loadAllInactiveCustomers();
});
