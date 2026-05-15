document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dob-input');
    const targetInput = document.getElementById('target-date-input');
    
    if(!dobInput || !targetInput) return;

    const today = new Date();
    targetInput.valueAsDate = today;

    window.calculateAge = () => {
        if (!dobInput.value || !targetInput.value) return;

        const dob = new Date(dobInput.value);
        const target = new Date(targetInput.value);

        if (dob > target) {
            alert("Date of birth cannot be after the target date.");
            return;
        }

        // 1. Precise Breakdown (Years, Months, Days)
        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        animateValue("res-years", 0, years, 1000);
        animateValue("res-months", 0, months, 1000);
        animateValue("res-days", 0, days, 1000);

        // 2. Total Counts
        const diffMs = target.getTime() - dob.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalMonths = (years * 12) + months;
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;

        document.getElementById('res-total-months').innerText = totalMonths.toLocaleString();
        document.getElementById('res-total-weeks').innerText = totalWeeks.toLocaleString();
        document.getElementById('res-total-days').innerText = totalDays.toLocaleString();

        // 3. Health Estimates
        // Avg 80 bpm heart rate, Avg 16 bpm breath rate
        const heartbeats = (totalDays * 24 * 60) * 80;
        const breaths = (totalDays * 24 * 60) * 16;
        document.getElementById('res-heartbeats').innerText = heartbeats.toLocaleString();
        document.getElementById('res-breaths').innerText = breaths.toLocaleString();

        // 4. Zodiac & Birthstone
        const zodiac = getZodiac(dob.getDate(), dob.getMonth() + 1);
        document.getElementById('res-zodiac').innerText = zodiac.name;
        document.getElementById('res-zodiac-icon').innerText = zodiac.icon;
        document.getElementById('res-birthstone').innerText = `Birthstone: ${getBirthstone(dob.getMonth() + 1)}`;

        // 5. Day of the Week Born
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        document.getElementById('res-born-day').innerText = daysOfWeek[dob.getDay()];

        // 6. Next Birthday Calculation
        let nextBd = new Date(dob);
        nextBd.setFullYear(target.getFullYear());

        if (nextBd.getTime() < target.getTime() && (nextBd.getMonth() !== target.getMonth() || nextBd.getDate() !== target.getDate())) {
            nextBd.setFullYear(target.getFullYear() + 1);
        }

        const utc1 = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
        const utc2 = Date.UTC(nextBd.getFullYear(), nextBd.getMonth(), nextBd.getDate());
        const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

        document.getElementById('res-next-bd').innerText = diffDays === 0 ? "Today!" : `${diffDays} days to go`;
        document.getElementById('res-next-bd-day').innerText = `It's on a ${daysOfWeek[nextBd.getDay()]}`;

        // 7. Planetary Ages
        document.getElementById('age-mercury').innerText = (totalDays / 87.97).toFixed(1);
        document.getElementById('age-venus').innerText = (totalDays / 224.7).toFixed(1);
        document.getElementById('age-mars').innerText = (totalDays / 687).toFixed(1);
        document.getElementById('age-jupiter').innerText = (totalDays / 4333).toFixed(1);

        // 8. Life Milestones
        calculateMilestones(dob, target);

        const resultsDiv = document.getElementById('age-results');
        if(resultsDiv) {
            resultsDiv.classList.remove('hidden');
            void resultsDiv.offsetWidth;
            resultsDiv.classList.remove('opacity-0');
        }

        if (window.ageTicker) clearInterval(window.ageTicker);
    };

    function calculateMilestones(dob, target) {
        const container = document.getElementById('milestones-container');
        if (!container) return;
        
        const milestones = [
            { label: "10,000 Days Alive", value: 10000, type: "days" },
            { label: "15,000 Days Alive", value: 15000, type: "days" },
            { label: "20,000 Days Alive", value: 20000, type: "days" },
            { label: "25,000 Days Alive", value: 25000, type: "days" },
            { label: "500 Months Celebration", value: 500, type: "months" },
            { label: "1 Billion Seconds", value: 1000000000, type: "seconds" }
        ];

        let html = '';
        const now = target.getTime();

        milestones.forEach(m => {
            let mDate = new Date(dob);
            if (m.type === "days") mDate.setDate(mDate.getDate() + m.value);
            if (m.type === "months") mDate.setMonth(mDate.getMonth() + m.value);
            if (m.type === "seconds") mDate.setSeconds(mDate.getSeconds() + m.value);

            if (mDate.getTime() > now) {
                const daysLeft = Math.ceil((mDate.getTime() - now) / (1000 * 60 * 60 * 24));
                html += `
                    <div class="flex items-center gap-4 group">
                        <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shrink-0 font-bold text-[10px]">
                            ${m.value >= 1000000 ? (m.value/1000000000).toFixed(1)+'B' : m.value.toLocaleString()}
                        </div>
                        <div class="flex-1 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                            <div class="text-sm font-bold text-slate-700 dark:text-slate-200">${m.label}</div>
                            <div class="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                Happens on ${mDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • <span class="text-indigo-500">${daysLeft} days away</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = html || '<div class="text-xs text-slate-400 italic">All major milestones reached! You are a legend.</div>';
    }

    window.shareResult = async () => {
        const years = document.getElementById('res-years').innerText;
        const zodiac = document.getElementById('res-zodiac').innerText;
        const text = `I am ${years} years old (${zodiac})! Check out your precision age, life stats, and planetary age on CalcSuit.`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title: 'My Age Stats | CalcSuit', text: text, url: window.location.href });
            } catch (err) { console.log(err); }
        } else {
            // Fallback
            const el = document.createElement('textarea');
            el.value = text + " " + window.location.href;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert("Results copied to clipboard! Share them with your friends.");
        }
    };

    function getZodiac(day, month) {
        const signs = [
            { name: "Capricorn", icon: "♑", start: [12, 22], end: [1, 19] },
            { name: "Aquarius", icon: "♒", start: [1, 20], end: [2, 18] },
            { name: "Pisces", icon: "♓", start: [2, 19], end: [3, 20] },
            { name: "Aries", icon: "♈", start: [3, 21], end: [4, 19] },
            { name: "Taurus", icon: "♉", start: [4, 20], end: [5, 20] },
            { name: "Gemini", icon: "♊", start: [5, 21], end: [6, 20] },
            { name: "Cancer", icon: "♋", start: [6, 21], end: [7, 22] },
            { name: "Leo", icon: "♌", start: [7, 23], end: [8, 22] },
            { name: "Virgo", icon: "♍", start: [8, 23], end: [9, 22] },
            { name: "Libra", icon: "♎", start: [9, 23], end: [10, 22] },
            { name: "Scorpio", icon: "♏", start: [10, 23], end: [11, 21] },
            { name: "Sagittarius", icon: "♐", start: [11, 22], end: [12, 21] }
        ];
        return signs.find(s => (month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) || signs[0];
    }

    function getBirthstone(month) {
        const stones = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Alexandrite", "Ruby", "Peridot", "Sapphire", "Pink Tourmaline", "Topaz", "Blue Zircon"];
        return stones[month - 1];
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if(!obj) return;
        if (start === end) { obj.innerHTML = end; return; }
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.max(Math.abs(Math.floor(duration / range)), 10);
        const timer = setInterval(() => {
            current += increment;
            obj.innerHTML = current;
            if (current == end) clearInterval(timer);
        }, stepTime);
    }
});
