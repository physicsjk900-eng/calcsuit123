// js/calculators/electricity.js
document.addEventListener('DOMContentLoaded', () => {
    const powerInput = document.getElementById('elec-watts');
    const unitSelect = document.getElementById('elec-unit');
    const hoursInput = document.getElementById('elec-hours');
    const rateInput = document.getElementById('elec-rate');
    
    const resArea = document.getElementById('elec-results-area');
    const resDay = document.getElementById('elec-res-day');
    const resMonth = document.getElementById('elec-res-month');
    const resYear = document.getElementById('elec-res-year');
    const resKwh = document.getElementById('elec-res-kwh');

    function calculate() {
        const powerRaw = parseFloat(powerInput.value) || 0;
        const hours = parseFloat(hoursInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        const isKW = unitSelect.value === 'kW';

        if (powerRaw <= 0 || hours <= 0 || rate <= 0) {
            if(resArea) resArea.classList.add('hidden');
            return;
        }

        // Convert to Kilowatts
        const kw = isKW ? powerRaw : (powerRaw / 1000);
        
        // kWh per day
        const dailyKwh = kw * hours;
        
        // Costs
        const dailyCost = dailyKwh * rate;
        const monthlyCost = dailyCost * 30.416; // Average days per month
        const yearlyCost = dailyCost * 365;

        // Formatter
        const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        const numFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

        if(resArea) {
            resArea.classList.remove('hidden');
            
            resDay.textContent = curFmt.format(dailyCost);
            resMonth.textContent = curFmt.format(monthlyCost);
            resYear.textContent = curFmt.format(yearlyCost);
            resKwh.textContent = numFmt.format(dailyKwh * 30.416);

            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    [powerInput, unitSelect, hoursInput, rateInput].forEach(el => {
        if(el) {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        }
    });

    calculate();
});
