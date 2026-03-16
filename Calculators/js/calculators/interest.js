document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // Interest Calculator
    // --------------------------------------
    const formatCurrency = val => isNaN(val) ? "&mdash;" : '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Safety check - see if we are on a page where this exists.
    const intPrincipal = document.getElementById('int-principal');
    
    window.toggleCompoundFreq = (show) => {
        const container = document.getElementById('compound-freq-container');
        if(container) {
            container.style.display = show ? 'block' : 'none';
        }
    };

    window.calculateInterest = () => {
        if(!intPrincipal) return;

        const typeInput = document.querySelector('input[name="interest-type"]:checked');
        if(!typeInput) return;
        const type = typeInput.value;

        const pEl = document.getElementById('int-principal');
        const rAnnualEl = document.getElementById('int-rate');
        const tEl = document.getElementById('int-time');

        if(!pEl || !rAnnualEl || !tEl) return;

        const p = parseFloat(pEl.value);
        const rAnnual = parseFloat(rAnnualEl.value) / 100;
        const t = parseFloat(tEl.value);

        const resInterest = document.getElementById('int-res-interest');
        const resTotal = document.getElementById('int-res-total');

        if (isNaN(p) || isNaN(rAnnual) || isNaN(t) || p <= 0 || t <= 0) {
            if(resInterest) resInterest.innerHTML = "&mdash;";
            if(resTotal) resTotal.innerHTML = "&mdash;";
            return;
        }

        let totalAmount, totalInterest;

        if (type === 'simple') {
            totalInterest = p * rAnnual * t;
            totalAmount = p + totalInterest;
        } else {
            const freqEl = document.getElementById('int-freq');
            if(!freqEl) return;
            const n = parseFloat(freqEl.value);
            // A = P(1 + r/n)^(nt)
            totalAmount = p * Math.pow(1 + (rAnnual / n), n * t);
            totalInterest = totalAmount - p;
        }

        if(resInterest) resInterest.innerHTML = formatCurrency(totalInterest);
        if(resTotal) resTotal.innerHTML = formatCurrency(totalAmount);
    };
});
