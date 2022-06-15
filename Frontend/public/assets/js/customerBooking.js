const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

const CustomerID = localStorage.getItem('CustomerID');
const token = localStorage.getItem('token');

function loadUserDetails() {
  // extract user details from local storage
  const CustomerIDs = localStorage.getItem('CustomerID');
  console.log(CustomerIDs);
  let userInfo;

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/customerAddBooking/${CustomerIDs}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const user = data[i];

        // compile the data that the card needs for its creation
        userInfo = {
          userAddress: user.Address,
          userPostalCode: user.PostalCode,
        };
      }

      $('#cAddress').val(userInfo.userAddress);
      $('#cPostalCode').val(userInfo.userPostalCode);
    },
    // errorhandling
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

function incrementR() {
  document.getElementById('rooms').stepUp();
  updatedRooms();
}
function decrementR() {
  document.getElementById('rooms').stepDown();
  updatedRooms();
}
function incrementBR() {
  document.getElementById('bathRooms').stepUp();
  updatedBathrooms();
}
function decrementBR() {
  document.getElementById('bathRooms').stepDown();
  updatedBathrooms();
}
// function updatedService() {
//     var time = document.getElementById("").value;
//     document.getElementById("listService").innerHTML = time;
// }
// function updatePackage() {
//     var time = document.getElementById("").value;
//     document.getElementById("listPackage").innerHTML = time;
// }
function updatedRooms() {
  const roomss = document.getElementById('rooms').value;
  document.getElementById('listRooms').innerHTML = roomss;
}
function updatedBathrooms() {
  const bathroomss = document.getElementById('bathRooms').value;
  document.getElementById('listBathrooms').innerHTML = bathroomss;
}
// function updatedRates() {
//     var time = document.getElementById("").value;
//     document.getElementById("listRates").innerHTML = time;
// }
// function updatedAddServices() {
//     var time = document.getElementById("").value;
//     document.getElementById("listAddService").innerHTML = time;
// }
// function updatedDate() {
//     var time = document.getElementById("").value;
//     document.getElementById("listDate").innerHTML = time;
// }
// function updatedDay() {
//     var time = document.getElementById("").value;
//     document.getElementById("listDay").innerHTML = time;
// }
function updatedTime() {
  const time = document.getElementById('timeOfService').value;
  document.getElementById('listTime').innerHTML = time;
}
$(document).ready(() => {
  incrementR();
  decrementR();
  incrementBR();
  decrementBR();
  updatedTime();
  // updatedDay();
  // updatedDate();
  // updatedAddServices();
  // updatedRates();
  // updatedService();
  // updatePackage();
  loadUserDetails();

  // //update button
  // $("#Update").click(function () {
  //     updateProfile();
  //     loadUserDetails();
  //     // disable the normal behavior of a form submit
  //     return false;
  // });
});
