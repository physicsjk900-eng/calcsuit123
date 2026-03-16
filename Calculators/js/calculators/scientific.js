document.addEventListener('DOMContentLoaded', () => {
    // --- Scientific Calculator Initialization ---
    const sciDisplay = document.getElementById('sci-display');
    const sciHistory = document.getElementById('sci-history');
    
    if (!sciDisplay || !sciHistory) return;

    const sciCalc = new Calculator(sciDisplay, sciHistory);
    let scientificIsRad = false; // Default to DEG

    const degBtn = document.getElementById('sci-deg');
    const radBtn = document.getElementById('sci-rad');

    const setAngleMode = (isRad) => {
        scientificIsRad = isRad;
        if (isRad) {
            radBtn.classList.add('active-mode'); radBtn.classList.remove('text-slate-500', 'hover:text-slate-800', 'dark:text-slate-400', 'dark:hover:text-slate-200');
            degBtn.classList.remove('active-mode'); degBtn.classList.add('text-slate-500', 'hover:text-slate-800', 'dark:text-slate-400', 'dark:hover:text-slate-200');
        } else {
            degBtn.classList.add('active-mode'); degBtn.classList.remove('text-slate-500', 'hover:text-slate-800', 'dark:text-slate-400', 'dark:hover:text-slate-200');
            radBtn.classList.remove('active-mode'); radBtn.classList.add('text-slate-500', 'hover:text-slate-800', 'dark:text-slate-400', 'dark:hover:text-slate-200');
        }
    };
    degBtn.addEventListener('click', () => setAngleMode(false));
    radBtn.addEventListener('click', () => setAngleMode(true));

    document.querySelectorAll('#calc-scientific .calc-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('btn-number')) {
                sciCalc.appendNumber(button.dataset.value);
            } else if (button.dataset.action === 'clear') {
                sciCalc.clear();
            } else if (button.dataset.action === 'backspace') {
                sciCalc.delete();
            } else if (button.dataset.action === 'decimal') {
                sciCalc.appendNumber('.');
            } else if (button.dataset.action === 'calculate') {
                sciCalc.compute();
            } else if (button.dataset.action === 'toggle-sign') {
                sciCalc.toggleSign();
            } else if (button.dataset.sci === 'pi' || button.dataset.sci === 'e') {
                sciCalc.insertConstant(button.dataset.sci);
            } else if (button.dataset.sci === 'power') {
                sciCalc.chooseOperation('power', '^');
            } else if (button.dataset.sci) {
                // Pass the scientificIsRad flag to the core function
                sciCalc.computeSingleFunc(button.dataset.sci, scientificIsRad);
                // Note: parenthesis parser is omitted for simplicity in vanilla JS, relying on iterative compute instead. 
            } else if (button.dataset.action) {
                sciCalc.chooseOperation(button.dataset.action, button.innerText);
            }
        });
    });
});
