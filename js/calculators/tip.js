// js/calculators/tip.js
document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.getElementById('tip-bill');
    const tipBtns = document.querySelectorAll('.tip-btn');
    const customInput = document.getElementById('tip-custom');
    const splitMinus = document.getElementById('tip-minus');
    const splitPlus = document.getElementById('tip-plus');
    const splitDisp = document.getElementById('tip-split');
    
    const resArea = document.getElementById('tip-results-area');
    const resAmt = document.getElementById('tip-res-amt');
    const resTot = document.getElementById('tip-res-tot');

    let currentTipPct = 15;
    let splitCount = 1;

    function updateBtnStyles() {
        tipBtns.forEach(btn => {
            if (parseInt(btn.dataset.val) === currentTipPct && !customInput.value) {
                btn.className = "tip-btn w-16 py-2 rounded-xl border border-sky-400 dark:border-sky-500 font-bold transition-all bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm";
            } else {
                btn.className = "tip-btn w-16 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold transition-all bg-white dark:bg-slate-800 hover:border-sky-400 text-slate-600 dark:text-slate-300";
            }
        });
    }

    function calculate() {
        const bill = parseFloat(billInput.value);

        if (isNaN(bill) || bill <= 0) {
            if (resArea) resArea.classList.add('hidden');
            return;
        }

        // Check custom input first
        if (customInput.value !== '') {
            currentTipPct = parseFloat(customInput.value) || 0;
            updateBtnStyles(); // will clear all highlights
        }

        const tipAmount = bill * (currentTipPct / 100);
        const totalAmount = bill + tipAmount;
        
        const tipPerPerson = tipAmount / splitCount;
        const totalPerPerson = totalAmount / splitCount;

        const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

        if (resArea) {
            resArea.classList.remove('hidden');
            resAmt.textContent = curFmt.format(tipPerPerson);
            resTot.textContent = curFmt.format(totalPerPerson);
            setTimeout(() => { resArea.classList.add('opacity-100'); }, 10);
        }
    }

    // Event Listeners
    if (billInput) {
        billInput.addEventListener('input', calculate);
        
        tipBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentTipPct = parseInt(e.target.dataset.val);
                customInput.value = ''; // clear custom
                updateBtnStyles();
                calculate();
            });
        });

        customInput.addEventListener('input', calculate);

        splitMinus.addEventListener('click', () => {
            if (splitCount > 1) {
                splitCount--;
                splitDisp.textContent = splitCount;
                calculate();
            }
        });

        splitPlus.addEventListener('click', () => {
            if (splitCount < 100) {
                splitCount++;
                splitDisp.textContent = splitCount;
                calculate();
            }
        });

        updateBtnStyles();
    }
});
