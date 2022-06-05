/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

function createRow(cardInfo) {
  console.log(cardInfo);
  const card = `

    <tr>
    <script>if(${cardInfo.Status}=="Assgined"|| ${cardInfo.Status}=="Pending"){</script>
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
    <td>${cardInfo.Employee}</td>
    <td>${cardInfo.Status}</td>
    <td><button type="button" class="scheduleBooking-btn" data-toggle="modal" data-target="#schedule" style=" background: #2E6869;
    color: #fff;
    padding: 5px 20px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid #2E6869;
    transition: all 0.3s ease;">Schedule</button></td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditClassModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
    <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteBooking(${cardInfo.bookingID})"><i class="fa-regular fa-trash-can"></i></button></td>
    <script>}   $("button").removeAttr("disabled");</script>
    </tr>

  
    `;
  return card;
}
function pageBtnCreate(totalNumberOfPages) {
  $('#pagination').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
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
      }
      loadAllBooking();
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

// load gets a booking
function loadABooking(bookingID) {
  // gets a class of service based on id
  $.ajax({
    url: `${backEndUrl}/booking/${bookingID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // extract data information
      const RowInfo = {

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

// addClassOfService to add new class of service
function addBooking() {
  // extract values for add pop-up
  const name = $('#class_name_add').val();
  const classPricing = $('#class_pricing_add').val();
  const classDescription = $('#class_description__add').val();
  // setting empty string to the fields after adding
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');
  // store all extracted info into requestBody
  const requestBody = {
    ClassName: name,
    ClassPricing: classPricing,
    ClassDes: classDescription,
  };
  console.log(`request body: ${requestBody}`);
  // stringify reqBody
  const reqBody = JSON.stringify(requestBody);
  console.log(reqBody);
  // call the method to post data
  $.ajax({
    url: 'http://localhost:5000/class',
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      // set and call confirmation message
      msg = 'Successfully added!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      const post = data;
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      let errMsg = '';
      if (xhr.status == 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else if (xhr.status == 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status == 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
    },
  });
}

// updateClassOfService method update class of service
function updateBooking() {
  // extarct values from pop-up
  const classId = $('#class-id-update').val();
  const ClassName = $('#class-name-update').val();
  const ClassPricing = $('#class-pricing-update').val();
  const ClassDescription = $('#class-description-update').val();
  // set value to empty after getting value
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');

  // put all data inserted into data2 so that it can be used to parse as json data in the api
  const data2 = {
    ClassName,
    ClassPricing,
    ClassDes: ClassDescription,
  };
  // ajax method to call the method
  $.ajax({

    url: `http://localhost:5000/class/${classId}`,
    type: 'PUT',
    // data extractex
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      // set and call confirmation message
      msg = 'Successfully updated!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      // refresh
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      let errMsg = '';
      if (xhr.status == 500) {
        console.log('error');
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status == 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status == 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
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
  loadABooking(bookingID);
});
