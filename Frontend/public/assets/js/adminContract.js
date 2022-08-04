/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */


const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

let userSearchChar = [];
const userSearch = document.getElementById('searchContract');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

// Create a new card for Contracts
function createRow(cardInfo) {
  // cardInfo data is place in each respective place
  const card = `
      <tr>
  
        <td>${cardInfo.contractID}</td>
        <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
        <td>${cardInfo.Package}</td>
        <td>${cardInfo.ClassName}</td>
        <td>${cardInfo.StartDate}</td>
        <td>${cardInfo.TimeOfService}</td>
        <td>${cardInfo.NoOfRooms}</td>
        <td>${cardInfo.NoOfBathrooms}</td>
        <td>${cardInfo.RateName}ft</td>
        <td>${cardInfo.DayOfService1} ${(cardInfo.DayOfService2 === null || cardInfo.DayOfService2 === '-' || cardInfo.DayOfService2 === '') ? ' ' : `, ${cardInfo.DayOfService2}`}</td>
        <td>$${cardInfo.EstimatePricing}</td>
        <td>${cardInfo.Address}</td>

        <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editContractModal" onClick="loadAContract(${cardInfo.contractID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
      </tr>
      `;
  return card;
}

// Create pagination numbering
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
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  // Check if the active page is within max-left or max-right
  // Displays all page tabs within max-left and max-right
  for (i = maxLeft; i <= maxRight; i++) {
    // Check if page is active
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllContractByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  // Checkd if active page is not equals to the total number of pages
  // Displays the '>>' tab to bring users to the last page
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

// Load all contracts to allow for pagination numbering
function loadAllContracts(activePage) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    // when successful, divide the number of result by 6 to determine
    // number of pages needed
    success(data) {
      userSearchChar = [];
      for (let i = 0; i < data.length; i++) {
        const contract = data[i];

        const Contract = {
          CustomerName: `${contract.FirstName} ${contract.LastName}`,
          contractID: contract.ContractId,
          FirstName: contract.FirstName,
          LastName: contract.LastName,
          Package: contract.PackageName,
          ClassName: contract.ClassName,
          StartDate: contract.StartDate,
          TimeOfService: contract.TimeOfService,
          NoOfRooms: contract.NoOfRooms,
          NoOfBathrooms: contract.NoOfBathrooms,
          RateName: contract.RateName,
          EstimatePricing: contract.EstimatedPricing,
          Address: contract.Address,
          DayOfService1: contract.DayOfService,
          DayOfService2: contract.DayOfService2,
        };
        userSearchChar.push(Contract);
      }
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },

    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
    },
  });
}

// Load contracts restricted to 6 row per page
function loadAllContractByLimit(pageNumber) {
  // call the web service endpoint

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#contractTableBody').html('');
        // for loop to generate each row of result
        for (let i = 0; i < data.length; i++) {
          const contract = data[i];

          // compile the data that the card needs for its creation
          const contractstbl = {
            contractID: contract.ContractId,
            FirstName: contract.FirstName,
            LastName: contract.LastName,
            Package: contract.PackageName,
            ClassName: contract.ClassName,
            StartDate: contract.StartDate,
            TimeOfService: contract.TimeOfService,
            NoOfRooms: contract.NoOfRooms,
            NoOfBathrooms: contract.NoOfBathrooms,
            RateName: contract.RateName,
            EstimatePricing: contract.EstimatedPricing,
            Address: contract.Address,
            DayOfService1: contract.DayOfService,
            DayOfService2: contract.DayOfService2,
          };
          const newRow = createRow(contractstbl);
          $('#contractTableBody').append(newRow);
        }
      }
      loadAllContracts(pageNumber);
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
    },
  });
}

// Load the contract based on contractId
function loadAContract(contractId) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneContract/${contractId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      const contractZero = data[0];
      // extract data information
      const RowInfo = {
        contractId: contractZero.ContractID,
        DayOfService: contractZero.DayOfService,
        DayOfService2: contractZero.DayOfService2,
        EstimatedPricing: contractZero.EstimatedPricing,
      };
      // updating extracted values to update pop up
      $('#contract-id-update').val(RowInfo.contractId);
      $('#dayOfService1').val(RowInfo.DayOfService);
      $('#dayOfService2').val(RowInfo.DayOfService2);
      $('#estimatedPricing').val(RowInfo.EstimatedPricing);
      const day2 = document.getElementById('day2');
      // Disable day2 of no day2
      // Might need to change condition to which package selected
      if (RowInfo.DayOfService2 === null || RowInfo.DayOfService2 === '-') {
        day2.style.visibility = 'hidden';
      } else {
        day2.style.visibility = 'visible';
      }
    },
    error(xhr) {
      // set and call error message
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// To check Day 1 is not the same as Day 2
function CheckDropDowns(thisSelect) {
  const otherSelectId = (thisSelect.id === 'dayOfService1') ? 'dayOfService2' : 'dayOfService1';
  const otherSelect = document.getElementById(otherSelectId);

  for (i = 0; i < otherSelect.options.length; i++) {
    // otherSelect.options[i].style.display = 'block';
    otherSelect.options[i].removeAttribute('hidden');
    if (otherSelect.options[i].value === thisSelect.value) {
      // otherSelect.options[i].style.display = 'none';
      otherSelect.options[i].setAttribute('hidden', 'hidden');
    }
  }
}

// Levenshtein Distance function
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

// Search for contracts with event listener
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

  // If statement to run the loadAllContractByLimit function
  // if there are no inputs
  if (searchString === '') {
    filterCustomers = [];
    $('#similarSearch').html('');
    $('#contractTableBody').html('');
    loadAllContractByLimit(1);
    return;
  }

  // Clear the previous returned results in the containers
  $('#similarSearch').html('');
  $('#contractTableBody').html('');

  // Check if filterCustomers is not empty
  if (filterCustomers.length !== 0) {
    for (let i = 0; i < filterCustomers.length; i++) {
      const customer = filterCustomers[i];
      // compile the data that the card needs for its creation
      RowInfo = {
        contractID: customer.contractID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Package: customer.Package,
        ClassName: customer.ClassName,
        StartDate: customer.StartDate,
        TimeOfService: customer.TimeOfService,
        NoOfRooms: customer.NoOfRooms,
        NoOfBathrooms: customer.NoOfBathrooms,
        RateName: customer.RateName,
        EstimatePricing: customer.EstimatePricing,
        Address: customer.Address,
        DayOfService1: customer.DayOfService1,
        DayOfService2: customer.DayOfService2,
      };

      const newCard = createRow(RowInfo);
      $('#contractTableBody').append(newCard);
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
        contractID: customer.contractID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Package: customer.Package,
        ClassName: customer.ClassName,
        StartDate: customer.StartDate,
        TimeOfService: customer.TimeOfService,
        NoOfRooms: customer.NoOfRooms,
        NoOfBathrooms: customer.NoOfBathrooms,
        RateName: customer.RateName,
        EstimatePricing: customer.EstimatePricing,
        Address: customer.Address,
        DayOfService1: customer.DayOfService1,
        DayOfService2: customer.DayOfService2,
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
      $('#contractTableBody').append(newCard);
    }
    // Display when no results found
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$('#updateContract').click(() => {
  // data extraction
  const contractId = $('#contract-id-update').val();
  const dayOfService1 = $('#dayOfService1').val();
  let dayOfService2 = $('#dayOfService2').val();
  const estimatedPricing = $('#estimatedPricing').val();
  if ($('#day2').is(':hidden')) {
    dayOfService2 = '-';
  }
  // data compilation
  const info = {
    contractId,
    dayOfService1,
    dayOfService2,
    estimatedPricing,
  };

  // call web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateContract/${contractId}`,
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
          text: 'Contract updated!',
        }).show();
        window.location.reload();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Unsuccessful Update!',
        }).show();
      }
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }

      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Something Went Wrong',
      }).show();
    },
  });
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);

  loadAllContractByLimit(1);
});
