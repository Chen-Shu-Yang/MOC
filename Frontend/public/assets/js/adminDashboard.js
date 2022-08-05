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
function loadUserDetails() {
  const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/profile/${tempAdminID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const user = data[i];
        userInfo = {
          FirstName: user.FirstName,
          LastName: user.LastName,
        };
      }
      $('#adminName').append("<h1>Welcome "+userInfo.FirstName + " "+userInfo.LastName+",</h1>");
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

function loadMonthlyBookingForGraph() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingsByMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      const numberOfBookingJan = data[0].numberOfBooking;
      const numberOfBookingFeb = data[1].numberOfBooking;
      const numberOfBookingMar = data[2].numberOfBooking;
      const numberOfBookingApr = data[3].numberOfBooking;
      const numberOfBookingMay = data[4].numberOfBooking;
      const numberOfBookingJun = data[5].numberOfBooking;
      const numberOfBookingJul = data[6].numberOfBooking;
      const numberOfBookingAug = data[7].numberOfBooking;
      const numberOfBookingSep = data[8].numberOfBooking;
      const numberOfBookingOct = data[9].numberOfBooking;
      const numberOfBookingNov = data[10].numberOfBooking;
      const numberOfBookingDec = data[11].numberOfBooking;
      const numberOfBooking = [
        numberOfBookingJan,
        numberOfBookingFeb,
        numberOfBookingMar,
        numberOfBookingApr,
        numberOfBookingMay,
        numberOfBookingJun,
        numberOfBookingJul,
        numberOfBookingAug,
        numberOfBookingSep,
        numberOfBookingOct,
        numberOfBookingNov,
        numberOfBookingDec,
      ];
      const xValues = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'Novemeber', 'December'];
      const yValues = [];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      for (i = 0; i <= currentMonth; i++) {
        yValues[i] = numberOfBooking[i];
      }
      colorVal = 'rgb(255, 99, 132)';
      new Chart('myChart', {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [{
            fill: true,
            lineTension: 0.2,
            color: '#fff',
            backgroundColor: colorVal,
            borderColor: 'rgb(255,99.132)',
            data: yValues,
          }],
        },
        options: {
          responsive: true,
          legend: { display: false },

          title: {
            display: true,
            text: 'Booking',
          },
          scales: {
            yAxes: [{
              ticks: { min: 0, autoSkip: true },
              scaleLabel: {
                display: true,
                labelString: 'Number of Booking',
              },
            }],
          },
        },
      });
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

function getRevenueOfTheMonth() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/revenueOfTheMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      $('#revenueOfTheMonth').append(data.totalRevenue);
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

function diffInConsecutiveMonthBooking() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingsByMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      let lastMonth;
      if (currentMonth === 0) {
        lastMonth = 12;
      } else {
        lastMonth = currentMonth - 1;
      }
      const numberOfBookingLastMonth = data[lastMonth].numberOfBooking;
      const numberOfBookingCurrenttMonth = data[currentMonth].numberOfBooking;
      const diffInBooking = numberOfBookingCurrenttMonth - numberOfBookingLastMonth;
      if (diffInBooking > 0) {
        $('#diffInBooking').append(diffInBooking);
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="dollarIcon"></i>');
      } else if (diffInBooking < 0) {
        $('#diffInBooking').append(Math.abs(diffInBooking));
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="downTrendIcon" ></i>');
      } else if (diffInBooking === 0) {
        $('#diffInBooking').append(diffInBooking);
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="chart"></i>');
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
  loadUserDetails();
  loadMonthlyBookingForGraph();
  getRevenueOfTheMonth();
  diffInConsecutiveMonthBooking();
});
