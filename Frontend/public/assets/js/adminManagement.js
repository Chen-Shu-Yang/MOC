/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// const frontEndUrl = 'http://13.213.62.233:3001';
// const backEndUrl = 'http://13.213.62.233:5000';
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tempType = JSON.parse(localStorage.getItem('adminType'));
console.log(tempType);
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

// Create page tabs
function pageBtnCreate(totalNumberOfPages, activePage) {
  // Clears pagination section
  $('#pagination').html('');
  // Get page number of max-left and max-right page
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));

  // Checks if the max-left page is less than 1
  // Which is the first page
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }

  // Checks if max-right page is more than the total number of pages
  // Which is the last page
  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;

    // Checks if max-left is less than 1
    // Which is total number of pages within 1 and 5
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  // Checks if activepage is less than 1
  // Shows the '<<' icon to bring user to the first page
  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  // Check if the active page is within max-left or max-right
  // Displays all page tabs within max-left and max-right
  for (i = maxLeft; i <= maxRight; i++) {
    // Check if page is active
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAdminByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  // Checkd if active page is not equals to the total number of pages
  // Displays the '>>' tab to bring users to the last page
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAdminByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

// loadAllAdmins method to load all the admins in the company
function loadAllAdmins(activePage) {
  // call the web service endpoint for retrieving all admins
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    // If data retrival is successful
    success(data) {
      const totalNumberOfPages = Math.ceil(data.length / 6);

      pageBtnCreate(totalNumberOfPages, activePage);
    },

    // Error if otherwise
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
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
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      $('#admin-list').html('');

      for (let i = 0; i < data.length; i++) {
        const Admin = data[i];

        // Extracting information
        const RowInfo = {
          AdminID: Admin.AdminID,
          FirstName: Admin.FirstName,
          LastName: Admin.LastName,
          Email: Admin.Email,
          AdminType: Admin.AdminType,
        };

        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);

        const newRow = createRow(RowInfo);
        $('#admin-list').append(newRow);
      }
      loadAllAdmins(pageNumber);
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

// loadAnAdmin method to load one admin details
// eslint-disable-next-line no-unused-vars
function loadAnAdmin(id) {
  // call the web service endpoint for retrieving an admin details
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneadmin/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    // If data retrival is successful
    success(data) {
      // Clear the content within the tags
      $('#firstName').html('');
      $('#lastName').html('');
      $('#adminEmail').html('');

      // stores the data in a constant variable
      const Admin = data[0];
      // Declares the RowInfo Object first
      let RowInfo = {};
      // Extracting information for an Admin
      RowInfo = {
        AdminID: Admin.AdminID,
        FirstName: Admin.FirstName,
        LastName: Admin.LastName,
        Email: Admin.Email,
        AdminType: Admin.AdminType,
      };
      // Pre-select dropdown option for admin type
      $('#changeAdminType').val(RowInfo.AdminType);
      $('#editAdminID').val(RowInfo.AdminID);
      $('#deleteAdminID').val(RowInfo.AdminID);
      $('#firstName').append(RowInfo.FirstName);
      $('#lastName').append(RowInfo.LastName);
      $('#adminEmail').append(RowInfo.Email);
      $('#deleteAdminType').val(RowInfo.AdminType);
    },

    // Error if otherwise
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// Add the admin
function addUpdateAdmin() {
  // extract values for add pop-up
  const FirstName = $('#firstName').html();
  const LastName = $('#lastName').html();
  const email = $('#adminEmail').html();
  const password = $('#AdminPwdInput').val();
  const adminType = $('#changeAdminType').val();

  // store all extracted info into requestBody
  const requestBody = {
    LastName,
    FirstName,
    AdminPwd: password,
    AdminEmail: email,
    AdminType: adminType,
  };

  // Converts requestBody into a String
  const reqBody = JSON.stringify(requestBody);

  // call the method to post data
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
      const msg = 'Successfully added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      // Refresh the admin table
      loadAllAdmins();
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
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
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
    },
  });
}

// updateAdmin to update admin password
function updateAdmin() {
  // data extraction
  const id = $('#editAdminID').val();
  const Password = $('#AdminPwdInput').val();
  const adminType = $('#changeAdminType').val();

  // Stores data extracted into data object
  const data = {
    AdminPwd: Password,
    AdminType: adminType,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/${id}`,
    type: 'PUT',
    // Data object is converted into String
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data);
      console.log('Update Successful');
      const msg = 'Update Successfull';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#AdminPwdInput').val('');
      // Refresh admin table
      loadAllAdmins();
    },
    error(xhr, textStatus, errorThrown) {
      const msg = 'Update UnSuccessfull';
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// Delete Admin when admin type is changed
function deleteAdmin(id) {
  // call the web service endpoint for deleting admin by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      console.log('Delete Successful');
      // Refresh admin table
      loadAllAdmins();

      if (xhr.status === 404) {
        // set and call error message
        // eslint-disable-next-line no-use-before-define
        const errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      } else if (xhr.status === 200) {
        // if the params id is valid and
        // set and call confirmation message
        const msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
      }
    },

    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
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

// add new admin
function addAdmin() {
  // extract values for add pop-up
  const addFirstName = $('#addAdminFirstNameInput').val();
  const addLastName = $('#addAdminLastNameInput').val();
  const addEmail = $('#addAdminEmailInput').val();
  const addPassword = $('#addAdminPasswordInput').val();
  const addAdminType = $('#addAdminTypeInput').val();

  // store all extracted info into requestBody
  const requestBody = {
    LastName: addLastName,
    FirstName: addFirstName,
    AdminPwd: addPassword,
    AdminEmail: addEmail,
    AdminType: addAdminType,
  };
  // Converts requestBody into a String
  const reqtsBody = JSON.stringify(requestBody);

  // call the method to post data
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/addAdmin`,
    type: 'POST',
    data: reqtsBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
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
      // Refresh the admin table
      loadAllAdmins();
    },
    error(xhr) {
      // set and call error message
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

// Load datas when page refresh or loads for the first time
$(document).ready(() => {
  // LoadAllAdmins() called when page is loaded or refreshed
  loadAdminByLimit(1);

  // Add Admin button
  $('#addAdminBtn').click(() => {
    // addAdmin()function called upon click event
    addAdmin();
  });

  // Update Admin Type button
  $('#editAdminTypeBtn').click(() => {
    // Admin Id extracted to be passed into deleteAdmin() function
    const id = $('#editAdminID').val();

    // Process of updating admin type
    addUpdateAdmin();
    deleteAdmin(id);
    // Refresh the admin table
    loadAllAdmins();
  });

  // Update Admin Password button
  $('#editAdminBtn').click(() => {
    // UpdateAdmin() function called upon click event
    updateAdmin();
  });

  // Delete Admin button
  $('#deleteAdminBtn').click(() => {
    // Admin Id Extracted for delete admin function
    const id = $('#deleteAdminID').val();
    // Delete admin function called upon click event
    deleteAdmin(id);
  });
});
