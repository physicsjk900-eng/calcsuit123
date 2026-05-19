let myChart;

function runSimulation() {
    const baseSavings = parseFloat(document.getElementById('base-savings').value);
    const pivot = document.getElementById('pivot-type').value;
    const risk = document.getElementById('risk-level').value / 100;

    let years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let finData = [];
    let currentWealth = baseSavings;
    let happinessScore = 70; // Starting baseline

    // Probability Multipliers based on Pivot
    const pivotLogic = {
        job_change: { growth: 1.15, risk: 0.2, happy: 10 },
        move_city: { growth: 1.05, risk: 0.1, happy: 5 },
        buy_home: { growth: 1.08, risk: 0.05, happy: 15 },
        family: { growth: 0.90, risk: 0.05, happy: 25 }
    };

    const config = pivotLogic[pivot];

    // 10-Year Algorithm Loop
    for (let i = 1; i <= 10; i++) {
        // Stochastic Growth: Random variation based on risk level
        let variance = 1 + (Math.random() - 0.5) * risk;
        currentWealth = (currentWealth * config.growth) * variance;

        // Compound Happiness Utility
        happinessScore += (config.happy * (1 - risk)) - (i * 0.5);
        finData.push(Math.round(currentWealth));
    }

    updateUI(finData, Math.min(Math.round(happinessScore), 100));
}

function updateUI(data, happy) {
    document.getElementById('fin-result').innerText = "₹" + data[9].toLocaleString();
    document.getElementById('hap-result').innerText = happy + "/100";

    const ctx = document.getElementById('projectionChart').getContext('2d');

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10'],
            datasets: [{
                label: 'Wealth Projection (₹)',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false } } }
        }
    });

    const insight = document.getElementById('insight-box');
    if (happy > 80) {
        insight.innerText = "Insight: This pivot shows high fulfillment potential with sustainable financial compounding.";
    } else if (happy < 50) {
        insight.innerText = "Insight: High financial growth, but significant 'Time Debt' or stress risk detected.";
    } else {
        insight.innerText = "Insight: Stable trajectory. Consider increasing risk for higher financial reward.";
    }
}