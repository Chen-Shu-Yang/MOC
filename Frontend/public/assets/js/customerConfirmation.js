/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

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
$(document).ready(() => {
  // const servicePreference = localStorage.getItem('servicePref');
  const servicePreference = 'Class B';
  const customerAddress = localStorage.getItem('address');
  const servicePackages = localStorage.getItem('servicePackage');
  const roomNo = localStorage.getItem('rooms');
  const bathRoomNo = localStorage.getItem('bathRooms');
  const rates = localStorage.getItem('serviceRates');
  const additionalService = localStorage.getItem('addService');
  const contractStartDate = localStorage.getItem('contractStart');
  const day1 = localStorage.getItem('serviceDay1');
  const day2 = localStorage.getItem('serviceDay2');
  const time = localStorage.getItem('serviceTime');
  const additionalInfo = localStorage.getItem('addInfo');

  const servicePrefId = servicePreference.substring(servicePreference.indexOf('#') + 1);
  const ratesId = rates.substring(rates.indexOf('#') + 1);
  const additionalServiceId = additionalService.substring(additionalService.indexOf('#') + 1);
  const servicePackagesId = servicePackages.substring(servicePackages.indexOf('#') + 1);

  const servicePrefString = servicePreference.substring(0, servicePreference.indexOf('#'));
  const ratesString = rates.substring(0, rates.indexOf('#'));
  const additionalServiceString = additionalService.substring(0, additionalService.indexOf('#'));
  const servicePackagesString = servicePackages.substring(0, servicePackages.indexOf('#'));

  console.log(`  
    address: ${customerAddress}
    servicePackage: ${servicePackages}
    roooms: ${roomNo}
    bathRooms: ${bathRoomNo}
    serviceRates: ${rates}
    addService: ${additionalService}
    contractStart: ${contractStartDate}
    serviceDay1: ${day1}
    serviceDay2: ${day2}
    serviceTime: ${time}
    addInfo: ${additionalInfo}
  `);

  // $('#serviceClassId').val(servicePrefId);
  $('#servicePackageId').val(servicePackagesId);
  $('#sizeRatingsId').val(ratesId);
  $('#extraServicesId').val(additionalServiceId);

  $('#serviceClass').html(servicePrefString);
  $('#address').html(customerAddress);
  $('#servicePackage').html(servicePackagesString);
  $('#noOfRooms').html(roomNo);
  $('#noOfBath').html(bathRoomNo);
  $('#sizeRatings').html(ratesString);
  $('#extraServices').html(additionalServiceString);
  $('#startDate').html(contractStartDate);
  $('#serviceDay').html(day1);
  if (servicePackagesId === '2') {
    $('#serviceDay2').html(day2);
  }
  $('#serviceTiming').html(time);
  $('#additionalInfo').html(additionalInfo);
});
