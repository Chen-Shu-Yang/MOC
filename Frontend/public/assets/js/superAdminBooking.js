/* eslint-disable linebreak-style */
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



const userSearchChar = [];
const userSearch = document.getElementById('searchBookingByCustomer');
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tempType = JSON.parse(localStorage.getItem('adminType'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
if (tempType === 'Admin') {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

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
    <td>${cardInfo.ScheduleDate}</td>
    <td>${cardInfo.TimeOfService}</td>
    <td>$${cardInfo.EstimatePricing}</td>
    <td>${cardInfo.Address}</td>
    <td>
    ${(cardInfo.Employee === null) ? '-' : cardInfo.Employee}
    
  </td>
  <td>${(cardInfo.AssignerF === null) ? '-' : cardInfo.AssignerF} ${(cardInfo.AssignerL === null) ? '-' : cardInfo.AssignerL}</td>
   <td class="status"> <div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
    <td><a type="button" href="/admin/assign?bookingid=${cardInfo.bookingID}" class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} ">Assign</a></td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editBookingModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
    <td> <button type="button"  onClick="completeBooking(${cardInfo.bookingID})"  class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} btn btn-info" ><i class="fa fa-check"></i></button></td>
    <script>   $("button").removeAttr("disabled");</script>
    </tr>

  
    `;
  return card;
}

function completeBooking(id) {
  console.log(`Booking id to Complete ${id}`);
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/completeBooking/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
      $(bookingTableBody).html('');
      loadAllBookingByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);

      // refresh
      // $('#classServiceTableBody').html('')
      // loadAllClassOfServices()
    },
    error(xhr, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
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
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  // Check if the active page is within max-left or max-right
  // Displays all page tabs within max-left and max-right
  for (i = maxLeft; i <= maxRight; i++) {
    // Check if page is active
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  // Checkd if active page is not equals to the total number of pages
  // Displays the '>>' tab to bring users to the last page
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllBooking(activePage) {
  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate());
  const today = todayDate.toISOString().split('T')[0];
  document.getElementsByName('datepicker')[0].setAttribute('min', today);
  $('#datepicker').val(today);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/booking`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      for (let i = 0; i < data.length; i++) {
        const booking = data[i];

        const Customer = {
          CustomerName: `${booking.FirstName} ${booking.LastName}`,
          Address: booking.Address,
          ClassName: booking.ClassName,
          EmployeeName: booking.EmployeeName,
          EstimatedPricing: (booking.EstimatedPricing).toFixed(2),
          FirstName: booking.FirstName,
          LastName: booking.LastName,
          NoOfBathrooms: booking.NoOfBathrooms,
          NoOfRooms: booking.NoOfRooms,
          PackageName: booking.PackageName,
          Rate: booking.Rate,
          ScheduleDate: booking.ScheduleDate,
          Status: booking.Status,
          TimeOfService: booking.TimeOfService,
          BookingID: booking.BookingID,
        };
        userSearchChar.push(Customer);
      }
      console.log('-------response data------');
      console.log(`LENGTH OF DATA:${data.length}`);

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

function loadAllBookingByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
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

          let date = booking.ScheduleDate;
          date = date.replace('T16:00:00.000Z', '');
          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.BookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.PackageName,
            ClassName: booking.ClassName,
            ScheduleDate: date,
            TimeOfService: booking.TimeOfService,
            NoOfRooms: booking.NoOfRooms,
            NoOfBathrooms: booking.NoOfBathrooms,
            RateName: booking.Rate,
            EstimatePricing: (booking.EstimatedPricing).toFixed(2),
            Address: booking.Address,
            Employee: booking.EmployeeName,
            Status: booking.Status,
            AssignerF: booking.AdminFName,
            AssignerL: booking.AdminLName,
          };
          console.log('---------Card INfo data pack------------');
          console.log(bookingstbl);

          const newRow = createRow(bookingstbl);
          $('#bookingTableBody').append(newRow);
        }
      }
      loadAllBooking(pageNumber);
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
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

// eslint-disable-next-line no-unused-vars
function loadAllBookingToBECancelledByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
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

// Search for booking with event listener
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
  // Filter in the wanted ones and push in to filterBookings array
  let filterBookings = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));

  // If statement to run the loadAllBookingBtLimit function
  // if there are no inputs
  if (searchString === '') {
    filterBookings = [];
    $('#similarSearch').html('');
    $('#bookingTableBody').html('');
    loadAllBookingByLimit(1);
    return;
  }

  // Clear the previous returned results in the containers
  $('#similarSearch').html('');
  $('#bookingTableBody').html('');

  // Check if filterBookings is not empty
  if (filterBookings.length !== 0) {
    console.log(filterBookings);
    for (let i = 0; i < filterBookings.length; i++) {
      const booking = filterBookings[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: booking.BookingID,
        FirstName: booking.FirstName,
        LastName: booking.LastName,
        Package: booking.PackageName,
        ClassName: booking.ClassName,
        ScheduleDate: booking.ScheduleDate,
        TimeOfService: booking.TimeOfService,
        NoOfRooms: booking.NoOfRooms,
        NoOfBathrooms: booking.NoOfBathrooms,
        RateName: booking.Rate,
        EstimatePricing: parseFloat(booking.EstimatedPricing).toFixed(2),
        Address: booking.Address,
        Employee: booking.EmployeeName,
        Status: booking.Status,
      };
      const newCard = createRow(RowInfo);
      $('#bookingTableBody').append(newCard);
    }
  } else {
    // If filterBookings is empty
    for (let i = 0; i < userSearchChar.length; i++) {
      // Store the value been compared to, in compared constant
      const compared = userSearchChar[i].CustomerName;
      // Find the levenshtein distance between the compared word and input word
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const booking = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: booking.BookingID,
        FirstName: booking.FirstName,
        LastName: booking.LastName,
        Package: booking.PackageName,
        ClassName: booking.ClassName,
        ScheduleDate: booking.ScheduleDate,
        TimeOfService: booking.TimeOfService,
        NoOfRooms: booking.NoOfRooms,
        NoOfBathrooms: booking.NoOfBathrooms,
        RateName: booking.Rate,
        EstimatePricing: booking.EstimatedPricing,
        Address: booking.Address,
        Employee: booking.EmployeeName,
        Status: booking.Status,
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
      $('#bookingTableBody').append(newCard);
    }
    // Display when no results found
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

// load gets a booking
// eslint-disable-next-line no-unused-vars
function loadABooking(bookingID) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneBooking/${bookingID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      const booking = data[0];
      // extract data information
      const RowInfo = {
        bookingID: booking.BookingID,
        ScheduleDate: booking.ScheduleDate,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#booking-id-update').val(RowInfo.bookingID);
      $('#datePicker').val(RowInfo.ScheduleDate);
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
// eslint-disable-next-line no-unused-vars
function addMonthlyBooking() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/autoBooking`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      const msg = 'Successfully Added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();


      $(bookingTableBody).html('');
      loadAllBookingByLimit(1);
    },
    error(xhr, textStatus, errorThrown) {
     
      let errMsg = '';

      if(xhr.status ===200){
        const msg = 'Successfully Added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();

      }
      else{
        if (xhr.status === 500) {
          console.log('error');
          errMsg = 'Server Issues';
        } else if (xhr.status === 400) {
          errMsg = ' Input not accepted';
        } else if (xhr.status === 406) {
          errMsg = ' Input not accepted';
        } 
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();

      }
   
    
    
   
      $('#classServiceTableBody').html('');
      loadAllBookingByLimit(1);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function addMonthlyBookingNext() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/autoBookingNextMonth`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      const msg = 'Success!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();

      $(bookingTableBody).html('');
      loadAllBookingByLimit(1);
    },
    error(xhr, textStatus, errorThrown) {
    
      let errMsg = '';

      if(xhr.status ===200){
        const msg = 'Successfully Added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();

      }
      else{
        if (xhr.status === 500) {
          console.log('error');
          errMsg = 'Server Issues';
        } else if (xhr.status === 400) {
          errMsg = ' Input not accepted';
        } else if (xhr.status === 406) {
          errMsg = ' Input not accepted';
        } 
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();

      }
   
    
      $('#classServiceTableBody').html('');
      loadAllBookingByLimit(1);
    },
  });
}

// add new booking
$('#addNewBooking').click(() => {
  // data extraction

  const tempAdminID = localStorage.getItem('AdminID');
  if (tempAdminID != null) {
    const id = $('#addContractID').val();
    const date = $('#datepicker').val();
    const tempAdminID = localStorage.getItem('AdminID');

    // data compilation
    const info = {
      bookingID: id,
      bookingDate: date,
      AdminId: tempAdminID,
    };
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/booking`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        console.log(data);
        if (data != null) {
          new Noty({
            timeout: '5000',
            type: 'success',
            layout: 'topCenter',
            theme: 'sunset',
            text: `Booking ${id} added`,
          }).show();

          loadAllBookingByLimit(1);
          console.log(id+'Hiiiiiiiiiiiiiiiiiiiiiiiiiii');
        } else {
          new Noty({
            timeout: '5000',
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            text: `Booking ${id} not added`,
          }).show();
          console.log('Bye');
        }
      },
      error(xhr, textStatus, errorThrown) {
        console.log('Error in Operation');
        console.log(`XHR: ${JSON.stringify(xhr)}`);
        console.log(`Textstatus: ${textStatus}`);
        console.log(`Errorthorwn${errorThrown}`);
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please check your the date and ID',
        }).show();
      },
    });
  } else{
    window.localStorage.clear();
    window.location.replace(`${frontEndUrl}/unAuthorize`);
  }
});

// Login
$('#updateBookingDate').click(() => {
  // data extraction
  const bookingIDs = $('#booking-id-update').val();
  const date = $('#datePicker').val();
  // data compilation
  const info = {
    bookingID: bookingIDs,
    ScheduleDate: date,
  };

  // call web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateBooking/${bookingIDs}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
          loadAllBookingByLimit(1);
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'added successfully',
        }).show();
      
      } else {
        console.log('Error');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(`XHR: ${JSON.stringify(xhr)}`);
      console.log(`Textstatus: ${textStatus}`);
      console.log(`Errorthorwn${errorThrown}`);
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please check your the date and ID',
      }).show();
    },
  });
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllBookingByLimit(1);
});
