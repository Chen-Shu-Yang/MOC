function incrementR() {
    document.getElementById('rooms').stepUp();

}
function decrementR() {
    document.getElementById('rooms').stepDown();

}
function incrementBR() {

    document.getElementById('bathRooms').stepUp();
}
function decrementBR() {

    document.getElementById('bathRooms').stepDown();
}
function updatedService(){
    var time = document.getElementById("").value;
    document.getElementById("listService").innerHTML = time;
}
function updatePackage(){
    var time = document.getElementById("").value;
    document.getElementById("listPackage").innerHTML = time;
}
function updatedRooms(){
    var time = document.getElementById("rooms").value;
    document.getElementById("listRooms").innerHTML = time;
}
function updatedBathrooms(){
    var time = document.getElementById("bathRooms").value;
    document.getElementById("listBathrooms").innerHTML = time;
}
function updatedRates(){
    var time = document.getElementById("").value;
    document.getElementById("listRates").innerHTML = time;
}
function updatedAddServices(){
    var time = document.getElementById("").value;
    document.getElementById("listAddService").innerHTML = time;
}
function updatedDate(){
    var time = document.getElementById("").value;
    document.getElementById("listDate").innerHTML = time;
}
function updatedDay(){
    var time = document.getElementById("").value;
    document.getElementById("listDay").innerHTML = time;
}
function updatedTime(){
    var time = document.getElementById("timeOfService").value;
    document.getElementById("listTime").innerHTML = time;
}
$(document).ready(() => {
    incrementR();
    decrementR();
    incrementBR();
    decrementBR();
    updatedTime()
    updatedDay();
    updatedDate();
    updatedAddServices();
    updatedRates();
    updatedBathrooms();
    updatedService();
    updatePackage();
    updatedRooms();
});