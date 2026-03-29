/*!
 * task-calendar.js
 * Calendar rendering and PDF export using html2canvas & jsPDF
 */

document.addEventListener('DOMContentLoaded', () => {

    const STORAGE_KEY = 'calcsuit_calendar_events';
    let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // --- Authentication System ---
    const authBtn = document.getElementById('auth-btn-header');
    const authStatusText = document.getElementById('auth-status-text');
    const authModal = document.getElementById('auth-modal');
    const authModalDialog = document.getElementById('auth-modal-dialog');
    const authForm = document.getElementById('auth-form');
    
    function updateAuthUI() {
        const user = localStorage.getItem('calcSuitUser');
        if (user && authStatusText) {
            authStatusText.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400">Hi, ${user}</span>`;
            if (authBtn) authBtn.classList.add('bg-indigo-50', 'border-indigo-200', 'dark:bg-indigo-900/30', 'dark:border-indigo-700');
        } else if (authStatusText) {
            authStatusText.textContent = 'Sign In';
            if (authBtn) authBtn.classList.remove('bg-indigo-50', 'border-indigo-200', 'dark:bg-indigo-900/30', 'dark:border-indigo-700');
        }
    }
    updateAuthUI();

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            const user = localStorage.getItem('calcSuitUser');
            if (user) {
                if(confirm(`Log out of ${user}'s profile?`)) {
                    localStorage.removeItem('calcSuitUser');
                    updateAuthUI();
                }
            } else {
                authModal.classList.remove('hidden');
                authModal.classList.add('flex');
                setTimeout(() => {
                    authModalDialog.classList.remove('scale-95', 'opacity-0');
                    authModalDialog.classList.add('scale-100', 'opacity-100');
                }, 10);
            }
        });
    }

    if(document.getElementById('auth-modal-close')){
        document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
    }
    
    function closeAuthModal() {
        authModalDialog.classList.remove('scale-100', 'opacity-100');
        authModalDialog.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            authModal.classList.add('hidden');
            authModal.classList.remove('flex');
        }, 300);
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('auth-name').value;
            localStorage.setItem('calcSuitUser', name);
            updateAuthUI();
            closeAuthModal();
            showToast('Profile Activated', `Welcome to your workspace, ${name}!`, 'fa-user-astronaut', 'text-indigo-500');
        });
    }

    function showToast(title, message, iconStr = 'fa-bell', colorClass = 'text-indigo-500') {
        const container = document.getElementById('toast-container');
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

    // State
    const now = new Date();
    let currentView = 'monthly';
    let currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let editingEventId = null;

    // Initialize UI
    const monthPicker = document.getElementById('calendar-month-picker');
    monthPicker.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    document.getElementById('event-date').valueAsDate = now;

    // Color picker logic
    let selectedColor = 'bg-indigo-500';
    document.querySelectorAll('.color-choice').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-choice').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.getAttribute('data-color');
        });
    });

    // Form logic
    const btnSubmitEvent = document.getElementById('btn-submit-event');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const recurringSelect = document.getElementById('event-recurring');

    if(btnCancelEdit) {
        btnCancelEdit.addEventListener('click', () => {
            editingEventId = null;
            if(btnSubmitEvent) btnSubmitEvent.textContent = 'Add to Calendar';
            btnCancelEdit.classList.add('hidden');
            if(recurringSelect) recurringSelect.disabled = false;
            document.getElementById('event-form').reset();
            document.getElementById('event-date').valueAsDate = new Date();
        });
    }

    document.getElementById('event-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const baseEvent = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            start: document.getElementById('event-start').value || "All Day",
            end: document.getElementById('event-end').value || "",
            priority: document.getElementById('event-priority') ? document.getElementById('event-priority').value : "medium",
            reminder: document.getElementById('event-reminder') ? document.getElementById('event-reminder').value : "none",
            estTime: document.getElementById('event-est') ? parseInt(document.getElementById('event-est').value) || 25 : 25,
            details: document.getElementById('event-details') ? document.getElementById('event-details').value : "",
            color: selectedColor,
            notified: false
        };

        if (editingEventId) {
            // Update mode
            const index = events.findIndex(ev => ev.id === editingEventId);
            if(index !== -1) {
                events[index] = { ...events[index], ...baseEvent };
                showToast('Event Updated', 'Calendar event has been modified.', 'fa-check', 'text-emerald-500');
            }
            editingEventId = null;
            if(btnSubmitEvent) btnSubmitEvent.textContent = 'Add to Calendar';
            if(btnCancelEdit) btnCancelEdit.classList.add('hidden');
            if(recurringSelect) recurringSelect.disabled = false;
        } else {
            // Create mode (handle recurring)
            const recurringType = recurringSelect ? recurringSelect.value : 'none';
            const baseDate = new Date(baseEvent.date + 'T12:00:00'); // T12 to avoid timezone shifts
            let occurrences = 1;
            
            if (recurringType === 'daily') occurrences = 30;
            if (recurringType === 'weekly') occurrences = 12;
            if (recurringType === 'monthly') occurrences = 12;

            for(let i=0; i < occurrences; i++) {
                const newD = new Date(baseDate.getTime());
                if(recurringType === 'daily') newD.setDate(newD.getDate() + i);
                if(recurringType === 'weekly') newD.setDate(newD.getDate() + (i * 7));
                if(recurringType === 'monthly') newD.setMonth(newD.getMonth() + i);

                const ds = `${newD.getFullYear()}-${String(newD.getMonth() + 1).padStart(2, '0')}-${String(newD.getDate()).padStart(2, '0')}`;
                
                events.push({
                    ...baseEvent,
                    id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000) + '-' + i,
                    date: ds
                });
            }
            showToast('Event Added', occurrences > 1 ? `Added ${occurrences} recurring events.` : 'Event added to calendar.', 'fa-calendar-plus', 'text-indigo-500');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        e.target.reset();
        document.getElementById('event-date').valueAsDate = new Date();
        renderCalendar();
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
        if (confirm("Delete all calendar events globally?")) {
            events = [];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            renderCalendar();
        }
    });

    // View Tabs
    const tabs = document.querySelectorAll('.view-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-slate-200/50');
                t.classList.add('bg-transparent', 'border-transparent');
                t.style.backgroundColor = '';
            });
            tab.classList.remove('bg-transparent', 'border-transparent');
            tab.classList.add('active');

            currentView = tab.getAttribute('data-view');
            renderCalendar();
        });
    });

    // Date navigation
    monthPicker.addEventListener('change', (e) => {
        const [yyyy, mm] = e.target.value.split('-');
        if (yyyy && mm) {
            currentDate = new Date(parseInt(yyyy), parseInt(mm) - 1, 1);
            renderCalendar();
        }
    });

    // ==== RENDERING LOGIC ====
    const calendarContainer = document.getElementById('calendar-grid-container');
    const calendarTitle = document.getElementById('calendar-title');

    function renderCalendar() {
        calendarContainer.innerHTML = '';
        const yyyy = currentDate.getFullYear();
        const mm = currentDate.getMonth();
        const monthName = currentDate.toLocaleString('default', { month: 'long' });

        if (currentView === 'monthly') {
            calendarTitle.textContent = `${monthName} ${yyyy}`;
            renderMonthly(yyyy, mm);
        } else if (currentView === 'weekly') {
            calendarTitle.textContent = `Week of ${monthName} ${yyyy}`;
            renderWeekly(yyyy, mm);
        } else if (currentView === 'daily') {
            const dateStr = document.getElementById('event-date').value;
            const targetDate = dateStr ? new Date(dateStr) : new Date();
            calendarTitle.textContent = targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            renderDaily(targetDate);
        }
    }

    function removeEvent(id) {
        if (confirm("Delete this event?")) {
            events = events.filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            renderCalendar();
        }
    }

    window.removeEvent = removeEvent; // export for onclick

    function formatTime(timeStr) {
        if (!timeStr || timeStr === "All Day") return "";
        const [h, m] = timeStr.split(':');
        const hh = parseInt(h, 10);
        const ampm = hh >= 12 ? 'pm' : 'am';
        const hr = hh % 12 || 12;
        return `${hr}:${m}${ampm}`;
    }

    function renderMonthly(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden';

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(d => {
            const th = document.createElement('div');
            th.className = 'bg-slate-50 dark:bg-slate-900 text-center py-2 text-xs font-bold text-slate-500 uppercase tracking-wider';
            th.textContent = d;
            grid.appendChild(th);
        });

        // Blank cells before the 1st
        for (let i = 0; i < firstDayIndex; i++) {
            const blank = document.createElement('div');
            blank.className = 'bg-white dark:bg-slate-800 calendar-cell opacity-30';
            grid.appendChild(blank);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'bg-white dark:bg-slate-800 calendar-cell relative p-1 pb-4 flex flex-col gap-1 min-h-[100px] border-t border-transparent group';

            // Highlight today
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

            cell.innerHTML = `
                <div class="text-right text-sm font-semibold mb-1 ${isToday ? 'bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto' : 'text-slate-700 dark:text-slate-300'}">${day}</div>
                <div class="events-container flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar"></div>
            `;

            const eventsContainer = cell.querySelector('.events-container');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const dayEvents = events.filter(e => e.date === dateStr);
            // sort by time
            dayEvents.sort((a, b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

            dayEvents.forEach(ev => {
                const eDiv = document.createElement('div');
                const timeLabel = formatTime(ev.start);
                eDiv.className = `text-[10px] leading-tight text-white font-medium p-1 px-1.5 rounded truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-sm ${ev.color}`;
                eDiv.innerHTML = `${timeLabel ? `<span class="opacity-80">${timeLabel}</span> ` : ''}${ev.title}`;
                eDiv.title = `Click to view details: ${ev.title}`;
                eDiv.onclick = () => openTaskDetails(ev);
                eventsContainer.appendChild(eDiv);
            });

            grid.appendChild(cell);
        }

        // Blank cells at the end
        const totalCells = firstDayIndex + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 0; i < remaining; i++) {
            const blank = document.createElement('div');
            blank.className = 'bg-white dark:bg-slate-800 calendar-cell opacity-30';
            grid.appendChild(blank);
        }

        calendarContainer.appendChild(grid);
    }

    function renderWeekly(year, month) {
        // Just render a simple 7-column layout for the FIRST week of the currently selected month/day as a demo
        // For simplicity, we choose a fixed week around the selected currentDate (1st to 7th or similar based on week offset)
        // A full calendar app requires complex week shifting. Let's show the 7 days starting from Monday of the currentDate's week.

        let startOfWeek = new Date(year, month, 1);
        const dayOfWeek = startOfWeek.getDay(); // Sunday - Saturday : 0 - 6
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
        startOfWeek = new Date(startOfWeek.setDate(diff));

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-7 gap-4';

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);

            const dateStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
            const isToday = currentDay.toDateString() === now.toDateString();

            const col = document.createElement('div');
            col.className = 'flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm min-h-[400px]';

            const header = document.createElement('div');
            header.className = `p-3 text-center border-b border-slate-200 dark:border-slate-700 ${isToday ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-slate-800'}`;
            header.innerHTML = `
                <div class="text-xs font-bold uppercase tracking-wider ${isToday ? 'text-indigo-100' : 'text-slate-500'}">${currentDay.toLocaleString('default', { weekday: 'short' })}</div>
                <div class="text-xl font-bold mt-1 ${isToday ? 'text-white' : 'text-slate-800 dark:text-slate-200'}">${currentDay.getDate()}</div>
            `;
            col.appendChild(header);

            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'flex-1 p-2 space-y-2 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50';

            const dayEvents = events.filter(e => e.date === dateStr);
            dayEvents.sort((a, b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

            dayEvents.forEach(ev => {
                const eDiv = document.createElement('div');
                const timeStr = [formatTime(ev.start), formatTime(ev.end)].filter(Boolean).join(' - ');
                eDiv.className = `p-2 rounded-lg text-white text-xs font-medium cursor-pointer shadow-sm ${ev.color}`;
                eDiv.innerHTML = `<div class="font-bold opacity-80 mb-1 border-b border-white/20 pb-1 leading-none text-[10px]">${timeStr}</div><div class="leading-tight">${ev.title}</div>`;
                eDiv.onclick = () => openTaskDetails(ev);
                eventsContainer.appendChild(eDiv);
            });

            col.appendChild(eventsContainer);
            grid.appendChild(col);
        }

        calendarContainer.appendChild(grid);
    }

    function renderDaily(targetDate) {
        const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

        const dayEvents = events.filter(e => e.date === dateStr);
        
        // Inject current time if it's today
        const isToday = targetDate.toDateString() === new Date().toDateString();
        if (isToday) {
            const currentH = new Date().getHours();
            const currentM = new Date().getMinutes();
            const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
            dayEvents.push({
                isCurrentTimeIndicator: true,
                start: timeStr,
                end: '',
                title: 'Current Time',
                color: 'bg-rose-500' // Visual pop
            });
        }
        
        dayEvents.sort((a, b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm min-h-[400px] max-w-2xl mx-auto';

        if (dayEvents.length === 0 || (dayEvents.length === 1 && dayEvents[0].isCurrentTimeIndicator)) {
            container.innerHTML = `<div class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-20"><i class="fas fa-mug-hot text-5xl mb-4"></i><p class="text-lg">No tasks scheduled for this day.</p></div>`;
            calendarContainer.appendChild(container);
            return;
        }

        const timeline = document.createElement('div');
        timeline.className = 'relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 md:ml-6 space-y-8 py-4';

        dayEvents.forEach(ev => {
            const item = document.createElement('div');
            item.className = 'relative pl-8 md:pl-10 cursor-pointer group';
            
            if (ev.isCurrentTimeIndicator) {
                item.className = 'relative pl-8 md:pl-10 group my-4 py-2 pointer-events-none opacity-80';
                item.innerHTML = `
                    <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10"></div>
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-rose-500 z-0 border-t border-dashed border-rose-500/80"></div>
                    <div class="bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-center shadow-sm relative z-10 w-fit ml-auto border border-rose-100 dark:border-rose-900/50">
                        <i class="fas fa-clock mr-1"></i> Current Time &bull; ${formatTime(ev.start)}
                    </div>
                `;
                timeline.appendChild(item);
                return;
            }

            item.onclick = () => openTaskDetails(ev);

            const timeStr = ev.start === "All Day" ? "All Day" : [formatTime(ev.start), formatTime(ev.end)].filter(Boolean).join(' - ');

            item.innerHTML = `
                <span class="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${ev.color} shadow-sm group-hover:scale-125 transition-transform"></span>
                <div class="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <span class="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold uppercase tracking-wide mb-2">${timeStr}</span>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">${ev.title}</h4>
                </div>
            `;
            timeline.appendChild(item);
        });

        container.appendChild(timeline);
        calendarContainer.appendChild(container);
    }

    renderCalendar();

    // ==== PDF EXPORT LOGIC USING html2canvas + jsPDF ====
    document.getElementById('btn-export-pdf').addEventListener('click', async () => {
        const overlay = document.getElementById('pdf-processing');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        try {
            const templateTitle = document.getElementById('pdf-template-title');
            const templateSubtitle = document.getElementById('pdf-template-subtitle');
            const templateContent = document.getElementById('pdf-template-content');
            const templateDate = document.getElementById('pdf-template-date');

            templateTitle.textContent = currentView === 'daily' ? 'Daily Tasks' : (currentView === 'weekly' ? 'Weekly Planner' : 'Monthly Planner');
            templateSubtitle.textContent = document.getElementById('calendar-title').textContent;
            templateDate.textContent = "Generated: " + new Date().toLocaleDateString();

            // Get relevant events based on view
            let pdfEvents = [];
            const yyyy = currentDate.getFullYear();
            const mm = currentDate.getMonth();

            if (currentView === 'daily') {
                const dateStr = document.getElementById('event-date').value;
                if (dateStr) {
                    pdfEvents = events.filter(e => e.date === dateStr);
                } else {
                    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    pdfEvents = events.filter(e => e.date === todayStr);
                }
            } else {
                const prefix = `${yyyy}-${String(mm + 1).padStart(2, '0')}`;
                pdfEvents = events.filter(e => e.date.startsWith(prefix));
            }

            // Sort by date then time
            pdfEvents.sort((a, b) => a.date.localeCompare(b.date) || (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

            templateContent.innerHTML = '';

            // Generate rows for existing events
            pdfEvents.forEach(ev => {
                const row = document.createElement('div');
                row.className = 'flex items-stretch gap-5 bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 overflow-hidden';

                const sTime = ev.start && ev.start !== "All Day" ? formatTime(ev.start) : "______";
                const eTime = ev.end ? formatTime(ev.end) : "______";
                const displayDate = currentView !== 'daily' ? `<div class="text-[11px] text-indigo-500 font-bold uppercase mb-1.5 tracking-widest bg-indigo-50 inline-block px-2.5 py-1 rounded-md">${ev.date}</div>` : '';
                const colorClass = ev.color || 'bg-indigo-500';

                row.innerHTML = `
                    <div class="w-3 ${colorClass}"></div>
                    <div class="py-5 pl-4 flex items-center">
                        <div class="w-10 h-10 rounded-xl border-[3px] border-slate-300 bg-slate-50 shadow-inner"></div>
                    </div>
                    <div class="flex-1 py-5 pr-4 flex flex-col justify-center">
                        ${displayDate}
                        <div class="font-bold text-slate-800 text-2xl tracking-tight leading-tight">${ev.title}</div>
                    </div>
                    <div class="w-48 bg-slate-50 border-l border-slate-100 p-5 flex flex-col gap-3 justify-center shrink-0">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span class="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Start</span>
                            <span class="text-indigo-600 font-bold">${sTime}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] uppercase text-slate-400 tracking-wider font-bold">End</span>
                            <span class="text-rose-500 font-bold">${eTime}</span>
                        </div>
                    </div>
                `;
                templateContent.appendChild(row);
            });

            // Add attractive empty rows
            const emptyRowsCount = Math.max(4, 9 - pdfEvents.length);
            for (let i = 0; i < emptyRowsCount; i++) {
                const row = document.createElement('div');
                row.className = 'flex items-stretch gap-5 bg-white rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden opacity-70';
                row.innerHTML = `
                    <div class="w-3 bg-slate-200"></div>
                    <div class="py-5 pl-4 flex items-center">
                        <div class="w-10 h-10 rounded-xl border-[3px] border-slate-200 shadow-inner"></div>
                    </div>
                    <div class="flex-1 py-5 pr-4 flex flex-col justify-center">
                        <div class="h-6 w-full border-b-[3px] border-slate-200 border-dotted mt-1"></div>
                    </div>
                    <div class="w-48 bg-slate-50 border-l border-slate-100 p-5 flex flex-col gap-3 justify-center shrink-0">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span class="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Start</span>
                            <span class="text-slate-300 font-bold tracking-widest pl-4 w-full text-right border-b border-slate-300 border-dashed"></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] uppercase text-slate-400 tracking-wider font-bold">End</span>
                            <span class="text-slate-300 font-bold tracking-widest pl-4 w-full text-right border-b border-slate-300 border-dashed"></span>
                        </div>
                    </div>
                `;
                templateContent.appendChild(row);
            }

            // The browser sometimes struggles to capture heavily nested flexbox layouts
            // when they are positioned entirely offscreen (-9999px).
            // We temporarily pull it on-screen and behind a white loading overlay.
            const templateEl = document.getElementById('pdf-template');
            
            templateEl.style.left = '0px';
            templateEl.style.top = '0px';
            templateEl.style.zIndex = '100';
            templateEl.style.position = 'absolute';
            // Allow the DOM to render the template
            await new Promise(r => setTimeout(r, 200));

            const canvas = await window.html2canvas(templateEl, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff'
            });

            // Revert back
            templateEl.style.left = '-9999px';
            templateEl.style.position = 'fixed';
            templateEl.style.zIndex = '-1';

            const imgData = canvas.toDataURL('image/png');

            // Standard A4 Portrait is 210 x 297 mm
            const doc = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`TaskPlanner_${currentView}_${currentDate.getFullYear()}-${currentDate.getMonth() + 1}.pdf`);

        } catch (e) {
            console.error(e);
            alert("Could not generate PDF. Debug Info: " + e.message);
        } finally {
            overlay.classList.remove('flex');
            overlay.classList.add('hidden');
        }
    });

    // --- Task Details Modal & Interactions ---
    const taskModal = document.getElementById('task-modal');
    const taskModalDialog = document.getElementById('task-modal-dialog');
    const btnDeleteEvent = document.getElementById('btn-delete-event');
    const btnEditEvent = document.getElementById('btn-edit-event');
    let currentTaskOpenId = null;

    window.openTaskDetails = function(ev) {
        currentTaskOpenId = ev.id;
        
        // Populate modal data
        document.getElementById('tm-title').textContent = ev.title;
        document.getElementById('tm-color').className = `w-12 h-12 rounded-2xl ${ev.color} flex items-center justify-center text-white text-xl shadow-inner shrink-0 mt-0.5`;
        
        const dateObj = new Date(ev.date + 'T00:00:00');
        document.getElementById('tm-date').textContent = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        
        const timeStr = ev.start === "All Day" ? "All Day" : [formatTime(ev.start), formatTime(ev.end)].filter(Boolean).join(' - ');
        document.getElementById('tm-time').textContent = timeStr || "No time specified";
        
        const pBadge = document.getElementById('tm-priority');
        if(ev.priority === 'high') {
            pBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700';
            pBadge.textContent = 'High Priority';
        } else if(ev.priority === 'low') {
            pBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700';
            pBadge.textContent = 'Low Priority';
        } else {
            pBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700';
            pBadge.textContent = 'Medium Priority';
        }

        const rmSpan = document.getElementById('tm-reminder');
        if(ev.reminder && ev.reminder !== 'none') {
            if(ev.reminder === '1440') rmSpan.textContent = 'Reminder: 1 day before';
            else rmSpan.textContent = `Reminder: ${ev.reminder} mins before`;
        } else {
            rmSpan.textContent = "No active reminder";
        }

        const dtSpan = document.getElementById('tm-details');
        if(ev.details && ev.details.trim() !== "") {
            dtSpan.textContent = ev.details;
            dtSpan.classList.remove('italic', 'opacity-50');
        } else {
            dtSpan.textContent = "No additional notes provided.";
            dtSpan.classList.add('italic', 'opacity-50');
        }

        // Show Modal
        taskModal.classList.remove('hidden');
        taskModal.classList.add('flex');
        setTimeout(() => {
            taskModalDialog.classList.remove('scale-95', 'opacity-0');
            taskModalDialog.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    function closeTaskModal() {
        taskModalDialog.classList.remove('scale-100', 'opacity-100');
        taskModalDialog.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            taskModal.classList.add('hidden');
            taskModal.classList.remove('flex');
            currentTaskOpenId = null;
        }, 300);
    }
    
    if (document.getElementById('task-modal-close')) {
        document.getElementById('task-modal-close').addEventListener('click', closeTaskModal);
    }

    if (btnDeleteEvent) {
        btnDeleteEvent.addEventListener('click', () => {
            if(currentTaskOpenId) {
                events = events.filter(e => e.id !== currentTaskOpenId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
                renderCalendar();
                closeTaskModal();
                showToast('Event Deleted', 'The task has been permanently removed from your calendar.', 'fa-trash-alt', 'text-red-500');
            }
        });
    }

    if (btnEditEvent) {
        btnEditEvent.addEventListener('click', () => {
            if(currentTaskOpenId) {
                const evToEdit = events.find(e => e.id === currentTaskOpenId);
                if(evToEdit) {
                    // Populate form
                    document.getElementById('event-title').value = evToEdit.title;
                    document.getElementById('event-date').value = evToEdit.date;
                    document.getElementById('event-start').value = evToEdit.start !== "All Day" ? evToEdit.start : "";
                    document.getElementById('event-end').value = evToEdit.end;
                    
                    if(document.getElementById('event-priority')) document.getElementById('event-priority').value = evToEdit.priority || "medium";
                    if(document.getElementById('event-reminder')) document.getElementById('event-reminder').value = evToEdit.reminder || "none";
                    if(document.getElementById('event-est')) document.getElementById('event-est').value = evToEdit.estTime || "";
                    if(document.getElementById('event-details')) document.getElementById('event-details').value = evToEdit.details || "";
                    
                    selectedColor = evToEdit.color;
                    document.querySelectorAll('.color-choice').forEach(b => {
                        b.classList.remove('selected');
                        if(b.getAttribute('data-color') === selectedColor) b.classList.add('selected');
                    });

                    editingEventId = evToEdit.id;
                    const bse = document.getElementById('btn-submit-event');
                    if(bse) bse.textContent = 'Update Event';
                    const bce = document.getElementById('btn-cancel-edit');
                    if(bce) bce.classList.remove('hidden');
                    
                    const rs = document.getElementById('event-recurring');
                    if(rs) {
                        rs.value = 'none';
                        rs.disabled = true;
                    }

                    closeTaskModal();
                    
                    // Scroll to form nicely
                    const formContainer = document.getElementById('event-form').closest('div').parentElement;
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // --- Active Reminder Engine ---
    // Runs every 60 seconds to check if any event reminder condition is met
    setInterval(() => {
        const _now = new Date();
        let updated = false;
        
        events.forEach(ev => {
            if (!ev.notified && ev.reminder && ev.reminder !== 'none' && ev.start && ev.start !== "All Day") {
                const evDate = new Date(`${ev.date}T${ev.start}:00`);
                if (!isNaN(evDate)) {
                    const diffMs = evDate - _now;
                    const diffMins = Math.floor(diffMs / 60000);
                    const reminderTarget = parseInt(ev.reminder);
                    
                    if (diffMins >= 0 && diffMins <= reminderTarget) {
                        showToast(`Upcoming: ${ev.title}`, `Starts in ${diffMins} minutes.`, 'fa-clock', 'text-rose-500');
                        ev.notified = true;
                        updated = true;
                        
                        // Try native notification if allowed
                        if (Notification.permission === 'granted') {
                            new Notification(`Upcoming: ${ev.title}`, { body: `Starts in ${diffMins} minutes.` });
                        } else if (Notification.permission !== 'denied') {
                            Notification.requestPermission();
                        }
                    }
                }
            }
        });
        
        if (updated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        }
    }, 60000);

    // ==== POMODORO TIMER LITE (Calendar) ====
    let focusInterval = null;
    let focusTimeLeft = 25 * 60;
    let isPaused = false;
    let preFocusTimerTask = null;

    const focusOverlay = document.getElementById('focus-overlay');
    const focusDisplay = document.getElementById('focus-timer-display');
    const toggleBtn = document.getElementById('focus-toggle-btn');
    const toggleText = document.getElementById('focus-toggle-text');
    const focusStopBtn = document.getElementById('focus-stop-btn');
    const btnStartFocus = document.getElementById('btn-start-focus');

    if(btnStartFocus && focusOverlay) {
        btnStartFocus.addEventListener('click', () => {
            if(!currentTaskOpenId) return;
            const task = events.find(e => e.id === currentTaskOpenId);
            if(!task) return;
            
            preFocusTimerTask = task;
            document.getElementById('focus-task-title').textContent = task.title;
            
            closeTaskModal();
            
            focusOverlay.classList.remove('hidden');
            focusOverlay.classList.add('flex');
            setTimeout(() => focusOverlay.classList.replace('opacity-0', 'opacity-100'), 10);
            
            let estMins = parseInt(task.estTime) || 25;
            focusTimeLeft = estMins * 60;
            isPaused = false;
            updateFocusDisplay();
            if(toggleText) toggleText.textContent = "Pause";
            if(toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-pause group-hover:scale-110 transition-transform"></i> <span id="focus-toggle-text">Pause</span>';
            
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
            if(focusDisplay) focusDisplay.textContent = `${m}:${s}`;
            const fts = document.getElementById('focus-timer-status');
            if(fts) fts.textContent = `${m} Minutes Remaining`;
        }

        if(toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isPaused = !isPaused;
                const tgSpan = document.getElementById('focus-toggle-text');
                if(isPaused) {
                    if(tgSpan) tgSpan.textContent = "Resume";
                    toggleBtn.firstElementChild.className = "fas fa-play group-hover:scale-110 transition-transform";
                    const fts = document.getElementById('focus-timer-status');
                    if(fts) fts.textContent = "Timer Paused";
                } else {
                    if(tgSpan) tgSpan.textContent = "Pause";
                    toggleBtn.firstElementChild.className = "fas fa-pause group-hover:scale-110 transition-transform";
                    updateFocusDisplay();
                }
            });
        }

        if(focusStopBtn) {
            focusStopBtn.addEventListener('click', () => {
                finishPomodoro();
            });
        }

        const closeBtn = document.getElementById('focus-close-btn');
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearInterval(focusInterval);
                hideFocusOverlay();
            });
        }

        function finishPomodoro() {
            clearInterval(focusInterval);
            let estMins = preFocusTimerTask ? (parseInt(preFocusTimerTask.estTime) || 25) : 25;
            const elapsedS = (estMins * 60) - focusTimeLeft;
            const elapsedM = Math.round(elapsedS / 60);
            
            showToast('Focus Session complete!', `Completed ${elapsedM} minutes of focus on calendar event.`, 'fa-brain', 'text-indigo-500');
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

});