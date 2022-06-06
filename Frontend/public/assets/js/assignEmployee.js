/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const backEndUrl = 'http://localhost:5000';

//Load 
function loadBookingDetails(bookingid) {
  $.ajax({
    url: `${backEndUrl}/contract/${bookingid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const bookingDetails = data[0];

      const RowInfo = {
        customerFirstName: bookingDetails.FirstName,
        customerLastName: bookingDetails.LastName,
        contractAddress: bookingDetails.Address,
        contractRoom: bookingDetails.NoOfRooms,
        contractBathroom: bookingDetails.NoOfBathrooms,
        contractSizing: bookingDetails.RateName,
        contractPricing: bookingDetails.EstimatedPricing,
        contractEmployee: bookingDetails.EmployeeName,
        contractExtraNotes: bookingDetails.ExtraNotes,

      };

      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);

      $('#firstName').val(RowInfo.customerFirstName);
      $('#lastName').val(RowInfo.customerLastName);
      $('#address').val(RowInfo.contractAddress);
      $('#noOfRoom').val(RowInfo.contractRoom);
      $('#noOfBathroom').val(RowInfo.contractBathroom);
      $('#sizing').val(RowInfo.contractSizing);
      $('#pricing').val(RowInfo.contractPricing);
      $('#assign').val(RowInfo.EmployeeName);
      $('#extraNotes').val(RowInfo.ExtraNotes);
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}
function createRow(cardInfo) {
  console.log(cardInfo);
  const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <div class="row no-gutters">
        <div class="col-sm-3">
            <img src="${cardInfo.EmployeeImg}" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">${cardInfo.EmployeeName}</h6>
                <p class="card-text">
                ${cardInfo.EmployeeDes}
                </p>
            </div>
        </div>
    </div>
</div>
  `;
  return card;
}

function loadAvailableEmployee() {

  $.ajax({
    url: `${backEndUrl}/employeeList`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
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
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  let bookingid = queryParams.get('bookingid');
  console.log(bookingid);
  loadBookingDetails(bookingid);
});
