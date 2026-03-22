/*!
 * task-management.js
 * Smart Task Tracker Logic for CalcSuit
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==== STATE MANAGEMENT ====
    // Retrieve tracking data from local storage
    const STORAGE_KEY = 'calcsuit_tasktracker';
    
    const defaultData = {
        tasks: {
            daily: [],
            weekly: [],
            monthly: []
        },
        stats: {
            totalCompleted: 0,
            totalCreated: 0,
            estimatedTimeTotal: 0,
            actualTimeTotal: 0,
            streakCounter: 0,
            lastLoginDate: new Date().toDateString()
        },
        history: {
            trendData: [], // { date, completedCount }
        }
    };

    let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
    
    // Check "Next Day" logic implicitly on load
    const todayStr = new Date().toDateString();
    if (appData.stats.lastLoginDate !== todayStr) {
        // We'll increment or drop streak based on yesterday's completition.
        // For simplicity, handle generic streak update logic:
        appData.stats.lastLoginDate = todayStr;
        saveData();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
        renderUI();
    }

    // ==== UI NAVIGATION ====
    const tabBtns = document.querySelectorAll('.task-tab-btn');
    const tabContents = document.querySelectorAll('.task-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             // Remove active class
             tabBtns.forEach(b => b.classList.remove('active'));
             tabContents.forEach(c => c.classList.remove('active'));
             
             // Activate target
             btn.classList.add('active');
             const targetId = btn.getAttribute('data-target');
             document.getElementById(targetId).classList.add('active');

             if(targetId === 'insights-tab') {
                 renderCharts();
                 generateSuggestions();
             }
        });
    });

    // ==== TASK CREATION ====
    document.getElementById('daily-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask('daily', {
            id: Date.now().toString(),
            title: document.getElementById('daily-title').value,
            priority: document.getElementById('daily-priority').value,
            category: document.getElementById('daily-category').value,
            estTime: parseInt(document.getElementById('daily-est-time').value, 10),
            actualTime: 0,
            completed: false,
            createdAt: new Date().getTime()
        });
        e.target.reset();
    });

    document.getElementById('weekly-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask('weekly', {
            id: Date.now().toString(),
            title: document.getElementById('weekly-title').value,
            priority: document.getElementById('weekly-priority').value,
            category: document.getElementById('weekly-category').value,
            estTime: 0, actualTime: 0, completed: false, createdAt: new Date().getTime()
        });
        e.target.reset();
    });

    document.getElementById('monthly-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask('monthly', {
            id: Date.now().toString(),
            title: document.getElementById('monthly-title').value,
            priority: 'Medium', // Hidden by default, just use medium
            category: document.getElementById('monthly-category').value,
            estTime: 0, actualTime: 0, completed: false, createdAt: new Date().getTime()
        });
        e.target.reset();
    });

    function addTask(type, taskObj) {
        appData.tasks[type].push(taskObj);
        appData.stats.totalCreated++;
        saveData();
    }

    // ==== RENDERING TASK LISTS ====
    function renderUI() {
        document.getElementById('streak-counter').textContent = appData.stats.streakCounter;
        
        // Render Lists
        renderList('daily', 'daily-task-list', 'daily-empty-state');
        renderList('weekly', 'weekly-task-list', null);
        renderList('monthly', 'monthly-task-list', null);

        // Update Daily Progress
        const dailyTasks = appData.tasks.daily;
        const totalDaily = dailyTasks.length;
        const compDaily = dailyTasks.filter(t => t.completed).length;
        const progressPct = totalDaily > 0 ? Math.round((compDaily / totalDaily) * 100) : 0;
        
        document.getElementById('daily-progress-bar').value = progressPct;
        document.getElementById('daily-progress-text').textContent = `${progressPct}% Completed`;

        // Update Scorecards
        updateScorecards();
    }

    function renderList(type, containerId, emptyStateId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const list = appData.tasks[type] || [];

        if (emptyStateId) {
            const emptyEl = document.getElementById(emptyStateId);
            if (list.length === 0) {
                emptyEl.classList.remove('hidden');
            } else {
                emptyEl.classList.add('hidden');
            }
        }

        // Sort: completed at bottom, highest priority at top
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        
        list.slice().sort((a,b) => {
            if(a.completed !== b.completed) return a.completed ? 1 : -1;
            return priorityScore[b.priority] - priorityScore[a.priority];
        }).forEach(task => {
            const taskEl = document.createElement('div');
            
            let pColor = task.priority === 'High' ? 'text-rose-500' : (task.priority === 'Low' ? 'text-emerald-500' : 'text-amber-500');
            let opacity = task.completed ? 'opacity-50 grayscale' : 'opacity-100';
            
            taskEl.className = `p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between transition-all ${opacity}`;
            
            taskEl.innerHTML = `
                <div class="flex items-center gap-3 overflow-hidden">
                    <button class="w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}" onclick="window.toggleTaskCompletion('${type}', '${task.id}')">
                        ${task.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
                    </button>
                    <div class="truncate">
                        <div class="text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}">${task.title}</div>
                        <div class="flex gap-2 text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">
                            <span class="${pColor}">${task.priority || 'Normal'}</span>
                            <span class="text-slate-500">&bull;</span>
                            <span class="text-indigo-400">${task.category}</span>
                            ${task.estTime ? `<span class="text-slate-500">&bull;</span><span class="text-slate-500">${task.estTime}m</span>` : ''}
                        </div>
                    </div>
                </div>
                <button class="text-slate-400 hover:text-rose-500 shrink-0 ml-2" onclick="window.deleteTask('${type}', '${task.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            container.appendChild(taskEl);
        });
    }

    // ==== TASK ACTIONS ====
    let taskPendingCompletion = null; // {type, id}
    
    window.toggleTaskCompletion = (type, id) => {
        const task = appData.tasks[type].find(t => t.id === id);
        if(!task) return;

        if(!task.completed) {
            if(type === 'daily' && task.estTime > 0) {
                // Open feedback modal for daily tasks
                taskPendingCompletion = { type, id };
                document.getElementById('modal-task-title').textContent = task.title;
                document.getElementById('modal-est').value = task.estTime;
                document.getElementById('modal-actual').value = task.estTime;
                
                const modal = document.getElementById('completion-modal');
                const modalContent = document.getElementById('completion-modal-content');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
                
                return; // halt and wait for modal
            } else {
                completeTask(type, id, 0);
            }
        } else {
            // Un-complete
            task.completed = false;
            appData.stats.totalCompleted--;
            saveData();
        }
    };

    window.deleteTask = (type, id) => {
        if(confirm("Are you sure you want to delete this?")) {
            appData.tasks[type] = appData.tasks[type].filter(t => t.id !== id);
            saveData();
        }
    }

    // Modal behavior
    document.getElementById('btn-modal-cancel').addEventListener('click', closeCompletionModal);
    document.getElementById('btn-modal-save').addEventListener('click', () => {
        const actVal = parseInt(document.getElementById('modal-actual').value, 10) || 0;
        if(taskPendingCompletion) {
            completeTask(taskPendingCompletion.type, taskPendingCompletion.id, actVal);
        }
        closeCompletionModal();
    });

    function closeCompletionModal() {
        const modal = document.getElementById('completion-modal');
        const modalContent = document.getElementById('completion-modal-content');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
        taskPendingCompletion = null;
    }

    function completeTask(type, id, actualTime) {
        const task = appData.tasks[type].find(t => t.id === id);
        if(task) {
            task.completed = true;
            task.actualTime = actualTime;
            appData.stats.totalCompleted++;
            
            if(task.estTime > 0) {
                appData.stats.estimatedTimeTotal += task.estTime;
                appData.stats.actualTimeTotal += actualTime;
            }

            // Streak Logic: If all daily tasks are completed, bump streak.
            const daily = appData.tasks.daily;
            if(daily.length > 0 && daily.every(t => t.completed)) {
                appData.stats.streakCounter++;
                // Add to trend data
                appData.history.trendData.push({ date: new Date().toLocaleDateString(), completedCount: daily.length });
            }

            saveData();
        }
    }

    // ==== PERFORMANCE EVALUATION ====
    function updateScorecards() {
        // Completion Rate
        const total = appData.stats.totalCreated;
        const comp = appData.stats.totalCompleted;
        const rate = total > 0 ? Math.round((comp / total) * 100) : 0;
        document.getElementById('insight-completion').textContent = `${rate}%`;

        // Time Efficiency
        const eTime = appData.stats.estimatedTimeTotal;
        const aTime = appData.stats.actualTimeTotal;
        let diffPct = "N/A";
        if (eTime > 0) {
            const eff = Math.round((eTime / aTime) * 100);
            diffPct = `${eff}%`;
        }
        document.getElementById('insight-efficiency').textContent = diffPct;

        // Consistency (Streak-based algorithm)
        // E.g. Streak / max_streak, or just scale of 0-10
        const consScore = Math.min((appData.stats.streakCounter / 30) * 10, 10).toFixed(1);
        document.getElementById('insight-consistency').textContent = `${consScore}/10`;
    }

    // Chart.js instances
    let catChart = null;
    let trChart = null;

    function renderCharts() {
        // Category data
        let catGroups = { 'Work': 0, 'Study': 0, 'Health': 0, 'Personal': 0 };
        appData.tasks.daily.forEach(t => { if(t.completed) catGroups[t.category]++; });
        appData.tasks.weekly.forEach(t => { if(t.completed) catGroups[t.category]++; });
        appData.tasks.monthly.forEach(t => { if(t.completed) catGroups[t.category]++; });

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#cbd5e1' : '#475569';

        const ctx1 = document.getElementById('categoryChart').getContext('2d');
        if(catChart) catChart.destroy();
        catChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(catGroups),
                datasets: [{
                    data: Object.values(catGroups),
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#c084fc'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } } }
        });

        // Trend data
        const trendLabels = appData.history.trendData.slice(-7).map(d => d.date);
        const trendValues = appData.history.trendData.slice(-7).map(d => d.completedCount);

        const ctx2 = document.getElementById('trendChart').getContext('2d');
        if(trChart) trChart.destroy();
        trChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: trendLabels.length ? trendLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Completed Tasks',
                    data: trendValues.length ? trendValues : [0,0,0,0,0],
                    backgroundColor: '#6366f1',
                    borderRadius: 4
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false, 
                plugins: { legend: { display:false } },
                scales: { 
                    x: { ticks: { color: textColor } },
                    y: { ticks: { color: textColor }, beginAtZero: true }
                }
            } 
        });
    }

    function generateSuggestions() {
        const uList = document.getElementById('smart-suggestions');
        const suggestions = [];
        
        const rate = document.getElementById('insight-completion').textContent.replace('%','');
        
        if(appData.tasks.daily.length > 8) suggestions.push("You have a high number of daily tasks. Try chunking them or moving some to 'Weekly'.");
        if(parseInt(rate) < 50 && appData.stats.totalCreated > 0) suggestions.push("Your completion rate is below 50%. Focus on setting fewer, highly prioritized tasks.");
        if(appData.stats.streakCounter > 3) suggestions.push("Great streak! You're building solid consistency.");

        if(appData.stats.estimatedTimeTotal > 0 && appData.stats.actualTimeTotal > appData.stats.estimatedTimeTotal * 1.5) {
            suggestions.push("Tasks are taking longer than estimated. Try breaking them into smaller chunks or adding buffer time.");
        }

        if(suggestions.length > 0) {
            uList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
        } else {
            uList.innerHTML = "<li>All looking good! Keep up the balanced work.</li>";
        }
    }

    // ==== PDF EXPORT ====
    function generatePDFReport(timeframe) {
        const doc = new window.jspdf.jsPDF();
        
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text(`Smart Task Tracker - ${timeframe.toUpperCase()} REPORT`, 15, 25);
        
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 50);
        
        // Stats
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Performance Summary', 15, 65);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        const total = appData.stats.totalCreated;
        const comp = appData.stats.totalCompleted;
        const rate = total > 0 ? Math.round((comp/total)*100) : 0;
        
        doc.text(`Completion Rate: ${rate}%`, 15, 75);
        doc.text(`Current Streak: ${appData.stats.streakCounter} days`, 15, 82);
        
        if (timeframe === 'daily') {
            doc.text(`Est vs Actual Time: ${appData.stats.estimatedTimeTotal} min vs ${appData.stats.actualTimeTotal} min`, 15, 89);
        }

        // Task List
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Task List (${timeframe})`, 15, 105);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        let yPos = 115;
        const tasks = appData.tasks[timeframe] || [];
        
        if(tasks.length === 0) {
            doc.text("No tasks found for this classification.", 15, yPos);
        } else {
            tasks.forEach((t, i) => {
                if(yPos > 280) { doc.addPage(); yPos = 20; }
                const status = t.completed ? "[X]" : "[ ]";
                doc.text(`${status} ${t.title} (${t.priority} / ${t.category})`, 15, yPos);
                yPos += 7;
            });
        }

        doc.save(`${timeframe}-task-report.pdf`);
    }

    document.getElementById('btn-export-daily').addEventListener('click', () => generatePDFReport('daily'));
    document.getElementById('btn-export-weekly').addEventListener('click', () => generatePDFReport('weekly'));
    document.getElementById('btn-export-monthly').addEventListener('click', () => generatePDFReport('monthly'));

    // ==== SIMULATE NEXT DAY (CARRY FORWARD) ====
    document.getElementById('btn-carry-forward').addEventListener('click', () => {
        if(confirm('Simulate Next Day? Unfinished Daily tasks will carry forward. Completed ones will be cleared.')) {
            // Keep uncompleted daily
            const unfinished = appData.tasks.daily.filter(t => !t.completed);
            
            // Record streak logic. If anything was unfinished, streak breaks
            if(unfinished.length > 0) {
                appData.stats.streakCounter = 0;
            }
            // else streak remains/grows
            
            appData.tasks.daily = unfinished;
            
            // Keep weekly and monthly intact, assume user clears them manually
            saveData();
            alert('Next day simulated. Checked tasks removed, missed tasks carried forward.');
        }
    });

    // Initial render
    renderUI();

});
