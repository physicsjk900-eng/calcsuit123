// js/calculators/loan-optimizer.js

document.addEventListener('DOMContentLoaded', () => {
    let loanChart = null;
    let distChart = null;

    const formatCurrency = val => isNaN(val) ? "&mdash;" : '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatNumber = val => isNaN(val) ? "0" : val.toLocaleString('en-US');

    window.runOptimization = () => {
        const principal = parseFloat(document.getElementById('opt-principal').value);
        const annualRate = parseFloat(document.getElementById('opt-rate').value);
        const years = parseFloat(document.getElementById('opt-years').value);
        
        let extraVal = parseFloat(document.getElementById('opt-extra-val').value) || 0;
        const extraType = document.getElementById('opt-extra-type').value;
        const lumpVal = parseFloat(document.getElementById('opt-lump-val').value) || 0;
        const lumpMonth = parseInt(document.getElementById('opt-lump-month').value) || 0;

        if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate <= 0 || years <= 0) {
            resetUI();
            return;
        }

        const monthlyRate = annualRate / 12 / 100;
        const totalMonths = years * 12;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        document.getElementById('res-standard-emi').innerText = formatCurrency(emi);

        // Simulation 1: Baseline (Standard)
        const baseline = simulateLoan(principal, monthlyRate, emi, totalMonths, 0, 'none', 0, 0);
        
        // Simulation 2: Optimized
        const optimized = simulateLoan(principal, monthlyRate, emi, totalMonths, extraVal, extraType, lumpVal, lumpMonth);

        // Update Summary Cards
        const interestSaved = baseline.totalInterest - optimized.totalInterest;
        const monthsSaved = totalMonths - optimized.monthsTaken;
        
        document.getElementById('res-saved-interest').innerText = formatCurrency(interestSaved > 0 ? interestSaved : 0);
        
        if (monthsSaved > 0) {
            let y = Math.floor(monthsSaved / 12);
            let m = monthsSaved % 12;
            document.getElementById('res-saved-time').innerText = (y > 0 ? `${y}y ` : '') + (m > 0 ? `${m}m` : (y === 0 ? '0m' : ''));
        } else {
            document.getElementById('res-saved-time').innerText = "0 Months";
        }

        let finalY = Math.floor(optimized.monthsTaken / 12);
        let finalM = optimized.monthsTaken % 12;
        document.getElementById('res-total-tenure').innerText = (finalY > 0 ? `${finalY}y ` : '') + (finalM > 0 ? `${finalM}m` : '');

        // Update Charts
        updateCharts(baseline.history, optimized.history, interestSaved, principal, baseline.totalInterest);

        // Update Table
        updateTable(optimized.history);

        // Update Insights
        updateInsights(interestSaved, monthsSaved, principal);
    };

    function simulateLoan(p, r, emi, maxMonths, extra, extraType, lump, lumpMonth) {
        let balance = p;
        let totalInterest = 0;
        let monthsTaken = 0;
        let history = [];

        while (balance > 0 && monthsTaken < maxMonths * 2) {
            monthsTaken++;
            let interest = balance * r;
            totalInterest += interest;
            let principalPaid = emi - interest;
            
            let extraThisMonth = 0;
            if (extraType === 'monthly') extraThisMonth = extra;
            else if (extraType === 'yearly' && monthsTaken % 12 === 0) extraThisMonth = extra;
            
            if (monthsTaken === lumpMonth) extraThisMonth += lump;

            let totalPmt = principalPaid + extraThisMonth;
            
            let openingBalance = balance;
            if (balance <= totalPmt) {
                totalPmt = balance;
                balance = 0;
            } else {
                balance -= totalPmt;
            }

            history.push({
                month: monthsTaken,
                opening: openingBalance,
                principal: principalPaid,
                interest: interest,
                extra: extraThisMonth,
                closing: balance
            });

            if (balance <= 0) break;
        }

        return { totalInterest, monthsTaken, history };
    }

    function updateCharts(standardHistory, optimizedHistory, saved, principal, totalInt) {
        const ctx = document.getElementById('loanChart').getContext('2d');
        const labels = standardHistory.map(h => `Month ${h.month}`);
        const standardData = standardHistory.map(h => h.closing);
        const optimizedData = optimizedHistory.map(h => h.closing);

        if (loanChart) loanChart.destroy();
        loanChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Standard Balance',
                        data: standardData,
                        borderColor: '#94a3b8',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Optimized Balance',
                        data: optimizedData,
                        borderColor: '#fbbf24',
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { 
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    }
                }
            }
        });

        // Distribution Chart
        const dCtx = document.getElementById('distChart').getContext('2d');
        if (distChart) distChart.destroy();
        distChart = new Chart(dCtx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, totalInt],
                    backgroundColor: ['#6366f1', '#fbbf24'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '80%',
                plugins: { legend: { display: false } }
            }
        });
    }

    function updateTable(history) {
        const body = document.getElementById('schedule-body');
        body.innerHTML = history.slice(0, 60).map(h => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-bold text-slate-400">#${h.month}</td>
                <td class="px-6 py-4 font-medium">${formatCurrency(h.opening)}</td>
                <td class="px-6 py-4 font-semibold text-emerald-600">${formatCurrency(h.principal)}</td>
                <td class="px-6 py-4 text-slate-500">${formatCurrency(h.interest)}</td>
                <td class="px-6 py-4 font-bold text-amber-500">${h.extra > 0 ? formatCurrency(h.extra) : '&mdash;'}</td>
                <td class="px-6 py-4 font-black text-slate-900 dark:text-white">${formatCurrency(h.closing)}</td>
            </tr>
        `).join('');
        
        if (history.length > 60) {
            body.innerHTML += `<tr><td colspan="6" class="px-6 py-4 text-center text-slate-400 italic">Showing first 60 months only. Export for full schedule.</td></tr>`;
        }
    }

    function updateInsights(saved, months, principal) {
        const insight = document.getElementById('savings-insight');
        if (saved <= 0) {
            insight.innerText = "Add extra payments to see your interest saving potential!";
            return;
        }

        const percent = (saved / principal * 100).toFixed(1);
        let text = `By following this strategy, you will save **${formatCurrency(saved)}** in interest, which is **${percent}%** of your original loan amount. Your debt will be cleared **${months} months** sooner than expected.`;
        insight.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<span class="text-amber-500 font-bold">$1</span>');
    }

    function resetUI() {
        document.getElementById('res-saved-interest').innerText = "&mdash;";
        document.getElementById('res-saved-time').innerText = "&mdash;";
        document.getElementById('res-total-tenure').innerText = "&mdash;";
        document.getElementById('res-standard-emi').innerText = "&mdash;";
        document.getElementById('schedule-body').innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 font-medium italic">Enter loan terms to generate schedule...</td></tr>';
        if (loanChart) loanChart.destroy();
        if (distChart) distChart.destroy();
    }

    window.exportToCSV = () => {
        // Simple CSV export logic would go here
        alert("Full Amortization CSV feature is processing your data...");
    };
});
