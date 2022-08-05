const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const userSearchChar = [];
const userSearch = document.getElementById('searchBookingByCustomer');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
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
    <td><a type="button" href="/admin/assign?bookingid=${cardInfo.bookingID}" class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} ">Assign</a></td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editBookingModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
    <td> <button type="button" onClick="completeBooking(${cardInfo.bookingID})"  class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} btn btn-info"><i class="fa fa-check"></i></button></td>
    <script>   $("button").removeAttr("disabled");</script>
    </tr>
    `;
  return card;
}

function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#pagination').html('');
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
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }
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
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }else{
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

function loadAllBookingByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/booking/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#bookingTableBody').html('');
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
          $('#bookingTableBody').append(newRow);
        }
      }
      loadAllBooking(pageNumber);
    },
    error(xhr, textStatus, errorThrown) {
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
function completeBooking(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/completeBooking/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
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
    },
    error(xhr, textStatus, errorThrown) {
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
      errMsg="Error in operation"
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

function loadAllBookingToBECancelledByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingCancel/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#bookingTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
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
          const newRow = createRow(bookingstbl);
          $('#bookingTableBody').append(newRow);
        }
      }
      loadAllBooking();
    },
    error(xhr, textStatus, errorThrown) {
      errMsg="Error in operation"
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
  $('#pagination').html('');
  let filterBookings = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));
  if (searchString === '') {
    filterBookings = [];
    $('#similarSearch').html('');
    $('#bookingTableBody').html('');
    loadAllBookingByLimit(1);
    return;
  }
  $('#similarSearch').html('');
  $('#bookingTableBody').html('');
  if (filterBookings.length !== 0) {
    for (let i = 0; i < filterBookings.length; i++) {
      const booking = filterBookings[i];
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
      const newCard = createRow(RowInfo);
      $('#bookingTableBody').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].CustomerName;
      const distance = levenshtein(searchString, compared.toLowerCase());
      const booking = userSearchChar[i];
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
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }
    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#bookingTableBody').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

function loadABooking(bookingID) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneBooking/${bookingID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const booking = data[0];
      const RowInfo = {
        bookingID: booking.BookingID,
        ScheduleDate: booking.ScheduleDate,
      };
      $('#booking-id-update').val(RowInfo.bookingID);
      $('#datePicker').val(RowInfo.ScheduleDate);
    },
    error(xhr) {
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
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


$(document).ready(() => {
 $('#addNewBooking').click(() => {
    const tempAdminID = localStorage.getItem('AdminID');
    if (tempAdminID != null) {
      const id = $('#addContractID').val();
      const date = $('#datepicker').val();
      const tempAdminID = localStorage.getItem('AdminID');
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
          new Noty({
            timeout: '5000',
            type: 'success',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Booking added Successfully',
          }).show();
        },
        error(xhr, textStatus, errorThrown) {
          new Noty({
            timeout: '5000',
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Please check your the date and ID',
          }).show();
        },
      });
    } else {
      window.localStorage.clear();
      window.location.replace(`${frontEndUrl}/unAuthorize`);
    }
  });

  $('#updateBookingDate').click(() => {
    const bookingIDs = $('#booking-id-update').val();
    const date = $('#datePicker').val();
    const info = {
      bookingID: bookingIDs,
      ScheduleDate: date,
    };
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/updateBooking/${bookingIDs}`,
      type: 'PUT',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success() {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Booking Updated Successfully',
        }).show();
        loadAllBookingByLimit(1);
      },
      error(xhr, textStatus, errorThrown) {
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
  const queryParams = new URLSearchParams(window.location.search);
  loadAllBookingByLimit(1);
});
