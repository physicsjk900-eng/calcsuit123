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

        categories.forEach((cat, index) => {
            const amount = total * cat.pct;
            const colors = ['pink', 'rose', 'fuchsia', 'purple', 'indigo', 'blue', 'sky', 'teal', 'emerald', 'amber'];
            const color = colors[index % colors.length];
            
            const div = document.createElement('div');
            div.className = `group/cat flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-${color}-400/50 transition-all duration-300 shadow-sm hover:shadow-md`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400 shrink-0 transition-transform group-hover/cat:scale-110">
                        <i class="fas ${cat.icon} text-xl"></i>
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">${(cat.pct * 100).toFixed(0)}% Allocation</div>
                        <div class="text-sm font-bold text-slate-700 dark:text-slate-200">${cat.name}</div>
                    </div>
                </div>
                <div class="text-xl font-black text-slate-900 dark:text-white text-right shrink-0 ml-4 tabular-nums">
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
