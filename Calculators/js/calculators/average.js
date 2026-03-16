// js/calculators/average.js
document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('avg-input');
    const resArea = document.getElementById('avg-results-area');
    const resMean = document.getElementById('avg-res-mean');
    const resMedian = document.getElementById('avg-res-median');
    const resSum = document.getElementById('avg-res-sum');
    const resCount = document.getElementById('avg-res-count');

    function calculate() {
        const rawText = inputArea.value;
        const numbers = rawText
            .split(/[\s,]+/) // split by spaces or commas
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));

        if (numbers.length === 0) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const count = numbers.length;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;

        // Median
        const sorted = [...numbers].sort((a, b) => a - b);
        let median = 0;
        if (count % 2 === 0) {
            median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
        } else {
            median = sorted[Math.floor(count / 2)];
        }

        if (resArea) {
            resArea.classList.remove('hidden');
            
            if (resMean) resMean.textContent = Number.isInteger(mean) ? mean : parseFloat(mean.toFixed(6));
            if (resMedian) resMedian.textContent = Number.isInteger(median) ? median : parseFloat(median.toFixed(6));
            if (resSum) resSum.textContent = Number.isInteger(sum) ? sum : parseFloat(sum.toFixed(6));
            if (resCount) resCount.textContent = count;

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    if (inputArea) {
        inputArea.addEventListener('input', calculate);
    }
});
