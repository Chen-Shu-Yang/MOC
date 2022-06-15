
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

//loadAllClassOfServices gets all class of services
function loadMonthlyBookingForGraph() {
    $.ajax({
        url: `${backEndUrl}/bookingsByMonth`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {

            var numberOfBookingJan, numberOfBookingFeb, numberOfBookingMar, numberOfBookingApr, numberOfBookingMay, numberOfBookingJun, numberOfBookingJul, numberOfBookingAug, numberOfBookingSep, numberOfBookingOct, numberOfBookingNov, numberOfBookingDec;
            numberOfBookingJan = data[0].numberOfBooking
            numberOfBookingFeb = data[1].numberOfBooking
            numberOfBookingMar = data[2].numberOfBooking
            numberOfBookingApr = data[3].numberOfBooking
            numberOfBookingMay = data[4].numberOfBooking
            numberOfBookingJun = data[5].numberOfBooking
            numberOfBookingJul = data[6].numberOfBooking
            numberOfBookingAug = data[7].numberOfBooking
            numberOfBookingSep = data[8].numberOfBooking
            numberOfBookingOct = data[9].numberOfBooking
            numberOfBookingNov = data[10].numberOfBooking
            numberOfBookingDec = data[11].numberOfBooking
            var numberOfBooking = [numberOfBookingJan, numberOfBookingFeb, numberOfBookingMar, numberOfBookingApr, numberOfBookingMay, numberOfBookingJun, numberOfBookingJul, numberOfBookingAug, numberOfBookingSep, numberOfBookingOct, numberOfBookingNov, numberOfBookingDec];


            var xValues = ["January", "February", "March", "April", "May", "June", "July", "August", "October", "Novemeber", "December"];
            var yValues = [];
            const currentDate = new Date();
            let currentMonth = currentDate.getMonth();
            console.log(currentMonth)

            for (i = 0; i <= currentMonth; i++) {
                yValues[i] = numberOfBooking[i]
            }

            colorVal = "rgb(255, 99, 132)"

            new Chart("myChart", {
                type: "line",
                data: {
                    labels: xValues,
                    datasets: [{
                        fill: true,
                        lineTension: 0.2,
                        color: "#fff",
                        backgroundColor: colorVal,
                        borderColor: "rgb(255,99.132)",
                        data: yValues
                    }]
                },
                options: {
                    responsive: true,
                    legend: { display: false },

                    title: {
                        display: true,
                        text: 'Booking'
                    }

                    ,
                    scales: {

                        yAxes: [{
                            ticks: { min: 0, autoSkip: true },
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of Booking'
                            }

                        }],
                    }
                }
            });

        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });





}



//loadAllClassOfServices gets all class of services
function getRevenueOfTheMonth() {
    $.ajax({
        url: `${backEndUrl}/revenueOfTheMonth`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            console.log("-------response data------")
            console.log(data)

            $('#revenueOfTheMonth').append(data.totalRevenue);



        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });





}

function diffInConsecutiveMonthBooking() {
    $.ajax({
        url: `${backEndUrl}/bookingsByMonth`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            const currentDate = new Date();
            let currentMonth = currentDate.getMonth();
            let lastMonth;

            if (currentMonth == 0) {
                lastMonth = 12
            }
            else {
                lastMonth = currentMonth - 1
            }



            var numberOfBookingLastMonth, numberOfBookingCurrenttMonth;
            numberOfBookingLastMonth = data[lastMonth].numberOfBooking
            numberOfBookingCurrenttMonth = data[currentMonth].numberOfBooking

            var diffInBooking = numberOfBookingCurrenttMonth - numberOfBookingLastMonth

           

            if (diffInBooking > 0) {
                $('#diffInBooking').append(diffInBooking)
                $('#statusOrder').append(`<i class="fa fa-line-chart fa-2xl" id="dollarIcon"></i>`)


            }
            else if(diffInBooking<0) {
                $('#diffInBooking').append(Math.abs(diffInBooking))
                $('#statusOrder').append(`<i class="fa fa-line-chart fa-2xl" id="downTrendIcon"></i>`)

            }
            else if (diffInBooking == 0) {
                $('#diffInBooking').append(diffInBooking)
                $('#statusOrder').append(`<i class="fa fa-line-chart fa-2xl" ></i>`)
            }
          




        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });





}



// to load datas when page refresh or loads for the first time
$(document).ready(function () {
    // to debug
    var queryParams = new URLSearchParams(window.location.search);
    console.log("--------Query Params----------")
    console.log("Query Param (source): " + window.location.search)
    console.log("Query Param (extraction): " + queryParams)
    //load
    loadMonthlyBookingForGraph();
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    getRevenueOfTheMonth()
    console.log("+++++++++++++++++++++++++++++++++")
    diffInConsecutiveMonthBooking()


});