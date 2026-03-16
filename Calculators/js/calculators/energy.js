// js/calculators/energy.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('nrg-val-1');
    const u1 = document.getElementById('nrg-unit-1');
    const val2 = document.getElementById('nrg-val-2');
    const u2 = document.getElementById('nrg-unit-2');
    const btnSwap = document.getElementById('nrg-swap');

    // Base unit is Joules (J)
    const rates = {
        'j': 1,
        'kj': 1000,
        'cal': 4.184,
        'kcal': 4184,
        'wh': 3600,
        'kwh': 3600000,
        'btu': 1055.06
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        const inJoules = sourceVal * rates[sourceUnit];
        const result = inJoules / rates[targetUnit];
        
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
