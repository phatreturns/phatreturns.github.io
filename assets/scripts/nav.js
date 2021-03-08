// custom js to change navbar to dark on scroll
window.onscroll = function() {myFunction()};

var header = document.getElementById("nav");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("bg-dark");
  } else {
    header.classList.remove("bg-dark");
  }
}