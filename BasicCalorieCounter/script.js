let meals = [];

// function: addMeal
// gets the meal name correctly adds it to the list
function addMeal() {
    const mealName = document.getElementById('mealName').value;
    const mealCalories = parseInt(document.getElementById('mealCalories').value, 10);
    
    if (mealName === '' || isNaN(mealCalories)) {
        alert('Please add a meal name and its calorie count.');
        return;
    }

    meals.push({ name: mealName, calories: mealCalories });
    displayMeals();
    document.getElementById('mealName').value = '';
    document.getElementById('mealCalories').value = '';
}

// function: displayMeals
// function correctly displays the meals and its calorie count and displays their buttons
function displayMeals() {
    const mealList = document.getElementById('mealList'); // Ensure this matches your HTML
    mealList.innerHTML = ''; // Clear the list before adding items

    meals.forEach((meal, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${meal.name}: ${meal.calories} calories
            <button onclick="editMeal(${index})">Edit</button>
            <button onclick="deleteMeal(${index})">Delete</button>`; // Add Edit and Delete buttons
        mealList.appendChild(li);
    });

    // Assuming you have an element to display total calories
    const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
    document.getElementById('totalCalories').textContent = `Total Calories: ${totalCalories}`;
}

document.addEventListener('DOMContentLoaded', function() 
{
    const mealForm = document.getElementById('mealForm');

    // Initial load of meals from local storage
    loadMeals();

    mealForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isUpdate = this.dataset.isUpdate === 'true';
        const updateIndex = parseInt(this.dataset.updateIndex, 10);
        
        const mealName = document.getElementById('mealName').value.trim();
        const mealCalories = parseInt(document.getElementById('mealCalories').value, 10);
        
        if (mealName === '' || isNaN(mealCalories)) {
            alert('Please fill in all fields');
            return;
        }
        
        const meal = { name: mealName, calories: mealCalories };
        
        if (isUpdate) {
            updateMealInLocalStorage(updateIndex, meal);
            this.removeAttribute('data-is-update');
            this.removeAttribute('data-update-index');
            document.querySelector('#mealForm button[type="submit"]').textContent = 'Add Meal';
        } else {
            addMealToLocalStorage(meal);
        }
        
        loadMeals(); // Refresh the meals list to reflect changes
        this.reset(); // Reset form after submission
    });
    
    function addMealToList(meal, index) 
    {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${meal.name}: ${meal.calories} calories 
            <button onclick="editMeal(${index})">Edit</button>
            <button onclick="deleteMeal(${index})">Delete</button>`;
        mealList.appendChild(listItem);
    }

    function loadMeals() 
    {
        mealList.innerHTML = ''; // Clear current meals list
        const meals = getMealsFromLocalStorage();
        meals.forEach((meal, index) => addMealToList(meal, index));
    }

    window.deleteMeal = function(index) 
    {
        let meals = getMealsFromLocalStorage();
        if (index > -1) 
        {
            meals.splice(index, 1);
            localStorage.setItem('meals', JSON.stringify(meals));
            loadMeals(); // Refresh the meal list
        }
    };

    function addMealToLocalStorage(meal) 
    {
        let meals = getMealsFromLocalStorage();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function updateMealInLocalStorage(index, updatedMeal) 
    {
        let meals = getMealsFromLocalStorage();

        if (index >= 0 && index < meals.length) 
        {
            meals[index] = updatedMeal;
            localStorage.setItem('meals', JSON.stringify(meals));
        }
    }

    function getMealsFromLocalStorage() 
    {
        const storedMeals = localStorage.getItem('meals');
        if (storedMeals) {
            return JSON.parse(storedMeals);
        } else {
            return [];
        }
    }
});

function editMeal(index) {
    const meals = getMealsFromLocalStorage();
    if (index >= 0 && index < meals.length) {
        const meal = meals[index];
        document.getElementById('mealName').value = meal.name;
        document.getElementById('mealCalories').value = meal.calories;
        const mealForm = document.getElementById('mealForm');
        mealForm.dataset.isUpdate = 'true';
        mealForm.dataset.updateIndex = index;
        document.querySelector('#mealForm button[type="submit"]').textContent = 'Update Meal';
    }
}
