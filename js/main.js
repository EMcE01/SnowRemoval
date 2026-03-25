// This file contains the JavaScript code for general functionality across the website, such as handling navigation and any common interactive elements.

document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Add active class to the clicked link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Example of a common interactive element: a back-to-top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});