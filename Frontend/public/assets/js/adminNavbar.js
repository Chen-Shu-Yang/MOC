const sidebar = document.querySelector('.sidebar');
const sidebarBtn = document.querySelector('.sidebarBtn');
sidebarBtn.onclick = function () {
  sidebar.classList.toggle('active');
};
$(document).ready(() => {
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign('/login');
  });
});
