// js/calculators/bodyfat.js

document.addEventListener('DOMContentLoaded', () => {
    const bfUnit = document.getElementById('bf-unit');
    const bfGender = document.getElementById('bf-gender');
    const bfWeight = document.getElementById('bf-weight');
    const bfHeight = document.getElementById('bf-height');
    const bfNeck = document.getElementById('bf-neck');
    const bfWaist = document.getElementById('bf-waist');
    const bfHip = document.getElementById('bf-hip');
    const bfHipContainer = document.getElementById('bf-hip-container');
    
    // Labels
    const bfWeightLabel = document.getElementById('bf-weight-label');
    const bfHeightLabel = document.getElementById('bf-height-label');
    const bfNeckLabel = document.getElementById('bf-neck-label');
    const bfWaistLabel = document.getElementById('bf-waist-label');
    const bfHipLabel = document.getElementById('bf-hip-label');

    const calcBtn = document.getElementById('calc-btn-bf');
    const resultsArea = document.getElementById('bf-results-area');
    const bfOutputVal = document.getElementById('bf-output-val');
    const bfOutputMass = document.getElementById('bf-output-mass');
    const bfOutputCat = document.getElementById('bf-output-cat');

    if (!calcBtn) return;

    bfGender.addEventListener('change', () => {
        if (bfGender.value === 'female') {
            bfHipContainer.classList.remove('hidden');
        } else {
            bfHipContainer.classList.add('hidden');
        }
    });

    bfUnit.addEventListener('change', () => {
        const u = bfUnit.value === 'metric' ? {w:'kg', h:'cm'} : {w:'lbs', h:'in'};
        bfWeightLabel.textContent = u.w;
        bfHeightLabel.textContent = u.h;
        bfNeckLabel.textContent = u.h;
        bfWaistLabel.textContent = u.h;
        bfHipLabel.textContent = u.h;
    });

    calcBtn.addEventListener('click', () => {
        let weight = parseFloat(bfWeight.value);
        let height = parseFloat(bfHeight.value);
        let neck = parseFloat(bfNeck.value);
        let waist = parseFloat(bfWaist.value);
        let hip = parseFloat(bfHip.value || 0);
        const gender = bfGender.value;
        const unit = bfUnit.value;

        if (isNaN(weight) || isNaN(height) || isNaN(neck) || isNaN(waist)) {
            alert('Please fill in all required fields.');
            return;
        }

        // Convert to metric (cm/kg) for Navy Formula
        if (unit === 'imperial') {
            weight *= 0.453592;
            height *= 2.54;
            neck *= 2.54;
            waist *= 2.54;
            hip *= 2.54;
        }

        let bodyFat = 0;
        if (gender === 'male') {
            // Navy BF% Men = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
            bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        } else {
            // Navy BF% Women = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
            bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
        }

        if (bodyFat < 2 || isNaN(bodyFat)) {
            alert('Calculation error. Please ensure your measurements are realistic.');
            return;
        }

        const fatMass = weight * (bodyFat / 100);
        
        bfOutputVal.textContent = bodyFat.toFixed(1) + '%';
        bfOutputMass.textContent = (unit === 'metric') ? fatMass.toFixed(1) + ' kg' : (fatMass / 0.453592).toFixed(1) + ' lbs';
        
        // Simple Categorization
        let cat = '';
        if (gender === 'male') {
            if (bodyFat < 6) cat = 'Essential';
            else if (bodyFat < 14) cat = 'Athletic';
            else if (bodyFat < 18) cat = 'Fitness';
            else if (bodyFat < 25) cat = 'Average';
            else cat = 'Obese';
        } else {
            if (bodyFat < 14) cat = 'Essential';
            else if (bodyFat < 21) cat = 'Athletic';
            else if (bodyFat < 25) cat = 'Fitness';
            else if (bodyFat < 32) cat = 'Average';
            else cat = 'Obese';
        }
        bfOutputCat.textContent = cat;

        resultsArea.classList.remove('hidden');
        resultsArea.classList.add('opacity-100');
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
