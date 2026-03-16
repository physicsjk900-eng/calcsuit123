// js/calculators/area.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('area-val-1');
    const u1 = document.getElementById('area-unit-1');
    const val2 = document.getElementById('area-val-2');
    const u2 = document.getElementById('area-unit-2');
    const btnSwap = document.getElementById('area-swap');

    // Base unit is square meters
    const rates = {
        'sqm': 1,
        'sqkm': 1000000,
        'sqcm': 0.0001,
        'sqft': 0.09290304,
        'sqin': 0.00064516,
        'sqmi': 2589988.110336,
        'acre': 4046.8564224,
        'hectare': 10000
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        const inSqMeters = sourceVal * rates[sourceUnit];
        const result = inSqMeters / rates[targetUnit];
        
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
