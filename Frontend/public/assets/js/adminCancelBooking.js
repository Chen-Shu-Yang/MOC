/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

function createRow(cardInfo) {
  console.log(cardInfo);
  console.log('********');
  console.log(cardInfo.Status);
  const card = `
    <tr>
    <td>${cardInfo.bookingID}</td>
    <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
    <td>${cardInfo.Package}</td>
    <td>${cardInfo.ClassName}</td>
    <td>${cardInfo.StartDate}</td>
    <td>${cardInfo.TimeOfService}</td>
    <td>${cardInfo.NoOfRooms}</td>
    <td>${cardInfo.NoOfBathrooms}</td>
    <td>${cardInfo.RateName}</td>
    <td>${cardInfo.EstimatePricing}</td>
    <td>${cardInfo.Address}</td>
    <td>
    ${(cardInfo.Employee === null) ? '-' : cardInfo.Employee}
  </td>
  <td class="status"> <div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
    <td><button onClick="cancelBooking(${cardInfo.bookingID})" class="btn btn-danger">Cancel</button></td>
    </tr>
    `;
  return card;
}

function pageBtnCreate(totalNumberOfPages) {
  $('#paginationCancel').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${i})">${i}</button>`;
    $('#paginationCancel').append(divPaginBtn);
  }
}

function loadAllBookingToBeCancelled() {
  $.ajax({
    url: `${backEndUrl}/bookingCancel`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages);
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

function loadAllBookingToBeCancelledByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/bookingCancel/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        console.log('-------response data------');
        console.log(data);
        console.log(`LENGTH OF DATA:${data.length}`);
        $('#bookingTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.BookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.PackageName,
            ClassName: booking.ClassName,
            StartDate: booking.StartDate,
            TimeOfService: booking.TimeOfService,
            NoOfRooms: booking.NoOfRooms,
            NoOfBathrooms: booking.NoOfBathrooms,
            RateName: booking.Rate,
            EstimatePricing: booking.EstimatedPricing,
            Address: booking.Address,
            Employee: booking.EmployeeName,
            Status: booking.Status,
          };
          console.log('---------Card INfo data pack------------');
          console.log(bookingstbl);

          const newRow = createRow(bookingstbl);
          $('#bookingCancelTableBody').append(newRow);
        }
        loadAllBookingToBeCancelled();
      }
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

function cancelBooking(id) {
  console.log(`Booking id to cancel ${id}`);
  // ajax method to call the method
  $.ajax({
    url: `http://localhost:5000/cancelBooking/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      // set and call confirmation message
     $('#bookingCancelTableBody').html("");
      loadAllBookingToBeCancelledByLimit(1)
      msg = 'Successfully updated!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      
      
      // refresh
      // $('#classServiceTableBody').html('')
      // loadAllClassOfServices()
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      $('#classServiceTableBody').html('');
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);
  loadAllBookingToBeCancelledByLimit(1);
});
