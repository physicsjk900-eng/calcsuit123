document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // Percentage Calculator
    // --------------------------------------
    const formatRes = val => isNaN(val) ? "&mdash;" : (Math.round(val * 1e4) / 1e4);

    window.calcPerc1 = () => {
        const xEl = document.getElementById('perc1-x');
        const yEl = document.getElementById('perc1-y');
        const resEl = document.getElementById('perc1-res');
        
        if(!xEl || !yEl || !resEl) return;

        const x = parseFloat(xEl.value);
        const y = parseFloat(yEl.value);
        resEl.innerHTML = isNaN(x) || isNaN(y) ? "&mdash;" : formatRes((x / 100) * y);
    };

    window.calcPerc2 = () => {
        const xEl = document.getElementById('perc2-x');
        const yEl = document.getElementById('perc2-y');
        const resEl = document.getElementById('perc2-res');
        
        if(!xEl || !yEl || !resEl) return;

        const x = parseFloat(xEl.value);
        const y = parseFloat(yEl.value);
        resEl.innerHTML = isNaN(x) || isNaN(y) ? "&mdash;" : (formatRes((x / y) * 100) + '%');
    };

    window.calcPerc3 = () => {
        const xEl = document.getElementById('perc3-x');
        const yEl = document.getElementById('perc3-y');
        const resEl = document.getElementById('perc3-res');

        if(!xEl || !yEl || !resEl) return;
        
        const x = parseFloat(xEl.value);
        const y = parseFloat(yEl.value);
        
        if (isNaN(x) || isNaN(y)) {
            resEl.innerHTML = "&mdash;";
            return;
        }
        
        let diff = y - x;
        let p = (diff / Math.abs(x)) * 100;
        let prefix = p > 0 ? '+' : '';
        resEl.innerHTML = isNaN(p) ? "&mdash;" : (prefix + formatRes(p) + '%');
    };
});
