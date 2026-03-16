// js/calculators/bmi.js
document.addEventListener('DOMContentLoaded', () => {
    const btnBmiCalc = document.getElementById('calc-btn-bmi');
    const inputBmiWeight = document.getElementById('bmi-weight');
    const inputBmiHeight = document.getElementById('bmi-height');
    const selectBmiUnit = document.getElementById('bmi-unit');
    const labelBmiWeight = document.getElementById('bmi-weight-label');
    const labelBmiHeight = document.getElementById('bmi-height-label');

    if (selectBmiUnit && labelBmiWeight && labelBmiHeight) {
        selectBmiUnit.addEventListener('change', (e) => {
            if (e.target.value === 'imperial') {
                labelBmiWeight.textContent = 'lbs';
                labelBmiHeight.textContent = 'in';
            } else {
                labelBmiWeight.textContent = 'kg';
                labelBmiHeight.textContent = 'cm';
            }
        });
    }

    if (btnBmiCalc && inputBmiWeight && inputBmiHeight) {
        btnBmiCalc.addEventListener('click', () => {
            const weight = parseFloat(inputBmiWeight.value);
            const height = parseFloat(inputBmiHeight.value);
            const unit = selectBmiUnit ? selectBmiUnit.value : 'metric';
            const resArea = document.getElementById('bmi-results-area');
            const resVal = document.getElementById('bmi-output-val');
            const resCat = document.getElementById('bmi-output-cat');

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                if (resArea) {
                    resArea.classList.remove('hidden');
                    setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
                }
                if (resVal) resVal.textContent = "Error";
                if (resCat) {
                    resCat.textContent = "Invalid Input";
                    resCat.className = "text-xl font-semibold px-3 py-1 rounded-lg pb-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
                }
                return;
            }

            let bmi = 0;
            if (unit === 'metric') {
                // height in cm, weight in kg
                const heightInMeters = height / 100;
                bmi = weight / (heightInMeters * heightInMeters);
            } else {
                // height in inches, weight in lbs
                bmi = 703 * weight / (height * height);
            }

            bmi = parseFloat(bmi.toFixed(1));
            if (resVal) resVal.textContent = bmi;

            let categoryText = "";
            let categoryClass = "";

            if (bmi < 18.5) {
                categoryText = "Underweight";
                categoryClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
            } else if (bmi >= 18.5 && bmi < 25) {
                categoryText = "Normal weight";
                categoryClass = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
            } else if (bmi >= 25 && bmi < 30) {
                categoryText = "Overweight";
                categoryClass = "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
            } else {
                categoryText = "Obese";
                categoryClass = "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400";
            }

            if (resCat) {
                resCat.textContent = categoryText;
                resCat.className = `text-xl font-semibold px-3 py-1 rounded-lg pb-1 ${categoryClass}`;
            }

            if (resArea) {
                resArea.classList.remove('hidden');
                setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
            }
        });
    }
});
