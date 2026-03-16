document.addEventListener('DOMContentLoaded', () => {
    // Basic Calculator Initialization
    const basicDisplay = document.getElementById('basic-display');
    const basicHistory = document.getElementById('basic-history');
    
    // Check if elements exist to avoid errors on pages without the basic calculator
    if (!basicDisplay || !basicHistory) return;

    const basicCalc = new Calculator(basicDisplay, basicHistory);

    document.querySelectorAll('#calc-basic .calc-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Add haptic-like visual feedback
            button.style.transform = "scale(0.95)";
            setTimeout(() => button.style.transform = "", 100);

            if (button.classList.contains('btn-number')) {
                basicCalc.appendNumber(button.dataset.value);
            } else if (button.dataset.action === 'clear') {
                basicCalc.clear();
            } else if (button.dataset.action === 'backspace') {
                basicCalc.delete();
            } else if (button.dataset.action === 'decimal') {
                basicCalc.appendNumber('.');
            } else if (button.dataset.action === 'calculate') {
                basicCalc.compute();
            } else if (button.dataset.action === 'percentage') {
                basicCalc.percentage();
            } else if (button.dataset.action) {
                basicCalc.chooseOperation(button.dataset.action, button.innerText);
            }
        });
    });
});
