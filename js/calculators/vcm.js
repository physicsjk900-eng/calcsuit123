document.addEventListener('DOMContentLoaded', () => {

    const inputs = {
        mass: document.getElementById('vcm-mass'),
        radius: document.getElementById('vcm-radius'),
        velocity: document.getElementById('vcm-velocity'),
        gravity: document.getElementById('vcm-gravity')
    };

    const statusEls = {
        box: document.getElementById('vcm-status-box'),
        reqLoop: document.getElementById('vcm-req-loop'),
        reqSlack: document.getElementById('vcm-req-slack'),
        slackAngleRow: document.getElementById('slack-angle-row'),
        slackAngle: document.getElementById('vcm-slack-angle'),
        totalEnergy: document.getElementById('vcm-total-energy')
    };

    const liveEls = {
        theta: document.getElementById('live-theta'),
        tension: document.getElementById('live-tension'),
        velocity: document.getElementById('live-velocity'),
        height: document.getElementById('live-height')
    };

    const slider = document.getElementById('theta-slider');
    const vcmArm = document.getElementById('vcm-arm');
    const canvas = document.getElementById('vcmChart');
    
    let chartInstance = null;
    let currentData = []; // Array of {theta, tension, velocity, height, energy}

    function calculatePhysics() {
        const m = parseFloat(inputs.mass.value) || 0;
        const R = parseFloat(inputs.radius.value) || 0;
        const u = parseFloat(inputs.velocity.value) || 0;
        const g = parseFloat(inputs.gravity.value) || 0;

        if (m <= 0 || R <= 0 || g <= 0) return;

        // Critical Velocities
        const vLoop = Math.sqrt(5 * g * R);
        const vSlack = Math.sqrt(2 * g * R);

        statusEls.reqLoop.textContent = `${vLoop.toFixed(2)} m/s`;
        statusEls.reqSlack.textContent = `${vSlack.toFixed(2)} m/s`;
        statusEls.slackAngleRow.classList.add('hidden');

        // Status Determination
        if (u >= vLoop) {
            statusEls.box.innerHTML = `<span class="text-emerald-400"><i class="fas fa-check-circle mr-2"></i> Completes Loop</span>`;
        } else if (u > vSlack) {
            statusEls.box.innerHTML = `<span class="text-amber-400"><i class="fas fa-exclamation-triangle mr-2"></i> String Goes Slack</span>`;
            statusEls.slackAngleRow.classList.remove('hidden');
        } else {
            statusEls.box.innerHTML = `<span class="text-sky-400"><i class="fas fa-sync-alt mr-2"></i> Pendulum Motion</span>`;
        }

        // Generate Data Array (0 to 180 degrees)
        currentData = [];
        let slackDetected = false;
        let slackAngleVal = 0;
        
        const totalE = 0.5 * m * u * u; // Potential energy at bottom is 0
        statusEls.totalEnergy.textContent = `${totalE.toFixed(2)} J`;

        for (let theta = 0; theta <= 180; theta++) {
            const rad = theta * (Math.PI / 180);
            const h = R * (1 - Math.cos(rad));
            const PE = m * g * h;
            const KE = totalE - PE;
            
            let v = 0;
            let T = 0;

            if (KE >= 0) {
                v = Math.sqrt((2 * KE) / m);
                T = (m * v * v) / R + m * g * Math.cos(rad);
            } else {
                // Cannot reach this angle (Pendulum max angle exceeded)
                v = 0;
                T = 0;
            }

            if (u > vSlack && u < vLoop && !slackDetected && T <= 0 && KE >= 0) {
                slackDetected = true;
                slackAngleVal = theta;
                statusEls.slackAngle.textContent = `${theta}°`;
            }

            // Clip negative tension (string can't push)
            if (T < 0) T = 0;

            currentData.push({
                theta: theta,
                tension: T,
                velocity: v,
                height: h,
                energy: totalE,
                isReachable: KE >= 0 && (!slackDetected || theta <= slackAngleVal)
            });
        }

        renderChart();
        updateScrubber(parseInt(slider.value));
    }

    function renderChart() {
        if (!canvas) return;

        const labels = currentData.map(d => `${d.theta}°`);
        const tensions = currentData.map(d => d.isReachable ? d.tension : null);

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tension (N)',
                    data: tensions,
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4,
                    spanGaps: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#a855f7',
                        bodyColor: '#fff',
                        borderColor: '#334155',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `Tension: ${context.parsed.y.toFixed(2)} N`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { color: '#94a3b8', maxTicksLimit: 10 }
                    },
                    y: {
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { color: '#94a3b8' },
                        title: { display: true, text: 'Tension (N)', color: '#94a3b8' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateScrubber(theta) {
        if (!currentData[theta]) return;
        const data = currentData[theta];

        // Update Text
        liveEls.theta.textContent = `${data.theta}°`;
        liveEls.tension.textContent = data.isReachable ? `${data.tension.toFixed(2)} N` : '0 N (Slack/Stop)';
        liveEls.velocity.textContent = data.isReachable ? `${data.velocity.toFixed(2)} m/s` : '0 m/s';
        liveEls.height.textContent = `${data.height.toFixed(2)} m`;

        // Update Animation (0 deg = bottom = 180deg transform. theta degrees = 180 + theta)
        vcmArm.style.transform = `rotate(${180 + data.theta}deg)`;

        // Update Chart Tooltip programmatically
        if (chartInstance && data.isReachable) {
            const tooltip = chartInstance.tooltip;
            const chart = chartInstance;
            if (tooltip.getActiveElements().length === 0 || tooltip.getActiveElements()[0].index !== theta) {
                chart.setActiveElements([{ datasetIndex: 0, index: theta }]);
                chart.tooltip.setActiveElements([{ datasetIndex: 0, index: theta }], { x: 0, y: 0 });
                chart.update();
            }
        }
    }

    // Event Listeners
    Object.values(inputs).forEach(input => {
        if(input) {
            input.addEventListener('input', calculatePhysics);
        }
    });

    if(slider) {
        slider.addEventListener('input', (e) => {
            updateScrubber(parseInt(e.target.value));
        });
    }

    // Init
    calculatePhysics();
});
