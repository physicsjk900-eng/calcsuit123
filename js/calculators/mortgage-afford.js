// js/calculators/mortgage-afford.js
document.addEventListener('DOMContentLoaded', () => {
    const incomeInput = document.getElementById('ma-income');
    const debtInput = document.getElementById('ma-debt');
    const downInput = document.getElementById('ma-down');
    const rateInput = document.getElementById('ma-rate');
    const termInput = document.getElementById('ma-term');
    const dtiSelect = document.getElementById('ma-dti');
    
    const resArea = document.getElementById('ma-results-area');
    const resPrice = document.getElementById('ma-res-price');
    const resLoan = document.getElementById('ma-res-loan');
    const resMonth = document.getElementById('ma-res-month');

    function calculate() {
        const income = parseFloat(incomeInput.value) || 0;
        const debts = parseFloat(debtInput.value) || 0;
        const downPayment = parseFloat(downInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        const years = parseFloat(termInput.value) || 0;
        const dtiRule = dtiSelect.value;
        
        if (income <= 0 || rate <= 0 || years <= 0) {
            if(resArea) resArea.classList.add('hidden');
            return;
        }

        const monthlyIncome = income / 12;
        let maxMonthlyPayment = 0;

        // DTI Rules
        if (dtiRule === '28_36') {
            // Principle + Interest max 28% of income, AND Total P&I + Debts max 36%
            let maxPITI28 = monthlyIncome * 0.28;
            let maxTotal36 = monthlyIncome * 0.36;
            let maxRemainingPayment = maxTotal36 - debts;
            maxMonthlyPayment = Math.min(maxPITI28, maxRemainingPayment);
        } else if (dtiRule === '43') {
            // P&I + Debts max 43% of income
            let maxTotal43 = monthlyIncome * 0.43;
            maxMonthlyPayment = maxTotal43 - debts;
        }

        if (maxMonthlyPayment <= 0) {
            maxMonthlyPayment = 0; // Debts are too high
        }

        // Reverse Engineering the Present Value of the Annuity to find Max Loan
        // P = PMT * [ (1 - (1+r)^-n) / r ]
        let monthlyRate = (rate / 100) / 12;
        let numPayments = years * 12;

        let maxLoan = 0;
        if (maxMonthlyPayment > 0 && monthlyRate > 0) {
             maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
        } else if (monthlyRate === 0 && maxMonthlyPayment > 0) {
             maxLoan = maxMonthlyPayment * numPayments;
        }

        let maxHomePrice = maxLoan + downPayment;

        if(resArea) {
            resArea.classList.remove('hidden');
            
            // Format currency
            const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
            
            resPrice.textContent = formatter.format(Math.max(0, maxHomePrice));
            resLoan.textContent = formatter.format(Math.max(0, maxLoan));
            resMonth.textContent = formatter.format(Math.max(0, maxMonthlyPayment));

            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    [incomeInput, debtInput, downInput, rateInput, termInput, dtiSelect].forEach(el => {
        if(el) el.addEventListener('input', calculate);
        if(el) el.addEventListener('change', calculate);
    });

    calculate();
});
