// js/calculators/bmr.js

document.addEventListener('DOMContentLoaded', () => {
    const bmrUnit = document.getElementById('bmr-unit');
    const bmrGender = document.getElementById('bmr-gender');
    const bmrWeight = document.getElementById('bmr-weight');
    const bmrHeight = document.getElementById('bmr-height');
    const bmrAge = document.getElementById('bmr-age');
    const bmrWeightLabel = document.getElementById('bmr-weight-label');
    const bmrHeightLabel = document.getElementById('bmr-height-label');
    const calcBtn = document.getElementById('calc-btn-bmr');
    const resultsArea = document.getElementById('bmr-results-area');
    const bmrOutputVal = document.getElementById('bmr-output-val');

    if (!calcBtn) return;

    bmrUnit.addEventListener('change', () => {
        if (bmrUnit.value === 'metric') {
            bmrWeightLabel.textContent = 'kg';
            bmrHeightLabel.textContent = 'cm';
        } else {
            bmrWeightLabel.textContent = 'lbs';
            bmrHeightLabel.textContent = 'in';
        }
    });

    calcBtn.addEventListener('click', () => {
        let weight = parseFloat(bmrWeight.value);
        let height = parseFloat(bmrHeight.value);
        let age = parseInt(bmrAge.value);
        const gender = bmrGender.value;
        const unit = bmrUnit.value;

        if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        // Convert to metric if imperial
        if (unit === 'imperial') {
            weight = weight * 0.453592; // lbs to kg
            height = height * 2.54;      // in to cm
        }

        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        bmrOutputVal.textContent = Math.round(bmr).toLocaleString();
        resultsArea.classList.remove('hidden');
        resultsArea.classList.add('opacity-100');
        
        // Scroll to results
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
