// js/calculators/log.js
document.addEventListener('DOMContentLoaded', () => {
    const inputBase = document.getElementById('log-base');
    const inputNum = document.getElementById('log-number');
    const resArea = document.getElementById('log-results-area');
    const resVal = document.getElementById('log-res-value');

    function calculate() {
        const base = parseFloat(inputBase.value);
        const num = parseFloat(inputNum.value);

        if (isNaN(base) || isNaN(num)) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            
            if (base <= 0 || base === 1 || num <= 0) {
                resVal.textContent = "Undefined";
            } else {
                // log_base(x) = ln(x) / ln(base)
                const result = Math.log(num) / Math.log(base);
                resVal.textContent = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
            }

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (inputBase && inputNum) {
        inputBase.addEventListener('input', calculate);
        inputNum.addEventListener('input', calculate);
    }
});
