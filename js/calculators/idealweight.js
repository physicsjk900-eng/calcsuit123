// js/calculators/idealweight.js

document.addEventListener('DOMContentLoaded', () => {
    const iwUnit = document.getElementById('iw-unit');
    const iwGender = document.getElementById('iw-gender');
    const iwHeight = document.getElementById('iw-height');
    const iwHeightLabel = document.getElementById('iw-height-label');

    const calcBtn = document.getElementById('calc-btn-iw');
    const resultsArea = document.getElementById('iw-results-area');
    const iwOutputVal = document.getElementById('iw-output-val');
    const iwOutputRange = document.getElementById('iw-output-range');

    if (!calcBtn) return;

    iwUnit.addEventListener('change', () => {
        iwHeightLabel.textContent = iwUnit.value === 'metric' ? 'cm' : 'in';
    });

    calcBtn.addEventListener('click', () => {
        let height = parseFloat(iwHeight.value);
        const gender = iwGender.value;
        const unit = iwUnit.value;

        if (isNaN(height) || height <= 0) {
            alert('Please enter a valid height.');
            return;
        }

        // Convert to inches for standard formulas
        let heightInches = (unit === 'metric') ? height / 2.54 : height;

        if (heightInches < 60) {
            alert('Height must be at least 5 feet (60 inches) for these formulas.');
            return;
        }

        const inchesOver5ft = heightInches - 60;

        let idealWeight = 0;
        if (gender === 'male') {
            // Devine Formula (1974)
            idealWeight = 50 + (2.3 * inchesOver5ft);
        } else {
            // Devine Formula (1974)
            idealWeight = 45.5 + (2.3 * inchesOver5ft);
        }

        // BMI Range (18.5 - 25)
        const minBMIWeight = 18.5 * Math.pow(heightInches * 0.0254, 2);
        const maxBMIWeight = 25 * Math.pow(heightInches * 0.0254, 2);

        if (unit === 'imperial') {
            const lbs = idealWeight / 0.453592;
            const minLbs = minBMIWeight / 0.453592;
            const maxLbs = maxBMIWeight / 0.453592;
            iwOutputVal.textContent = Math.round(lbs) + ' lbs';
            iwOutputRange.textContent = Math.round(minLbs) + ' - ' + Math.round(maxLbs) + ' lbs';
        } else {
            iwOutputVal.textContent = Math.round(idealWeight) + ' kg';
            iwOutputRange.textContent = Math.round(minBMIWeight) + ' - ' + Math.round(maxBMIWeight) + ' kg';
        }

        resultsArea.classList.remove('hidden');
        resultsArea.classList.add('opacity-100');
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
