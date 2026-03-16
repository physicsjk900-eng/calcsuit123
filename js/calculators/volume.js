// js/calculators/volume.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('vol-val-1');
    const u1 = document.getElementById('vol-unit-1');
    const val2 = document.getElementById('vol-val-2');
    const u2 = document.getElementById('vol-unit-2');
    const btnSwap = document.getElementById('vol-swap');

    // Base unit is liters (L)
    const rates = {
        'l': 1,
        'ml': 0.001,
        'cum': 1000,
        'gal': 3.785411784,
        'qt': 0.946352946,
        'pt': 0.473176473,
        'cup': 0.2365882365,
        'floz': 0.02957352956
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        const inLiters = sourceVal * rates[sourceUnit];
        const result = inLiters / rates[targetUnit];
        
        if(Number.isInteger(result)) return result;
        const rounded = parseFloat(result.toFixed(6));
        
        if (rounded === 0 && result !== 0) return result.toExponential(4);
        return rounded;
    }

    function syncRight() {
        const v = parseFloat(val1.value);
        val2.value = convert(v, u1.value, u2.value);
    }

    function syncLeft() {
        const v = parseFloat(val2.value);
        val1.value = convert(v, u2.value, u1.value);
    }

    function swap() {
        const tempU = u1.value;
        u1.value = u2.value;
        u2.value = tempU;
        syncRight();
    }

    if (val1 && val2) {
        val1.addEventListener('input', syncRight);
        u1.addEventListener('change', syncRight);
        
        val2.addEventListener('input', syncLeft);
        u2.addEventListener('change', syncLeft);
        
        btnSwap.addEventListener('click', swap);
        syncRight();
    }
});
