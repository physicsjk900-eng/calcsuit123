// js/calculators/temperature.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('temp-val-1');
    const u1 = document.getElementById('temp-unit-1');
    const val2 = document.getElementById('temp-val-2');
    const u2 = document.getElementById('temp-unit-2');
    const btnSwap = document.getElementById('temp-swap');

    function convert(val, from, to) {
        if (isNaN(val)) return '';
        if (from === to) return val;

        let celsius = 0;

        // Convert From unit to Celsius
        if (from === 'c') celsius = val;
        else if (from === 'f') celsius = (val - 32) * 5/9;
        else if (from === 'k') celsius = val - 273.15;

        // Convert Celsius to Target unit
        let result = 0;
        if (to === 'c') result = celsius;
        else if (to === 'f') result = (celsius * 9/5) + 32;
        else if (to === 'k') result = celsius + 273.15;

        if (Number.isInteger(result)) return result;
        return parseFloat(result.toFixed(4));
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
