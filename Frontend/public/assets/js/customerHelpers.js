const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

const CustomerID = localStorage.getItem('customerID');
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const card = `
        <div class="helper-card">
            <div class="helper-pic">
                <img src="${cardInfo.EmployeeImg}" alt="">
            </div>
            <div class="helper-details">
                <h3 class="helper-name">${cardInfo.EmployeeName}</h3>
                <p class="helper-des">${cardInfo.EmployeeDes}</p>
                <a data-toggle="collapse" href="#skillsets${cardInfo.EmployeeID}" role="button" aria-expanded="false">
                    View Skillsets
                </a>
                <div class="collapse" id="skillsets${cardInfo.EmployeeID}">
                    <div class="card card-body">${cardInfo.Skillsets}</div>
                </div>
            </div>
        </div>
    `;
  return card;
}

function loadUserDetails(id) {
  let userInfo;
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customerAddBooking/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const user = data[i];
        userInfo = {
          userNameInfo: user.FirstName,
        };
      }
      $('#cUserNameInfo').html(userInfo.userNameInfo);
    },
  });
}

function loadPossibleHelpers(date) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/helpers/${date}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#helpers-list').html('');
      for (let i = 0; i < data.length; i++) {
        const employee = data[i];
        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImg: employee.EmployeeImgUrl,
          Skillsets: employee.Skillsets,
        };
        const newCard = createRow(RowInfo);
        $('#helpers-list').append(newCard);
      }
    },
    error(xhr) {
      if (xhr.status === 404) {
        $('#errorMsg').text(
          `There are no helpers available on ${date}. A helper will still be schedule to your booking`
          );
      }
    },
  });
}

$(document).ready(() => {
  const date = localStorage.getItem('contractStart');
  loadPossibleHelpers(date);
  loadUserDetails(CustomerID);
});
