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
    <td>${cardInfo.FirstName} ${cardInfo.FirstName}</td>
    <td>${cardInfo.Package}</td>
    <td>${cardInfo.StartDate}</td>
    <td>${cardInfo.TimeOfService}</td>
    <td>${cardInfo.NoOfRooms}</td>
    <td>${cardInfo.NoOfBathrooms}</td>
    <td>${cardInfo.RateName}</td>
    <td>${cardInfo.EstimatePricing}</td>
    <td>${cardInfo.Address}</td>
    <td>${cardInfo.Employee}</td>
    <td>${cardInfo.Status}</td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditClassModal" onClick="loadAClassOfService(${cardInfo.classId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
    </td>
    <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteClassOfService(${cardInfo.classId})"><i class="fa-regular fa-trash-can"></i></button></td>
    </tr>
    `;
  return card;
}

function loadAllEmployees() {
  $.ajax({
    url: `${backEndUrl}/admin/booking`,
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
    url: `${backEndUrl}/admin/booking/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        console.log('-------response data------');
        console.log(data);
        console.log(`LENGTH OF DATA:${data.length}`);
        $('#employeeListing').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.bookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.Package,
            ClassName: booking.ClassName,
            StartDate: booking.StartDate,
            TimeOfService: booking.TimeOfService,
            NoOfRooms: booking.NoOfRooms,
            NoOfBathrooms: booking.NoOfBathrooms,
            RateName: booking.RateName,
            EstimatePricing: booking.EstimatePricing,
            Address: booking.Address,
            Employee: booking.Employee,
            Status: booking.status,
          };
          console.log('---------Card INfo data pack------------');
          console.log(bookingstbl);

          const newRow = createRow(BookingInfo);
          $('#bookingTableBody').append(newRow);
        }
      } else {
        loadAllEmployees();
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

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllBookingByLimit(1);
});
