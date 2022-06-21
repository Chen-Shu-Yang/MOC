/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

const CustomerID = localStorage.getItem('customerID');
const token = localStorage.getItem('token');

function fillUpConfirmationCard() {
  // const servicePreference = localStorage.getItem('servicePref');
  const servicePreference = localStorage.getItem('servicePref');
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
  const totalEstCost = localStorage.getItem('totalCost');

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

  $('#serviceClassId').val(servicePrefId);
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
  $('#estimatedTotalCost').html(`$ ${totalEstCost}`);
  $('#estimatedTotal').val(totalEstCost);
}

function customerAutobooking() {
  const ServiceClass = $('#serviceClassId').val();
  const ServicePackage = $('#servicePackageId').val();
  const NoOfRooms = $('#noOfRooms').html();
  const NoOfBathrooms = $('#noOfBath').html();
  const Address = $('#address').html();
  const StartDate = $('#startDate').html();
  const ServiceDay = $('#serviceDay').html();
  const ServiceDay2 = $('#serviceDay2').html();
  const ServiceTiming = $('#serviceTiming').html();
  const SizeRating = $('#sizeRatingsId').val();
  const ExtraServices = $('#extraServicesId').val();
  const AdditionalInfo = $('#additionalInfo').html();
  const EstimatedTotal = $('#estimatedTotal').val();

  const requestBody = {
    customer: CustomerID,
    StartDate,
    Package: ServicePackage,
    DayOfService: ServiceDay,
    DayOfService2: ServiceDay2,
    TimeOfService: ServiceTiming,
    EstimatedPricing: EstimatedTotal,
    ExtraNotes: AdditionalInfo,
    NoOfRooms,
    NoOfBathrooms,
    Address,
    Class: ServiceClass,
    Rate: SizeRating,
    ExtraService: ExtraServices,
  };

  console.log(requestBody);
  const reqBody = JSON.stringify(requestBody);

  $.ajax({
    url: `${backEndUrl}/customer/autobooking`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      localStorage.removeItem('servicePref');
      localStorage.removeItem('address');
      localStorage.removeItem('servicePackage');
      localStorage.removeItem('rooms');
      localStorage.removeItem('bathRooms');
      localStorage.removeItem('serviceRates');
      localStorage.removeItem('addService');
      localStorage.removeItem('serviceDay1');
      localStorage.removeItem('serviceDay2');
      localStorage.removeItem('serviceTime');
      localStorage.removeItem('addInfo');
      localStorage.removeItem('totalCost');
      window.location.replace(`${frontEndUrl}/customer/helpers`);
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      $('#classServiceTableBody').html('');
    },
  });
}

$(document).ready(() => {
  fillUpConfirmationCard();

  $('#confirmBookingBtn').click(() => {
    customerAutobooking();
  });
});
