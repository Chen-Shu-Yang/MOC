
const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';

//errorToast method display the error
function errorToast(msg) {
    // error alert div
    diverror = `
<div class="alert alert-danger alert-dismissible fade show">
<strong>Error!</strong>${msg}
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`
    //return error alert div
    return diverror;

}

//confirmToast method display confiramtion
function confirmToast(msg) {
    //confiramtion alert div
    divConfirmation = `
<div class="alert alert-success alert-dismissible fade show">
<strong>${msg}</strong>
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`
    //return confirmation alert div
    return divConfirmation;

}

//deleteClassOfService method delete class of service
function deleteClassOfService(id) {

    // call the web service endpoint for deleting class of service by id
    $.ajax({

        url: `${backEndUrl}/class/${id}`,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        // if data inserted
        success: function (data, textStatus, xhr) {


            //if id in the params not valid show error
            if (xhr.status == 404) {
                //set and call error message
                errMsg = "Not valid id"
                var errMsg = ""
                $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
                //to refresh
                $('#classServiceTableBody').html('')
                loadAllClassOfServices()
            }
            //if the params id is valid and 
            else if (xhr.status == 200) {
                //set and call confirmation message
                msg = "Successfully deleted!"

                $('#confirmationMsg').html(confirmToast(msg + " " + xhr.status)).fadeOut(2500);
                 //to refresh
                $('#classServiceTableBody').html('')
                loadAllClassOfServices()

            }
        },

        error: function (xhr, textStatus, errorThrown) {

            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }

            else {

                errMsg = "There is some other issues here"

            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);


        }

    });




}

//updateClassOfService method update class of service
function updateClassOfService() {

    //extarct values from pop-up
    var classId = $('#class-id-update').val();
    var ClassName = $('#class-name-update').val();
    var ClassPricing = $('#class-pricing-update').val();
    var ClassDescription = $('#class-description-update').val();
    //set value to empty after getting value
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")
    $('#class_description__add').val("")

    //put all data inserted into data2 so that it can be used to parse as json data in the api
    var data2 = {
        "ClassName": ClassName,
        "ClassPricing": ClassPricing,
        "ClassDes": ClassDescription
    }
    // ajax method to call the method
    $.ajax({

        url: `${backEndUrl}/class/` + classId,
        type: 'PUT',
        //data extractex
        data: JSON.stringify(data2),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            //set and call confirmation message
            msg = "Successfully updated!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
            //refresh
            $('#classServiceTableBody').html('')
            loadAllClassOfServices()

        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Please ensure that your values are accurate"
            }
            else if (xhr.status == 400) {
                errMsg = " Invalid input "
            }
            else if (xhr.status == 406) {
                errMsg = " Invalid input"
            }
            else {
                errMsg = "There is some other issues here "
            }
            $('#classServiceTableBody').html('')
            loadAllClassOfServices()
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);

        }
    });







}

//createTable method is to create the table rows
function createTable(cardInfo) {
    console.log(cardInfo);
    // card html with values to extract when displaying
    var card = `
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


    //returning card
    return card;
}

//createExtraServicesTable method is to create the table rows
function createExtraServicesTable(cardInfo) {
    console.log(cardInfo);
    // card html with values to extract when displaying
    var card = `
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
    //returning card
    return card;
}

//createRateTable method is to create the table rows
function createRateTable(cardInfo) {
    console.log(cardInfo);
    // card html with values to extract when displaying
    var card = `
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
    //returning card
    return card;
}

//loadAllClassOfServices gets all class of services
function loadAllClassOfServices() {
    $.ajax({
        url: `${backEndUrl}/classes`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)

            for (var i = 0; i < data.length; i++) {
                //assigning variable for classOfService
                var classOfService = data[i];
                //extracting information
                var RowInfo = {
                    "classId": classOfService.ClassID,
                    "className": classOfService.ClassName,
                    "classPricing": classOfService.ClassPricing,
                    "classDes": classOfService.ClassDes,
                }
                console.log("---------Card INfo data pack------------")
                console.log(RowInfo);
                //calling createTable to display values row by row
                var newRow = createTable(RowInfo);
                //appeding row to classTable
                $('#classServiceTableBody').append(newRow);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });





}

//loadAClassOfService gets a class of services        
function loadAClassOfService(id) {
    // gets a class of service based on id
    $.ajax({
        url: `${backEndUrl}/classes/` + id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            //if the code works
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)
            //extract data information
            var RowInfo = {
                "classId": data[0].ClassID,
                "className": data[0].ClassName,
                "classPricing": data[0].ClassPricing,
                "classDescription": data[0].ClassDes
            }
            console.log("---------Card INfo data pack------------")
            console.log(RowInfo);
            console.log("---------------------")
            //updating extracted values to update pop up
            $('#class-id-update').val(RowInfo.classId);
            $('#class-name-update').val(RowInfo.className);
            $('#class-pricing-update').val(RowInfo.classPricing);
            $('#class-description-update').val(RowInfo.classDescription);
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            errMsg = " "
            if (xhr.status == 201) {
                errMsg = "The id doesn't exist "
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });





}

//addClassOfService to add new class of service
function addClassOfService() {
    //extract values for add pop-up
    var name = $('#class_name_add').val();
    var classPricing = $('#class_pricing_add').val();
    var classDescription = $('#class_description__add').val();
    //setting empty string to the fields after adding
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")
    $('#class_description__add').val("")
    //store all extracted info into requestBody
    const requestBody = {
        ClassName: name,
        ClassPricing: classPricing,
        ClassDes: classDescription
    }
    console.log("request body: " + requestBody)
    //stringify reqBody
    const reqBody = JSON.stringify(requestBody)
    console.log(reqBody)
    // call the method to post data
    $.ajax({
        url: `${backEndUrl}/class`,
        type: 'POST',
        data: reqBody,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const post = data;
            //set and call confirmation message
            $('#classServiceTableBody').html('')
            loadAllClassOfServices()
            msg = "Successfully added!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
           
         
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }
            else if (xhr.status == 400) {
                errMsg = " Input not accepted"
            }
            else if (xhr.status == 406) {
                errMsg = " Input not accepted"
            }
            else {
                errMsg = "There is some other issues here"
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
            $('#classServiceTableBody').html('')
            loadAllClassOfServices()
        }
    });




}

//loadAllExtraServices gets all extra services
function loadAllExtraServices() {
    $.ajax({
        url: `${backEndUrl}/extraServices`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)

            for (var i = 0; i < data.length; i++) {
                //assigning variable for extraServices
                var extraServices = data[i];
                //extracting information
                var RowInfo = {
                    "extraServiceId": extraServices.ExtraServiceID,
                    "extraServiceName": extraServices.ExtraServiceName,
                    "extraServicePrice": extraServices.ExtraServicePrice
                }
                console.log("---------Card INfo data pack------------")
                console.log(RowInfo);
                //calling createExtraServicesTable to display values row by row
                var newRow = createExtraServicesTable(RowInfo);
                //appeding row to extraServicesTable
                $('#extraServiceTableBody').append(newRow);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });
}

//loadAnExtraService gets an extra service     
function loadAnExtraService(id) {
    // gets a class of service based on id
    $.ajax({
        url: `${backEndUrl}/extraServices/`+ id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            //if the code works
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)
            //extract data information
            var RowInfo = {
                "extraServiceId": data[0].ExtraServiceID,
                "extraServiceName": data[0].ExtraServiceName,
                "extraServicePrice": data[0].ExtraServicePrice
            }
            console.log("---------Card INfo data pack------------")
            console.log(RowInfo);
            console.log("---------------------")
            //updating extracted values to update pop up
            $('#extra-service-id-update').val(RowInfo.extraServiceId);
            $('#extra-service-name-update').val(RowInfo.extraServiceName);
            $('#extra-service-pricing-update').val(RowInfo.extraServicePrice);
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            errMsg = " "
            if (xhr.status == 201) {
                errMsg = "The id doesn't exist "
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });
}

//addExtraService to add new extra service
function addExtraService() {
    //extract values for add pop-up
    var extraServiceName = $('#extra_service_add').val();
    var extraServicePrice = $('#extra_service_pricing_add').val();

    //setting empty string to the fields after adding
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")
    $('#class_description__add').val("")

    //store all extracted info into requestBody
    const requestBody = {
        ExtraServiceName: extraServiceName,
        ExtraServicePrice: extraServicePrice
    }
    console.log("request body: " + requestBody)
    //stringify reqBody
    const reqBody = JSON.stringify(requestBody)
    console.log(reqBody)
    // call the method to post data
    $.ajax({
        url: `${backEndUrl}/extraService`,
        type: 'POST',
        data: reqBody,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            //set and call confirmation message
            msg = "Successfully added!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
            const post = data;
            $('#extraServiceTableBody').html('')
            loadAllExtraServices()
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }
            else if (xhr.status == 400) {
                errMsg = " Input not accepted"
            }
            else if (xhr.status == 406) {
                errMsg = " Input not accepted"
            }
            else {
                errMsg = "There is some other issues here"
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
            $('#extraServiceTableBody').html('')
        }
    });
}

//updateExtraService to update existing extra service
function updateExtraService() {
    //extract values from pop-up
    var extraServiceId = $('#extra-service-id-update').val();
    var extraServiceName = $('#extra-service-name-update').val();
    var extraServicePrice = $('#extra-service-pricing-update').val();

    //set value to empty after getting value
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")

    //put all data inserted into data2 so that it can be used to parse as json data in the api
    var data2 = {
        "ExtraServiceName": extraServiceName,
        "ExtraServicePrice": extraServicePrice
    }
    // ajax method to call the method
    $.ajax({
            url: `${backEndUrl}/extraService/` + extraServiceId,
            type: 'PUT',
            //data extracted
            data: JSON.stringify(data2),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
            //set and call confirmation message
            msg = "Successfully updated!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
            //refresh
            $('#extraServiceTableBody').html('')
            loadAllExtraServices()
         
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
                if (xhr.status == 500) {
                console.log("error")
                errMsg = "Please ensure that your values are accurate"
            }
            else if (xhr.status == 400) {
                errMsg = " Invalid input "
            }
            else if (xhr.status == 406) {
                errMsg = " Invalid input"
            }
            else {
                errMsg = "There is some other issues here "
            }
            $('#extraServiceTableBody').html('')
            //loadAllClassOfServices()
            //loadAllExtraServices()
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });
}

//deleteExtraService to delete existing extra service
function deleteExtraService(id) {

    // call the web service endpoint for deleting class of service by id
    $.ajax({

        url: `${backEndUrl}/extraService/${id}`,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        // if data inserted
        success: function (data, textStatus, xhr) {

            //if id in the params not valid show error
            if (xhr.status == 404) {
                //set and call error message
                errMsg = "Not valid id"
                var errMsg = ""
                $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
                //to refresh
                $('#extraServiceTableBody').html('')
            }
            //if the params id is valid and 
            else if (xhr.status == 200) {
                //set and call confirmation message
                msg = "Successfully deleted!"

                $('#confirmationMsg').html(confirmToast(msg + " " + xhr.status)).fadeOut(2500);
                 //to refresh
                $('#extraServiceTableBody').html('')
                loadAllExtraServices()
            }
        },
        error: function (xhr, textStatus, errorThrown) {

            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }

            else {

                errMsg = "There is some other issues here"

            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });
}

//loadAllRates gets all rates
function loadAllRates() {
    $.ajax({
        url: `${backEndUrl}/rates`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)

            for (var i = 0; i < data.length; i++) {
                //assigning variable for extraServices
                var rates = data[i];
                //extracting information
                var RowInfo = {
                    "ratesId": rates.RatesID,
                    "rateName": rates.RateName,
                    "ratePrice": rates.RatePrice,
                    "package": rates.PackageName
                }
                console.log("---------Card INfo data pack------------")
                console.log(RowInfo);
                //calling createRateTable to display values row by row
                var newRow = createRateTable(RowInfo);
                //appeding row to ratesTable
                $('#rateTableBody').append(newRow);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //print error
            console.log('Error in Operation');
        }
    });
}

 //loadARate gets a rate
 function loadARate(id) {
    // gets a class of service based on id
    $.ajax({
        url: `${backEndUrl}/rates/` + id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, xhr) {
            //if the code works
            console.log("-------response data------")
            console.log(data)
            console.log("LENGTH OF DATA:" + data.length)
            //extract data information
            var RowInfo = {
                "ratesId": data[0].RatesID,
                "rateName": data[0].RateName,
                "ratePrice": data[0].RatePrice,
                "package": data[0].Package
            }
            console.log("---------Card INfo data pack------------")
            console.log(RowInfo);
            console.log("---------------------")
            //updating extracted values to update pop up
            $('#rate-id-update').val(RowInfo.ratesId);
            $('#rate-name-update').val(RowInfo.rateName);
            $('#rate-pricing-update').val(RowInfo.ratePrice);
            $('#package-update').val(RowInfo.package);
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            errMsg = " "
            if (xhr.status == 201) {
                errMsg = "The id doesn't exist "
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });
}

//addRate to add new rate
function addRate() {
    //extract values for add pop-up
    var rateName = $('#rate_add').val();
    var ratePrice = $('#rate_pricing_add').val();
    var package = $('#package_add').val();

    //setting empty string to the fields after adding
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")
    $('#class_description__add').val("")

    //store all extracted info into requestBody
    const requestBody = {
        RateName: rateName,
        RatePrice: ratePrice,
        Package: package
    }
    console.log("request body: " + requestBody)
    //stringify reqBody
    const reqBody = JSON.stringify(requestBody)
    console.log(reqBody)
    // call the method to post data
    $.ajax({
        url: `${backEndUrl}/rate`,
        type: 'POST',
        data: reqBody,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $('#rateTableBody').html('')
            loadAllRates()
            //set and call confirmation message

            msg = "Successfully added!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
            const post = data;
         
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }
            else if (xhr.status == 400) {
                errMsg = " Input not accepted"
            }
            else if (xhr.status == 406) {
                errMsg = " Input not accepted"
            }
            else {
                errMsg = "There is some other issues here"
            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
            $('#rateTableBody').html('')
        }
    });
}

//updateRate to update existing rate
function updateRate() {
    //extract values from pop-up
    var rateId = $('#rate-id-update').val();
    var rateName = $('#rate-name-update').val();
    var ratePrice = $('#rate-pricing-update').val();
    var package = $('#package-update').val();

    //set value to empty after getting value
    $('#class_name_add').val("")
    $('#class_pricing_add').val("")

    //put all data inserted into data2 so that it can be used to parse as json data in the api
    var data2 = {
        "RateName": rateName,
        "RatePrice": ratePrice,
        "Package": package,
    }
    // ajax method to call the method
    $.ajax({
            url: `${backEndUrl}/rate/` + rateId,
            type: 'PUT',
            //data extracted
            data: JSON.stringify(data2),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
            //set and call confirmation message
            msg = "Successfully updated!"
            $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
            //refresh
            $('#rateTableBody').html('')
            loadAllRates()
            //loadAllClassOfServices()
            //loadAllExtraServices()
        },
        error: function (xhr, textStatus, errorThrown) {
            //set and call error message
            var errMsg = ""
                if (xhr.status == 500) {
                console.log("error")
                errMsg = "Please ensure that your values are accurate"
            }
            else if (xhr.status == 400) {
                errMsg = " Invalid input "
            }
            else if (xhr.status == 406) {
                errMsg = " Invalid input"
            }
            else {
                errMsg = "There is some other issues here "
            }
            $('#rateTableBody').html('')
            //loadAllClassOfServices()
            //loadAllExtraServices()
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        }
    });
}

//deleteRate to delete existing rate
function deleteRate(id) {

    // call the web service endpoint for deleting class of service by id
    $.ajax({

        url: `${backEndUrl}/rate/${id}`,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        // if data inserted
        success: function (data, textStatus, xhr) {

            //if id in the params not valid show error
            if (xhr.status == 404) {
                //set and call error message
                errMsg = "Not valid id"
                var errMsg = ""
                $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
                //to refresh
                $('#rateTableBody').html('')
              
            }
            //if the params id is valid and 
            else if (xhr.status == 200) {
                //set and call confirmation message
                msg = "Successfully deleted!"

                $('#confirmationMsg').html(confirmToast(msg + " " + xhr.status)).fadeOut(2500);
                 //to refresh
                  //to refresh
                $('#rateTableBody').html('')
                loadAllRates()
               
            }
        },
        error: function (xhr, textStatus, errorThrown) {

            //set and call error message
            var errMsg = ""
            if (xhr.status == 500) {
                console.log("error")
                errMsg = "Server Issues"
            }

            else {

                errMsg = "There is some other issues here"

            }
            $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
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
    loadAllClassOfServices();
    loadAllExtraServices()
    loadAllRates()
});