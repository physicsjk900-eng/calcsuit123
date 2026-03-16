// js/calculators/party.js
document.addEventListener('DOMContentLoaded', () => {
    const guestsInput = document.getElementById('party-guests');
    const foodInput = document.getElementById('party-food');
    const drinksInput = document.getElementById('party-drinks');
    const venueInput = document.getElementById('party-venue');
    const decorInput = document.getElementById('party-decor');
    
    const resArea = document.getElementById('party-results-area');
    const resTotal = document.getElementById('party-res-total');
    const resPP = document.getElementById('party-res-pp');
    
    const resF = document.getElementById('party-res-f');
    const resD = document.getElementById('party-res-d');
    const resV = document.getElementById('party-res-v');
    
    const barF = document.getElementById('party-bar-f');
    const barD = document.getElementById('party-bar-d');
    const barV = document.getElementById('party-bar-v');

    function calculate() {
        const guests = parseFloat(guestsInput.value) || 0;
        const foodCostPP = parseFloat(foodInput.value) || 0;
        const drinksCostPP = parseFloat(drinksInput.value) || 0;
        const venue = parseFloat(venueInput.value) || 0;
        const decor = parseFloat(decorInput.value) || 0;

        if (guests <= 0) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const totalFood = guests * foodCostPP;
        const totalDrinks = guests * drinksCostPP;
        const fixed = venue + decor;
        
        const total = totalFood + totalDrinks + fixed;
        const pp = total / guests;

        const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

        if (resArea) {
            resArea.classList.remove('hidden');
            
            resTotal.textContent = curFmt.format(total);
            resPP.textContent = `Averages out to ${curFmt.format(pp)} per person`;
            
            resF.textContent = curFmt.format(totalFood);
            resD.textContent = curFmt.format(totalDrinks);
            resV.textContent = curFmt.format(fixed);

            if (total > 0) {
                barF.style.width = `${(totalFood / total) * 100}%`;
                barD.style.width = `${(totalDrinks / total) * 100}%`;
                barV.style.width = `${(fixed / total) * 100}%`;
            } else {
                barF.style.width = '0%';
                barD.style.width = '0%';
                barV.style.width = '0%';
            }

            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    [guestsInput, foodInput, drinksInput, venueInput, decorInput].forEach(el => {
        if(el) {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        }
    });

    calculate();
});
