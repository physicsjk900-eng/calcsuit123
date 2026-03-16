// js/calculators/fraction.js
document.addEventListener('DOMContentLoaded', () => {
    const fracInputs = ['num1', 'den1', 'op', 'num2', 'den2'];
    const fields = {};
    fracInputs.forEach(id => {
        fields[id] = document.getElementById(`frac-${id}`);
        if (fields[id]) {
            fields[id].addEventListener(fields[id].tagName === 'SELECT' ? 'change' : 'input', calculateFraction);
        }
    });

    const resArea = document.getElementById('frac-results-area');
    const resVal = document.getElementById('frac-res-value');

    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    function simplify(num, den) {
        if (den === 0) return { num: 0, den: 0, err: true };
        const g = Math.abs(gcd(num, den));
        let sNum = num / g;
        let sDen = den / g;
        if (sDen < 0) {
            sNum = -sNum;
            sDen = -sDen;
        }
        return { num: sNum, den: sDen, err: false };
    }

    function calculateFraction() {
        if (!fields.num1 || !fields.den1 || !fields.op || !fields.num2 || !fields.den2) return;

        const n1 = parseInt(fields.num1.value);
        const d1 = parseInt(fields.den1.value);
        const n2 = parseInt(fields.num2.value);
        const d2 = parseInt(fields.den2.value);
        const op = fields.op.value;

        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2) || d1 === 0 || d2 === 0) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        let rNum = 0, rDen = 1;

        switch (op) {
            case '+':
                rNum = n1 * d2 + n2 * d1;
                rDen = d1 * d2;
                break;
            case '-':
                rNum = n1 * d2 - n2 * d1;
                rDen = d1 * d2;
                break;
            case '*':
                rNum = n1 * n2;
                rDen = d1 * d2;
                break;
            case '/':
                rNum = n1 * d2;
                rDen = d1 * n2;
                break;
        }

        const simplified = simplify(rNum, rDen);

        if (resArea && resVal) {
            resArea.classList.remove('hidden');
            if (simplified.err || simplified.den === 0) {
                resVal.innerHTML = 'Undefined';
            } else if (simplified.den === 1) {
                resVal.innerHTML = `<span class="text-4xl font-bold">${simplified.num}</span>`;
            } else {
                resVal.innerHTML = `
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-3xl font-bold pb-1 border-b-2 border-slate-700 dark:border-slate-300 w-full text-center">${simplified.num}</span>
                        <span class="text-3xl font-bold pt-1">${simplified.den}</span>
                    </div>
                `;
            }
            // Let UI render then fade in
            setTimeout(() => {
                resArea.classList.add('opacity-100');
            }, 10);
        }
    }
});
