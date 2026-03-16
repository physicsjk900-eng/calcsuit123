document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // Loan Calculator (Reverse)
    // --------------------------------------
    const formatCurrency = val => isNaN(val) ? "&mdash;" : '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    let currentLoanCalcMode = 'principal'; // 'principal', 'tenure', 'rate'

    // We check if the loan calculator view is present
    const loanResValue = document.getElementById('loan-res-value');

    window.switchLoanCalcMode = (mode) => {
        if(!loanResValue) return;
        
        currentLoanCalcMode = mode;
        const btns = document.querySelectorAll('.loan-tab-btn');
        btns.forEach(b => {
            b.classList.remove('active-mode', 'bg-white', 'dark:bg-slate-700', 'text-slate-800', 'dark:text-white');
            b.classList.add('text-slate-500', 'dark:text-slate-400');
        });

        let activeIdx = mode === 'principal' ? 0 : mode === 'tenure' ? 1 : 2;
        if(btns[activeIdx]) {
            btns[activeIdx].classList.remove('text-slate-500', 'dark:text-slate-400');
            btns[activeIdx].classList.add('active-mode', 'bg-white', 'dark:bg-slate-700', 'text-slate-800', 'dark:text-white');
        }

        const container = document.getElementById('loan-inputs-container');
        if(!container) return;
        
        let html = '';
        if (mode === 'principal') {
            document.getElementById('loan-res-label').innerText = "Loan Amount (Principal):";
            html = `
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Monthly EMI</label><input type="number" id="loan-emi" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Interest Rate (%)</label><input type="number" id="loan-rate" step="0.1" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Tenure (Months)</label><input type="number" id="loan-tenure" class="perc-input w-full py-2"></div>
            `;
        } else if (mode === 'tenure') {
            document.getElementById('loan-res-label').innerText = "Loan Tenure (Months):";
            html = `
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Loan Amount</label><input type="number" id="loan-principal" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Monthly EMI</label><input type="number" id="loan-emi" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Interest Rate (%)</label><input type="number" id="loan-rate" step="0.1" class="perc-input w-full py-2"></div>
            `;
        } else {
            document.getElementById('loan-res-label').innerText = "Annual Interest Rate (%):";
            html = `
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Loan Amount</label><input type="number" id="loan-principal" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Monthly EMI</label><input type="number" id="loan-emi" class="perc-input w-full py-2"></div>
                <div><label class="block text-xs font-semibold text-slate-500 mb-1">Tenure (Months)</label><input type="number" id="loan-tenure" class="perc-input w-full py-2"></div>
            `;
        }
        container.innerHTML = html;
        loanResValue.innerHTML = "&mdash;";
    };

    // Initialize the default layout
    if(loanResValue) {
        switchLoanCalcMode('principal');
    }

    window.calculateReverseLoan = () => {
        if(!document.getElementById('loan-res-value')) return;
        
        let p, emi, rAnnual, n, rMonthly;

        if (currentLoanCalcMode === 'principal') {
            emi = parseFloat(document.getElementById('loan-emi').value);
            rAnnual = parseFloat(document.getElementById('loan-rate').value);
            n = parseFloat(document.getElementById('loan-tenure').value);

            if (isNaN(emi) || isNaN(rAnnual) || isNaN(n) || emi <= 0 || rAnnual <= 0 || n <= 0) return;
            rMonthly = rAnnual / 12 / 100;
            // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
            p = emi * (Math.pow(1 + rMonthly, n) - 1) / (rMonthly * Math.pow(1 + rMonthly, n));
            document.getElementById('loan-res-value').innerHTML = formatCurrency(p);

        } else if (currentLoanCalcMode === 'tenure') {
            p = parseFloat(document.getElementById('loan-principal').value);
            emi = parseFloat(document.getElementById('loan-emi').value);
            rAnnual = parseFloat(document.getElementById('loan-rate').value);

            if (isNaN(p) || isNaN(emi) || isNaN(rAnnual) || p <= 0 || emi <= 0 || rAnnual <= 0) return;
            rMonthly = rAnnual / 12 / 100;
            if (emi <= p * rMonthly) {
                alert("EMI must be greater than monthly interest.");
                return;
            }
            // n = log(EMI / (EMI - P*r)) / log(1 + r)
            n = Math.log(emi / (emi - p * rMonthly)) / Math.log(1 + rMonthly);
            document.getElementById('loan-res-value').innerHTML = Math.ceil(n) + " Months";

        } else if (currentLoanCalcMode === 'rate') {
            p = parseFloat(document.getElementById('loan-principal').value);
            emi = parseFloat(document.getElementById('loan-emi').value);
            n = parseFloat(document.getElementById('loan-tenure').value);

            if (isNaN(p) || isNaN(emi) || isNaN(n) || p <= 0 || emi <= 0 || n <= 0) return;
            if (emi * n <= p) {
                alert("Total repayment (EMI * Months) must be greater than Principal.");
                return;
            }

            // Numerical Approximation for rate using Newton-Raphson or binary search
            // We use simple binary search for safety
            let low = 0.0001; // 0.01% monthly
            let high = 0.5;   // 50% monthly
            let guess = 0;

            for (let i = 0; i < 50; i++) {
                guess = (low + high) / 2;
                let calculatedEmi = p * guess * Math.pow(1 + guess, n) / (Math.pow(1 + guess, n) - 1);
                if (calculatedEmi > emi) {
                    high = guess;
                } else {
                    low = guess;
                }
            }
            let annualRate = guess * 12 * 100;
            document.getElementById('loan-res-value').innerHTML = (Math.round(annualRate * 100) / 100).toFixed(2) + "%";
        }
    };


    // --------------------------------------
    // 9. Advanced Loan Calculator
    // --------------------------------------
    window.calculateAdvLoan = () => {
        const advLoanResults = document.getElementById('adv-loan-results');
        if(!advLoanResults) return;

        const pStr = document.getElementById('adv-principal').value;
        const rStr = document.getElementById('adv-rate').value;
        const nStr = document.getElementById('adv-tenure').value;
        const extraPmtStr = document.getElementById('adv-extra-val').value;

        if (!pStr || !rStr || !nStr) {
            advLoanResults.classList.add('hidden');
            advLoanResults.classList.remove('opacity-100');
            return;
        }

        const p = parseFloat(pStr);
        const rAnnual = parseFloat(rStr);
        const nYears = parseFloat(nStr);
        let extra = parseFloat(extraPmtStr);
        const extraType = document.getElementById('adv-extra-type').value; // monthly or yearly

        if (isNaN(p) || isNaN(rAnnual) || isNaN(nYears) || p <= 0 || rAnnual <= 0 || nYears <= 0) return;
        if (isNaN(extra) || extra < 0) extra = 0;

        const nMonths = nYears * 12;
        const rMonthly = rAnnual / 12 / 100;

        // Baseline EMI and Total Interest
        const baselineEmi = p * rMonthly * Math.pow(1 + rMonthly, nMonths) / (Math.pow(1 + rMonthly, nMonths) - 1);
        const baselineTotalInterest = (baselineEmi * nMonths) - p;

        document.getElementById('adv-baseline-emi').innerHTML = formatCurrency(baselineEmi);

        if (extra === 0) {
            advLoanResults.classList.remove('hidden');
            void advLoanResults.offsetWidth; // reflow
            advLoanResults.classList.add('opacity-100');
            document.getElementById('adv-res-saved').innerHTML = formatCurrency(0);
            document.getElementById('adv-res-time').innerHTML = "0 Months";
            return;
        }

        // Simulating the loan with extra payments
        let balance = p;
        let monthsTaken = 0;
        let totalInterestPaid = 0;

        while (balance > 0 && monthsTaken < nMonths * 2) { // safety limit
            monthsTaken++;
            let interestForMonth = balance * rMonthly;
            totalInterestPaid += interestForMonth;
            let principalPmt = baselineEmi - interestForMonth;

            let extraThisMonth = 0;
            if (extraType === 'monthly') {
                extraThisMonth = extra;
            } else if (extraType === 'yearly' && monthsTaken % 12 === 0) {
                extraThisMonth = extra;
            }

            let totalPmt = principalPmt + extraThisMonth;

            if (balance <= totalPmt) {
                balance = 0;
                break;
            } else {
                balance -= totalPmt;
            }
        }

        const interestSaved = baselineTotalInterest - totalInterestPaid;
        const monthsSaved = nMonths - monthsTaken;

        advLoanResults.classList.remove('hidden');
        void advLoanResults.offsetWidth; // reflow
        advLoanResults.classList.add('opacity-100');

        document.getElementById('adv-res-saved').innerHTML = formatCurrency(interestSaved > 0 ? interestSaved : 0);

        if (monthsSaved > 0) {
            let ySaved = Math.floor(monthsSaved / 12);
            let mSaved = monthsSaved % 12;
            let text = "";
            if (ySaved > 0) text += `${ySaved} Yr `;
            if (mSaved > 0) text += `${mSaved} Mo`;
            document.getElementById('adv-res-time').innerHTML = text.trim();
        } else {
            document.getElementById('adv-res-time').innerHTML = "None";
        }
    };
});
