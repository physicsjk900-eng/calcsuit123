document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // EMI Calculator
    // --------------------------------------
    const formatCurrency = val => isNaN(val) ? "&mdash;" : '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const emiPrincipalInput = document.getElementById('emi-principal');
    if(!emiPrincipalInput) return;

    window.calculateEMI = () => {
        const pEl = document.getElementById('emi-principal');
        const rAnnualEl = document.getElementById('emi-rate');
        const nEl = document.getElementById('emi-tenure');
        const tenureTypeEl = document.getElementById('emi-tenure-type');

        if(!pEl || !rAnnualEl || !nEl || !tenureTypeEl) return;

        const p = parseFloat(pEl.value);
        const rAnnual = parseFloat(rAnnualEl.value);
        let n = parseFloat(nEl.value);
        const tenureType = tenureTypeEl.value;

        const resMonthly = document.getElementById('emi-res-monthly');
        const resInterest = document.getElementById('emi-res-interest');
        const resTotal = document.getElementById('emi-res-total');

        if (isNaN(p) || isNaN(rAnnual) || isNaN(n) || p <= 0 || rAnnual <= 0 || n <= 0) {
            if(resMonthly) resMonthly.innerHTML = "&mdash;";
            if(resInterest) resInterest.innerHTML = "&mdash;";
            if(resTotal) resTotal.innerHTML = "&mdash;";
            return;
        }

        if (tenureType === 'years') n = n * 12; // convert to months
        const rMonthly = rAnnual / 12 / 100; // monthly rate

        // Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        const emi = p * rMonthly * Math.pow(1 + rMonthly, n) / (Math.pow(1 + rMonthly, n) - 1);
        const totalAmount = emi * n;
        const totalInterest = totalAmount - p;

        if(resMonthly) resMonthly.innerHTML = formatCurrency(emi);
        if(resInterest) resInterest.innerHTML = formatCurrency(totalInterest);
        if(resTotal) resTotal.innerHTML = formatCurrency(totalAmount);
    };
});
