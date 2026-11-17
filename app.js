
// ==================================================
// MY NUTRITION - APP NAVIGATION
// ==================================================

// Get all navigation buttons
const homeButton = document.getElementById("homeButton");
const diaryButton = document.getElementById("diaryButton");
const foodsButton = document.getElementById("foodsButton");
const goalsButton = document.getElementById("goalsButton");
const progressButton = document.getElementById("progressButton");

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

goalsButton.addEventListener("click", () => {
    showSection("goalsSection");
});

progressButton.addEventListener("click", () => {

    showSection("progressSection");

    updateProgressDashboard();
    updateOverallProgress();
    updateCalorieProgressChart();
    updateOverallPeriodLabel();

});

// ==================================================
// INITIAL APP VIEW
// ==================================================

showSection("homeSection");


// ==================================================
// DAILY NUTRITION TARGETS
// ==================================================

// Load saved nutrition targets
function loadNutritionTarget(key, defaultValue) {

    const savedTarget = Number(localStorage.getItem(key));

    if (Number.isFinite(savedTarget) && savedTarget > 0) {
        return savedTarget;
    }

    return defaultValue;
}

// Current daily nutrition targets
let dailyCalorieTarget = loadNutritionTarget("myNutritionCalorieTarget", 1500);
let dailyProteinTarget = loadNutritionTarget("myNutritionProteinTarget", 110);
let dailyCarbsTarget = loadNutritionTarget("myNutritionCarbsTarget", 141);
let dailyFatTarget = loadNutritionTarget("myNutritionFatTarget", 55);
let dailyFibreTarget = loadNutritionTarget("myNutritionFibreTarget", 25);

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
// FOOD DIARY - SELECTED DATE
// ==================================================

const diaryDate = document.getElementById("diaryDate");

// Set date picker to today
diaryDate.value = getTodayDate();

// PREVIOUS AND NEXT DAY BUTTONS
const previousDateButton = document.getElementById("previousDateButton");
const nextDateButton = document.getElementById("nextDateButton");

// ==================================================
// PROGRESS - SELECTED DATE
// ==================================================

const progressDate = document.getElementById("progressDate");

// Overall Progress has its own selected date
let overallPeriodDate = getTodayDate();

const previousProgressDateButton = document.getElementById("previousProgressDateButton");
const nextProgressDateButton = document.getElementById("nextProgressDateButton");

// Set Progress date to today
progressDate.value = getTodayDate();


// CHANGE PROGRESS DATE
function changeProgressDate(days) {

    const [year, month, day] = progressDate.value.split("-").map(Number);

    const selectedDate = new Date(year, month - 1, day);

    selectedDate.setDate(selectedDate.getDate() + days);

    const newYear = selectedDate.getFullYear();
    const newMonth = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const newDay = String(selectedDate.getDate()).padStart(2, "0");

    progressDate.value = `${newYear}-${newMonth}-${newDay}`;

    updateProgressDashboard();
    updateOverallProgress();
    updateCalorieProgressChart();

}


// PREVIOUS DAY BUTTON
previousProgressDateButton.addEventListener("click", () => {
    changeProgressDate(-1);
});


// NEXT DAY BUTTON
nextProgressDateButton.addEventListener("click", () => {
    changeProgressDate(1);
});


// CALENDAR DATE CHANGE
progressDate.addEventListener("change", () => {
    updateProgressDashboard();
    updateOverallProgress();
});

// UPDATE OVERALL PROGRESS WHEN PERIOD CHANGES

const progressPeriod = document.getElementById("progressPeriod");

// ==================================================
// OVERALL PROGRESS - PERIOD NAVIGATION
// ==================================================

const previousPeriodButton = document.getElementById("previousPeriodButton");
const nextPeriodButton = document.getElementById("nextPeriodButton");


previousPeriodButton.addEventListener("click", () => {
    changeOverallPeriod(-1);
});


nextPeriodButton.addEventListener("click", () => {
    changeOverallPeriod(1);
});


// UPDATE WHEN WEEK / MONTH / YEAR CHANGES

progressPeriod.addEventListener("change", () => {

    updateOverallProgress();
    updateCalorieProgressChart();
    updateOverallPeriodLabel();

});

// CHANGE DIARY DATE
function changeDiaryDate(days) {

    const [year, month, day] = diaryDate.value.split("-").map(Number);

    const selectedDate = new Date(year, month - 1, day);

    selectedDate.setDate(selectedDate.getDate() + days);

    const newYear = selectedDate.getFullYear();
    const newMonth = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const newDay = String(selectedDate.getDate()).padStart(2, "0");

    diaryDate.value = `${newYear}-${newMonth}-${newDay}`;

    displayFoodEntries();
}

// PREVIOUS DAY BUTTON
previousDateButton.addEventListener("click", () => {
    changeDiaryDate(-1);
});

// NEXT DAY BUTTON
nextDateButton.addEventListener("click", () => {
    changeDiaryDate(1);
});

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

function calculateDailyNutrition(date = getTodayDate()) {

    const todaysEntries = foodEntries.filter(entry =>
        entry.date === date
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

    const dailyData = calculateDailyNutrition(diaryDate.value);
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
// PROGRESS - UPDATE DAILY DASHBOARD
// ==================================================

function updateProgressDashboard() {

    const dailyData = calculateDailyNutrition(progressDate.value);
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

    document.getElementById("progressCaloriesRemaining").textContent =
        Math.round(remainingCalories);

    document.getElementById("progressCaloriesConsumed").textContent =
        Math.round(totals.calories);

    document.getElementById("progressCalorieTarget").textContent =
        dailyCalorieTarget;


    // PROTEIN

    document.getElementById("progressProteinAmount").textContent =
        `${totals.protein.toFixed(1)} / ${dailyProteinTarget} g`;

    document.getElementById("progressProteinBar").style.width =
        Math.min(100, totals.protein / dailyProteinTarget * 100) + "%";


    // CARBOHYDRATES

    document.getElementById("progressCarbsAmount").textContent =
        `${totals.carbs.toFixed(1)} / ${dailyCarbsTarget} g`;

    document.getElementById("progressCarbsBar").style.width =
        Math.min(100, totals.carbs / dailyCarbsTarget * 100) + "%";


    // FAT

    document.getElementById("progressFatAmount").textContent =
        `${totals.fat.toFixed(1)} / ${dailyFatTarget} g`;

    document.getElementById("progressFatBar").style.width =
        Math.min(100, totals.fat / dailyFatTarget * 100) + "%";


    // FIBRE

    document.getElementById("progressFibreAmount").textContent =
        `${totals.fibre.toFixed(1)} / ${dailyFibreTarget} g`;

    document.getElementById("progressFibreBar").style.width =
        Math.min(100, totals.fibre / dailyFibreTarget * 100) + "%";


    // CALORIE PROGRESS CIRCLE

    document.querySelector("#progressSection .calorie-ring").style.background =
        `conic-gradient(
            var(--success) ${caloriePercentage * 3.6}deg,
            var(--surface) ${caloriePercentage * 3.6}deg 360deg
        )`;


    // FOOD SUMMARY

    const foodSummary = document.getElementById("progressFoodSummary");

    if (dailyData.entries.length === 0) {

        foodSummary.textContent = "No food entries for this day.";

    } else {

        foodSummary.textContent = dailyData.entries
            .map(entry => `${entry.name} — ${Math.round(entry.calories)} kcal`)
            .join(" | ");

    }

}

// ==================================================
// PROGRESS - GET SELECTED DATE RANGE
// ==================================================

function getProgressDateRange() {

    const selectedDate = new Date(overallPeriodDate + "T00:00:00");

    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    const period = document.getElementById("progressPeriod").value;


    // WEEKLY RANGE (MONDAY - SUNDAY)

    if (period === "week") {

        const day = selectedDate.getDay();

        const difference = day === 0 ? -6 : 1 - day;

        startDate.setDate(selectedDate.getDate() + difference);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

    }


    // MONTHLY RANGE

    else if (period === "month") {

        startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );

        endDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0
        );

    }


    // YEARLY RANGE

    else if (period === "year") {

        startDate = new Date(selectedDate.getFullYear(), 0, 1);

        endDate = new Date(selectedDate.getFullYear(), 11, 31);

    }


    // FORMAT DATES AS YYYY-MM-DD

    function formatDate(date) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };

}


// ==================================================
// PROGRESS - CHANGE OVERALL PERIOD
// ==================================================

function changeOverallPeriod(direction) {

    const selectedDate = new Date(overallPeriodDate + "T00:00:00");

    const period = progressPeriod.value;


    // MOVE BACKWARD OR FORWARD ONE WEEK

    if (period === "week") {

        selectedDate.setDate(
            selectedDate.getDate() + (direction * 7)
        );

    }


    // MOVE BACKWARD OR FORWARD ONE MONTH

    else if (period === "month") {

        selectedDate.setDate(1);

        selectedDate.setMonth(
            selectedDate.getMonth() + direction
        );

    }


    // MOVE BACKWARD OR FORWARD ONE YEAR

    else if (period === "year") {

        selectedDate.setFullYear(
            selectedDate.getFullYear() + direction
        );

    }


    // SAVE THE NEW DATE

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    overallPeriodDate = `${year}-${month}-${day}`;


    // REFRESH OVERALL PROGRESS

    updateOverallProgress();
    updateCalorieProgressChart();
    updateOverallPeriodLabel();

}

// ==================================================
// PROGRESS - DISPLAY SELECTED PERIOD
// ==================================================

function updateOverallPeriodLabel() {

    const dateRange = getProgressDateRange();

    const startDate = new Date(dateRange.startDate + "T00:00:00");
    const endDate = new Date(dateRange.endDate + "T00:00:00");

    const period = progressPeriod.value;

    let label = "";


    // WEEKLY LABEL

    if (period === "week") {

        const start = startDate.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short"
        });

        const end = endDate.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        label = `${start} – ${end}`;

    }


    // MONTHLY LABEL

    else if (period === "month") {

        label = startDate.toLocaleDateString("en-NZ", {
            month: "long",
            year: "numeric"
        });

    }


    // YEARLY LABEL

    else if (period === "year") {

        label = startDate.getFullYear();

    }


    document.getElementById("overallPeriodLabel").textContent = label;

    // UPDATE NAVIGATION BUTTON LABELS

const periodName = period === "week"
    ? "Week"
    : period === "month"
        ? "Month"
        : "Year";

previousPeriodButton.textContent = `Previous ${periodName}`;
nextPeriodButton.textContent = `Next ${periodName}`;

}

// ==================================================
// PROGRESS - CALCULATE OVERALL STATISTICS
// ==================================================

function calculateOverallProgress() {

    const dateRange = getProgressDateRange();

    // GET FOOD ENTRIES WITHIN THE SELECTED DATE RANGE

    const periodEntries = foodEntries.filter(entry =>
        entry.date >= dateRange.startDate &&
        entry.date <= dateRange.endDate
    );


    // CALCULATE TOTAL CALORIES

    let totalCalories = 0;

    periodEntries.forEach(entry => {
        totalCalories += Number(entry.calories) || 0;
    });


    // FIND UNIQUE DAYS WITH FOOD LOGGED

    const daysLogged = new Set(
        periodEntries.map(entry => entry.date)
    );


    // CALCULATE AVERAGE DAILY CALORIES

    const averageCalories = daysLogged.size > 0
        ? totalCalories / daysLogged.size
        : 0;


    return {
        totalCalories: totalCalories,
        averageCalories: averageCalories,
        daysLogged: daysLogged.size
    };

}

// ==================================================
// PROGRESS - UPDATE OVERALL SUMMARY
// ==================================================

function updateOverallProgress() {

    const overallData = calculateOverallProgress();

    document.getElementById("averageDailyCalories").textContent =
        `${Math.round(overallData.averageCalories)} kcal`;

    document.getElementById("totalPeriodCalories").textContent =
        `${Math.round(overallData.totalCalories)} kcal`;

    document.getElementById("periodDaysLogged").textContent =
        overallData.daysLogged;

}

// ==================================================
// PROGRESS - CALORIE INTAKE CHART
// ==================================================

function updateCalorieProgressChart() {

    const dateRange = getProgressDateRange();
    const period = progressPeriod.value;

    const chartData = [];

    // GET ALL FOOD ENTRIES IN THE SELECTED PERIOD

    const periodEntries = foodEntries.filter(entry =>
        entry.date >= dateRange.startDate &&
        entry.date <= dateRange.endDate
    );


    // WEEKLY AND MONTHLY: SHOW DAILY CALORIES

    if (period === "week" || period === "month") {

        const start = new Date(dateRange.startDate + "T00:00:00");
        const end = new Date(dateRange.endDate + "T00:00:00");

        const currentDate = new Date(start);

        while (currentDate <= end) {

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");

            const dateString = `${year}-${month}-${day}`;

            const dailyCalories = periodEntries
                .filter(entry => entry.date === dateString)
                .reduce((total, entry) => total + (Number(entry.calories) || 0), 0);

            chartData.push({
                label: period === "week"
                    ? currentDate.toLocaleDateString("en-NZ", { weekday: "short" })
                    : day,
                calories: dailyCalories
            });

            currentDate.setDate(currentDate.getDate() + 1);

        }

    }


    // YEARLY: SHOW AVERAGE DAILY CALORIES FOR EACH MONTH

    if (period === "year") {

        const selectedYear = Number(overallPeriodDate.split("-")[0]);

        for (let month = 0; month < 12; month++) {

            const monthEntries = periodEntries.filter(entry => {
                const entryDate = new Date(entry.date + "T00:00:00");

                return entryDate.getFullYear() === selectedYear &&
                    entryDate.getMonth() === month;
            });

            const totalCalories = monthEntries.reduce(
                (total, entry) => total + (Number(entry.calories) || 0),
                0
            );

            const loggedDays = new Set(
                monthEntries.map(entry => entry.date)
            );

            const averageCalories = loggedDays.size > 0
                ? totalCalories / loggedDays.size
                : 0;

            chartData.push({
                label: new Date(selectedYear, month, 1)
                    .toLocaleDateString("en-NZ", { month: "short" }),
                calories: averageCalories
            });

        }

    }


    // FIND THE CHART SCALE

    const highestCalories = Math.max(
        dailyCalorieTarget,
        ...chartData.map(item => item.calories)
    );

    const chartMaximum = Math.ceil(highestCalories / 500) * 500;

    const targetPosition =
        100 - (dailyCalorieTarget / chartMaximum * 100);


    // BUILD THE CHART

    const chartContainer = document.getElementById("calorieProgressChart");

    chartContainer.innerHTML = `
        <div class="calorie-chart">

            <div class="calorie-chart-target"
                style="bottom: ${100 - targetPosition}%">

                <span>Goal: ${dailyCalorieTarget} kcal</span>

            </div>

            ${chartData.map(item => {

                const barHeight = item.calories > 0
                    ? (item.calories / chartMaximum) * 100
                    : 0;

                return `
                    <div class="calorie-chart-column">

                        <div class="calorie-chart-value">
                            ${Math.round(item.calories)}
                        </div>

                        <div class="calorie-chart-bar-area">

                            <div
                                class="calorie-chart-bar"
                                style="height: ${barHeight}%"
                                title="${Math.round(item.calories)} kcal">
                            </div>

                        </div>

                        <div class="calorie-chart-label">
                            ${item.label}
                        </div>

                    </div>
                `;

            }).join("")}

        </div>
    `;

}

// ==================================================
// INITIALISE NUTRITION DASHBOARD
// ==================================================

updateNutritionDashboard();

// ==================================================
// FOOD DIARY - ADD FOOD ENTRIES
// ==================================================

const foodEntryForm = document.getElementById("foodEntryForm");

// SAVE FOOD TO MY FOODS CHECKBOX
const saveFoodToMyFoods = document.getElementById("saveFoodToMyFoods");

// Goals form elements
const goalsForm = document.getElementById("goalsForm");

const calorieGoalInput = document.getElementById("calorieGoal");
const proteinGoalInput = document.getElementById("proteinGoal");
const carbsGoalInput = document.getElementById("carbsGoal");
const fatGoalInput = document.getElementById("fatGoal");
const fibreGoalInput = document.getElementById("fibreGoal");

const resetGoalsButton = document.getElementById("resetGoalsButton");

// Load current targets into the Goals form
calorieGoalInput.value = dailyCalorieTarget;
proteinGoalInput.value = dailyProteinTarget;
carbsGoalInput.value = dailyCarbsTarget;
fatGoalInput.value = dailyFatTarget;
fibreGoalInput.value = dailyFibreTarget;

// ==================================================
// SAVE NUTRITION GOALS
// ==================================================

goalsForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get the new target values
    const newCalorieTarget = Number(calorieGoalInput.value);
    const newProteinTarget = Number(proteinGoalInput.value);
    const newCarbsTarget = Number(carbsGoalInput.value);
    const newFatTarget = Number(fatGoalInput.value);
    const newFibreTarget = Number(fibreGoalInput.value);

    // Validate all targets
    const newTargets = [
        newCalorieTarget,
        newProteinTarget,
        newCarbsTarget,
        newFatTarget,
        newFibreTarget
    ];

    if (newTargets.some(target => !Number.isFinite(target) || target <= 0)) {
        alert("Please enter valid nutrition targets greater than zero.");
        return;
    }

    // Update current targets
    dailyCalorieTarget = newCalorieTarget;
    dailyProteinTarget = newProteinTarget;
    dailyCarbsTarget = newCarbsTarget;
    dailyFatTarget = newFatTarget;
    dailyFibreTarget = newFibreTarget;

    // Save targets to localStorage
    localStorage.setItem("myNutritionCalorieTarget", dailyCalorieTarget);
    localStorage.setItem("myNutritionProteinTarget", dailyProteinTarget);
    localStorage.setItem("myNutritionCarbsTarget", dailyCarbsTarget);
    localStorage.setItem("myNutritionFatTarget", dailyFatTarget);
    localStorage.setItem("myNutritionFibreTarget", dailyFibreTarget);

    // Refresh dashboards using the new targets
    updateNutritionDashboard();
    updateProgressDashboard();
    updateCalorieProgressChart();

    alert("Your nutrition goals have been saved!");

});

// ==================================================
// RESET NUTRITION GOALS
// ==================================================

resetGoalsButton.addEventListener("click", function() {

    // Restore default targets
    dailyCalorieTarget = 1500;
    dailyProteinTarget = 110;
    dailyCarbsTarget = 141;
    dailyFatTarget = 55;
    dailyFibreTarget = 25;

    // Update the input fields
    calorieGoalInput.value = dailyCalorieTarget;
    proteinGoalInput.value = dailyProteinTarget;
    carbsGoalInput.value = dailyCarbsTarget;
    fatGoalInput.value = dailyFatTarget;
    fibreGoalInput.value = dailyFibreTarget;

    // Save default targets
    localStorage.setItem("myNutritionCalorieTarget", dailyCalorieTarget);
    localStorage.setItem("myNutritionProteinTarget", dailyProteinTarget);
    localStorage.setItem("myNutritionCarbsTarget", dailyCarbsTarget);
    localStorage.setItem("myNutritionFatTarget", dailyFatTarget);
    localStorage.setItem("myNutritionFibreTarget", dailyFibreTarget);

    // Refresh dashboards
    updateNutritionDashboard();
    updateProgressDashboard();
    updateCalorieProgressChart();

    alert("Your nutrition goals have been reset to default!");

});

// ==================================================
// DISPLAY FOOD ENTRIES
// ==================================================

function displayFoodEntries() {

    const container = document.getElementById("foodEntriesContainer");

    const dailyData = calculateDailyNutrition(diaryDate.value);

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

            // EDIT FOOD ENTRY BUTTON
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";

            // INLINE FOOD ENTRY EDIT FORM
const editForm = document.createElement("div");
editForm.className = "food-edit-form";
editForm.style.display = "none";

// FOOD NAME
const editName = document.createElement("input");
editName.type = "text";
editName.value = entry.name;

// MEAL TYPE
const editMeal = document.createElement("select");

["Breakfast", "Lunch", "Dinner", "Snack"].forEach(meal => {

    const option = document.createElement("option");
    option.value = meal;
    option.textContent = meal;

    if (meal === entry.meal) {
        option.selected = true;
    }

    editMeal.appendChild(option);

});

// SERVING SIZE
const editServing = document.createElement("input");
editServing.type = "number";
editServing.min = "1";
editServing.step = "1";
editServing.value = parseFloat(entry.serving) || 100;

// NUTRITION VALUES
const editCalories = document.createElement("input");
editCalories.type = "number";
editCalories.min = "0";
editCalories.step = "0.1";
editCalories.value = entry.calories;

const editProtein = document.createElement("input");
editProtein.type = "number";
editProtein.min = "0";
editProtein.step = "0.1";
editProtein.value = entry.protein;

const editCarbs = document.createElement("input");
editCarbs.type = "number";
editCarbs.min = "0";
editCarbs.step = "0.1";
editCarbs.value = entry.carbs;

const editFat = document.createElement("input");
editFat.type = "number";
editFat.min = "0";
editFat.step = "0.1";
editFat.value = entry.fat;

const editFibre = document.createElement("input");
editFibre.type = "number";
editFibre.min = "0";
editFibre.step = "0.1";
editFibre.value = entry.fibre;

// EDIT FORM HEADING
const editHeading = document.createElement("h4");
editHeading.textContent = "Edit Food Entry";

// NUTRITION HEADING
const nutritionHeading = document.createElement("h4");
nutritionHeading.textContent = "Nutrition Information";

// ADD LABELS AND FIELDS TO EDIT FORM

editForm.appendChild(editHeading);

function addEditField(labelText, inputElement) {

    const label = document.createElement("label");
    label.textContent = labelText;

    editForm.appendChild(label);
    editForm.appendChild(inputElement);

}

addEditField("Food Name", editName);
addEditField("Meal", editMeal);
addEditField("Serving Size (g)", editServing);

editForm.appendChild(nutritionHeading);

addEditField("Calories (kcal)", editCalories);
addEditField("Protein (g)", editProtein);
addEditField("Carbohydrates (g)", editCarbs);
addEditField("Fat (g)", editFat);
addEditField("Fibre (g)", editFibre);

// SAVE FOOD TO MY FOODS CHECKBOX
const saveEditedFoodCheckbox = document.createElement("input");
saveEditedFoodCheckbox.type = "checkbox";

const saveEditedFoodLabel = document.createElement("label");
saveEditedFoodLabel.textContent = "Save this food to My Foods";

saveEditedFoodLabel.prepend(saveEditedFoodCheckbox);

editForm.appendChild(saveEditedFoodLabel);

// SAVE CHANGES BUTTON
const saveButton = document.createElement("button");
saveButton.textContent = "Save Changes";
saveButton.type = "button";

// CANCEL BUTTON
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.type = "button";

editForm.appendChild(saveButton);
editForm.appendChild(cancelButton);

// OPEN FOOD ENTRY EDIT FORM
editButton.addEventListener("click", () => {
    editForm.style.display = "grid";
});

// CANCEL EDITING
cancelButton.addEventListener("click", () => {
    editForm.style.display = "none";
});

// SAVE EDITED FOOD ENTRY
saveButton.addEventListener("click", () => {

    if (!editName.value.trim()) {
        alert("Please enter a food name.");
        return;
    }

    entry.name = editName.value.trim();
    entry.meal = editMeal.value;
    entry.serving = `${editServing.value} g`;
    entry.calories = Number(editCalories.value) || 0;
    entry.protein = Number(editProtein.value) || 0;
    entry.carbs = Number(editCarbs.value) || 0;
    entry.fat = Number(editFat.value) || 0;
    entry.fibre = Number(editFibre.value) || 0;

    // SAVE EDITED FOOD TO MY FOODS
if (saveEditedFoodCheckbox.checked) {

    const savedFood = {
        id: Date.now() + Math.random(),
        name: entry.name,
        brand: "Manually Added",
        serving: entry.serving,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        fibre: entry.fibre,
        servingType: "custom"
    };

    const alreadySaved = savedFoods.some(food =>
        food.name.toLowerCase() === savedFood.name.toLowerCase()
    );

    if (!alreadySaved) {
        savedFoods.push(savedFood);
        saveSavedFoods();
        displaySavedFoods();
    } else {
        alert("This food is already saved in My Foods.");
    }
}

    saveFoodEntries();
    displayFoodEntries();
    updateNutritionDashboard();
});

// DELETE FOOD ENTRY BUTTON
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.type = "button";

deleteButton.addEventListener("click", () => {

    const confirmDelete = confirm(
        `Are you sure you want to delete ${entry.name}?`
    );

    if (!confirmDelete) {
        return;
    }

    foodEntries = foodEntries.filter(item => item.id !== entry.id);

    saveFoodEntries();
    displayFoodEntries();
    updateNutritionDashboard();
});

            foodItem.appendChild(foodDetails);
            foodItem.appendChild(editButton);
            foodItem.appendChild(editForm);
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
        date: diaryDate.value,
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


    // SAVE FOOD TO MY FOODS IF CHECKED

    if (saveFoodToMyFoods.checked) {

        const savedFood = {

            id: Date.now() + Math.random(),
            name: newEntry.name,
            brand: "Manually Added",
            serving: newEntry.serving,
            calories: newEntry.calories,
            protein: newEntry.protein,
            carbs: newEntry.carbs,
            fat: newEntry.fat,
            fibre: newEntry.fibre,
            servingType: "custom"

        };

        const alreadySaved = savedFoods.some(food =>
            food.name.toLowerCase() === savedFood.name.toLowerCase()
        );

        if (!alreadySaved) {

            savedFoods.push(savedFood);

            saveSavedFoods();

            displaySavedFoods();

        } else {

            alert("This food is already saved in My Foods.");

        }

    }


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

// UPDATE DIARY WHEN DATE CHANGES
diaryDate.addEventListener("change", () => {
    displayFoodEntries();
});

// ==================================================
// MY FOODS - FOOD DATABASE SEARCH
// ==================================================

const foodSearchButton = document.getElementById("foodSearchButton");

const foodSearchInput = document.getElementById("foodSearchInput");

const foodSearchResults = document.getElementById("foodSearchResults");

// ==================================================
// MY FOODS - SAVED FOOD STORAGE
// ==================================================

let savedFoods = [];

try {
    savedFoods = JSON.parse(localStorage.getItem("myNutritionSavedFoods")) || [];
} catch (error) {
    savedFoods = [];
}

function saveSavedFoods() {
    localStorage.setItem(
        "myNutritionSavedFoods",
        JSON.stringify(savedFoods)
    );
}

// ==================================================
// MY FOODS - FAVOURITE FILTER
// ==================================================

let showFavouriteFoodsOnly = false;

const showAllFoodsButton = document.getElementById("showAllFoodsButton");
const showFavouriteFoodsButton = document.getElementById("showFavouriteFoodsButton");

// SHOW ALL FOODS
showAllFoodsButton.addEventListener("click", () => {

    showFavouriteFoodsOnly = false;

    displaySavedFoods();

});

// SHOW FAVOURITES ONLY
showFavouriteFoodsButton.addEventListener("click", () => {

    showFavouriteFoodsOnly = true;

    displaySavedFoods();

});

foodSearchButton.addEventListener("click", searchFoodDatabase);


async function searchFoodDatabase() {
    const searchTerm = foodSearchInput.value.trim();

    foodSearchInput.value = "";
    foodSearchResults.innerHTML = "";

    if (searchTerm === "") {
        alert("Please enter a food to search for.");
        return;
    }

    foodSearchResults.innerHTML = "<p>Searching for foods...</p>";

    try {

        // SEARCH NEW ZEALAND PRODUCTS FIRST
        const nzParams = new URLSearchParams({
            search_terms: searchTerm,
            search_simple: "1",
            action: "process",
            json: "1",
            page_size: "10",
            tagtype_0: "countries",
            tag_contains_0: "contains",
            tag_0: "en:new-zealand"
        });

        const nzResponse = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?${nzParams}`
        );

        if (!nzResponse.ok) {
            throw new Error("Unable to contact food database.");
        }

        const nzData = await nzResponse.json();

        let products = nzData.products || [];

        // IF FEWER THAN 10 NZ RESULTS, SEARCH WORLDWIDE
        if (products.length < 10) {

            foodSearchResults.innerHTML =
                "<p>Looking for more matching foods...</p>";

            const globalParams = new URLSearchParams({
                search_terms: searchTerm,
                search_simple: "1",
                action: "process",
                json: "1",
                page_size: "10"
            });

            const globalResponse = await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?${globalParams}`
            );

            if (!globalResponse.ok) {
                throw new Error("Unable to contact food database.");
            }

            const globalData = await globalResponse.json();

            const globalProducts = globalData.products || [];

            // KEEP NZ RESULTS FIRST AND AVOID DUPLICATES
            const seenProducts = new Set(
                products.map(product =>
                    product.code ||
                    `${product.product_name || ""}-${product.brands || ""}`.toLowerCase()
                )
            );

            globalProducts.forEach(product => {

                const productKey = product.code ||
                    `${product.product_name || ""}-${product.brands || ""}`.toLowerCase();

                if (!seenProducts.has(productKey) && products.length < 10) {
                    products.push(product);
                    seenProducts.add(productKey);
                }

            });
        }

        displayFoodSearchResults(products);

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

        const calories = Number(nutrition["energy-kcal_100g"]) || 0;
        const protein = Number(nutrition.proteins_100g) || 0;
        const carbs = Number(nutrition.carbohydrates_100g) || 0;
        const fat = Number(nutrition.fat_100g) || 0;
        const fibre = Number(nutrition.fiber_100g) || 0;

        const foodCard = document.createElement("div");
        foodCard.className = "nutrition-card food-search-card";

        const nameHeading = document.createElement("h4");
        nameHeading.textContent = foodName;

        const brandText = document.createElement("p");
        brandText.textContent = brand;

        const nutritionText = document.createElement("p");

nutritionText.textContent =
    `${calories} kcal | Protein: ${protein} g | Carbs: ${carbs} g | Fat: ${fat} g | Fibre: ${fibre} g per 100 g`;

        const servingText = document.createElement("p");
        servingText.textContent = "Nutrition values per 100 g";

        const servingInput = document.createElement("input");
        servingInput.type = "number";
        servingInput.min = "1";
        servingInput.value = "100";
        servingInput.placeholder = "Serving size in grams";

        const mealSelect = document.createElement("select");

        ["Breakfast", "Lunch", "Dinner", "Snack"].forEach(meal => {
            const option = document.createElement("option");
            option.value = meal;
            option.textContent = meal;
            mealSelect.appendChild(option);
        });

        // SAVE FOOD BUTTON
        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.textContent = "Save Food";

        saveButton.addEventListener("click", () => {

            const savedFood = {
                id: Date.now() + Math.random(),
                name: foodName,
                brand: brand,
                calories: calories,
                protein: protein,
                carbs: carbs,
                fat: fat,
                fibre: fibre
            };

            const alreadySaved = savedFoods.some(food =>
                food.name === savedFood.name &&
                food.brand === savedFood.brand
            );

            if (alreadySaved) {
                alert("This food is already saved!");
                return;
            }

            savedFoods.push(savedFood);

            saveSavedFoods();
            displaySavedFoods();

            alert(`${foodName} saved to My Foods!`);

        });

        // ADD TO DIARY BUTTON
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "Add to Diary";

addButton.addEventListener("click", () => {

    const serving = Number(servingInput.value);

    if (!serving || serving <= 0) {
        alert("Please enter a valid serving size.");
        return;
    }

    const multiplier = serving / 100;

    const newEntry = {
        id: Date.now() + Math.random(),
        date: diaryDate.value,
        name: foodName,
        meal: mealSelect.value,
        serving: `${serving} g`,
        calories: calories * multiplier,
        protein: protein * multiplier,
        carbs: carbs * multiplier,
        fat: fat * multiplier,
        fibre: fibre * multiplier
    };

    foodEntries.push(newEntry);

    saveFoodEntries();
    displayFoodEntries();
    updateNutritionDashboard();

    alert(`${foodName} added to your Food Diary!`);

});

        foodCard.appendChild(nameHeading);
        foodCard.appendChild(brandText);
        foodCard.appendChild(nutritionText);
        foodCard.appendChild(servingText);
        foodCard.appendChild(servingInput);
        foodCard.appendChild(mealSelect);
        foodCard.appendChild(saveButton);
        foodCard.appendChild(addButton);

        foodSearchResults.appendChild(foodCard);

    });

}

// ==================================================
// MY FOODS - DISPLAY SAVED FOODS
// ==================================================

function displaySavedFoods() {

    const container = document.getElementById("savedFoodsContainer");

    container.innerHTML = "";

        // FILTER FOODS
    const filteredFoods = showFavouriteFoodsOnly
        ? savedFoods.filter(food => food.isFavourite)
        : savedFoods;

    if (filteredFoods.length === 0) {
        container.innerHTML = showFavouriteFoodsOnly
    ? "<p>You haven't added any favourites yet.</p>"
    : "<p>You haven't saved any foods yet.</p>";
    }

    filteredFoods.forEach(food => {

        const foodCard = document.createElement("div");
        foodCard.className = "nutrition-card food-search-card";

        const foodHeading = document.createElement("h4");
        foodHeading.textContent = food.name;

        // FAVOURITE FOOD BUTTON
const favouriteButton = document.createElement("button");
favouriteButton.type = "button";

favouriteButton.textContent = food.isFavourite
    ? "⭐ Favourite"
    : "☆ Add to Favourites";

favouriteButton.addEventListener("click", () => {

    food.isFavourite = !food.isFavourite;

    saveSavedFoods();

    displaySavedFoods();

});

        const brandText = document.createElement("p");
        brandText.textContent = food.brand;

        const nutritionText = document.createElement("p");
        nutritionText.textContent =
            `${food.calories} kcal | Protein: ${food.protein} g | Carbs: ${food.carbs} g | Fat: ${food.fat} g | Fibre: ${food.fibre} g per 100 g`;

        // SERVING SIZE
    const servingInput = document.createElement("input");

    if (food.servingType === "custom") {

        servingInput.type = "text";
        servingInput.value = food.serving;
        servingInput.placeholder = "Serving size";

    } else {

        servingInput.type = "number";
        servingInput.min = "1";
        servingInput.value = "100";
        servingInput.placeholder = "Serving size in grams";

    }

// SERVING NUTRITION PREVIEW
const nutritionPreview = document.createElement("p");
nutritionPreview.className = "nutrition-preview";

// UPDATE NUTRITION PREVIEW
function updateSavedFoodPreview() {

    if (food.servingType === "custom") {

        nutritionPreview.textContent =
            `${food.calories} kcal | ` +
            `Protein: ${food.protein} g | ` +
            `Carbs: ${food.carbs} g | ` +
            `Fat: ${food.fat} g | ` +
            `Fibre: ${food.fibre} g`;

        return;

    }

    const serving = Number(servingInput.value);

    if (!serving || serving <= 0) {
        nutritionPreview.textContent = "Enter a valid serving size.";
        return;
    }

    const multiplier = serving / 100;

    nutritionPreview.textContent =
        `${Math.round(food.calories * multiplier)} kcal | ` +
        `Protein: ${(food.protein * multiplier).toFixed(1)} g | ` +
        `Carbs: ${(food.carbs * multiplier).toFixed(1)} g | ` +
        `Fat: ${(food.fat * multiplier).toFixed(1)} g | ` +
        `Fibre: ${(food.fibre * multiplier).toFixed(1)} g`;
}

servingInput.addEventListener("input", updateSavedFoodPreview);

updateSavedFoodPreview();

// MEAL SELECTION
const mealSelect = document.createElement("select");

["Breakfast", "Lunch", "Dinner", "Snack"].forEach(meal => {
    const option = document.createElement("option");
    option.value = meal;
    option.textContent = meal;
    mealSelect.appendChild(option);
});

// ADD TO DIARY BUTTON
const addButton = document.createElement("button");
addButton.type = "button";
addButton.textContent = "Add to Diary";

addButton.addEventListener("click", () => {

    let servingDescription;
    let multiplier = 1;

    if (food.servingType === "custom") {

        servingDescription = food.serving;

    } else {

        const serving = Number(servingInput.value);

        if (!serving || serving <= 0) {
            alert("Please enter a valid serving size.");
            return;
        }

        servingDescription = `${serving} g`;
        multiplier = serving / 100;

    }

    const newEntry = {
        id: Date.now() + Math.random(),
        date: diaryDate.value,
        name: food.name,
        meal: mealSelect.value,
        serving: servingDescription,
        calories: food.calories * multiplier,
        protein: food.protein * multiplier,
        carbs: food.carbs * multiplier,
        fat: food.fat * multiplier,
        fibre: food.fibre * multiplier
    };

    foodEntries.push(newEntry);

    saveFoodEntries();
    displayFoodEntries();
    updateNutritionDashboard();

    alert(`${food.name} added to your Food Diary!`);

});

        // EDIT SAVED FOOD BUTTON
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit Food";

    // OPEN EDITING FORM
editButton.addEventListener("click", () => {

    editForm.style.display = "block";

    editName.value = food.name;
    editBrand.value = food.brand;
    editCalories.value = food.calories;
    editProtein.value = food.protein;
    editCarbs.value = food.carbs;
    editFat.value = food.fat;
    editFibre.value = food.fibre;

});

        // INLINE EDITING FORM
const editForm = document.createElement("div");

// EDITING FORM HEADING
const editHeading = document.createElement("h4");
editHeading.textContent = "Edit Food Details";

// NUTRITION HEADING
const nutritionHeading = document.createElement("h4");
nutritionHeading.textContent = "Nutrition per 100 g";
editForm.className = "food-edit-form";
editForm.style.display = "none";

// FOOD NAME
const editName = document.createElement("input");
editName.type = "text";
editName.value = food.name;
editName.placeholder = "Food name";

// BRAND
const editBrand = document.createElement("input");
editBrand.type = "text";
editBrand.value = food.brand;
editBrand.placeholder = "Brand";

// NUTRITION FIELDS
const editCalories = document.createElement("input");
editCalories.type = "number";
editCalories.min = "0";
editCalories.value = food.calories;
editCalories.placeholder = "Calories per 100 g";

const editProtein = document.createElement("input");
editProtein.type = "number";
editProtein.min = "0";
editProtein.step = "0.1";
editProtein.value = food.protein;
editProtein.placeholder = "Protein per 100 g";

const editCarbs = document.createElement("input");
editCarbs.type = "number";
editCarbs.min = "0";
editCarbs.step = "0.1";
editCarbs.value = food.carbs;
editCarbs.placeholder = "Carbs per 100 g";

const editFat = document.createElement("input");
editFat.type = "number";
editFat.min = "0";
editFat.step = "0.1";
editFat.value = food.fat;
editFat.placeholder = "Fat per 100 g";

const editFibre = document.createElement("input");
editFibre.type = "number";
editFibre.min = "0";
editFibre.step = "0.1";
editFibre.value = food.fibre;
editFibre.placeholder = "Fibre per 100 g";

// SAVE CHANGES BUTTON
const saveChangesButton = document.createElement("button");
saveChangesButton.type = "button";
saveChangesButton.textContent = "Save Changes";

// CANCEL BUTTON
const cancelEditButton = document.createElement("button");
cancelEditButton.type = "button";
cancelEditButton.textContent = "Cancel";

// ADD FIELDS TO EDITING FORM

editForm.appendChild(editHeading);

const nameLabel = document.createElement("label");
nameLabel.textContent = "Food Name";
editForm.appendChild(nameLabel);
editForm.appendChild(editName);

const brandLabel = document.createElement("label");
brandLabel.textContent = "Brand";
editForm.appendChild(brandLabel);
editForm.appendChild(editBrand);

editForm.appendChild(nutritionHeading);

const caloriesLabel = document.createElement("label");
caloriesLabel.textContent = "Calories (kcal)";
editForm.appendChild(caloriesLabel);
editForm.appendChild(editCalories);

const proteinLabel = document.createElement("label");
proteinLabel.textContent = "Protein (g)";
editForm.appendChild(proteinLabel);
editForm.appendChild(editProtein);

const carbsLabel = document.createElement("label");
carbsLabel.textContent = "Carbohydrates (g)";
editForm.appendChild(carbsLabel);
editForm.appendChild(editCarbs);

const fatLabel = document.createElement("label");
fatLabel.textContent = "Fat (g)";
editForm.appendChild(fatLabel);
editForm.appendChild(editFat);

const fibreLabel = document.createElement("label");
fibreLabel.textContent = "Fibre (g)";
editForm.appendChild(fibreLabel);
editForm.appendChild(editFibre);

editForm.appendChild(saveChangesButton);
editForm.appendChild(cancelEditButton);

// SAVE EDITED FOOD
saveChangesButton.addEventListener("click", () => {

    const name = editName.value.trim();

    const nutritionValues = [
        editCalories.value,
        editProtein.value,
        editCarbs.value,
        editFat.value,
        editFibre.value
    ];

    if (name === "") {
        alert("Please enter a food name.");
        return;
    }

    if (nutritionValues.some(value =>
        value.trim() === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
    )) {
        alert("Please enter valid nutrition values.");
        return;
    }

    food.name = name;
    food.brand = editBrand.value.trim();

    food.calories = Number(editCalories.value);
    food.protein = Number(editProtein.value);
    food.carbs = Number(editCarbs.value);
    food.fat = Number(editFat.value);
    food.fibre = Number(editFibre.value);

    saveSavedFoods();
    displaySavedFoods();

});

// CANCEL EDITING
cancelEditButton.addEventListener("click", () => {

    editForm.style.display = "none";

});

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Remove Saved Food";

        deleteButton.addEventListener("click", () => {

            savedFoods = savedFoods.filter(item => item.id !== food.id);

            saveSavedFoods();

            displaySavedFoods();

        });

        foodCard.appendChild(foodHeading);
        foodCard.appendChild(favouriteButton);
        foodCard.appendChild(brandText);
        foodCard.appendChild(nutritionText);
        foodCard.appendChild(servingInput);
        foodCard.appendChild(nutritionPreview);
        foodCard.appendChild(mealSelect);
        foodCard.appendChild(addButton);
        foodCard.appendChild(editButton);
        foodCard.appendChild(editForm);
        foodCard.appendChild(deleteButton);

        container.appendChild(foodCard);

    });

}

// LOAD SAVED FOODS
displaySavedFoods();
