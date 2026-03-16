// js/calculators/timeduration.js
document.addEventListener('DOMContentLoaded', () => {
    const ids = ['d1', 'h1', 'm1', 's1', 'd2', 'h2', 'm2', 's2'];
    const inputs = {};
    ids.forEach(id => {
        inputs[id] = document.getElementById(`td-${id}`);
        if(inputs[id]) inputs[id].addEventListener('input', calculate);
    });

    const opSelect = document.getElementById('td-op');
    if (opSelect) opSelect.addEventListener('change', calculate);

    const resArea = document.getElementById('td-results-area');
    const resVal = document.getElementById('td-res-value');

    function toSeconds(d, h, m, s) {
        return (d * 86400) + (h * 3600) + (m * 60) + s;
    }

    function calculate() {
        const d1 = parseFloat(inputs.d1?.value) || 0;
        const h1 = parseFloat(inputs.h1?.value) || 0;
        const m1 = parseFloat(inputs.m1?.value) || 0;
        const s1 = parseFloat(inputs.s1?.value) || 0;

        const d2 = parseFloat(inputs.d2?.value) || 0;
        const h2 = parseFloat(inputs.h2?.value) || 0;
        const m2 = parseFloat(inputs.m2?.value) || 0;
        const s2 = parseFloat(inputs.s2?.value) || 0;

        const op = opSelect?.value || '+';

        // Check if completely empty
        const allKeys = Object.keys(inputs);
        const isEmpty = allKeys.every(k => !inputs[k].value);
        if (isEmpty) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const sec1 = toSeconds(d1, h1, m1, s1);
        const sec2 = toSeconds(d2, h2, m2, s2);

        let totalSecs = op === '+' ? (sec1 + sec2) : (sec1 - sec2);
        
        // Handle negative time
        let isNegative = false;
        if (totalSecs < 0) {
            isNegative = true;
            totalSecs = Math.abs(totalSecs);
        }

        const rDays = Math.floor(totalSecs / 86400);
        let rem = totalSecs % 86400;
        const rHours = Math.floor(rem / 3600);
        rem %= 3600;
        const rMins = Math.floor(rem / 60);
        const rSecs = rem % 60;

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            
            let parts = [];
            if (rDays > 0) parts.push(`${rDays}d`);
            if (rHours > 0 || parts.length > 0) parts.push(`${rHours}h`);
            if (rMins > 0 || parts.length > 0) parts.push(`${rMins}m`);
            parts.push(`${rSecs}s`); // Always show seconds at minimum if 0

            let finalStr = parts.join(' ');
            if (isNegative) finalStr = "-" + finalStr;
            
            resVal.textContent = finalStr;

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }
});
