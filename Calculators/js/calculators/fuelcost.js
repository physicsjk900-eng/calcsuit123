// js/calculators/fuelcost.js
document.addEventListener('DOMContentLoaded', () => {
    const distInput = document.getElementById('fc-dist');
    const distU = document.getElementById('fc-dist-u');
    const effInput = document.getElementById('fc-eff');
    const effU = document.getElementById('fc-eff-u');
    const priceInput = document.getElementById('fc-price');
    const priceLabel = document.getElementById('fc-price-label');
    
    const resArea = document.getElementById('fc-results-area');
    const resCost = document.getElementById('fc-res-cost');
    const resReq = document.getElementById('fc-res-req');

    function updateLabels() {
        if (effU.value === 'mpg') {
            priceLabel.textContent = '/ Gallon';
        } else {
            priceLabel.textContent = '/ Liter';
        }
    }

    function calculate() {
        updateLabels();

        const dist = parseFloat(distInput.value) || 0;
        const eff = parseFloat(effInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        
        const dUnit = distU.value;
        const eUnit = effU.value;

        if (dist <= 0 || eff <= 0 || price < 0) {
            if(resArea) resArea.classList.add('hidden');
            return;
        }

        let fuelNeeded = 0;
        let unitText = 'Liters';

        // Normalize distance to align with efficiency metric temporarily if mismatched
        // Standardize calculating fuel needed
        
        if (eUnit === 'kml') {
            // Needs km
            let actualKm = dUnit === 'km' ? dist : dist * 1.60934;
            fuelNeeded = actualKm / eff;
            unitText = 'Liters';
        } else if (eUnit === 'l100') {
            // Needs km
            let actualKm = dUnit === 'km' ? dist : dist * 1.60934;
            fuelNeeded = (actualKm / 100) * eff;
            unitText = 'Liters';
        } else if (eUnit === 'mpg') {
            // Needs miles
            let actualMi = dUnit === 'mi' ? dist : dist * 0.621371;
            fuelNeeded = actualMi / eff;
            unitText = 'Gallons';
        }

        const totalCost = fuelNeeded * price;

        const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        const numFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

        if(resArea) {
            resArea.classList.remove('hidden');
            resCost.textContent = curFmt.format(totalCost);
            resReq.textContent = `${numFmt.format(fuelNeeded)} ${unitText}`;
            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    [distInput, distU, effInput, effU, priceInput].forEach(el => {
        if(el) {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        }
    });

    calculate();
});
