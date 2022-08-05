const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
let userSearchChar = [];
const userSearch = document.getElementById('searchCancelledBookingByCustomer');
function createRow(cardInfo) {
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
  <td class="status"> <div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
    <td><button onClick="cancelBooking(${cardInfo.bookingID})" class="btn btn-danger">Cancel</button></td>
    </tr>
    `;
  return card;
}
function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#paginationCancel').html('');
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }
  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }
  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${1})"><<</button>`;
    $('#paginationCancel').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllBookingToBeCancelledByLimit(${i})">${i}</button>`;
      $('#paginationCancel').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${i})">${i}</button>`;
      $('#paginationCancel').append(divPaginBtn);
    }
  }
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${totalNumberOfPages})">>></button>`;
    $('#paginationCancel').append(divPaginBtn);
  }
}

function loadAllBookingToBeCancelled(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingCancel`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      userSearchChar = [];
      for (let i = 0; i < data.length; i++) {
        const cancelledBooking = data[i];
        const Customer = {
          CustomerName: `${cancelledBooking.FirstName} ${cancelledBooking.LastName}`,
          Address: cancelledBooking.Address,
          ClassName: cancelledBooking.ClassName,
          EmployeeName: cancelledBooking.EmployeeName,
          EstimatedPricing: cancelledBooking.EstimatedPricing,
          FirstName: cancelledBooking.FirstName,
          LastName: cancelledBooking.LastName,
          NoOfBathrooms: cancelledBooking.NoOfBathrooms,
          NoOfRooms: cancelledBooking.NoOfRooms,
          PackageName: cancelledBooking.PackageName,
          Rate: cancelledBooking.Rate,
          ScheduleDate: cancelledBooking.ScheduleDate,
          Status: cancelledBooking.Status,
          TimeOfService: cancelledBooking.TimeOfService,
          BookingID: cancelledBooking.BookingID,
        };
        userSearchChar.push(Customer);
      }
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      else{
        errMsg="Error in operation"
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();

      }
    },
  });
}

function loadAllBookingToBeCancelledByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingCancel/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#bookingCancelTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          const bookingstbl = {
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
            EstimatePricing: (booking.EstimatedPricing).toFixed(2),
            Address: booking.Address,
            Employee: booking.EmployeeName,
            Status: booking.Status,
          };
          const newRow = createRow(bookingstbl);
          $('#bookingCancelTableBody').append(newRow);
        }
        loadAllBookingToBeCancelled(pageNumber);
      }
    },
    error(xhr, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      } else if (xhr.status === 500) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      }
    },
  });
}
function cancelBooking(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/cancelBooking/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() {
      $('#bookingCancelTableBody').html('');
      loadAllBookingToBeCancelledByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
    },
    error(xhr) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      $('#classServiceTableBody').html('');
      loadAllBookingToBeCancelledByLimit(1);
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    },
  });
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(
            matrix[i][j - 1] + 1, 
            matrix[i - 1][j] + 1,
          ),
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

userSearch.addEventListener('keyup', (e) => {
  let RowInfo = {};
  const similarResults = [];
  const searchString = e.target.value.toLowerCase();
  $('#paginationCancel').html('');
  let filterBookings = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));
  if (searchString === '') {
    filterBookings = [];
    $('#similarSearch').html('');
    $('#bookingCancelTableBody').html('');
    loadAllBookingToBeCancelledByLimit(1);
    return;
  }
  $('#similarSearch').html('');
  $('#bookingCancelTableBody').html('');
  if (filterBookings.length !== 0) {
    for (let i = 0; i < filterBookings.length; i++) {
      const cancelledBooking = filterBookings[i];
      RowInfo = {
        bookingID: cancelledBooking.BookingID,
        FirstName: cancelledBooking.FirstName,
        LastName: cancelledBooking.LastName,
        Package: cancelledBooking.PackageName,
        ClassName: cancelledBooking.ClassName,
        ScheduleDate: cancelledBooking.ScheduleDate,
        TimeOfService: cancelledBooking.TimeOfService,
        NoOfRooms: cancelledBooking.NoOfRooms,
        NoOfBathrooms: cancelledBooking.NoOfBathrooms,
        RateName: cancelledBooking.Rate,
        EstimatePricing: parseFloat(cancelledBooking.EstimatedPricing).toFixed(2),
        Address: cancelledBooking.Address,
        Employee: cancelledBooking.EmployeeName,
        Status: cancelledBooking.Status,
      };
      const newCard = createRow(RowInfo);
      $('#bookingCancelTableBody').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].CustomerName;
      const distance = levenshtein(searchString, compared.toLowerCase()); 
      const cancelledBooking = userSearchChar[i];
      RowInfo = {
        bookingID: cancelledBooking.BookingID,
        FirstName: cancelledBooking.FirstName,
        LastName: cancelledBooking.LastName,
        Package: cancelledBooking.PackageName,
        ClassName: cancelledBooking.ClassName,
        ScheduleDate: cancelledBooking.ScheduleDate,
        TimeOfService: cancelledBooking.TimeOfService,
        NoOfRooms: cancelledBooking.NoOfRooms,
        NoOfBathrooms: cancelledBooking.NoOfBathrooms,
        RateName: cancelledBooking.Rate,
        EstimatePricing: cancelledBooking.EstimatedPricing,
        Address: cancelledBooking.Address,
        Employee: cancelledBooking.EmployeeName,
        Status: cancelledBooking.Status,
      };
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#bookingCancelTableBody').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadAllBookingToBeCancelledByLimit(1);
});
