document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // Age Calculator
    // --------------------------------------
    const dobInput = document.getElementById('dob-input');
    const targetInput = document.getElementById('target-date-input');
    
    if(!dobInput || !targetInput) return;

    // Set default target to today
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

        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            // get days in previous month
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Animate numbers
        animateValue("res-years", 0, years, 1000);
        animateValue("res-months", 0, months, 1000);
        animateValue("res-days", 0, days, 1000);

        // Next Birthday Calculation
        let nextBd = new Date(dob);
        nextBd.setFullYear(target.getFullYear());

        // If birthday has passed this year, next birthday is next year
        if (nextBd.getTime() < target.getTime() && (nextBd.getMonth() !== target.getMonth() || nextBd.getDate() !== target.getDate())) {
            nextBd.setFullYear(target.getFullYear() + 1);
        }

        // Fix timezone offset issues by using UTC for difference
        const utc1 = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
        const utc2 = Date.UTC(nextBd.getFullYear(), nextBd.getMonth(), nextBd.getDate());
        const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

        let nextBdText;
        if (diffDays === 0) nextBdText = "Today!";
        else if (diffDays === 1) nextBdText = "1 day";
        else nextBdText = `${diffDays} days`;

        document.getElementById('res-next-bd').innerText = nextBdText;

        const resultsDiv = document.getElementById('age-results');
        if(resultsDiv) {
            resultsDiv.classList.remove('hidden');
            // trigger reflow
            void resultsDiv.offsetWidth;
            resultsDiv.classList.remove('opacity-0', 'translate-y-4');
        }
    };

    function animateValue(id, start, end, duration) {
        if (start === end) {
            const el = document.getElementById(id);
            if(el) el.innerHTML = end;
            return;
        }
        let range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        let stepTime = Math.abs(Math.floor(duration / range));
        let obj = document.getElementById(id);
        if(!obj) return;
        
        let timer = setInterval(function () {
            current += increment;
            obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
});
