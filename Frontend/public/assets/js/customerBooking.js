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
$(document).ready(() => {
    incrementR();
    decrementR();
    incrementBR();
    decrementBR();
});