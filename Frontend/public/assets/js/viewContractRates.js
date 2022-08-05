const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


function createCard(rates) {
  const card = `
  <tr>
  <td
      style="text-align: left;">
      ${rates.RateName} sqft:</td>
  <td>From S$  ${rates.RatePrice}</td>
</tr>
      `;
  return card;
}

function populateRatesMullBerry() {
  $.ajax({
    url: `${backEndUrl}/ratesByPackagePublic/1`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      for (let i = 0; i < data.length; i++) {
        const rates = data[i];
        const RowInfo = {
          rateName: rates.RateName,
          ratePrice: rates.RatePrice,
        };
        const newRow = createCard(rates);
        $('#mulberry').append(newRow);
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
function populateRatesSaffaras() {
  $.ajax({
    url: `${backEndUrl}/ratesByPackagePublic/2`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {

      for (let i = 0; i < data.length; i++) {
        const rates = data[i];
        const RowInfo = {
          rateName: rates.RateName,
          ratePrice: rates.RatePrice,
        };
        const newRow = createCard(rates);
        $('#Saffaras').append(newRow);
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
  populateRatesMullBerry();
  populateRatesSaffaras();
});
