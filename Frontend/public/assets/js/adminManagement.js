const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tempType = JSON.parse(localStorage.getItem('adminType'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
if (tempType === 'Admin') {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const card = `
    <tr>
      <th scope="row">${cardInfo.FirstName} ${cardInfo.LastName}</th>
      <td>${cardInfo.Email}</td>
      <td>${cardInfo.AdminType}</td>
      <td>
        <button type="button" data-toggle="modal" data-target="#editModal" onclick="loadAnAdmin(${cardInfo.AdminID}, '${cardInfo.AdminType}')">
          <i class="fa-solid fa-pen"></i>
        </button>
      </td>
      <td>
        <button type="button" data-toggle="modal" data-target="#deleteModal" onclick="loadAnAdmin(${cardInfo.AdminID}, '${cardInfo.AdminType}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
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
    divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAdminByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllAdmins(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
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

function loadAdminByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#admin-list').html('');
      for (let i = 0; i < data.length; i++) {
        const Admin = data[i];
        const RowInfo = {
          AdminID: Admin.AdminID,
          FirstName: Admin.FirstName,
          LastName: Admin.LastName,
          Email: Admin.Email,
          AdminType: Admin.AdminType,
        };
        const newRow = createRow(RowInfo);
        $('#admin-list').append(newRow);
      }
      loadAllAdmins(pageNumber);
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

function loadAnAdmin(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneadmin/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#firstName').html('');
      $('#lastName').html('');
      $('#adminEmail').html('');
      const Admin = data[0];
      let RowInfo = {};
      RowInfo = {
        AdminID: Admin.AdminID,
        FirstName: Admin.FirstName,
        LastName: Admin.LastName,
        Email: Admin.Email,
        AdminType: Admin.AdminType,
      };
      $('#changeAdminType').val(RowInfo.AdminType);
      $('#editAdminID').val(RowInfo.AdminID);
      $('#deleteAdminID').val(RowInfo.AdminID);
      $('#firstName').append(RowInfo.FirstName);
      $('#lastName').append(RowInfo.LastName);
      $('#adminEmail').append(RowInfo.Email);
      $('#deleteAdminType').val(RowInfo.AdminType);
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

function updateAdmin() {
  const id = $('#editAdminID').val();
  const Password = $('#AdminPwdInput').val();
  const adminType = $('#changeAdminType').val();
  const data = {
    AdminPwd: Password,
    AdminType: adminType,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() {
      const msg = 'Update Successfull';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#AdminPwdInput').val('');
      loadAdminByLimit(1);
    },
    error() {
      const msg = 'Update UnSuccessful!';
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

function deleteAdmin(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(xhr) {
      loadAdminByLimit(1);
      if (xhr.status === 404) {
        const errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      } else if (xhr.status === 200) {
        const msg = 'Successfully deleted!';
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
    },
  });
}
function addAdmin() {
  const addFirstName = $('#addAdminFirstNameInput').val();
  const addLastName = $('#addAdminLastNameInput').val();
  const addEmail = $('#addAdminEmailInput').val();
  const addPassword = $('#addAdminPasswordInput').val();
  const addAdminType = $('#addAdminTypeInput').val();
  const emailPattern = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
  if (!emailPattern.test(addEmail)) {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Please enter a valid email.',
    }).show();
    return;
  }
  const requestBody = {
    LastName: addLastName,
    FirstName: addFirstName,
    AdminPwd: addPassword,
    AdminEmail: addEmail,
    AdminType: addAdminType,
  };
  const reqtsBody = JSON.stringify(requestBody);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/addAdmin`,
    type: 'POST',
    data: reqtsBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() {
      const msg = 'Successfully added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#addAdminFirstNameInput').val('');
      $('#addAdminLastNameInput').val('');
      $('#addAdminEmailInput').val('');
      $('#addAdminPasswordInput').val('');
      $('#addAdminTypeInput').val('Admin');
      loadAdminByLimit(1);
    },
    error(xhr) {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: xhr.responseText,
      }).show();
    },
  });
}

$(document).ready(() => {
  loadAdminByLimit(1);
  $('#addAdminBtn').click(() => {
    addAdmin();
  });
  $('#editAdminBtn').click(() => {
    updateAdmin();
  });

  $('#deleteAdminBtn').click(() => {
    const id = $('#deleteAdminID').val();
    deleteAdmin(id);
  });
});
