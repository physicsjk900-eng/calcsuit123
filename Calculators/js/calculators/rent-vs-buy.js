// js/calculators/rent-vs-buy.js
document.addEventListener('DOMContentLoaded', () => {
    const rentInput = document.getElementById('rvb-rent');
    const rentIncInput = document.getElementById('rvb-rent-inc');
    const priceInput = document.getElementById('rvb-price');
    const downInput = document.getElementById('rvb-down');
    const rateInput = document.getElementById('rvb-rate');
    const taxInput = document.getElementById('rvb-tax');
    const yearsSlider = document.getElementById('rvb-years');
    const yearsDisp = document.getElementById('rvb-years-disp');
    const ySpan = document.getElementById('rvb-res-y-span');
    
    const banner = document.getElementById('rvb-banner');
    const resRentCost = document.getElementById('rvb-res-rentcost');
    const resBuyCost = document.getElementById('rvb-res-buycost');
    const resArea = document.getElementById('rvb-results-area');

    // Assumptions for simplified calc
    const loanTermYrs = 30; 
    const homeAppreciationPerYr = 0.03; // 3%
    const sellingCostPct = 0.06; // 6%

    function calculate() {
        yearsDisp.textContent = `${yearsSlider.value} Years`;
        ySpan.textContent = yearsSlider.value;

        const initialRent = parseFloat(rentInput.value) || 0;
        const rentInc = (parseFloat(rentIncInput.value) || 0) / 100;
        const homePrice = parseFloat(priceInput.value) || 0;
        const down = parseFloat(downInput.value) || 0;
        const rate = (parseFloat(rateInput.value) || 0) / 100;
        const taxRate = (parseFloat(taxInput.value) || 0) / 100;
        const targetYears = parseInt(yearsSlider.value) || 1;

        if (initialRent <= 0 || homePrice <= 0 || down >= homePrice) {
            if(resArea) resArea.classList.add('hidden');
            return;
        }

        // 1. Rent Cost
        let totalRentPaid = 0;
        let currentMonthlyRent = initialRent;
        for (let i = 0; i < targetYears; i++) {
            totalRentPaid += currentMonthlyRent * 12;
            currentMonthlyRent *= (1 + rentInc);
        }

        // 2. Buy Cost
        const loanAmt = homePrice - down;
        const r = rate / 12;
        const n = loanTermYrs * 12;
        
        let monthlyPI = 0;
        if (r > 0) {
            monthlyPI = loanAmt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
            monthlyPI = loanAmt / n;
        }

        // Simplify taxes: assume fixed on initial value for speed
        const annualTaxes = homePrice * taxRate;
        const totalTaxesPaid = annualTaxes * targetYears;
        
        // Amortization tracking to find equity
        let balance = loanAmt;
        for (let i = 0; i < targetYears * 12; i++) {
            const interest = balance * r;
            const principal = monthlyPI - interest;
            balance -= principal;
            if(balance < 0) balance = 0;
        }

        const futureHomeValue = homePrice * Math.pow(1 + homeAppreciationPerYr, targetYears);
        const equityAmount = futureHomeValue - balance;
        const sellingCosts = futureHomeValue * sellingCostPct;
        const netProceeds = equityAmount - sellingCosts;

        // Total "Sunk Cost" of buying = Initial Down + Total P&I Paid + Total Taxes - Net Proceeds from eventual sale
        // This is a simplified cash flow view vs equity delta
        const totalPIPaid = monthlyPI * (targetYears * 12);
        
        let totalBuySunkCost = down + totalPIPaid + totalTaxesPaid - netProceeds;
        
        // Ensure formatting
        const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

        if(resArea) {
            resArea.classList.remove('hidden');
            
            resRentCost.textContent = fmt.format(totalRentPaid);
            resBuyCost.textContent = fmt.format(totalBuySunkCost);

            // Verdict
            if (totalBuySunkCost < totalRentPaid) {
                const diff = totalRentPaid - totalBuySunkCost;
                banner.innerHTML = `Buying is Better<div class="text-sm font-medium mt-1 text-slate-500 font-normal tracking-normal pt-2 border-t border-slate-200 dark:border-slate-800">Saves ${fmt.format(diff)} over ${targetYears} yrs</div>`;
                banner.className = "text-3xl font-extrabold break-all px-2 py-3 rounded-xl shadow-inner bg-emerald-100/30 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50";
            } else {
                const diff = totalBuySunkCost - totalRentPaid;
                 banner.innerHTML = `Renting is Better<div class="text-sm font-medium mt-1 text-slate-500 font-normal tracking-normal pt-2 border-t border-slate-200 dark:border-slate-800">Saves ${fmt.format(diff)} over ${targetYears} yrs</div>`;
                 banner.className = "text-3xl font-extrabold break-all px-2 py-3 rounded-xl shadow-inner bg-red-100/30 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/50";
            }

            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    const inputs = [rentInput, rentIncInput, priceInput, downInput, rateInput, taxInput, yearsSlider];
    inputs.forEach(el => {
        if(el) {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        }
    });

    calculate();
});
