/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

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
                <button type="button" data-toggle="modal" data-target="#editModal" onclick="loadACustomer(${cardInfo.CustomerID})">
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
    divPaginBtn = `<button type="button" onClick="loadCustomersByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  // Check if the active page is within max-left or max-right
  // Displays all page tabs within max-left and max-right
  for (i = maxLeft; i <= maxRight; i++) {
    // Check if page is active
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadCustomersByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadCustomersByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  // Checkd if active page is not equals to the total number of pages
  // Displays the '>>' tab to bring users to the last page
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

// eslint-disable-next-line no-unused-vars
function loadACustomer(id) {
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

    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

function updateCustomer() {
  // data extraction
  const id = $('#editCustomerID').val();
  const customerPwd = $('#customerPwdInput').val();
  const customerStatus = $('#customerStatusInput').val();

  // get item from local storage
  const data = {
    CustomerPassword: customerPwd,
    CustomerStatus: customerStatus,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data);
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
    error(xhr, textStatus, errorThrown) {
      msg = 'Update Unsuccessful';
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

function deleteCustomer(id) {
  // call the web service endpoint for deleting customer by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      console.log('Delete Successful');
      $('#customer-list').html('');
      loadAllCustomers();
      if (xhr.status === 404) {
        // set and call error message
        // eslint-disable-next-line no-use-before-define
        errMsg = 'Not valid id';
      } else if (xhr.status === 200) {
        // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';
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
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
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

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Search for customers with event listener
userSearch.addEventListener('keyup', (e) => {
  // Declare RowInfo Object
  let RowInfo = {};
  // Declare similarResults array
  const similarResults = [];
  // Declare constant variable to store the user input
  // Input is converted to lowercases
  const searchString = e.target.value.toLowerCase();
  // Clear the pagination buttons
  $('#pagination').html('');

  // eslint-disable-next-line arrow-body-style
  // Filter in the wanted ones and push in to filterCustomers array
  let filterCustomers = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));

  // If statement to run the loadCustomersByLimit function
  // if there are no inputs
  if (searchString === '') {
    filterCustomers = [];
    $('#similarSearch').html('');
    $('#customer-list').html('');
    loadCustomersByLimit(1);
    return;
  }

  // Clear the previous returned results in the containers
  $('#similarSearch').html('');
  $('#customer-list').html('');

  // Check if filterCustomers is not empty
  if (filterCustomers.length !== 0) {
    for (let i = 0; i < filterCustomers.length; i++) {
      const customer = filterCustomers[i];

      // compile the data that the card needs for its creation
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
    // If filterCustomers is empty
    for (let i = 0; i < userSearchChar.length; i++) {
      // Store the value been compared to, in compared constant
      const compared = userSearchChar[i].CustomerName;
      // Find the levenshtein distance between the compared word and input word
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const customer = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Email: customer.Email,
        Status: customer.Status,
      };

      // If levenshtein distance is smalle or equals to 4
      // push result into similarResults array
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }

    // For loop to display the result rows
    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#customer-list').append(newCard);
    }
    // Display when no results found
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  loadCustomersByLimit(1);

  // update button
  $('#editCustomerBtn').click(() => {
    updateCustomer();
  });
  // delete button
  $('#deleteCustomerBtn').click(() => {
    deleteCustomer();
  });
});
