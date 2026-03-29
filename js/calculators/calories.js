// js/calculators/calories.js

document.addEventListener('DOMContentLoaded', () => {
    const calUnit = document.getElementById('cal-unit');
    const calGender = document.getElementById('cal-gender');
    const calWeight = document.getElementById('cal-weight');
    const calHeight = document.getElementById('cal-height');
    const calAge = document.getElementById('cal-age');
    const calActivity = document.getElementById('cal-activity');
    const calWeightLabel = document.getElementById('cal-weight-label');
    const calHeightLabel = document.getElementById('cal-height-label');
    const calcBtn = document.getElementById('calc-btn-cal');
    const resultsArea = document.getElementById('cal-results-area');
    const calOutputVal = document.getElementById('cal-output-val');
    const calMaintain = document.getElementById('cal-maintain');
    const calLose = document.getElementById('cal-lose');
    const calGain = document.getElementById('cal-gain');

    if (!calcBtn) return;

    calUnit.addEventListener('change', () => {
        if (calUnit.value === 'metric') {
            calWeightLabel.textContent = 'kg';
            calHeightLabel.textContent = 'cm';
        } else {
            calWeightLabel.textContent = 'lbs';
            calHeightLabel.textContent = 'in';
        }
    });

    calcBtn.addEventListener('click', () => {
        let weight = parseFloat(calWeight.value);
        let height = parseFloat(calHeight.value);
        let age = parseInt(calAge.value);
        const gender = calGender.value;
        const unit = calUnit.value;
        const activity = parseFloat(calActivity.value);

        if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
            alert('Please enter valid positive numbers.');
            return;
        }

        if (unit === 'imperial') {
            weight = weight * 0.453592;
            height = height * 2.54;
        }

        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        const tdee = bmr * activity;

        calOutputVal.textContent = Math.round(tdee).toLocaleString();
        calMaintain.textContent = Math.round(tdee).toLocaleString();
        calLose.textContent = Math.round(tdee - 500).toLocaleString();
        calGain.textContent = Math.round(tdee + 500).toLocaleString();

        resultsArea.classList.remove('hidden');
        resultsArea.classList.add('opacity-100');
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
