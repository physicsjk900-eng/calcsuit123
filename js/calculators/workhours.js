// js/calculators/workhours.js
document.addEventListener('DOMContentLoaded', () => {
    const startInput = document.getElementById('wh-start');
    const endInput = document.getElementById('wh-end');
    const breakInput = document.getElementById('wh-break');
    const resArea = document.getElementById('wh-results-area');
    const resVal = document.getElementById('wh-res-value');
    const resDecimal = document.getElementById('wh-res-decimal');
    const errArea = document.getElementById('wh-error-area');
    const errMsg = document.getElementById('wh-error-msg');

    function calculate() {
        const startVal = startInput.value;
        const endVal = endInput.value;
        let breakMins = parseFloat(breakInput.value);

        if (!startVal || !endVal) {
            if (resArea) resArea.classList.add('hidden');
            if (errArea) errArea.classList.add('hidden');
            return;
        }

        if (isNaN(breakMins) || breakMins < 0) {
            breakMins = 0;
        }

        const startParts = startVal.split(':');
        const endParts = endVal.split(':');

        let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        // Support overnight shifts implicitly (if end time is before start time, add 24 hours)
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }

        let totalWorkedMins = endMinutes - startMinutes - breakMins;

        if (errArea) errArea.classList.add('hidden');

        if (totalWorkedMins < 0) {
            if (resArea) resArea.classList.add('hidden');
            if (errArea && errMsg) {
                errMsg.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Break time exceeds total shifted time.';
                errArea.classList.remove('hidden');
                setTimeout(() => { errArea.classList.add('opacity-100'); }, 10);
            }
            return;
        }

        const hrs = Math.floor(totalWorkedMins / 60);
        const mins = Math.floor(totalWorkedMins % 60);

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            resVal.textContent = `${hrs} Hrs ${mins} Mins`;
            
            const decimalHrs = (totalWorkedMins / 60).toFixed(2);
            resDecimal.textContent = `(or ${decimalHrs} hours decimal)`;

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (startInput) startInput.addEventListener('input', calculate);
    if (endInput) endInput.addEventListener('input', calculate);
    if (breakInput) breakInput.addEventListener('input', calculate);
    
    // Initial calc
    calculate();
});
