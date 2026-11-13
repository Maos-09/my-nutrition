
// ==================================================
// MY NUTRITION - APP NAVIGATION
// ==================================================

// Get all navigation buttons
const homeButton = document.getElementById("homeButton");
const diaryButton = document.getElementById("diaryButton");
const foodsButton = document.getElementById("foodsButton");
const progressButton = document.getElementById("progressButton");
const goalsButton = document.getElementById("goalsButton");


// ==================================================
// NAVIGATION FUNCTION
// ==================================================

function showSection(sectionId) {

    const sections = document.querySelectorAll("main section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";
}


// ==================================================
// NAVIGATION BUTTONS
// ==================================================

homeButton.addEventListener("click", () => {
    showSection("homeSection");
});

diaryButton.addEventListener("click", () => {
    showSection("diarySection");
});

foodsButton.addEventListener("click", () => {
    showSection("foodsSection");
});

progressButton.addEventListener("click", () => {
    showSection("progressSection");
});

goalsButton.addEventListener("click", () => {
    showSection("goalsSection");
});


// ==================================================
// INITIAL APP VIEW
// ==================================================

showSection("homeSection");
