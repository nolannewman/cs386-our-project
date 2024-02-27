function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to set the goal based on the URL parameter
function setGoalFromQueryParam() {
    var goal = getQueryParam('goal');
    if(goal) {
        document.getElementById('goal').value = goal.toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setGoalFromQueryParam();
});

function calculateBMR() {
    var weight = parseFloat(document.getElementById('weight').value);
    var height = parseFloat(document.getElementById('height').value);
    var age = parseInt(document.getElementById('age').value);
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var weightUnit = document.getElementById('weightUnit').value;
    var heightUnit = document.getElementById('heightUnit').value;
    var goal = document.getElementById('goal').value;
    var bmr;

    // Convert to metric if necessary
    if (weightUnit === 'lbs') {
        weight = weight * 0.453592; // Convert lbs to kg
    }
    if (heightUnit === 'in') {
        height = height * 2.54; // Convert inches to cm
    }

    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Adjust BMR based on the goal
    switch(goal) {
        case "BULKING":
            bmr += 500;
            break;
        case "CUTTING":
            bmr -= 500;
            break;
        // MAINTAINING does not change the BMR
    }

    document.getElementById('result').innerHTML = `Estimated BMR (Adjusted for Goal): ${bmr.toFixed(2)} calories/day`;
}
