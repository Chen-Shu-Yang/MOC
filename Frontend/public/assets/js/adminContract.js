const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

let userSearchChar = [];
const userSearch = document.getElementById('searchContract');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const card = `
      <tr>
        <td>${cardInfo.contractID}</td>
        <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
        <td>${cardInfo.Package}</td>
        <td>${cardInfo.ClassName}</td>
        <td>${cardInfo.StartDate}</td>
        <td>${cardInfo.TimeOfService}</td>
        <td>${cardInfo.NoOfRooms}</td>
        <td>${cardInfo.NoOfBathrooms}</td>
        <td>${cardInfo.RateName}ft</td>
        <td>${cardInfo.DayOfService1} ${(cardInfo.DayOfService2 === null || cardInfo.DayOfService2 === '-' || cardInfo.DayOfService2 === '') ? ' ' : `, ${cardInfo.DayOfService2}`}</td>
        <td>$${cardInfo.EstimatePricing}</td>
        <td>${cardInfo.Address}</td>
        <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editContractModal" onClick="loadAContract(${cardInfo.contractID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
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
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllContractByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllContracts(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      userSearchChar = [];
      for (let i = 0; i < data.length; i++) {
        const contract = data[i];
        const Contract = {
          CustomerName: `${contract.FirstName} ${contract.LastName}`,
          contractID: contract.ContractId,
          FirstName: contract.FirstName,
          LastName: contract.LastName,
          Package: contract.PackageName,
          ClassName: contract.ClassName,
          StartDate: contract.StartDate,
          TimeOfService: contract.TimeOfService,
          NoOfRooms: contract.NoOfRooms,
          NoOfBathrooms: contract.NoOfBathrooms,
          RateName: contract.RateName,
          EstimatePricing: contract.EstimatedPricing,
          Address: contract.Address,
          DayOfService1: contract.DayOfService,
          DayOfService2: contract.DayOfService2,
        };
        userSearchChar.push(Contract);
      }
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
    },
    error(errorThrown) {
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

function loadAllContractByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#contractTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const contract = data[i];
          const contractstbl = {
            contractID: contract.ContractId,
            FirstName: contract.FirstName,
            LastName: contract.LastName,
            Package: contract.PackageName,
            ClassName: contract.ClassName,
            StartDate: contract.StartDate,
            TimeOfService: contract.TimeOfService,
            NoOfRooms: contract.NoOfRooms,
            NoOfBathrooms: contract.NoOfBathrooms,
            RateName: contract.RateName,
            EstimatePricing: contract.EstimatedPricing,
            Address: contract.Address,
            DayOfService1: contract.DayOfService,
            DayOfService2: contract.DayOfService2,
          };
          const newRow = createRow(contractstbl);
          $('#contractTableBody').append(newRow);
        }
      }
      loadAllContracts(pageNumber);
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

function loadAContract(contractId) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneContract/${contractId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const contractZero = data[0];
      const RowInfo = {
        contractId: contractZero.ContractID,
        DayOfService: contractZero.DayOfService,
        DayOfService2: contractZero.DayOfService2,
        EstimatedPricing: contractZero.EstimatedPricing,
      };
      $('#contract-id-update').val(RowInfo.contractId);
      $('#dayOfService1').val(RowInfo.DayOfService);
      $('#dayOfService2').val(RowInfo.DayOfService2);
      $('#estimatedPricing').val(RowInfo.EstimatedPricing);
      const day2 = document.getElementById('day2');
      if (RowInfo.DayOfService2 === null || RowInfo.DayOfService2 === '-') {
        day2.style.visibility = 'hidden';
      } else {
        day2.style.visibility = 'visible';
      }
    },
    error(xhr) {
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
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
}

function CheckDropDowns(thisSelect) {
  const otherSelectId = (thisSelect.id === 'dayOfService1') ? 'dayOfService2' : 'dayOfService1';
  const otherSelect = document.getElementById(otherSelectId);

  for (i = 0; i < otherSelect.options.length; i++) {
    otherSelect.options[i].removeAttribute('hidden');
    if (otherSelect.options[i].value === thisSelect.value) {
      otherSelect.options[i].setAttribute('hidden', 'hidden');
    }
  }
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
  let filterCustomers = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));
  if (searchString === '') {
    filterCustomers = [];
    $('#similarSearch').html('');
    $('#contractTableBody').html('');
    loadAllContractByLimit(1);
    return;
  }
  $('#similarSearch').html('');
  $('#contractTableBody').html('');
  if (filterCustomers.length !== 0) {
    for (let i = 0; i < filterCustomers.length; i++) {
      const customer = filterCustomers[i];
      RowInfo = {
        contractID: customer.contractID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Package: customer.Package,
        ClassName: customer.ClassName,
        StartDate: customer.StartDate,
        TimeOfService: customer.TimeOfService,
        NoOfRooms: customer.NoOfRooms,
        NoOfBathrooms: customer.NoOfBathrooms,
        RateName: customer.RateName,
        EstimatePricing: customer.EstimatePricing,
        Address: customer.Address,
        DayOfService1: customer.DayOfService1,
        DayOfService2: customer.DayOfService2,
      };
      const newCard = createRow(RowInfo);
      $('#contractTableBody').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].CustomerName;
      const distance = levenshtein(searchString, compared.toLowerCase()); 
      const customer = userSearchChar[i];
      RowInfo = {
        contractID: customer.contractID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Package: customer.Package,
        ClassName: customer.ClassName,
        StartDate: customer.StartDate,
        TimeOfService: customer.TimeOfService,
        NoOfRooms: customer.NoOfRooms,
        NoOfBathrooms: customer.NoOfBathrooms,
        RateName: customer.RateName,
        EstimatePricing: customer.EstimatePricing,
        Address: customer.Address,
        DayOfService1: customer.DayOfService1,
        DayOfService2: customer.DayOfService2,
      };
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }
    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#contractTableBody').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$('#updateContract').click(() => {
  const contractId = $('#contract-id-update').val();
  const dayOfService1 = $('#dayOfService1').val();
  let dayOfService2 = $('#dayOfService2').val();
  const estimatedPricing = $('#estimatedPricing').val();
  if ($('#day2').is(':hidden')) {
    dayOfService2 = '-';
  }
  const info = {
    contractId,
    dayOfService1,
    dayOfService2,
    estimatedPricing,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateContract/${contractId}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Contract updated!',
        }).show();
        window.location.reload();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Unsuccessful Update!',
        }).show();
      }
    },
    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Something Went Wrong',
      }).show();
    },
  });
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadAllContractByLimit(1);
});
