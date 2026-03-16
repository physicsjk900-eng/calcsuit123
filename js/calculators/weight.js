// js/calculators/weight.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('wt-val-1');
    const u1 = document.getElementById('wt-unit-1');
    const val2 = document.getElementById('wt-val-2');
    const u2 = document.getElementById('wt-unit-2');
    const btnSwap = document.getElementById('wt-swap');

    // Base unit is grams (g)
    const rates = {
        'kg': 1000,
        'g': 1,
        'mg': 0.001,
        'mt': 1000000, // metric ton
        'lb': 453.59237,
        'oz': 28.349523125,
        'ton': 907184.74 // US ton
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        // Convert source to grams, then grams to target
        const inGrams = sourceVal * rates[sourceUnit];
        const result = inGrams / rates[targetUnit];
        
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

        // Init
        syncRight();
    }
});
