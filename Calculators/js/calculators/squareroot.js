// js/calculators/squareroot.js
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sqrt-input');
    const resArea = document.getElementById('sqrt-results-area');
    const resVal = document.getElementById('sqrt-res-value');

    if (input) {
        input.addEventListener('input', () => {
            const val = parseFloat(input.value);
            
            if (isNaN(val)) {
                if (resArea) resArea.classList.add('hidden');
                return;
            }

            if (resArea && resVal) {
                resArea.classList.remove('hidden');
                
                if (val < 0) {
                    // Quick complex notation for negative roots
                    const mag = Math.sqrt(Math.abs(val));
                    // Check if it's an integer
                    const displayMag = Number.isInteger(mag) ? mag : mag.toFixed(4).replace(/\.?0+$/, "");
                    resVal.textContent = `${displayMag}i`;
                } else {
                    const root = Math.sqrt(val);
                    resVal.textContent = Number.isInteger(root) ? root : root.toFixed(8).replace(/\.?0+$/, "");
                }

                setTimeout(() => {
                    resArea.classList.add('opacity-100');
                }, 10);
            }
        });
    }
});
