// js/calculators/speed.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('spd-val-1');
    const u1 = document.getElementById('spd-unit-1');
    const val2 = document.getElementById('spd-val-2');
    const u2 = document.getElementById('spd-unit-2');
    const btnSwap = document.getElementById('spd-swap');

    // Base unit is meters per second (m/s)
    const rates = {
        'ms': 1,
        'kmh': 1/3.6,
        'mph': 0.44704,
        'knots': 0.514444
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        const inMS = sourceVal * rates[sourceUnit];
        const result = inMS / rates[targetUnit];
        
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
