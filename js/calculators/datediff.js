// js/calculators/datediff.js
document.addEventListener('DOMContentLoaded', () => {
    const d1 = document.getElementById('date1');
    const d2 = document.getElementById('date2');
    const resArea = document.getElementById('dd-results-area');
    const resVal = document.getElementById('dd-res-value');
    const resWeeks = document.getElementById('dd-res-weeks');
    const resDays = document.getElementById('dd-res-days');

    function calculate() {
        if (!d1.value || !d2.value) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const date1 = new Date(d1.value);
        const date2 = new Date(d2.value);

        // Ensure date1 is always the earlier date for the difference string
        let start = date1 < date2 ? date1 : date2;
        let end = date1 < date2 ? date2 : date1;

        // Total Days difference
        const msDiff = Math.abs(date2.getTime() - date1.getTime());
        const totalDays = Math.floor(msDiff / (1000 * 3600 * 24));
        const totalWeeks = (totalDays / 7).toFixed(1);

        // Exact Y-M-D diff
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months -= 1;
            // Get last day of previous month
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (resArea) {
            resArea.classList.remove('hidden');
            
            let parts = [];
            if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
            if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
            if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
            
            resVal.textContent = parts.join(', ');
            resWeeks.textContent = totalWeeks;
            resDays.textContent = totalDays;

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (d1 && d2) {
        d1.addEventListener('change', calculate);
        d2.addEventListener('change', calculate);
        
        // Populate today as default for d1
        const today = new Date().toISOString().split('T')[0];
        d1.value = today;
    }
});
