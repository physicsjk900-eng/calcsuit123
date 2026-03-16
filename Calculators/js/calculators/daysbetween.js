// js/calculators/daysbetween.js
document.addEventListener('DOMContentLoaded', () => {
    const d1 = document.getElementById('dbd-d1');
    const d2 = document.getElementById('dbd-d2');
    const includeEnd = document.getElementById('dbd-include');
    
    const resArea = document.getElementById('dbd-results-area');
    const resVal = document.getElementById('dbd-res-value');
    const resWeeks = document.getElementById('dbd-res-weeks');

    function calculate() {
        if (!d1.value || !d2.value) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const date1 = new Date(d1.value);
        const date2 = new Date(d2.value);

        // Strip time to ensure exact day differences across daylight savings boundaries
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

        let msDiff = Math.abs(utc2 - utc1);
        let days = Math.floor(msDiff / (1000 * 60 * 60 * 24));

        if (includeEnd && includeEnd.checked) {
            days += 1;
        }

        const weeks = (days / 7).toFixed(1);

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            resVal.textContent = days.toString();
            resWeeks.textContent = `(That's roughly ${weeks} weeks)`;

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (d1 && d2) {
        d1.addEventListener('change', calculate);
        d2.addEventListener('change', calculate);
        if(includeEnd) includeEnd.addEventListener('change', calculate);
        
        // Defaults
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        d1.value = today.toISOString().split('T')[0];
        d2.value = nextWeek.toISOString().split('T')[0];
        calculate(); // trigger visual init
    }
});
