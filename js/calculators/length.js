// js/calculators/length.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('len-val-1');
    const u1 = document.getElementById('len-unit-1');
    const val2 = document.getElementById('len-val-2');
    const u2 = document.getElementById('len-unit-2');
    const btnSwap = document.getElementById('len-swap');

    // Base unit is meters
    const rates = {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'mi': 1609.344,
        'yd': 0.9144,
        'ft': 0.3048,
        'in': 0.0254
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        // Convert source to meters, then meters to target
        const inMeters = sourceVal * rates[sourceUnit];
        const result = inMeters / rates[targetUnit];
        
        // Format to avoid long decimals but keep precision up to 6 decimal places
        if(Number.isInteger(result)) return result;
        const rounded = parseFloat(result.toFixed(6));
        
        // Handle scientific notation for very small or large numbers elegantly
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
        syncRight(); // Trigger recalculation primarily to the right
    }

    if (val1 && val2) {
        val1.addEventListener('input', syncRight);
        u1.addEventListener('change', syncRight);
        
        val2.addEventListener('input', syncLeft);
        u2.addEventListener('change', syncLeft); // updating right unit reflows to left visually or vice versa, standard is left->right on unit change
        
        btnSwap.addEventListener('click', swap);

        // Init
        syncRight();
    }
});
