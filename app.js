
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


// ==================================================
// FOOD DIARY - ADD FOOD ENTRIES
// ==================================================

const foodEntryForm = document.getElementById("foodEntryForm");


// ==================================================
// DISPLAY FOOD ENTRIES
// ==================================================

function displayFoodEntries() {

    const container = document.getElementById("foodEntriesContainer");

    const dailyData = calculateDailyNutrition();

    container.innerHTML = "";

    if (dailyData.entries.length === 0) {

        container.innerHTML = "<p>No food entries yet.</p>";
        return;

    }

    const mealTypes = [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack"
    ];

    mealTypes.forEach(meal => {

        const mealEntries = dailyData.entries.filter(entry =>
            entry.meal === meal
        );

        if (mealEntries.length === 0) return;

        const mealSection = document.createElement("div");
        mealSection.className = "meal-section";

        const mealHeading = document.createElement("h4");
        mealHeading.textContent = meal;

        mealSection.appendChild(mealHeading);

        mealEntries.forEach(entry => {

            const foodItem = document.createElement("div");
            foodItem.className = "food-entry";

            const foodDetails = document.createElement("div");

            const foodName = document.createElement("strong");
            foodName.textContent = entry.name;

            const foodServing = document.createElement("p");
            foodServing.textContent =
                `${entry.serving} · ${entry.calories} kcal`;

            foodDetails.appendChild(foodName);
            foodDetails.appendChild(foodServing);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {

                foodEntries = foodEntries.filter(item =>
                    item.id !== entry.id
                );

                saveFoodEntries();
                displayFoodEntries();
                updateNutritionDashboard();

            });

            foodItem.appendChild(foodDetails);
            foodItem.appendChild(deleteButton);

            mealSection.appendChild(foodItem);

        });

        container.appendChild(mealSection);

    });

}


// ==================================================
// HANDLE FOOD FORM SUBMISSION
// ==================================================

foodEntryForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newEntry = {

        id: Date.now() + Math.random(),

        date: getTodayDate(),

        name: document.getElementById("foodName").value.trim(),

        meal: document.getElementById("mealType").value,

        serving: document.getElementById("foodServing").value.trim(),

        calories: Number(document.getElementById("foodCalories").value),

        protein: Number(document.getElementById("foodProtein").value),

        carbs: Number(document.getElementById("foodCarbs").value),

        fat: Number(document.getElementById("foodFat").value),

        fibre: Number(document.getElementById("foodFibre").value)

    };


    // SAVE FOOD ENTRY

    foodEntries.push(newEntry);

    saveFoodEntries();


    // CLEAR FORM

    foodEntryForm.reset();


    // REFRESH APP

    displayFoodEntries();

    updateNutritionDashboard();

});


// ==================================================
// INITIALISE FOOD DIARY
// ==================================================

displayFoodEntries();

// ==================================================
// MY FOODS - FOOD DATABASE SEARCH
// ==================================================

const foodSearchButton = document.getElementById("foodSearchButton");

const foodSearchInput = document.getElementById("foodSearchInput");

const foodSearchResults = document.getElementById("foodSearchResults");

foodSearchButton.addEventListener("click", searchFoodDatabase);

async function searchFoodDatabase() {

    const searchTerm = foodSearchInput.value.trim();

    if (searchTerm === "") {
        alert("Please enter a food to search for.");
        return;
    }

    foodSearchResults.innerHTML = "<p>Searching for foods...</p>";

    try {

        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=10`
        );

        if (!response.ok) {
            throw new Error("Unable to contact food database.");
        }

        const data = await response.json();

        displayFoodSearchResults(data.products || []);

    } catch (error) {

        foodSearchResults.innerHTML =
            "<p>Sorry, we couldn't connect to the food database. Please try again.</p>";

    }
}

// ==================================================
// MY FOODS - DISPLAY SEARCH RESULTS
// ==================================================

function displayFoodSearchResults(products) {

    foodSearchResults.innerHTML = "";

    if (products.length === 0) {
        foodSearchResults.innerHTML =
            "<p>No matching foods found. Try another search.</p>";
        return;
    }

    products.forEach(product => {

        const nutrition = product.nutriments || {};

        const foodName = product.product_name || "Unnamed food";

        const brand = product.brands || "Unknown brand";

        const calories = nutrition["energy-kcal_100g"] || 0;
        const protein = nutrition.proteins_100g || 0;
        const carbs = nutrition.carbohydrates_100g || 0;
        const fat = nutrition.fat_100g || 0;
        const fibre = nutrition.fiber_100g || 0;

        const foodCard = document.createElement("div");
        foodCard.className = "nutrition-card food-search-card";

        const nameHeading = document.createElement("h4");
        nameHeading.textContent = foodName;

        const brandText = document.createElement("p");
        brandText.textContent = brand;

        const nutritionText = document.createElement("p");
        nutritionText.textContent =
            `${calories} kcal | Protein: ${protein} g | Carbs: ${carbs} g | Fat: ${fat} g | Fibre: ${fibre} g`;

        const servingText = document.createElement("p");
        servingText.textContent = "Nutrition values per 100 g";

        foodCard.appendChild(nameHeading);
        foodCard.appendChild(brandText);
        foodCard.appendChild(nutritionText);
        foodCard.appendChild(servingText);

        foodSearchResults.appendChild(foodCard);

    });

}
