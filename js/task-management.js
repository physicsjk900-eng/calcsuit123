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

    function showToast(title, message, iconStr = 'fa-bell', colorClass = 'text-indigo-500') {
        let container = document.getElementById('toast-container');
        if(!container) return;
        const toast = document.createElement('div');
        toast.className = 'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-4 transform translate-y-[-20px] opacity-0 transition-all duration-300 w-80 pointer-events-auto z-[300]';
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 ${colorClass}">
                <i class="fas ${iconStr}"></i>
            </div>
            <div class="flex-1">
                <h4 class="text-sm font-bold text-slate-800 dark:text-white">${title}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${message}</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-[-20px]', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });
        
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
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
            details: document.getElementById('daily-details') ? document.getElementById('daily-details').value.trim() : "",
            actualTime: 0,
            completed: false,
            createdAt: new Date().getTime(),
            subtasks: []
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
            details: document.getElementById('weekly-details') ? document.getElementById('weekly-details').value.trim() : "",
            estTime: 0, actualTime: 0, completed: false, createdAt: new Date().getTime(), subtasks: []
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
            details: document.getElementById('monthly-details') ? document.getElementById('monthly-details').value.trim() : "",
            estTime: 0, actualTime: 0, completed: false, createdAt: new Date().getTime(), subtasks: []
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
                <div class="flex items-center gap-3 overflow-hidden flex-1">
                    <button class="w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}" onclick="window.toggleTaskCompletion('${type}', '${task.id}')">
                        ${task.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
                    </button>
                    <div class="truncate cursor-pointer flex-1 group" onclick="window.openTaskDetails('${type}', '${task.id}')">
                        <div class="text-sm font-semibold truncate group-hover:text-indigo-500 transition-colors ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}">${task.title}</div>
                        <div class="flex gap-2 text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">
                            <span class="${pColor}">${task.priority || 'Normal'}</span>
                            <span class="text-slate-500">&bull;</span>
                            <span class="text-indigo-400">${task.category}</span>
                            ${task.estTime ? `<span class="text-slate-500">&bull;</span><span class="text-slate-500">${task.estTime}m</span>` : ''}
                            ${task.subtasks && task.subtasks.length ? `<span class="text-slate-500">&bull;</span><span class="text-slate-500">${task.subtasks.filter(s=>s.done).length}/${task.subtasks.length} subtasks</span>` : ''}
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

    // ==== TASK DETAILS & SUBTASKS ====
    let currentOpenTask = null; // {type, id}
    const tdModal = document.getElementById('tracker-detail-modal');
    const tdSubtasksList = document.getElementById('td-subtasks-list');
    
    window.openTaskDetails = (type, id) => {
        const task = appData.tasks[type].find(t => t.id === id);
        if(!task) return;
        currentOpenTask = { type, id };
        if(!task.subtasks) task.subtasks = []; // Migration for old tasks
        
        document.getElementById('td-title').textContent = task.title;
        document.getElementById('td-category').textContent = task.category;
        document.getElementById('td-priority').textContent = task.priority;
        
        const estBadge = document.getElementById('td-est');
        if(task.estTime) {
            estBadge.textContent = `${task.estTime}m`;
            estBadge.classList.remove('hidden');
        } else {
            estBadge.classList.add('hidden');
        }
        
        const detailDisplay = document.getElementById('td-details');
        if(detailDisplay) {
            detailDisplay.textContent = task.details && task.details.trim() !== "" ? task.details : "No details provided.";
        }
        
        // Hide edit form if open
        document.getElementById('td-edit-form').classList.add('hidden');
        
        renderSubtasks();
        
        tdModal.classList.remove('hidden');
        tdModal.classList.add('flex');
        setTimeout(() => {
            tdModal.firstElementChild.classList.remove('scale-95', 'opacity-0');
            tdModal.firstElementChild.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    if(document.getElementById('tracker-detail-close')) {
        document.getElementById('tracker-detail-close').addEventListener('click', closeTdModal);
    }
    
    function closeTdModal() {
        if(tdModal) {
            tdModal.firstElementChild.classList.remove('scale-100', 'opacity-100');
            tdModal.firstElementChild.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                tdModal.classList.add('hidden');
                tdModal.classList.remove('flex');
                currentOpenTask = null;
            }, 300);
        }
    }
    
    function renderSubtasks() {
        if(!currentOpenTask || !tdSubtasksList) return;
        const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
        tdSubtasksList.innerHTML = '';
        if(task && task.subtasks) {
            task.subtasks.forEach((st, idx) => {
                const el = document.createElement('div');
                el.className = 'flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50';
                el.innerHTML = `
                    <div class="flex items-center gap-2 flex-1 overflow-hidden cursor-pointer group" onclick="window.toggleSubtask(${idx})">
                        <div class="w-4 h-4 rounded border flex items-center justify-center shrink-0 ${st.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600'}">
                            ${st.done ? '<i class="fas fa-check text-[8px]"></i>' : ''}
                        </div>
                        <span class="truncate ${st.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-500'}">${st.title}</span>
                    </div>
                    <button class="text-slate-400 hover:text-rose-500 ml-2" onclick="window.deleteSubtask(${idx})"><i class="fas fa-times text-xs"></i></button>
                `;
                tdSubtasksList.appendChild(el);
            });
        }
    }

    window.toggleSubtask = (idx) => {
        if(!currentOpenTask) return;
        const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
        task.subtasks[idx].done = !task.subtasks[idx].done;
        saveData();
        renderSubtasks();
    };

    window.deleteSubtask = (idx) => {
        if(!currentOpenTask) return;
        const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
        task.subtasks.splice(idx, 1);
        saveData();
        renderSubtasks();
    };

    if(document.getElementById('td-btn-add-subtask')) {
        document.getElementById('td-btn-add-subtask').addEventListener('click', () => {
            const input = document.getElementById('td-new-subtask');
            if(!input.value.trim() || !currentOpenTask) return;
            const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
            if(!task.subtasks) task.subtasks = [];
            task.subtasks.push({ title: input.value.trim(), done: false });
            input.value = '';
            saveData();
            renderSubtasks();
        });

        document.getElementById('td-new-subtask').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') document.getElementById('td-btn-add-subtask').click();
        });
    }

    // ==== EDITING TASK ====
    if(document.getElementById('td-btn-edit')) {
        document.getElementById('td-btn-edit').addEventListener('click', () => {
            if(!currentOpenTask) return;
            const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
            document.getElementById('td-edit-form').classList.remove('hidden');
            document.getElementById('td-edit-title').value = task.title;
            document.getElementById('td-edit-category').value = task.category;
            document.getElementById('td-edit-priority').value = task.priority;
            document.getElementById('td-edit-est').value = task.estTime || 0;
            if(document.getElementById('td-edit-details')) {
                document.getElementById('td-edit-details').value = task.details || "";
            }
        });

        document.getElementById('td-btn-cancel-edit').addEventListener('click', () => {
            document.getElementById('td-edit-form').classList.add('hidden');
        });

        document.getElementById('td-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if(!currentOpenTask) return;
            const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
            task.title = document.getElementById('td-edit-title').value;
            task.category = document.getElementById('td-edit-category').value;
            task.priority = document.getElementById('td-edit-priority').value;
            task.estTime = parseInt(document.getElementById('td-edit-est').value) || 0;
            if(document.getElementById('td-edit-details')) {
                task.details = document.getElementById('td-edit-details').value;
            }
            
            saveData();
            // Update modal display visually
            document.getElementById('td-title').textContent = task.title;
            document.getElementById('td-category').textContent = task.category;
            document.getElementById('td-priority').textContent = task.priority;
            if(task.estTime) {
                document.getElementById('td-est').textContent = `${task.estTime}m`;
                document.getElementById('td-est').classList.remove('hidden');
            } else {
                document.getElementById('td-est').classList.add('hidden');
            }
            if(document.getElementById('td-details')) {
                document.getElementById('td-details').textContent = task.details && task.details.trim() !== "" ? task.details : "No details provided.";
            }
            document.getElementById('td-edit-form').classList.add('hidden');
        });
    }

    // ==== POMODORO TIMER LITE ====
    let focusInterval = null;
    let focusTimeLeft = 25 * 60;
    let isPaused = false;
    let preFocusTimerTask = null;

    const focusOverlay = document.getElementById('focus-overlay');
    const focusDisplay = document.getElementById('focus-timer-display');
    const toggleBtn = document.getElementById('focus-toggle-btn');
    const toggleText = document.getElementById('focus-toggle-text');

    if(document.getElementById('td-btn-focus')) {
        document.getElementById('td-btn-focus').addEventListener('click', () => {
            if(!currentOpenTask) return;
            const task = appData.tasks[currentOpenTask.type].find(t => t.id === currentOpenTask.id);
            preFocusTimerTask = task;
            document.getElementById('focus-task-title').textContent = task.title;
            
            closeTdModal();
            
            focusOverlay.classList.remove('hidden');
            focusOverlay.classList.add('flex');
            setTimeout(() => focusOverlay.classList.replace('opacity-0', 'opacity-100'), 10);
            
            let estMins = parseInt(task.estTime) || 25;
            focusTimeLeft = estMins * 60;
            isPaused = false;
            updateFocusDisplay();
            toggleText.textContent = "Pause";
            toggleBtn.innerHTML = '<i class="fas fa-pause group-hover:scale-110 transition-transform"></i> <span id="focus-toggle-text">Pause</span>';
            
            clearInterval(focusInterval);
            focusInterval = setInterval(() => {
                if(!isPaused && focusTimeLeft > 0) {
                    focusTimeLeft--;
                    updateFocusDisplay();
                } else if (focusTimeLeft <= 0) {
                    clearInterval(focusInterval);
                    finishPomodoro();
                }
            }, 1000);
        });

        function updateFocusDisplay() {
            const m = Math.floor(focusTimeLeft / 60).toString().padStart(2, '0');
            const s = (focusTimeLeft % 60).toString().padStart(2, '0');
            focusDisplay.textContent = `${m}:${s}`;
            document.getElementById('focus-timer-status').textContent = `${m} Minutes Remaining`;
        }

        toggleBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            const tgSpan = document.getElementById('focus-toggle-text');
            if(isPaused) {
                tgSpan.textContent = "Resume";
                toggleBtn.firstElementChild.className = "fas fa-play group-hover:scale-110 transition-transform";
                document.getElementById('focus-timer-status').textContent = "Timer Paused";
            } else {
                tgSpan.textContent = "Pause";
                toggleBtn.firstElementChild.className = "fas fa-pause group-hover:scale-110 transition-transform";
                updateFocusDisplay();
            }
        });

        document.getElementById('focus-stop-btn').addEventListener('click', () => {
            finishPomodoro();
        });

        document.getElementById('focus-close-btn').addEventListener('click', () => {
            clearInterval(focusInterval);
            hideFocusOverlay();
        });

        function finishPomodoro() {
            clearInterval(focusInterval);
            let estMins = preFocusTimerTask ? (parseInt(preFocusTimerTask.estTime) || 25) : 25;
            const elapsedS = (estMins * 60) - focusTimeLeft;
            const elapsedM = Math.round(elapsedS / 60);
            
            if (preFocusTimerTask && elapsedM > 0) {
                preFocusTimerTask.actualTime = (preFocusTimerTask.actualTime || 0) + elapsedM;
                saveData();
                showToast && showToast('Focus Session complete!', `Added ${elapsedM} minutes to task execution!`);
            }
            hideFocusOverlay();
        }

        function hideFocusOverlay() {
            focusOverlay.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                focusOverlay.classList.add('hidden');
                focusOverlay.classList.remove('flex');
            }, 500);
        }
    }

    // Initial render
    renderUI();

});
