// js/calculators/exponent.js
document.addEventListener('DOMContentLoaded', () => {
    const inputBase = document.getElementById('exp-base');
    const inputPower = document.getElementById('exp-power');
    const resArea = document.getElementById('exp-results-area');
    const resVal = document.getElementById('exp-res-value');
    const visualizer = document.getElementById('exp-visualizer');

    function calculate() {
        const base = parseFloat(inputBase.value);
        const power = parseFloat(inputPower.value);

        if (isNaN(base) && isNaN(power)) {
            visualizer.innerHTML = `x<sup class="text-2xl text-sky-400 ml-1">y</sup>`;
        } else if (!isNaN(base) && isNaN(power)) {
             visualizer.innerHTML = `${base}<sup class="text-2xl text-sky-400 ml-1">y</sup>`;
        } else if (isNaN(base) && !isNaN(power)) {
             visualizer.innerHTML = `x<sup class="text-2xl text-sky-400 ml-1">${power}</sup>`;
        } else {
             visualizer.innerHTML = `${base}<sup class="text-2xl text-sky-400 ml-1">${power}</sup>`;
        }

        if (isNaN(base) || isNaN(power)) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            
            // JavaScript Math.pow handles standard exponents well
            const result = Math.pow(base, power);
            
            if (!isFinite(result)) {
                resVal.textContent = result < 0 ? "-Infinity" : "Infinity";
            } else if (isNaN(result)) {
                resVal.textContent = "Undefined (Complex Root)";
            } else {
                // If it's an integer, show it exactly. If it's a float, fix to a reasonable length.
                // Scientific notation for very large numbers is built into JS toString()
                resVal.textContent = Number.isInteger(result) ? result : parseFloat(result.toPrecision(12)).toString();
            }

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (inputBase && inputPower) {
        inputBase.addEventListener('input', calculate);
        inputPower.addEventListener('input', calculate);
    }
});
