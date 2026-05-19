document.addEventListener('DOMContentLoaded', () => {

    const valApiStd = document.getElementById('val-api-std');
    const valObsTemp = document.getElementById('val-obs-temp');
    const unitObsTemp = document.getElementById('unit-obs-temp');
    const valObsSg = document.getElementById('val-obs-sg');
    
    // New Inputs
    const inputProductType = document.getElementById('input-product-type');
    const inputAlpha = document.getElementById('input-alpha');

    let lastTempCalcSource = 'api'; // 'api' or 'sg'

    function formatNumber(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
            useGrouping: false // Don't use commas for API/SG to prevent confusion
        });
    }

    function convertTempToF(temp, unit) {
        if (unit === 'F') return temp;
        if (unit === 'C') return temp * 9/5 + 32;
        if (unit === 'K') return (temp - 273.15) * 9/5 + 32;
        return temp;
    }

    function calculateTemperatureConversion() {
        if (!valApiStd || !valObsTemp || !valObsSg || !inputAlpha) return;
        
        const tempVal = parseFloat(valObsTemp.value);
        if (isNaN(tempVal)) return;
        
        const tempF = convertTempToF(tempVal, unitObsTemp.value);
        const deltaT = tempF - 60;
        
        let alpha = parseFloat(inputAlpha.value);
        if (isNaN(alpha) || alpha <= 0) alpha = 0.00040; // Fallback to crude

        // High-Precision ASTM Exponential Volume Correction Factor
        const vcf = Math.exp((-alpha * deltaT) - (0.8 * Math.pow(alpha, 2) * Math.pow(deltaT, 2)));

        if (lastTempCalcSource === 'api') {
            const apiVal = parseFloat(valApiStd.value);
            if (isNaN(apiVal)) {
                valObsSg.value = '';
                return;
            }
            const sg60 = 141.5 / (apiVal + 131.5);
            const sgObs = sg60 * vcf;
            valObsSg.value = formatNumber(sgObs);
            
            // UI Glow
            const card = valObsSg.closest('.glass-card');
            if(card) {
                card.classList.add('calculated-glow');
                setTimeout(() => card.classList.remove('calculated-glow'), 500);
            }

        } else if (lastTempCalcSource === 'sg') {
            const sgObsVal = parseFloat(valObsSg.value);
            if (isNaN(sgObsVal) || sgObsVal <= 0) {
                valApiStd.value = '';
                return;
            }
            const sg60 = sgObsVal / vcf;
            const apiVal = (141.5 / sg60) - 131.5;
            valApiStd.value = formatNumber(apiVal);
            
            // UI Glow
            const card = valApiStd.closest('.glass-card');
            if(card) {
                card.classList.add('calculated-glow');
                setTimeout(() => card.classList.remove('calculated-glow'), 500);
            }
        }
    }

    // Product Type Dropdown Logic
    if (inputProductType && inputAlpha) {
        inputProductType.addEventListener('change', () => {
            const val = inputProductType.value;
            if (val === 'custom') {
                inputAlpha.readOnly = false;
                inputAlpha.focus();
            } else {
                inputAlpha.readOnly = true;
                inputAlpha.value = val;
                calculateTemperatureConversion();
            }
        });
        
        inputAlpha.addEventListener('input', () => {
            calculateTemperatureConversion();
        });
    }

    if (valApiStd) {
        valApiStd.addEventListener('input', () => {
            lastTempCalcSource = 'api';
            calculateTemperatureConversion();
        });
    }

    if (valObsSg) {
        valObsSg.addEventListener('input', () => {
            lastTempCalcSource = 'sg';
            calculateTemperatureConversion();
        });
    }

    if (valObsTemp && unitObsTemp) {
        const tempChangeHandler = () => {
            calculateTemperatureConversion();
        };
        valObsTemp.addEventListener('input', tempChangeHandler);
        unitObsTemp.addEventListener('change', tempChangeHandler);
    }

});
