// js/calculators/matrix.js
document.addEventListener('DOMContentLoaded', () => {
    const ids = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
    const inputs = ids.map(id => document.getElementById(`m-${id}`));
    const resArea = document.getElementById('matrix-results-area');
    const resVal = document.getElementById('matrix-res-value');

    function calculate() {
        const vals = inputs.map(input => parseFloat(input.value));
        
        // If any field is empty or NaN, hide result
        if (vals.some(isNaN)) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        const [a, b, c, d, e, f, g, h, i] = vals;

        // Determinant = a(ei - fh) - b(di - fg) + c(dh - eg)
        const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            resVal.textContent = Number.isInteger(determinant) ? determinant : parseFloat(determinant.toFixed(6));

            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }

    inputs.forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });
});
