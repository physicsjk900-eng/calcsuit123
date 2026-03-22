/*!
 * task-calendar.js
 * Calendar rendering and PDF export using html2canvas & jsPDF
 */

document.addEventListener('DOMContentLoaded', () => {

    const STORAGE_KEY = 'calcsuit_calendar_events';
    let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // State
    const now = new Date();
    let currentView = 'monthly';
    let currentDate = new Date(now.getFullYear(), now.getMonth(), 1); 

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
    document.getElementById('event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newEvent = {
            id: Date.now().toString(),
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value, // YYYY-MM-DD
            start: document.getElementById('event-start').value || "All Day", // HH:MM
            end: document.getElementById('event-end').value || "",
            color: selectedColor
        };

        events.push(newEvent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        e.target.reset();
        document.getElementById('event-date').valueAsDate = new Date();
        renderCalendar();
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
        if(confirm("Delete all calendar events globally?")) {
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
            currentDate = new Date(parseInt(yyyy), parseInt(mm)-1, 1);
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
        if(confirm("Delete this event?")) {
            events = events.filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            renderCalendar();
        }
    }
    
    window.removeEvent = removeEvent; // export for onclick

    function formatTime(timeStr) {
        if(!timeStr || timeStr === "All Day") return "";
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
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            
            const dayEvents = events.filter(e => e.date === dateStr);
            // sort by time
            dayEvents.sort((a,b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

            dayEvents.forEach(ev => {
                const eDiv = document.createElement('div');
                const timeLabel = formatTime(ev.start);
                eDiv.className = `text-[10px] leading-tight text-white font-medium p-1 px-1.5 rounded truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-sm ${ev.color}`;
                eDiv.innerHTML = `${timeLabel ? `<span class="opacity-80">${timeLabel}</span> ` : ''}${ev.title}`;
                eDiv.title = `Click to delete: ${ev.title}`;
                eDiv.onclick = () => removeEvent(ev.id);
                eventsContainer.appendChild(eDiv);
            });

            grid.appendChild(cell);
        }

        // Blank cells at the end
        const totalCells = firstDayIndex + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for(let i=0; i<remaining; i++){
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
            
            const dateStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth()+1).padStart(2,'0')}-${String(currentDay.getDate()).padStart(2,'0')}`;
            const isToday = currentDay.toDateString() === now.toDateString();

            const col = document.createElement('div');
            col.className = 'flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm min-h-[400px]';

            const header = document.createElement('div');
            header.className = `p-3 text-center border-b border-slate-200 dark:border-slate-700 ${isToday ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-slate-800'}`;
            header.innerHTML = `
                <div class="text-xs font-bold uppercase tracking-wider ${isToday ? 'text-indigo-100' : 'text-slate-500'}">${currentDay.toLocaleString('default', {weekday: 'short'})}</div>
                <div class="text-xl font-bold mt-1 ${isToday ? 'text-white' : 'text-slate-800 dark:text-slate-200'}">${currentDay.getDate()}</div>
            `;
            col.appendChild(header);

            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'flex-1 p-2 space-y-2 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50';

            const dayEvents = events.filter(e => e.date === dateStr);
            dayEvents.sort((a,b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

            dayEvents.forEach(ev => {
                const eDiv = document.createElement('div');
                const timeStr = [formatTime(ev.start), formatTime(ev.end)].filter(Boolean).join(' - ');
                eDiv.className = `p-2 rounded-lg text-white text-xs font-medium cursor-pointer shadow-sm ${ev.color}`;
                eDiv.innerHTML = `<div class="font-bold opacity-80 mb-1 border-b border-white/20 pb-1 leading-none text-[10px]">${timeStr}</div><div class="leading-tight">${ev.title}</div>`;
                eDiv.onclick = () => removeEvent(ev.id);
                eventsContainer.appendChild(eDiv);
            });

            col.appendChild(eventsContainer);
            grid.appendChild(col);
        }
        
        calendarContainer.appendChild(grid);
    }

    function renderDaily(targetDate) {
        const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(targetDate.getDate()).padStart(2,'0')}`;
        
        const dayEvents = events.filter(e => e.date === dateStr);
        dayEvents.sort((a,b) => (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm min-h-[400px] max-w-2xl mx-auto';

        if(dayEvents.length === 0) {
            container.innerHTML = `<div class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-20"><i class="fas fa-mug-hot text-5xl mb-4"></i><p class="text-lg">No events scheduled for this day.</p></div>`;
            calendarContainer.appendChild(container);
            return;
        }

        const timeline = document.createElement('div');
        timeline.className = 'relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 md:ml-6 space-y-8 py-4';

        dayEvents.forEach(ev => {
            const item = document.createElement('div');
            item.className = 'relative pl-8 md:pl-10 cursor-pointer group';
            item.onclick = () => removeEvent(ev.id);
            
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
                if(dateStr) {
                    pdfEvents = events.filter(e => e.date === dateStr);
                } else {
                    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
                    pdfEvents = events.filter(e => e.date === todayStr);
                }
            } else {
                const prefix = `${yyyy}-${String(mm+1).padStart(2,'0')}`;
                pdfEvents = events.filter(e => e.date.startsWith(prefix));
            }

            // Sort by date then time
            pdfEvents.sort((a,b) => a.date.localeCompare(b.date) || (a.start === 'All Day' ? '00:00' : a.start).localeCompare(b.start === 'All Day' ? '00:00' : b.start));

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
            for(let i=0; i<emptyRowsCount; i++) {
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

            // Allow the DOM to render the template
            await new Promise(r => setTimeout(r, 100));

            const templateEl = document.getElementById('pdf-template');
            
            const canvas = await window.html2canvas(templateEl, {
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff'
            });

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
            doc.save(`TaskPlanner_${currentView}_${currentDate.getFullYear()}-${currentDate.getMonth()+1}.pdf`);

        } catch(e) {
            console.error(e);
            alert("Could not generate PDF. Check console for details.");
        } finally {
            overlay.classList.remove('flex');
            overlay.classList.add('hidden');
        }
    });

});
