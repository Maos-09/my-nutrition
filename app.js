
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


// ==================================================
// FOOD DIARY - STORAGE AND DAILY TARGETS
// ==================================================

// Daily nutrition targets
const dailyCalorieTarget = 1500;
const dailyProteinTarget = 110;
const dailyCarbsTarget = 141;
const dailyFatTarget = 55;
const dailyFibreTarget = 25;


// ==================================================
// FOOD ENTRY STORAGE
// ==================================================

// Load saved food entries
let foodEntries = [];

try {
    foodEntries = JSON.parse(
        localStorage.getItem("myNutritionEntries")
    ) || [];
} catch (error) {
    foodEntries = [];
}


// ==================================================
// GET TODAY'S DATE
// ==================================================

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==================================================
// SAVE FOOD ENTRIES
// ==================================================

function saveFoodEntries() {

    localStorage.setItem(
        "myNutritionEntries",
        JSON.stringify(foodEntries)
    );

}


// ==================================================
// CALCULATE TODAY'S NUTRITION
// ==================================================

function calculateDailyNutrition() {

    const today = getTodayDate();

    const todaysEntries = foodEntries.filter(entry =>
        entry.date === today
    );

    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fibre: 0
    };

    todaysEntries.forEach(entry => {

        totals.calories += Number(entry.calories) || 0;
        totals.protein += Number(entry.protein) || 0;
        totals.carbs += Number(entry.carbs) || 0;
        totals.fat += Number(entry.fat) || 0;
        totals.fibre += Number(entry.fibre) || 0;

    });

    return {
        entries: todaysEntries,
        totals: totals
    };

}


// ==================================================
// UPDATE HOME DASHBOARD
// ==================================================

function updateNutritionDashboard() {

    const dailyData = calculateDailyNutrition();
    const totals = dailyData.totals;

    const remainingCalories = Math.max(
        0,
        dailyCalorieTarget - totals.calories
    );

    const caloriePercentage = Math.min(
        100,
        (totals.calories / dailyCalorieTarget) * 100
    );


    // CALORIES

    document.getElementById("caloriesRemaining").textContent =
        Math.round(remainingCalories);

    document.getElementById("caloriesConsumed").textContent =
        Math.round(totals.calories);

    document.getElementById("calorieTarget").textContent =
        dailyCalorieTarget;


    // PROTEIN

    document.getElementById("proteinAmount").textContent =
        `${totals.protein.toFixed(1)} / ${dailyProteinTarget} g`;

    document.getElementById("proteinProgress").style.width =
        Math.min(100, totals.protein / dailyProteinTarget * 100) + "%";


    // CARBOHYDRATES

    document.getElementById("carbsAmount").textContent =
        `${totals.carbs.toFixed(1)} / ${dailyCarbsTarget} g`;

    document.getElementById("carbsProgress").style.width =
        Math.min(100, totals.carbs / dailyCarbsTarget * 100) + "%";


    // FAT

    document.getElementById("fatAmount").textContent =
        `${totals.fat.toFixed(1)} / ${dailyFatTarget} g`;

    document.getElementById("fatProgress").style.width =
        Math.min(100, totals.fat / dailyFatTarget * 100) + "%";


    // FIBRE

    document.getElementById("fibreAmount").textContent =
        `${totals.fibre.toFixed(1)} / ${dailyFibreTarget} g`;

    document.getElementById("fibreProgress").style.width =
        Math.min(100, totals.fibre / dailyFibreTarget * 100) + "%";


    // CALORIE PROGRESS CIRCLE

    document.querySelector(".calorie-ring").style.background =
        `conic-gradient(
            var(--success) ${caloriePercentage * 3.6}deg,
            var(--surface) ${caloriePercentage * 3.6}deg 360deg
        )`;


    // TODAY'S FOOD SUMMARY

    const foodSummary = document.getElementById("todayFoodSummary");

    if (dailyData.entries.length === 0) {

        foodSummary.textContent =
            "No food entries yet. Start by logging your first meal!";

    } else {

        foodSummary.textContent =
            `${dailyData.entries.length} food entries logged today.`;

    }

}


// ==================================================
// INITIALISE NUTRITION DASHBOARD
// ==================================================

updateNutritionDashboard();
