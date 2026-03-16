class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
        this.updateDisplay();
    }

    delete() {
        if (this.readyToReset) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.readyToReset) {
            this.currentOperand = number.toString();
            this.readyToReset = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
        this.updateDisplay();
    }

    chooseOperation(operation, displayOp) {
        if (this.currentOperand === 'Error') this.clear();
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.operationDisplay = displayOp;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add': computation = prev + current; break;
            case 'subtract': computation = prev - current; break;
            case 'multiply': computation = prev * current; break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = "Error";
                    this.previousOperand = "";
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case 'power': computation = Math.pow(prev, current); break;
            default: return;
        }

        // Handle JS floating point anomalies gracefully
        computation = Math.round(computation * 1e10) / 1e10;

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.readyToReset = true;
        this.updateDisplay();
    }

    percentage() {
        if (this.currentOperand === 'Error' || this.currentOperand === '') return;
        let val = parseFloat(this.currentOperand);
        if (isNaN(val)) return;
        this.currentOperand = (val / 100).toString();
        this.readyToReset = true;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentOperand === 'Error' || this.currentOperand === '' || this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.substring(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
        this.updateDisplay();
    }

    // Scientific functions execution
    computeSingleFunc(funcName, scientificIsRad) {
        if (this.currentOperand === 'Error' || this.currentOperand === '') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        let isRad = scientificIsRad;

        const toRad = deg => deg * (Math.PI / 180);
        const toDeg = rad => rad * (180 / Math.PI);

        switch (funcName) {
            case 'sin': result = isRad ? Math.sin(current) : Math.sin(toRad(current)); break;
            case 'cos': result = isRad ? Math.cos(current) : Math.cos(toRad(current)); break;
            case 'tan': result = isRad ? Math.tan(current) : Math.tan(toRad(current)); break;
            case 'asin': result = isRad ? Math.asin(current) : toDeg(Math.asin(current)); break;
            case 'acos': result = isRad ? Math.acos(current) : toDeg(Math.acos(current)); break;
            case 'atan': result = isRad ? Math.atan(current) : toDeg(Math.atan(current)); break;
            case 'log':
                if (current <= 0) result = NaN; else result = Math.log10(current); break;
            case 'ln':
                if (current <= 0) result = NaN; else result = Math.log(current); break;
            case 'sqrt':
                if (current < 0) result = NaN; else result = Math.sqrt(current); break;
            case 'cbrt':
                result = Math.cbrt(current); break;
            case 'square': result = Math.pow(current, 2); break;
            case 'cube': result = Math.pow(current, 3); break;
            case 'exp': result = Math.exp(current); break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    result = NaN;
                } else if (current > 170) {
                    result = Infinity; // Avoid extremely long loops
                } else {
                    result = 1;
                    for (let i = 2; i <= current; i++) result *= i;
                }
                break;
        }

        if (isNaN(result)) {
            this.currentOperand = "Error";
        } else {
            result = Math.round(result * 1e10) / 1e10;
            this.currentOperand = result.toString();
        }
        this.readyToReset = true;
        this.updateDisplay();
    }

    insertConstant(constant) {
        if (constant === 'pi') {
            this.currentOperand = Math.PI.toString();
        } else if (constant === 'e') {
            this.currentOperand = Math.E.toString();
        }
        this.readyToReset = true;
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayElement.innerText = this.currentOperand;

        // Adjust font size dynamically on basic calc if number is huge
        if (this.displayElement.id === 'basic-display' || this.displayElement.id === 'sci-display') {
            if (this.currentOperand.length > 12) {
                this.displayElement.classList.remove('text-5xl', 'text-4xl');
                this.displayElement.classList.add('text-3xl');
            } else {
                this.displayElement.classList.add(this.displayElement.id === 'basic-display' ? 'text-5xl' : 'text-4xl');
                this.displayElement.classList.remove('text-3xl');
            }
        }

        if (this.operation != null) {
            this.historyElement.innerText = `${this.previousOperand} ${this.operationDisplay}`;
        } else {
            this.historyElement.innerText = '';
        }
    }

    getDisplayValue() { return this.currentOperand; }
}

// Utility for copy to clipboard
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const text = targetEl.innerText || targetEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const toast = document.getElementById('toast');
                    if (toast) {
                        toast.classList.remove('translate-x-[200%]');
                        setTimeout(() => {
                            toast.classList.add('translate-x-[200%]');
                        }, 2000);
                    }
                });
            }
        });
    });
});
