const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

let userSearchChar = [];
const userSearch = document.getElementById('searchCustomer');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function createRow(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.FirstName} ${cardInfo.LastName}</th>
            <td>${cardInfo.Email}</td>
            <td class="status"><div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
            <td>
                <button type="button" data-toggle="modal" data-target="#editModal" onclick="loadACustomer(${cardInfo.CustomerID}, '${cardInfo.Status}')">
                <i class="fa-solid fa-pen"></i>
                </button>
            </td>
            <td>
                <button type="button" id="deleteCustomerBtn" onClick="deleteCustomer(${cardInfo.CustomerID})"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr>
    `;
  return card;
}

function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#pagination').html('');
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }
  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }
  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadCustomersByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadCustomersByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadCustomersByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadCustomersByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllCustomers(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      userSearchChar = [];
      for (let i = 0; i < data.length; i++) {
        const customer = data[i];
        const Customer = {
          CustomerName: `${customer.FirstName} ${customer.LastName}`,
          FirstName: customer.FirstName,
          LastName: customer.LastName,
          CustomerID: customer.CustomerID,
          Email: customer.Email,
          Status: customer.Status,
        };
        userSearchChar.push(Customer);
      }
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }else{
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

function loadCustomersByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#customer-list').html('');
      for (let i = 0; i < data.length; i++) {
        const customer = data[i];
        const RowInfo = {
          CustomerID: customer.CustomerID,
          FirstName: customer.FirstName,
          LastName: customer.LastName,
          Email: customer.Email,
          Status: customer.Status,
        };
        const newCard = createRow(RowInfo);
        $('#customer-list').append(newCard);
      }
      loadAllCustomers(pageNumber);
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }else{
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

function loadACustomer(id, status) {
  if (status === 'unverified') {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Editing of this customer is not allowed as account is unverified.',
    }).show();
    return;
  }
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/onecustomer/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#firstName').html('');
      $('#lastName').html('');
      const customer = data[0];
      const RowInfo = {
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Status: customer.Status,
      };
      $('#editCustomerID').val(RowInfo.CustomerID);
      $('#firstName').append(RowInfo.FirstName);
      $('#lastName').append(RowInfo.LastName);
      $('#customerStatusInput').val(RowInfo.Status);
    },
    error(xhr, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      } else if (xhr.status === 500) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      }
    },
  });
}

function updateCustomer() {
  const id = $('#editCustomerID').val();
  const customerPwd = $('#customerPwdInput').val();
  const customerStatus = $('#customerStatusInput').val();
  const data = {
    CustomerPassword: customerPwd,
    CustomerStatus: customerStatus,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() {
      const msg = 'Update Successful';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#customerPwdInput').val('');
      $('#customer-list').html('');
      loadCustomersByLimit(1);
    },
    error(xhr) {
      msg = 'Update Unsuccessful';
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
    },
  });
}

function deleteCustomer(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      $('#customer-list').html('');
      loadCustomersByLimit(1);
      if (xhr.status === 404) {
        errMsg = 'Not valid id';
      } else if (xhr.status === 200) {
        msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
      }
    },
    error(xhr) {
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
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(
            matrix[i][j - 1] + 1, 
            matrix[i - 1][j] + 1, 
          ),
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

userSearch.addEventListener('keyup', (e) => {
  let RowInfo = {};
  const similarResults = [];
  const searchString = e.target.value.toLowerCase();
  $('#pagination').html('');
  let filterCustomers = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));
  if (searchString === '') {
    filterCustomers = [];
    $('#similarSearch').html('');
    $('#customer-list').html('');
    loadCustomersByLimit(1);
    return;
  }
  $('#similarSearch').html('');
  $('#customer-list').html('');
  if (filterCustomers.length !== 0) {
    for (let i = 0; i < filterCustomers.length; i++) {
      const customer = filterCustomers[i];
      RowInfo = {
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Email: customer.Email,
        Status: customer.Status,
      };
      const newCard = createRow(RowInfo);
      $('#customer-list').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].CustomerName;
      const distance = levenshtein(searchString, compared.toLowerCase()); 
      const customer = userSearchChar[i];
      RowInfo = {
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Email: customer.Email,
        Status: customer.Status,
      };
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }
    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#customer-list').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  loadCustomersByLimit(1);
  $('#editCustomerBtn').click(() => {
    updateCustomer();
  });
  $('#deleteCustomerBtn').click(() => {
    deleteCustomer();
  });
});
