
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

// function cancelBooking(bookingId){
//     var moment = require('moment'); // require
//     alert(bookingId)
//     const startTime = moment('2021-01-01')  
// const end = moment('2021-02-01')  
// const duration = moment.duration(end.diff(startTime));  
// const hours = duration.asHours();  
// console.log(hours)
// }


function createRow(cardInfo) {
    //   console.log(cardInfo);
    const card = `
        <div class="card">
                        <div class="card-header bg-white"># Booking ${cardInfo.bookingID}</div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Service : ${cardInfo.className}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Pricing : $${cardInfo.estimatePricing}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Package : ${cardInfo.packageName}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Day : ${cardInfo.dayOfService} ${(cardInfo.dayOfService2) === null ? '' : ',' + (cardInfo.dayOfService2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Room : ${cardInfo.noOfRooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Address : ${cardInfo.address}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Bathroom : ${cardInfo.noOfBathrooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Status of appointment : ${cardInfo.status}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Date of appointment : ${cardInfo.scheduleDate}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Name of helper : ${(cardInfo.employee === null ? 'No assigned employee' : cardInfo.employee)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Extra Notes : ${(cardInfo.extraNotes) === null ? 'No Extra notes' : cardInfo.extraNotes}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                <button class="btn btn-danger" type="button" onClick=cancelBooking(${cardInfo.bookingID})>Cancel</button>
                            </div>
                        </div>
                    </div>
      `;
    return card;

}

function loadAllBooking() {
    const customerId = localStorage.getItem('EmployeeID');
    $.ajax({
        url: `${backEndUrl}/show/bookings/${customerId}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',

        success(data) {
            console.log('-------response data------');
            console.log(data);
            console.log(`LENGTH OF DATA:${data.length}`);

            for (let i = 0; i < data.length; i++) {
                const booking = data[i];
                const bookingDetails = {
                    bookingID: booking.BookingID,
                    packageName: booking.PackageName,
                    className: booking.ClassName,
                    scheduleDate: booking.ScheduleDate,
                    timeOfService: booking.TimeOfService,
                    noOfRooms: booking.NoOfRooms,
                    noOfBathrooms: booking.NoOfBathrooms,
                    rateName: booking.Rate,
                    estimatePricing: booking.EstimatedPricing,
                    address: booking.Address,
                    employee: booking.EmployeeName,
                    status: booking.contractStatus,
                    extraNotes: booking.ExtraNotes,
                    dayOfService: booking.DayOfService,
                    dayOfService2: booking.DayOfService2
                };
                const newRow = createRow(bookingDetails);
                $('#bookingSection').append(newRow);
            }
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

$(document).ready(() => {
    const queryParams = new URLSearchParams(window.location.search);
    console.log('--------Query Params----------');
    console.log(`Query Param (source): ${window.location.search}`);
    console.log(`Query Param (extraction): ${queryParams}`);

    loadAllBooking();
});