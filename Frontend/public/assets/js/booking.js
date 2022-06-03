/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

function pageBtnCreate(totalNumberOfPages) {
  $('#pagination').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function createRow(cardInfo) {
  console.log(cardInfo);
  const card = `
    <tr>
    <td>${cardInfo.bookingID}</td>
    <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
    <td>${cardInfo.Package}</td>
    <td>${cardInfo.ClassName}</td>
    <td>${cardInfo.TimeOfService}</td>
    <td>${cardInfo.NoOfRooms}</td>
    <td>${cardInfo.NoOfBathrooms}</td>
    <td>${cardInfo.RateName}</td>
    <td>${cardInfo.EstimatePricing}</td>
    <td>${cardInfo.Address}</td>
    <td>${cardInfo.Employee}</td>
    <td>${cardInfo.Status}</td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditClassModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
    </td>
    <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteBooking(${cardInfo.bookingID})"><i class="fa-regular fa-trash-can"></i></button></td>
    </tr>
    `;
  return card;
}

function loadAllBooking() {
  $.ajax({
    url: `${backEndUrl}/booking`,
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

function loadAllBookingByLimit(pageNumber) {
// call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/booking/${pageNumber}`,
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
          $('#bookingTableBody').append(newRow);
        }
      } else {
        loadAllBooking();
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

// loadAClassOfService gets a class of services
function loadABooking(id) {
  // gets a class of service based on id
  $.ajax({
    url: `${backEndUrl}/booking/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // extract data information
      const RowInfo = {
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
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#class-id-update').val(RowInfo.classId);
      $('#class-name-update').val(RowInfo.className);
      $('#class-pricing-update').val(RowInfo.classPricing);
      $('#class-description-update').val(RowInfo.classDescription);
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      errMsg = ' ';
      if (xhr.status == 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllBookingByLimit(1);
  loadABooking(id);
});
