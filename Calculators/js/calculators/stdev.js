// js/calculators/stdev.js
document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('std-input');
    const resArea = document.getElementById('std-results-area');
    const resSample = document.getElementById('std-res-sample');
    const resPop = document.getElementById('std-res-pop');
    const resVar = document.getElementById('std-res-var');
    const resMean = document.getElementById('std-res-mean');

    function calculate() {
        const rawText = inputArea.value;
        const numbers = rawText
            .split(/[\s,]+/)
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));

        if (numbers.length === 0) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const count = numbers.length;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;

        let sampleVariance = 0;
        let popVariance = 0;

        if (count > 1) {
            const sumSqDiffs = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
            popVariance = sumSqDiffs / count;
            sampleVariance = sumSqDiffs / (count - 1);
        }

        const popStdDev = Math.sqrt(popVariance);
        const sampleStdDev = Math.sqrt(sampleVariance);

        if (resArea) {
            resArea.classList.remove('hidden');
            
            if (resSample) resSample.textContent = count > 1 ? (Number.isInteger(sampleStdDev) ? sampleStdDev : parseFloat(sampleStdDev.toFixed(6))) : "N/A";
            if (resPop) resPop.textContent = Number.isInteger(popStdDev) ? popStdDev : parseFloat(popStdDev.toFixed(6));
            if (resVar) resVar.textContent = count > 1 ? (Number.isInteger(sampleVariance) ? sampleVariance : parseFloat(sampleVariance.toFixed(6))) : "N/A";
            if (resMean) resMean.textContent = Number.isInteger(mean) ? mean : parseFloat(mean.toFixed(6));

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (inputArea) {
        inputArea.addEventListener('input', calculate);
    }
});
