function revealTheMagic() {
    const n1 = document.getElementById('user-name').value.trim();
    const n2 = document.getElementById('partner-name').value.trim();

    if (!n1 || !n2) {
        alert("Enter both names to see the magic! 💖");
        return;
    }

    // A secret way to find a high "Love Score" based on names
    let scoreTotal = 0;
    const combined = (n1 + n2).toLowerCase();
    for (let i = 0; i < combined.length; i++) scoreTotal += combined.charCodeAt(i);

    // This keeps the score between 75% and 100% so it's always loving!
    const finalScore = (scoreTotal % 26) + 75;

    // Update the names on the card
    document.getElementById('label-name1').innerText = n1;
    document.getElementById('label-name2').innerText = n2;

    // Switch screens
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('reveal-view').classList.remove('hidden');

    // Make the number count up fast
    let current = 0;
    const timer = setInterval(() => {
        if (current >= finalScore) {
            clearInterval(timer);
            setHeartfeltMessage(finalScore);
        } else {
            current++;
            document.getElementById('love-percent').innerText = current + "%";
        }
    }, 20);
}

function setHeartfeltMessage(s) {
    const m = document.getElementById('love-message');
    if (s > 95) m.innerText = "You're truly soulmates. The world is just better when you're together! ✨💍";
    else if (s > 88) m.innerText = "Pure magic! You two have a spark that most people only dream of. 🔥❤️";
    else m.innerText = "A beautiful connection. You balance each other out perfectly! 🌸😊";
}

// Function to save the "Love Card" as a real photo
async function savePhoto() {
    const card = document.getElementById('printable-card');
    const canvas = await html2canvas(card, { backgroundColor: null, scale: 3 });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `Our-Love-Story.png`;
    link.href = image;
    link.click();
}

function sendToPartner() {
    const score = document.getElementById('love-percent').innerText;
    const n1 = document.getElementById('label-name1').innerText;
    const text = `I just checked our names and... wow! We are a ${score} match. I knew we were special! ❤️✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}