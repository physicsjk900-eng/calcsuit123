// js/calculators/ratio.js
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['a', 'b', 'c', 'd'].map(id => document.getElementById(`ratio-${id}`));
    const resArea = document.getElementById('ratio-results-area');
    const resVal = document.getElementById('ratio-res-value');
    const errArea = document.getElementById('ratio-error-area');

    function calculate() {
        let emptyCount = 0;
        let emptyIndex = -1;
        const vals = [];

        inputs.forEach((input, index) => {
            if (input && input.value.trim() === '') {
                emptyCount++;
                emptyIndex = index;
                vals.push(null);
            } else {
                vals.push(parseFloat(input.value));
            }
        });

        if (emptyCount === 0 || emptyCount > 1) {
            if (resArea) resArea.classList.add('hidden');
            
            // Show error only if all fields have some value, to guide the user
            if (emptyCount === 0 && errArea) {
                errArea.classList.remove('hidden');
                errArea.classList.add('opacity-100');
            } else if (errArea) {
                errArea.classList.add('hidden');
                errArea.classList.remove('opacity-100');
            }
            return;
        }

        if (errArea) {
            errArea.classList.add('hidden');
            errArea.classList.remove('opacity-100');
        }

        // We have exactly one empty field.
        const [a, b, c, d] = vals;
        let result = 0;

        // A/B = C/D
        if (emptyIndex === 0) {
            // A = (B * C) / D
            if (d === 0) { resVal.textContent = "Divide by zero"; } 
            else { result = (b * c) / d; }
        } else if (emptyIndex === 1) {
            // B = (A * D) / C
            if (c === 0) { resVal.textContent = "Divide by zero"; } 
            else { result = (a * d) / c; }
        } else if (emptyIndex === 2) {
            // C = (A * D) / B
            if (b === 0) { resVal.textContent = "Divide by zero"; } 
            else { result = (a * d) / b; }
        } else if (emptyIndex === 3) {
            // D = (B * C) / A
            if (a === 0) { resVal.textContent = "Divide by zero"; } 
            else { result = (b * c) / a; }
        }

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            if (resVal.textContent !== "Divide by zero") {
                 resVal.textContent = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
             }
            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    inputs.forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });
});
