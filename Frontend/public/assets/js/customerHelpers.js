/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */

// const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const backEndUrl = 'https://moc-ba.herokuapp.com/';

// Display the helper card
// Helpers' information will be passed in as cardInfo
function createRow(cardInfo) {
  const card = `
        <div class="helper-card">
            <div class="helper-pic">
                <img src="${cardInfo.EmployeeImg}" alt="">
            </div>
            <div class="helper-details">
                <h3 class="helper-name">${cardInfo.EmployeeName}</h3>
                <p class="helper-des">${cardInfo.EmployeeDes}</p>
                <a data-toggle="collapse" href="#skillsets${cardInfo.EmployeeID}" role="button" aria-expanded="false">
                    View Skillsets
                </a>
                <div class="collapse" id="skillsets${cardInfo.EmployeeID}">
                    <div class="card card-body">${cardInfo.Skillsets}</div>
                </div>
            </div>
        </div>
    `;
  return card;
}

// Load the possible helpers available for
// The most recent booking
function loadPossibleHelpers(date) {
  // Ajax function to call GET method to get the data
  $.ajax({
    url: `${backEndUrl}/helpers/${date}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      // Clears helpers-list container
      $('#helpers-list').html('');

      for (let i = 0; i < data.length; i++) {
        // Assign each helper data into employee
        const employee = data[i];

        // Extracting information
        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImg: employee.EmployeeImgUrl,
          Skillsets: employee.Skillsets,
        };

        // //calling createRow to display values row by row
        const newCard = createRow(RowInfo);

        // appeding row to helpers-list
        $('#helpers-list').append(newCard);
      }
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

$(document).ready(() => {
  // Function to list possible helpers
  // Date is passed in
  const date = localStorage.getItem('contractStart');
  loadPossibleHelpers(date);
});
