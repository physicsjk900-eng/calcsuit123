// js/calculators/countdown.js
document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('cd-target');
    const resArea = document.getElementById('cd-results-area');
    const resD = document.getElementById('cd-res-d');
    const resH = document.getElementById('cd-res-h');
    const resM = document.getElementById('cd-res-m');
    const resS = document.getElementById('cd-res-s');
    const message = document.getElementById('cd-message');

    let timerInterval = null;

    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    function updateCountdown() {
        if (!targetInput.value) {
            clearInterval(timerInterval);
            resD.textContent = '00'; resH.textContent = '00'; resM.textContent = '00'; resS.textContent = '00';
            message.textContent = "Select a future date to start the countdown.";
            message.classList.remove('text-emerald-500');
            return;
        }

        const now = new Date().getTime();
        const target = new Date(targetInput.value).getTime();

        const distance = target - now;

        if (distance <= 0) {
            clearInterval(timerInterval);
            resD.textContent = '00'; resH.textContent = '00'; resM.textContent = '00'; resS.textContent = '00';
            message.textContent = "Target date has been reached!";
            message.classList.add('text-emerald-500', 'animate-pulse');
            resArea.classList.remove('opacity-0');
            return;
        }

        message.textContent = "Counting down...";
        message.classList.remove('text-emerald-500', 'animate-pulse');

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        resD.textContent = pad(days);
        resH.textContent = pad(hours);
        resM.textContent = pad(minutes);
        resS.textContent = pad(seconds);
        
        resArea.classList.remove('opacity-0');
    }

    if (targetInput) {
        // Set default to tomorrow noon
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        
        // format for datetime-local: YYYY-MM-DDThh:mm
        const tzOffset = tomorrow.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(tomorrow - tzOffset)).toISOString().slice(0, 16);
        targetInput.value = localISOTime;

        targetInput.addEventListener('change', () => {
            clearInterval(timerInterval);
            updateCountdown();
            timerInterval = setInterval(updateCountdown, 1000);
        });

        // initial kickoff
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    }
});
