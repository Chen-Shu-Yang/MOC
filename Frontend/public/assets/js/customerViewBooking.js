const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tmpToken === null || tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const { bookingID } = cardInfo;
  const scheduleDate = new Date(cardInfo.scheduleDate);
  let showBtn = 1;
  const statusOfAppointment = cardInfo.status;
  const dateToBeChecked = new Date();
  dateToBeChecked.setDate(dateToBeChecked.getDate() + 1);
  if (scheduleDate < dateToBeChecked) {
    showBtn = 0;
  } else if (statusOfAppointment === 'Cancelled') {
    showBtn = 0;
  } else {
    showBtn = 1;
  }

  let card;
  if (showBtn) {
    card = `
        <div class="card">
                        <div class="card-header bg-white"># Booking ${cardInfo.bookingID}</div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Service : ${cardInfo.className}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Pricing : $${cardInfo.estimatePricing}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Package : ${cardInfo.packageName}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Day : ${cardInfo.dayOfService} ${(cardInfo.dayOfService2) === null ? '' : `,${cardInfo.dayOfService2}`}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Room : ${cardInfo.noOfRooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Address : ${cardInfo.address}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Bathroom : ${cardInfo.noOfBathrooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Status of appointment : ${cardInfo.status}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Date of appointment : ${cardInfo.scheduleDate}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Name of helper : ${(cardInfo.employee === null ? 'No assigned employee' : cardInfo.employee)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Extra Notes : ${(cardInfo.extraNotes) === null ? 'No Extra notes' : cardInfo.extraNotes}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                            ${showBtn ? `<button class="btn btn-danger" type="button"  onClick=cancelBooking(${cardInfo.bookingID}) $("#idBooking").val("${cardInfo.bookingID}");>
                                Cancel
                            </button>` : ''}
                             
                            </div>
                        </div>
                    </div>
      `;
  } else {
    card = `
        <div class="card">
                        <div class="card-header bg-white"># Booking ${cardInfo.bookingID}</div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Service : ${cardInfo.className}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Pricing : $${cardInfo.estimatePricing}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Package : ${cardInfo.packageName}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Day : ${cardInfo.dayOfService} ${(cardInfo.dayOfService2) === null ? '' : `,${cardInfo.dayOfService2}`}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Room : ${cardInfo.noOfRooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Address : ${cardInfo.address}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Bathroom : ${cardInfo.noOfBathrooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Status of appointment : ${cardInfo.status}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Date of appointment : ${cardInfo.scheduleDate}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Name of helper : ${(cardInfo.employee === null ? 'No assigned employee' : cardInfo.employee)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Extra Notes : ${(cardInfo.extraNotes) === null ? 'No Extra notes' : cardInfo.extraNotes}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                             <h1></h1>
                             
                            </div>
                        </div>
                    </div>
      `;
  }

  return card;
}

function cancelBooking(bookingId) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/update/customerBooking/${bookingId}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      $('#bookingSection').html('');
      loadAllBooking();
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: `Booking ID: ${bookingId} has been succeccefully cancelled`,
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
    },
  });
}

function loadAllBooking() {
  const customerId = localStorage.getItem('customerID');
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/show/bookings/${customerId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const booking = data[i];
        const bookingDetails = {
          bookingID: booking.BookingID,
          packageName: booking.PackageName,
          className: booking.ClassName,
          scheduleDate: booking.ScheduleDate,
          timeOfService: booking.TimeOfService,
          noOfRooms: booking.NoOfRooms,
          noOfBathrooms: booking.NoOfBathrooms,
          rateName: booking.Rate,
          estimatePricing: booking.EstimatedPricing,
          address: booking.Address,
          employee: booking.EmployeeName,
          status: booking.Status,
          extraNotes: booking.ExtraNotes,
          dayOfService: booking.DayOfService,
          dayOfService2: booking.DayOfService2,
        };
        const newRow = createRow(bookingDetails);
        $('#bookingSection').append(newRow);
      }
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

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadAllBooking();
});
