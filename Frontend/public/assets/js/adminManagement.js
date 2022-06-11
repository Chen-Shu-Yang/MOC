/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

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
        <button type="button" data-toggle="modal" data-target="#deleteModal" onclick="loadAnAdmin(${cardInfo.AdminID}, '${cardInfo.AdminType}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
    `;
  return card;
}

// loadAllAdmins method to load all the admins in the company
function loadAllAdmins() {
  // call the web service endpoint for retrieving all admins
  $.ajax({
    url: `${backEndUrl}/admin`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    // If data retrival is successful
    success(data) {
      // To refresh the content within admin-list
      $('#admin-list').html('');

      // for loop to display each object
      for (let i = 0; i < data.length; i++) {
        const Admin = data[i];

        // Extracting information
        const RowInfo = {
          AdminID: Admin.AdminID,
          FirstName: Admin.FirstName,
          LastName: Admin.LastName,
          Email: Admin.Email,
          AdminType: Admin.AdminType
        };

        //calling createRow to display values row by row
        const newCard = createRow(RowInfo);
        //appeding row to classTable
        $('#admin-list').append(newCard);
      }
    },

    // Error if otherwise
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

// loadAnAdmin method to load one admin details
function loadAnAdmin(id, AdminType) {
  // declares a variable endpoint
  let endpoint;
  // Check if the admin extracted is a super admin or a normal admin
  // Change the endpoint and retrieve different data from different tables
  if (AdminType === "Super Admin") {
    // Endpoint to retrieve a superadmin details
    endpoint = `onesuperadmin/${id}`;
  } else {
    // Endpoint to retrieve an admin details
    endpoint = `oneadmin/${id}`;
  }

  // call the web service endpoint for retrieving an admin details
  $.ajax({
    url: `${backEndUrl}/${endpoint}`,
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

      // If Else statement to differentiate the admintype
      // Ensure data passed into the inputs are correct
      if (Admin.AdminType === "Super Admin") {
        // Extracting information for a Super Admin
        RowInfo = {
          SuperAdminID: Admin.SuperAdminID,
          FirstName: Admin.FirstName,
          LastName: Admin.LastName,
          Email: Admin.Email,
          Pwd: Admin.Password,
          AdminType: Admin.AdminType
        };
        // Pre-select dropdown option for admin type
        $('#changeAdminType').val(RowInfo.AdminType);
        // Fills in the input with data extracted
        $('#editAdminID').val(RowInfo.SuperAdminID);
        $('#deleteAdminID').val(RowInfo.SuperAdminID);

      } else {
        // Extracting information for an Admin
        RowInfo = {
          AdminID: Admin.AdminID,
          FirstName: Admin.FirstName,
          LastName: Admin.LastName,
          Email: Admin.Email,
          Pwd: Admin.Password,
          AdminType: Admin.AdminType
        };
        // Pre-select dropdown option for admin type
        $('#changeAdminType').val(RowInfo.AdminType);
        // Fills in the input with data extracted
        $('#editAdminID').val(RowInfo.AdminID);
        $('#deleteAdminID').val(RowInfo.AdminID);
      }
      // Fills in the input with data retrieved
      // Columns names are the same for both types of admin
      // Hence it can be shared
      $('#firstName').append(RowInfo.FirstName);
      $('#lastName').append(RowInfo.LastName);
      $('#adminEmail').append(RowInfo.Email);
      $('#AdminPwdInput').val(RowInfo.Pwd);
      $('#deleteAdminType').val(RowInfo.AdminType);
    },

    // Error if otherwise
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// addUpdateAdmin to add the admin to another admin table when admin type is changed
function addUpdateAdmin() {

  //extract values for add pop-up
  const FirstName = $('#firstName').html();
  const LastName = $('#lastName').html();
  const email = $('#adminEmail').html();
  const password = $('#AdminPwdInput').val();
  const adminType = $('#changeAdminType').val();

  // declares a variable endpoint
  let endpoint;
  // Check if the admin extracted is a super admin or a normal admin
  // Change the endpoint and add the admins into different admin type table
  if (adminType === "Super Admin") {
    // Endpoint to add regular admin into superadmin table
    endpoint = `superadmin`;
  } else {
    // Endpoint to add superadmin into admin table
    endpoint = `admin`;
  }

  //store all extracted info into requestBody
  const requestBody = {
    LastName: LastName,
    FirstName: FirstName,
    AdminPwd: password,
    AdminEmail: email,
    AdminType: adminType,
  }

  // Converts requestBody into a String
  const reqBody = JSON.stringify(requestBody);

  // call the method to post data
  $.ajax({
    url: `${backEndUrl}/${endpoint}`,
    type: 'POST',
    data: reqBody,
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function (data, textStatus, xhr) {
      //set and call confirmation message
      msg = "Successfully added!"
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      const post = data;
      // Refresh the admin table
      loadAllAdmins()
    },
    error: function (xhr, textStatus, errorThrown) {
      //set and call error message
      var errMsg = ""
      if (xhr.status == 500) {
        console.log("error")
        errMsg = "Server Issues"
      }
      else if (xhr.status == 400) {
        errMsg = " Input not accepted"
      }
      else if (xhr.status == 406) {
        errMsg = " Input not accepted"
      }
      else {
        errMsg = "There is some other issues here"
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
    }
  });
}

// updateAdmin to update admin password
function updateAdmin() {
  // data extraction
  const id = $('#editAdminID').val();
  const Password = $('#AdminPwdInput').val();
  const adminType = $('#changeAdminType').val();

  // declares a variable endpoint
  let endpoint;
  // Check if the admin extracted is a super admin or a normal admin
  // Change the endpoint to update either the super admin or admin table
  if (adminType === "Super Admin") {
    // Endpoint to update superadmin
    endpoint = `superadmin/${id}`;
  } else {
    // Endpoint to update regular admin
    endpoint = `admin/${id}`;
  }

  // Stores data extracted into data object
  const data = {
    AdminPwd: Password,
    AdminType: adminType,
  };

  // call the web service endpoint
  $.ajax({
    // headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/${endpoint}`,
    type: 'PUT',
    // Data object is converted into String
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('Update Successful');
      // Refresh admin table
      loadAllAdmins();
    },
    error(xhr, textStatus, errorThrown) {
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
  // Data extraction
  const AdminType = $('#deleteAdminType').val();

  // declares a variable endpoint
  let endpoint;
  // Check if the admin extracted is a super admin or a normal admin
  // Change the endpoint to delete admin either from the admin or super admin table
  if (AdminType === "Super Admin") {
    // Endpoint to delete admin from super admin table
    endpoint = `superadmin/${id}`;
  } else {
    // Endpoint to delete admin from the admin table
    endpoint = `admin/${id}`;
  }

  // call the web service endpoint for deleting admin by id
  $.ajax({
    url: `${backEndUrl}/${endpoint}`,
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
        errMsg = 'Not valid id';
      }
      // if the params id is valid and
      else if (xhr.status === 200) {
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
      }
    },

    error(xhr, textStatus, errorThrown) {
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

//add new admin
function addAdmin(){
    //extract values for add pop-up
    const addFirstName = $('#addAdminFirstNameInput').val();
    const addLastName = $('#addAdminLastNameInput').val();
    const addEmail = $('#addAdminEmailInput').val();
    const addPassword = $('#addAdminPasswordInput').val();
    const addAdminType = $('#addAdminTypeInput').val();
    console.log(addFirstName + addLastName+ addEmail);
    // declares a variable endpoint
    let endpoint;
    // Check if the admin extracted is a super admin or a normal admin
    // Change the endpoint and add the admins into different admin type table
    if (addAdminType === "Super Admin") {
      // Endpoint to add regular admin into superadmin table
      endpoint = `Superadmin`;
    } else {
      // Endpoint to add superadmin into admin table
      endpoint = `Admin`;
    }
    //store all extracted info into requestBody
    const requestBody = {
      LastName: addLastName,
      FirstName: addFirstName,
      AdminPwd: addPassword,
      AdminEmail: addEmail,
      AdminType: addAdminType,
    }
    // Converts requestBody into a String
    const reqtsBody = JSON.stringify(requestBody);
     console.log(reqtsBody);
    // call the method to post data
    $.ajax({
      url: `${backEndUrl}/add${endpoint}`,
      type: 'POST',
      data: reqtsBody,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data, textStatus, xhr) {
        //set and call confirmation message
        msg = "Successfully added!"
        $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
        const post = data;
        // Refresh the admin table
        loadAllAdmins()
      },
      error: function (xhr, textStatus, errorThrown) {
        //set and call error message
        var errMsg = ""
        if (xhr.status == 500) {
          console.log("error")
          errMsg = "Server Issues"
        }
        else if (xhr.status == 400) {
          errMsg = " Input not accepted"
        }
        else if (xhr.status == 406) {
          errMsg = " Input not accepted"
        }
        else {
          errMsg = "There is some other issues here"
        }
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      }
    });

}

// Load datas when page refresh or loads for the first time
$(document).ready(() => {
  // LoadAllAdmins() called when page is loaded or refreshed
  loadAllAdmins();
  
  // Add Admin button
  $('#addAdminBtn').click(() => {
    // addAdmin()function called upon click event
    addAdmin()
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
