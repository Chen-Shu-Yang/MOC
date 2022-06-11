
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';



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
        <td>${cardInfo.RateName}</td>
        <td>${cardInfo.EstimatePricing}</td>
        <td>${cardInfo.Address}</td>
      </tr>
      `;
    return card;
}

function pageBtnCreate(totalNumberOfPages) {
    $('#pagination').html('');
    for (i = 1; i <= totalNumberOfPages; i++) {
        divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
        $('#pagination').append(divPaginBtn);
    }
}

function loadAllContracts() {
    $.ajax({
        url: `${backEndUrl}/contracts`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',

        success(data) {
            const totalNumberOfPages = Math.ceil(data.length / 6);
            pageBtnCreate(totalNumberOfPages);
        },

        error(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.responseText);
            console.log(xhr.status);
        },
    });
}

function loadAllContractByLimit(pageNumber) {
    // call the web service endpoint
    $.ajax({
        url: `${backEndUrl}/contracts/${pageNumber}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            if (data != null) {
                $('#contractTableBody').html('');
                for (let i = 0; i < data.length; i++) {
                    const contract = data[i];

                    let date = contract.StartDate;
                    date = date.replace("T16:00:00.000Z", "");
                    // compile the data that the card needs for its creation
                    const contractstbl = {
                        contractID: contract.ContractId,
                        FirstName: contract.FirstName,
                        LastName: contract.LastName,
                        Package: contract.PackageName,
                        ClassName: contract.ClassName,
                        StartDate: date,
                        TimeOfService: contract.TimeOfService,
                        NoOfRooms: contract.NoOfRooms,
                        NoOfBathrooms: contract.NoOfBathrooms,
                        RateName: contract.Rate,
                        EstimatePricing: contract.EstimatedPricing,
                        Address: contract.Address,
                    };
                    const newRow = createRow(contractstbl);
                    $('#contractTableBody').append(newRow);
                }
            }
            
        },
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
    const queryParams = new URLSearchParams(window.location.search);
    console.log('--------Query Params----------');
    console.log(`Query Param (source): ${window.location.search}`);
    console.log(`Query Param (extraction): ${queryParams}`);

    loadAllContractByLimit(1);
    loadAllContracts()
});