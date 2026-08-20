// ================================
// MOBILE NAVIGATION
// ================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuToggle.textContent = "✕";
    } else {
        menuToggle.textContent = "☰";
    }
});


// Close mobile menu after clicking a link

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});


// ================================
// CURRENT YEAR
// ================================

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#dc2626";
        return;
    }

    formMessage.textContent =
        "Thank you, " + name + "! Your message has been received.";

    formMessage.style.color = "#16a34a";

    contactForm.reset();
});


// ================================
// ACTIVE NAVIGATION ON SCROLL
// ================================

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {

    const scrollPosition = window.scrollY + 150;

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            navigationLinks.forEach(function (link) {
                link.classList.remove("active-link");
            });

            const activeLink = document.querySelector(
                '.nav-links a[href="#' + sectionId + '"]'
            );

            if (activeLink) {
                activeLink.classList.add("active-link");
            }
        }
    });
});