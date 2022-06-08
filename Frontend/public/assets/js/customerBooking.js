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
function updatedService(){
    var time = document.getElementById("").value;
    document.getElementById("listService").innerHTML = time;
}
function updatePackage(){
    var time = document.getElementById("").value;
    document.getElementById("listPackage").innerHTML = time;
}
function updatedRooms(){
    var roomss = document.getElementById("rooms").value;
    document.getElementById("listRooms").innerHTML = roomss;
}
function updatedBathrooms(){
    var bathroomss = document.getElementById("bathRooms").value;
    document.getElementById("listBathrooms").innerHTML = bathroomss;
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
    updatedService();
    updatePackage();
   ;
});