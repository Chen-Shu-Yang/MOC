/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';


var CustomerID = localStorage.getItem('CustomerID')
var token = localStorage.getItem('token');

var myArray = [];

function createCard(cardInfo) {
    var card = `
        <div class="card">
            <div class="container">
                <h4><b>${cardInfo.ClassName}</b></h4> 
                <p>$${cardInfo.ClassPricing} per hour</p>
                <p>Include:</p>
                <p>${cardInfo.ClassDes}</p>
                <input type="checkbox" id="classNameButton" value=${cardInfo.ClassName} onchange="updatedService" hidden>
                <button onclick="document.getElementById('classNameButton').checked=!document.getElementById('classNameButton').checked;">Select</button>
            </div>
        </div>
    `; 

    return card;
}

function loadUserDetails() {
    // extract user details from local storage
    const CustomerIDs = localStorage.getItem('CustomerID')
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
                    userPostalCode: user.PostalCode
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

// function to display all class of services by card
function populateClass() {
    //call the web service endpoint
    $.ajax({
        url:  `${backEndUrl}/classOfService/`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            console.log("-------- response data --------");
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                var classOfService = data[i];

                //compile the data that the card needs for its creation
                var cardInfo = {
                    "ClassID": classOfService.ClassID,
                    "ClassName": classOfService.ClassName,
                    "ClassPricing": classOfService.ClassPricing,
                    "ClassDes": classOfService.ClassDes
                };

                console.log("-------- Card Info data pack --------");
                console.log(cardInfo);

                var newCard = createCard(cardInfo);

                $('#class').append(newCard);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            console.log(xhr.responseText);
            console.log(xhr.status);
        }
    });
}

// function to display all packages in a drop down list
function populatePackage() {
    //call the web service endpoint
    $.ajax({
        url:  `${backEndUrl}/package/`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            console.log("-------- response data --------");
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                var package = data[i];

                // for loop to generate every data from the database and append to the drop down list
                $('#package').append('<option value="' + package.PackageName + ' (' + package.PackageDes + ')">' + package.PackageName + ' (' + package.PackageDes + ')</option>');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            console.log(xhr.responseText);
            console.log(xhr.status);
        }
    });
}

// function to display all rates in a drop down list
function populateRates() {
    //call the web service endpoint
    $.ajax({
        url:  `${backEndUrl}/rates/`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            console.log("-------- response data --------");
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                var rates = data[i];

                // for loop to generate every data from the database and append to the drop down list
                $('#rates').append('<option value="' + rates.RateName + 'sqft' + ' (From S$' + rates.RatePrice + ')">' + rates.RateName + 'sqft' + ' (From S$' + rates.RatePrice + ')</option>');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            console.log(xhr.responseText);
            console.log(xhr.status);
        }
    });
}

// function to display all extra services in a drop down list
function populateAdditonalService() {
    //call the web service endpoint
    $.ajax({
        url:  `${backEndUrl}/additionalService/`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            console.log("-------- response data --------");
            console.log(data);

            // for loop to generate every data from the database and append to the drop down list
            for (var i = 0; i < data.length; i++) {
                var extraservice = data[i];

                $('#additionalService').append(extraservice.ExtraServiceName 
                + '<input id="' + i + '" type="checkbox" onchange="updatedAddServices(' + i + ')" name="' + extraservice.ExtraServiceName + '" value="' + extraservice.ExtraServiceName + ' (Additonal S$' + extraservice.ExtraServicePrice + ')">'
                + ' (Additonal S$' + extraservice.ExtraServicePrice + ')<br>');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            console.log(xhr.responseText);
            console.log(xhr.status);
        }
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
function updatedService() {
    var services = document.getElementById("classNameButton").value;
    document.getElementById("listService").innerHTML = services;
}
function updatedPackage() {
    var packages = document.getElementById("package").value;
    document.getElementById("listPackage").innerHTML = packages;
}
function updatedRooms() {
    var roomss = document.getElementById("rooms").value;
    document.getElementById("listRooms").innerHTML = roomss;
}
function updatedBathrooms() {
    var bathroomss = document.getElementById("bathRooms").value;
    document.getElementById("listBathrooms").innerHTML = bathroomss;
}
function updatedRates() {
    var ratess = document.getElementById("rates").value;
    document.getElementById("listRates").innerHTML = ratess;
}
function updatedAddServices(i) {
    var additionalServices = document.getElementById(i).value;
    var currentServices = document.getElementById("listAddService");

    //get rids of the dash if its the only one
    if(currentServices.innerHTML == "-"){
        currentServices.innerHTML = "";
    }

    //if service found, take the current innerHTML, replace it with blank, then set it back
    if(currentServices.innerHTML.indexOf(additionalServices) != -1){
        var currentServicesList = currentServices.innerHTML;
        currentServicesList = currentServicesList.replace(additionalServices+" ","");
        currentServices.innerHTML = currentServicesList;
    }
    else{
        currentServices.innerHTML += additionalServices + " ";
    }

    //adds the dash back if empty again
    if(currentServices.innerHTML == ""){
        currentServices.innerHTML = "-";
    }
    
}
function updatedDate() {
    var date = document.getElementById("startDate").value;
    document.getElementById("listDate").innerHTML = date;
}
function updatedDay1() {
    var day1 = document.getElementById("dayOfService1").value;
    document.getElementById("listDay1").innerHTML = day1;
}
function updatedDay2() {
    var day2 = document.getElementById("dayOfService2").value;
    document.getElementById("listDay2").innerHTML = day2;
}
function updatedTime() {
    var time = document.getElementById("timeOfService").value;
    document.getElementById("listTime").innerHTML = time;
}
$(document).ready(() => {
    populateClass()
    populatePackage();
    populateRates();
    populateAdditonalService()

    incrementR();
    decrementR();
    incrementBR();
    decrementBR();
    updatedTime();
    updatedDay1();
    updatedDay2()
    updatedDate();
    updatedAddServices();
    updatedRates();
    updatedService();
    updatedPackage();
    loadUserDetails();

    // //update button 
    // $("#Update").click(function () {
    //     updateProfile();
    //     loadUserDetails();
    //     // disable the normal behavior of a form submit
    //     return false;
    // });
});

$(document).ready(function(){
    $("#day2").hide();
    $("#day22").hide();
 
 });

$(document).on('change',"#package", function () {
    if ($(this).val() == "Sassafras (Twice a week, 8 times a month)") {
        $("#day2").show();
        $("#day22").show();
    } else {
        $("#day2").hide();
        $("#day22").hide();
    }
 });