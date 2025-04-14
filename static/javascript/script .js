document.addEventListener('DOMContentLoaded', function() {  
    const menuToggle = document.querySelector('.menu-toggle');  
    const nav = document.querySelector('nav');  
   
    menuToggle.addEventListener('click', function() {  
       nav.classList.toggle('show');  
    });  
});
// Function to toggle the dropdown
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    // Check if the clicked target is not the dropdown button
    if (!event.target.matches('.dropbtn img')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        // If the dropdown is open, close it
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  
// Populate student info dynamically (can be fetched from API or backend in a real-world app)
