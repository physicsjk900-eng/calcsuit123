// js/calculators/matrix.js
document.addEventListener('DOMContentLoaded', () => {
    const dimSelect = document.getElementById('matrix-dim');
    const gridA = document.getElementById('matrix-a-grid');
    const gridB = document.getElementById('matrix-b-grid');
    const clearBtn = document.getElementById('clear-btn');
    const opBtns = document.querySelectorAll('.op-btn');
    const resArea = document.getElementById('matrix-results-area');
    const resScalarWrap = document.getElementById('result-scalar-wrapper');
    const resMatrixWrap = document.getElementById('result-matrix-wrapper');
    const resScalar = document.getElementById('matrix-res-scalar');
    const resGrid = document.getElementById('matrix-res-grid');
    const resError = document.getElementById('result-error');
    const resTitle = document.getElementById('result-title');

    let currentDim = 3;

    function renderGrids(dim) {
        currentDim = dim;
        gridA.style.gridTemplateColumns = `repeat(${dim}, minmax(0, 1fr))`;
        gridB.style.gridTemplateColumns = `repeat(${dim}, minmax(0, 1fr))`;
        resGrid.style.gridTemplateColumns = `repeat(${dim}, minmax(0, 1fr))`;

        gridA.innerHTML = '';
        gridB.innerHTML = '';

        for (let r = 0; r < dim; r++) {
            for (let c = 0; c < dim; c++) {
                gridA.innerHTML += `<input type="number" id="ma-${r}-${c}" class="perc-input w-12 sm:w-16 md:w-20 text-center font-bold text-base md:text-lg py-2 md:py-3 transition-colors duration-300 bg-white/50 dark:bg-slate-900/50 border-transparent focus:border-sky-400 focus:ring focus:ring-sky-200 dark:focus:ring-sky-900/30 rounded-lg outline-none">`;
                gridB.innerHTML += `<input type="number" id="mb-${r}-${c}" class="perc-input w-12 sm:w-16 md:w-20 text-center font-bold text-base md:text-lg py-2 md:py-3 transition-colors duration-300 bg-white/50 dark:bg-slate-900/50 border-transparent focus:border-emerald-400 focus:ring focus:ring-emerald-200 dark:focus:ring-emerald-900/30 rounded-lg outline-none">`;
            }
        }

        // Brackets are now stretched via CSS flexbox automatically

        hideResult();
    }

    dimSelect.addEventListener('change', (e) => {
        renderGrids(parseInt(e.target.value));
    });

    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('#matrix-a-grid input, #matrix-b-grid input').forEach(inp => inp.value = '');
        hideResult();
    });

    function getMatrix(prefix) {
        const m = [];
        let hasAtLeastOneValue = false;

        for (let r = 0; r < currentDim; r++) {
            m[r] = [];
            for (let c = 0; c < currentDim; c++) {
                const inputVal = document.getElementById(`${prefix}-${r}-${c}`).value.trim();
                if (inputVal !== '') hasAtLeastOneValue = true;
                const val = inputVal === '' ? 0 : parseFloat(inputVal);
                if (isNaN(val)) throw new Error(`Invalid number in Matrix ${prefix.toUpperCase().replace('M', '')}`);
                m[r][c] = val;
            }
        }

        if (!hasAtLeastOneValue) {
            throw new Error(`Matrix ${prefix.toUpperCase().replace('M', '')} is completely empty. Please enter at least one value.`);
        }

        return m;
    }

    function hideResult() {
        resArea.classList.add('hidden');
        resError.classList.add('hidden');
        resScalarWrap.classList.add('hidden');
        resMatrixWrap.classList.add('hidden');
    }

    function showError(msg) {
        resArea.classList.remove('hidden');
        resError.textContent = msg;
        resError.classList.remove('hidden');
        resScalarWrap.classList.add('hidden');
        resMatrixWrap.classList.add('hidden');
    }

    function showScalar(val, title) {
        resArea.classList.remove('hidden');
        resError.classList.add('hidden');
        resMatrixWrap.classList.add('hidden');
        resScalarWrap.classList.remove('hidden');
        resTitle.textContent = title;
        resScalar.textContent = formatNum(val);
    }

    function showMatrix(m, title) {
        resArea.classList.remove('hidden');
        resError.classList.add('hidden');
        resScalarWrap.classList.add('hidden');
        resMatrixWrap.classList.remove('hidden');
        resTitle.textContent = title;

        resGrid.innerHTML = '';
        for (let r = 0; r < currentDim; r++) {
            for (let c = 0; c < currentDim; c++) {
                resGrid.innerHTML += `<div class="bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 w-12 sm:w-16 md:w-20 text-center font-bold text-base md:text-lg py-2 md:py-3 rounded border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center">${formatNum(m[r][c])}</div>`;
            }
        }
        // Brackets are now stretched via CSS flexbox automatically
    }

    function formatNum(num) {
        // Handle floating point precision issues (e.g. 0.00000000004 -> 0)
        if (Math.abs(num) < 1e-10) return 0;
        if (Number.isInteger(num)) return num;
        // Strip trailing zeros after 4 decimals
        return parseFloat(num.toFixed(4));
    }

    // Math Functions
    function add(a, b) { return a.map((r, i) => r.map((c, j) => c + b[i][j])); }
    function sub(a, b) { return a.map((r, i) => r.map((c, j) => c - b[i][j])); }
    function mul(a, b) {
        const res = Array(currentDim).fill(0).map(() => Array(currentDim).fill(0));
        for (let i = 0; i < currentDim; i++) {
            for (let j = 0; j < currentDim; j++) {
                for (let k = 0; k < currentDim; k++) {
                    res[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return res;
    }

    function determinant(m) {
        const n = m.length;
        if (n === 1) return m[0][0];
        if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        let det = 0;
        for (let i = 0; i < n; i++) {
            const minor = getMinor(m, 0, i);
            det += Math.pow(-1, i) * m[0][i] * determinant(minor);
        }
        return det;
    }

    function getMinor(m, row, col) {
        return m.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
    }

    function transpose(m) {
        return m[0].map((_, colIndex) => m.map(row => row[colIndex]));
    }

    function trace(m) {
        let t = 0;
        for (let i = 0; i < m.length; i++) t += m[i][i];
        return t;
    }

    function cofactorMatrix(m) {
        const n = m.length;
        const cof = Array(n).fill(0).map(() => Array(n).fill(0));
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                cof[r][c] = Math.pow(-1, r + c) * determinant(getMinor(m, r, c));
            }
        }
        return cof;
    }

    function minorsMatrix(m) {
        const n = m.length;
        const minM = Array(n).fill(0).map(() => Array(n).fill(0));
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                minM[r][c] = determinant(getMinor(m, r, c));
            }
        }
        return minM;
    }

    function adjugate(m) {
        return transpose(cofactorMatrix(m));
    }

    function inverse(m) {
        const det = determinant(m);
        if (Math.abs(det) < 1e-10) throw new Error("Determinant is 0. Inverse does not exist.");
        const adj = adjugate(m);
        return adj.map(row => row.map(val => val / det));
    }

    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const op = btn.dataset.op;
            try {
                let A;
                try { A = getMatrix('ma'); } catch (e) { throw new Error(e.message); }

                let B;
                if (['add', 'sub', 'mul'].includes(op)) {
                    try { B = getMatrix('mb'); } catch (e) { throw new Error(e.message); }
                }

                switch (op) {
                    case 'add': showMatrix(add(A, B), "Result: A + B"); break;
                    case 'sub': showMatrix(sub(A, B), "Result: A - B"); break;
                    case 'mul': showMatrix(mul(A, B), "Result: A × B"); break;
                    case 'det': showScalar(determinant(A), "Determinant |A|"); break;
                    case 'trace': showScalar(trace(A), "Trace tr(A)"); break;
                    case 'trans': showMatrix(transpose(A), "Transpose Aᵀ"); break;
                    case 'inv': showMatrix(inverse(A), "Inverse A⁻¹"); break;
                    case 'adj': showMatrix(adjugate(A), "Adjugate adj(A)"); break;
                    case 'cof': showMatrix(cofactorMatrix(A), "Cofactor Matrix"); break;
                    case 'minors': showMatrix(minorsMatrix(A), "Matrix of Minors"); break;
                }

                // Smooth scroll to results
                setTimeout(() => {
                    resArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);

            } catch (err) {
                showError(err.message);
                setTimeout(() => {
                    resArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);
            }
        });
    });

    // Copy to clipboard logic
    document.querySelectorAll('.copy-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            let textToCopy = '';

            if (targetId) {
                textToCopy = document.getElementById(targetId).textContent;
            } else if (btn.id === 'copy-matrix-btn') {
                // Formatting matrix copy
                const gridItems = Array.from(resGrid.children);
                for (let i = 0; i < currentDim; i++) {
                    const row = gridItems.slice(i * currentDim, (i + 1) * currentDim).map(div => div.textContent).join('\t');
                    textToCopy += row + '\n';
                }
            }

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy.trim());
                const icon = btn.querySelector('i');
                icon.className = 'fas fa-check text-emerald-400';
                setTimeout(() => icon.className = 'fas fa-copy', 2000);
            }
        });
    });

    // Initialize layout
    renderGrids(3);
});
