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

function createTable(cardInfo) {
  const card = `
  <tr>
  <td>${cardInfo.classId}</td>
  <td>${cardInfo.className}</td>
  <td>$${cardInfo.classPricing}</td>
  <td>${cardInfo.classDes}</td>
  <td>
  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditClassModal" onClick="loadAClassOfService(${cardInfo.classId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
  </td>
  <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteClassOfService(${cardInfo.classId})"><i class="fa-regular fa-trash-can"></i></button></td>
  </tr>
  `;
  return card;
}

function createExtraServicesTable(cardInfo) {
  const card = `
                  <tr>
                  <td>${cardInfo.extraServiceId}</td>
                  <td>${cardInfo.extraServiceName}</td>
                  <td>$${cardInfo.extraServicePrice}</td>
                  <td>
                  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditExtraServiceModal" onClick="loadAnExtraService(${cardInfo.extraServiceId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                  </td>
                  <td> <button type="button" id="deleteExtraServiceBtn" class="btn btn-info"  onClick="deleteExtraService(${cardInfo.extraServiceId})"><i class="fa-regular fa-trash-can"></i></button></td>
                  </tr>
                  `;
  return card;
}

function createRateTable(cardInfo) {
  const card = `
                  <tr>
                  <td>${cardInfo.ratesId}</td>
                  <td>${cardInfo.rateName}</td>
                  <td>$${cardInfo.ratePrice}</td>
                  <td>${cardInfo.package}</td>
                  <td>
                  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditRateModal" onClick="loadARate(${cardInfo.ratesId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                  </td>
                  <td> <button type="button" id="deleteRateBtn" class="btn btn-info"  onClick="deleteRate(${cardInfo.ratesId})"><i class="fa-regular fa-trash-can"></i></button></td>
                  </tr>
                  `;
  return card;
}
function loadAllClassOfServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/classes`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const classOfService = data[i];
        const RowInfo = {
          classId: classOfService.ClassID,
          className: classOfService.ClassName,
          classPricing: (classOfService.ClassPricing).toFixed(2),
          classDes: classOfService.ClassDes,
        };
        const newRow = createTable(RowInfo);
        $('#classServiceTableBody').append(newRow);
      }
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

function deleteClassOfService(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      if (xhr.status === 404) {
        let errMsg = '';
        errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      } else if (xhr.status === 200) {
        const msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
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

function updateClassOfService() {
  const classId = $('#class-id-update').val();
  const ClassName = $('#class-name-update').val();
  const ClassPricing = $('#class-pricing-update').val();
  const ClassDescription = $('#class-description-update').val();
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');

  const data2 = {
    ClassName,
    ClassPricing,
    ClassDes: ClassDescription,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class/${classId}`,
    type: 'PUT',
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      const msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
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
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();

    },
  });
}

function loadAClassOfService(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/classes/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const RowInfo = {
        classId: data[0].ClassID,
        className: data[0].ClassName,
        classPricing: data[0].ClassPricing,
        classDescription: data[0].ClassDes,
      };
      $('#class-id-update').val(RowInfo.classId);
      $('#class-name-update').val(RowInfo.className);
      $('#class-pricing-update').val(RowInfo.classPricing);
      $('#class-description-update').val(RowInfo.classDescription);
    },
    error(xhr, textStatus, errorThrown) {
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

function addClassOfService() {
  const name = $('#class_name_add').val();
  const classPricing = $('#class_pricing_add').val();
  const classDescription = $('#class_description__add').val();
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');
  const requestBody = {
    ClassName: name,
    ClassPricing: classPricing,
    ClassDes: classDescription,
  };
  const reqBody = JSON.stringify(requestBody);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      const post = data;
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
      const msg = 'Successfully added!';
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
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
    },
  });
}

function loadAllExtraServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraServices`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const extraServices = data[i];
        const RowInfo = {
          extraServiceId: extraServices.ExtraServiceID,
          extraServiceName: extraServices.ExtraServiceName,
          extraServicePrice: (extraServices.ExtraServicePrice).toFixed(2),
        };
        const newRow = createExtraServicesTable(RowInfo);
        $('#extraServiceTableBody').append(newRow);
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

function loadAnExtraService(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraServices/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const RowInfo = {
        extraServiceId: data[0].ExtraServiceID,
        extraServiceName: data[0].ExtraServiceName,
        extraServicePrice: data[0].ExtraServicePrice,
      };
      $('#extra-service-id-update').val(RowInfo.extraServiceId);
      $('#extra-service-name-update').val(RowInfo.extraServiceName);
      $('#extra-service-pricing-update').val(RowInfo.extraServicePrice);
    },
    error(xhr, textStatus, errorThrown) {
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

function addExtraService() {
  const extraServiceName = $('#extra_service_add').val();
  const extraServicePrice = $('#extra_service_pricing_add').val();
  $('#extra_service_add').val('');
  $('#extra_service_pricing_add').val('');
  const requestBody = {
    ExtraServiceName: extraServiceName,
    ExtraServicePrice: extraServicePrice,
  };
  const reqBody = JSON.stringify(requestBody);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      const msg = 'Successfully added!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      const post = data;
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
    },
  });
}

function updateExtraService() {
  const extraServiceId = $('#extra-service-id-update').val();
  const extraServiceName = $('#extra-service-name-update').val();
  const extraServicePrice = $('#extra-service-pricing-update').val();
  $('#extra_service_add').val('');
  $('#extra_service_pricing_add').val('');
  const data2 = {
    ExtraServiceName: extraServiceName,
    ExtraServicePrice: extraServicePrice,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService/${extraServiceId}`,
    type: 'PUT',
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      const msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
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
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
    },
  });
}

function deleteExtraService(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      if (xhr.status === 404) {
        let errMsg = '';
        errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#extraServiceTableBody').html('');
      } else if (xhr.status === 200) {
        const msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
        $('#extraServiceTableBody').html('');
        loadAllExtraServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
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

function loadAllRates() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rates`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      for (let i = 0; i < data.length; i++) {
        const rates = data[i];
        const RowInfo = {
          ratesId: rates.RatesID,
          rateName: rates.RateName,
          ratePrice: (rates.RatePrice).toFixed(2),
          package: rates.PackageName,
        };
        const newRow = createRateTable(RowInfo);
        $('#rateTableBody').append(newRow);
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

function loadARate(id) {
  $.ajax({
    url: `${backEndUrl}/rates/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      const RowInfo = {
        ratesId: data[0].RatesID,
        rateName: data[0].RateName,
        ratePrice: data[0].RatePrice,
        package: data[0].Package,
      };
      $('#rate-id-update').val(RowInfo.ratesId);
      $('#rate-name-update').val(RowInfo.rateName);
      $('#rate-pricing-update').val(RowInfo.ratePrice);
      $('#package-update').val(RowInfo.package);
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = ' ';
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

function addRate() {
  const rateName = $('#rate_add').val();
  const ratePrice = $('#rate_pricing_add').val();
  const packages = $('#package_add').val();
  $('#rate_add').val('');
  $('#rate_pricing_add').val('');
  const requestBody = {
    RateName: rateName,
    RatePrice: ratePrice,
    Package: packages,
  };
  const reqBody = JSON.stringify(requestBody);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      $('#rateTableBody').html('');
      loadAllRates();
      const msg = 'Successfully added!';
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
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();

      $('#rateTableBody').html('');
      loadAllRates();
    },
  });
}

function updateRate() {
  const rateId = $('#rate-id-update').val();
  const rateName = $('#rate-name-update').val();
  const ratePrice = $('#rate-pricing-update').val();
  const packages = $('#package-update').val();
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  const data2 = {
    RateName: rateName,
    RatePrice: ratePrice,
    Package: packages,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate/${rateId}`,
    type: 'PUT',
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      const msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#rateTableBody').html('');
      loadAllRates();
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
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#rateTableBody').html('');
      loadAllRates();
    },
  });
}

function deleteRate(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      if (xhr.status === 404) {
        let errMsg = '';
        errMsg = 'Not valid id';
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#rateTableBody').html('');
      } else if (xhr.status === 200) {
        const msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
        $('#rateTableBody').html('');
        loadAllRates();
      }
    },
    error(xhr, textStatus, errorThrown) {
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
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
  const queryParams = new URLSearchParams(window.location.search);
  loadAllClassOfServices();
  loadAllExtraServices();
  loadAllRates();
});
