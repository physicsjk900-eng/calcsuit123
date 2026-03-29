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
                banner.innerHTML = `<span class="text-emerald-400">Buying is Better</span><div class="text-xs font-medium mt-3 text-slate-500 font-normal tracking-tight pt-4 border-t border-white/5">Saves ${fmt.format(diff)} over ${targetYears} years</div>`;
                banner.classList.remove('text-red-400');
                banner.classList.add('text-emerald-400');
            } else {
                const diff = totalBuySunkCost - totalRentPaid;
                banner.innerHTML = `<span class="text-red-400">Renting is Better</span><div class="text-xs font-medium mt-3 text-slate-500 font-normal tracking-tight pt-4 border-t border-white/5">Saves ${fmt.format(diff)} over ${targetYears} years</div>`;
                banner.classList.remove('text-emerald-400');
                banner.classList.add('text-red-400');
            }

            setTimeout(() => { resArea.classList.add('opacity-100', 'translate-y-0'); }, 10);
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
