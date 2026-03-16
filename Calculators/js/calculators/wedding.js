// js/calculators/wedding.js
document.addEventListener('DOMContentLoaded', () => {
    const budgetInput = document.getElementById('wed-budget');
    const breakdownContainer = document.getElementById('wed-breakdown');

    // Industry standard average wedding budget percentages
    const categories = [
        { name: 'Venue, Catering & Rentals', pct: 0.50, icon: 'fa-building' },
        { name: 'Photography & Videography', pct: 0.12, icon: 'fa-camera' },
        { name: 'Attire & Beauty', pct: 0.09, icon: 'fa-tshirt' },
        { name: 'Music & Entertainment', pct: 0.08, icon: 'fa-music' },
        { name: 'Flowers & Decor', pct: 0.08, icon: 'fa-spa' },
        { name: 'Favors & Gifts', pct: 0.02, icon: 'fa-gift' },
        { name: 'Transportation', pct: 0.02, icon: 'fa-car' },
        { name: 'Stationery', pct: 0.02, icon: 'fa-envelope' },
        { name: 'Cake', pct: 0.02, icon: 'fa-birthday-cake' },
        { name: 'Cushion / Miscellaneous', pct: 0.05, icon: 'fa-umbrella-beach' }
    ];

    function calculate() {
        const total = parseFloat(budgetInput.value) || 0;
        const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

        breakdownContainer.innerHTML = '';

        if (total <= 0) {
            breakdownContainer.innerHTML = '<div class="col-span-full text-center text-slate-400 py-8">Enter a budget to see the breakdown.</div>';
            return;
        }

        categories.forEach(cat => {
            const amount = total * cat.pct;
            
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-sky-300 transition-colors";
            
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <div>
                        <div class="text-sm font-bold text-slate-700 dark:text-slate-300">${cat.name}</div>
                        <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${(cat.pct * 100).toFixed(0)}% Allocation</div>
                    </div>
                </div>
                <div class="text-lg font-black text-sky-600 dark:text-sky-400 text-right shrink-0 ml-4">
                    ${curFmt.format(amount)}
                </div>
            `;
            
            breakdownContainer.appendChild(div);
        });
    }

    if (budgetInput) {
        budgetInput.addEventListener('input', calculate);
        calculate();
    }
});
