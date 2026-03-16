// js/calculators/currency.js
document.addEventListener('DOMContentLoaded', () => {
    const val1 = document.getElementById('cur-val-1');
    const u1 = document.getElementById('cur-unit-1');
    const val2 = document.getElementById('cur-val-2');
    const u2 = document.getElementById('cur-unit-2');
    const btnSwap = document.getElementById('cur-swap');

    // Base unit is USD. Static estimation fallback rates.
    // In a real prod environment, these should be dynamically fetched via 'https://api.exchangerate-api.com/v4/latest/USD'.
    const rates = {
        'USD': 1.00,
        'EUR': 0.92,
        'GBP': 0.79,
        'INR': 82.90,
        'JPY': 150.25,
        'AUD': 1.52,
        'CAD': 1.35,
        'CNY': 7.19
    };

    function convert(sourceVal, sourceUnit, targetUnit) {
        if (isNaN(sourceVal)) return '';
        const inUSD = sourceVal / rates[sourceUnit];
        const result = inUSD * rates[targetUnit];
        
        return parseFloat(result.toFixed(2)); // Standard 2 decimal places for currency
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
