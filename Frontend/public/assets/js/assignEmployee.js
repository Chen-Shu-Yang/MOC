const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
let employeeCount = 0;
let customerCount = 0;
function selectEmployee(employee) {
  document.getElementById('assign').value = employee;
}
function createRow(cardInfo) {
  if (cardInfo.EmployeeStatus === 'Assigned') {
    const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <button type="button" class="btn bg-assigned" onclick="selectEmployee(${cardInfo.EmployeeID})">
      <div class="row no-gutters ">
        <div class="col-sm-3">
            <img src="${cardInfo.EmployeeImg}" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">${cardInfo.Employee}</h6>
                <p class="card-text">
                ${cardInfo.EmployeeDes}
                </p>
            </div>
        </div>
      </div>
    </button>
</div>
  `;
    return card;
  } else {
    const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <button type="button" class="btn" onclick="selectEmployee(${cardInfo.EmployeeID})">
      <div class="row no-gutters ">
        <div class="col-md-3">
            <img src="${cardInfo.EmployeeImg}" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">${cardInfo.Employee}</h6>
                <p class="card-text">
                ${cardInfo.EmployeeDes}
                </p>
            </div>
        </div>
      </div>
    </button>
</div>
  `;
    return card;
  }
}

function loadAvailableEmployee(bookingDate,timeOfService) {
  const details = {
    bookingDates: bookingDate,
    timeOfService: timeOfService,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employeeList`,
    type: 'POST',
    data: JSON.stringify(details),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          const employeeDetails = {
            Employee: booking.EmployeeName,
            EmployeeDes: booking.EmployeeDes,
            EmployeeImg: booking.EmployeeImgUrl,
            EmployeeStatus: booking.Status,
            EmployeeID: booking.EmployeeID,
          };
          const newRow = createRow(employeeDetails);
          $('#employeeList').append(newRow);
        }
      }
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

function loadBookingDetails(bookingid) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contract/${bookingid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const bookingDetails = data[0];
      const RowInfo = {
        customerId: bookingDetails.CustomerID,
        customerFirstName: bookingDetails.FirstName,
        customerLastName: bookingDetails.LastName,
        contractAddress: bookingDetails.Address,
        contractRoom: bookingDetails.NoOfRooms,
        contractBathroom: bookingDetails.NoOfBathrooms,
        contractSizing: bookingDetails.RateName,
        contractPricing: bookingDetails.EstimatedPricing,
        contractEmployee: bookingDetails.EmployeeName,
        contractExtraNotes: bookingDetails.ExtraNotes,
        bookingDate: bookingDetails.ScheduleDate,
        timeOfService: bookingDetails.TimeOfService
      };
      $('#customerIdAssignBooking').val(RowInfo.customerId);
      $('#firstName').val(RowInfo.customerFirstName);
      $('#lastName').val(RowInfo.customerLastName);
      $('#address').val(RowInfo.contractAddress);
      $('#noOfRoom').val(RowInfo.contractRoom);
      $('#noOfBathroom').val(RowInfo.contractBathroom);
      $('#sizing').val(RowInfo.contractSizing);
      $('#pricing').val(RowInfo.contractPricing);
      $('#assign').val(RowInfo.contractEmployee);
      $('#extraNotes').val(RowInfo.ExtraNotes);
      loadAvailableEmployee(RowInfo.bookingDate, RowInfo.timeOfService);
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

function assignBookingSchedule() {
  const queryParams = new URLSearchParams(window.location.search);
  const bookingid = queryParams.get('bookingid');
  const adminID = localStorage.getItem('AdminID');
  const employeeID = $('#assign').val();
  const customerID = $('#customerIdAssignBooking').val();
  const data = {
    CustomerID: customerID,
    EmployeeID: employeeID,
    AdminID: adminID,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/assignBooking/${bookingid}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Assigned successfully',
        }).show();
        $('#sendWhatsappModal').modal('show');
        $('#employeeName').html('');
        $('#customerName').html('');
        $('#employeeName').html(`${data.EmployeeName}:`);
        $('#customerName').html(`${data.CustomerName}:`);
        $('#employeeWhatsapp').val(data.EmployeeMobile);
        $('#customerWhatsapp').val(data.CustomerMobile);
      } else {
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
    error(xhr, textStatus, errorThrown) {
      if (xhr.status === 400) {
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

function whatsappEmployee() {
  const queryParams = new URLSearchParams(window.location.search);
  const bookingId = queryParams.get('bookingid');
  const employeeWhatsapp = $('#employeeWhatsapp').val();
  if (employeeCount > 0 && customerCount > 0) {
    window.location.replace(`${frontEndUrl}/admin/booking`);
  }
  if (employeeCount > 0) {
    new Noty({
      timeout: '3000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Message has been sent!',
    }).show();
    return;
  }
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contract/${bookingId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      if (data != null) {
        const bookingDetails = data[0];
        let extraNotes;
        if (bookingDetails.ExtraNotes === null) {
          extraNotes = '';
        } else {
          extraNotes = `Here is an extra note from the customer: ${bookingDetails.ExtraNotes}.`;
        }
        const WhatsappMsg = `Hi ${bookingDetails.EmployeeName}, you have been assigned to a booking on ${bookingDetails.ScheduleDate} from ${bookingDetails.FirstName} ${bookingDetails.LastName}. The address is ${bookingDetails.Address}. There will be ${bookingDetails.NoOfRooms} rooms and ${bookingDetails.NoOfBathrooms} bathrooms with an estimated sizing of ${bookingDetails.RateName} sqft. ${extraNotes}`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=65${employeeWhatsapp}&text=${WhatsappMsg}`;
        window.open(whatsappLink, '_blank').focus();
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
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
  employeeCount++;
}

function whatsappCustomer() {
  const queryParams = new URLSearchParams(window.location.search);
  const bookingId = queryParams.get('bookingid');
  const customerWhatsapp = $('#customerWhatsapp').val();
  if (employeeCount > 0 && customerCount > 0) {
    window.location.replace(`${frontEndUrl}/admin/booking`);
  }
  if (customerCount > 0) {
    new Noty({
      timeout: '3000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Message has been sent!',
    }).show();
    return;
  }
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contract/${bookingId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      if (data != null) {
        const bookingDetails = data[0];
        const WhatsappMsg = `Hi ${bookingDetails.FirstName} ${bookingDetails.LastName}. ${bookingDetails.EmployeeName} has been assigned to your booking on ${bookingDetails.ScheduleDate}. Enjoy your service!`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=65${customerWhatsapp}&text=${WhatsappMsg}`;
        window.open(whatsappLink, '_blank').focus();
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
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
  customerCount++;
}

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const bookingid = queryParams.get('bookingid');
  loadBookingDetails(bookingid);
});
