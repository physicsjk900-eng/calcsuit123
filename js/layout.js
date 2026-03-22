// js/layout.js

document.addEventListener('DOMContentLoaded', async () => {

    const calculatorConfig = [
        { id: '/', name: 'Dashboard', icon: '<i class="fas fa-home"></i>', category: 'General', colorClass: 'bg-transparent text-slate-500 dark:text-slate-400' },
        { id: '/calculators/basic-calculator.html', name: 'Basic', icon: '<i class="fas fa-equals text-sm"></i>', category: 'Standard', colorClass: 'bg-indigo-500' },
        { id: '/calculators/scientific-calculator.html', name: 'Scientific', icon: '<i class="fas fa-flask"></i>', category: 'Standard', colorClass: 'bg-indigo-100/50 text-indigo-600 dark:bg-slate-700/50 dark:text-indigo-400' },
        { id: '/calculators/percentage-calculator.html', name: 'Percentage', icon: '<i class="fas fa-percent"></i>', category: 'Standard', colorClass: 'bg-indigo-100/50 text-indigo-600 dark:bg-slate-700/50 dark:text-indigo-400' },
        { id: '/calculators/age-calculator.html', name: 'Age', icon: '<i class="fas fa-user-clock"></i>', category: 'Standard', colorClass: 'bg-indigo-100/50 text-indigo-600 dark:bg-slate-700/50 dark:text-indigo-400' },
        { id: '/math/fraction-calculator.html', name: 'Fraction', icon: '<i class="fas fa-divide"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/squareroot-calculator.html', name: 'Square Root', icon: '<i class="fas fa-square-root-variable"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/exponent-calculator.html', name: 'Exponent', icon: '<i class="fas fa-superscript"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/ratio-calculator.html', name: 'Ratio', icon: '<i class="fas fa-balance-scale"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/average-calculator.html', name: 'Average', icon: '<i class="fas fa-chart-line"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/stdev-calculator.html', name: 'Std Dev', icon: '<i class="fas fa-chart-pie"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/log-calculator.html', name: 'Logarithm', icon: '<i class="fas fa-calculator"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/math/matrix-calculator.html', name: 'Matrix', icon: '<i class="fas fa-border-all"></i>', category: 'Math', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/health/bmi-calculator.html', name: 'BMI', icon: '<i class="fas fa-weight"></i>', category: 'Health', colorClass: 'bg-rose-100/50 text-rose-600 dark:bg-slate-700/50 dark:text-rose-400' },
        { id: '/finance/emi-calculator.html', name: 'EMI', icon: '<i class="fas fa-money-bill-wave"></i>', category: 'Financial', colorClass: 'bg-emerald-100/50 text-emerald-600 dark:bg-slate-700/50 dark:text-emerald-400' },
        { id: '/finance/loan-calculator.html', name: 'Loan', icon: '<i class="fas fa-hand-holding-dollar"></i>', category: 'Financial', colorClass: 'bg-emerald-100/50 text-emerald-600 dark:bg-slate-700/50 dark:text-emerald-400' },
        { id: '/finance/interest-calculator.html', name: 'Interest', icon: '<i class="fas fa-chart-line"></i>', category: 'Financial', colorClass: 'bg-emerald-100/50 text-emerald-600 dark:bg-slate-700/50 dark:text-emerald-400' },
        { id: '/time/date-diff-calculator.html', name: 'Date Difference', icon: '<i class="far fa-calendar-alt"></i>', category: 'Time & Date', colorClass: 'bg-purple-100/50 text-purple-600 dark:bg-slate-700/50 dark:text-purple-400' },
        { id: '/time/work-hours-calculator.html', name: 'Work Hours', icon: '<i class="far fa-clock"></i>', category: 'Time & Date', colorClass: 'bg-purple-100/50 text-purple-600 dark:bg-slate-700/50 dark:text-purple-400' },
        { id: '/time/time-duration-calculator.html', name: 'Time Duration', icon: '<i class="fas fa-stopwatch"></i>', category: 'Time & Date', colorClass: 'bg-purple-100/50 text-purple-600 dark:bg-slate-700/50 dark:text-purple-400' },
        { id: '/time/countdown-calculator.html', name: 'Countdown', icon: '<i class="fas fa-hourglass-start"></i>', category: 'Time & Date', colorClass: 'bg-purple-100/50 text-purple-600 dark:bg-slate-700/50 dark:text-purple-400' },
        { id: '/time/days-between-calculator.html', name: 'Days Between', icon: '<i class="far fa-calendar-check"></i>', category: 'Time & Date', colorClass: 'bg-purple-100/50 text-purple-600 dark:bg-slate-700/50 dark:text-purple-400' },
        { id: '/conversion/length-converter.html', name: 'Length', icon: '<i class="fas fa-ruler"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/weight-converter.html', name: 'Weight', icon: '<i class="fas fa-weight-hanging"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/temperature-converter.html', name: 'Temperature', icon: '<i class="fas fa-temperature-high"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/speed-converter.html', name: 'Speed', icon: '<i class="fas fa-tachometer-alt"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/currency-converter.html', name: 'Currency', icon: '<i class="fas fa-money-bill-alt"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/area-converter.html', name: 'Area', icon: '<i class="fas fa-vector-square"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/volume-converter.html', name: 'Volume', icon: '<i class="fas fa-tint"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/energy-converter.html', name: 'Energy', icon: '<i class="fas fa-bolt"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/conversion/pressure-converter.html', name: 'Pressure', icon: '<i class="fas fa-compress-arrows-alt"></i>', category: 'Conversion', colorClass: 'bg-amber-100/50 text-amber-600 dark:bg-slate-700/50 dark:text-amber-400' },
        { id: '/finance/mortgage-afford-calculator.html', name: 'Mortgage Affordability', icon: '<i class="fas fa-home"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/rent-vs-buy-calculator.html', name: 'Rent vs Buy', icon: '<i class="fas fa-balance-scale"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/electricity-calculator.html', name: 'Electricity Bill', icon: '<i class="fas fa-plug"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/fuel-cost-calculator.html', name: 'Fuel Cost', icon: '<i class="fas fa-gas-pump"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/tip-calculator.html', name: 'Tip Calculator', icon: '<i class="fas fa-receipt"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/wedding-budget-calculator.html', name: 'Wedding Budget', icon: '<i class="fas fa-ring"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/lifestyle/party-budget-calculator.html', name: 'Party Budget', icon: '<i class="fas fa-glass-cheers"></i>', category: 'Lifestyle & Finance', colorClass: 'bg-sky-100/50 text-sky-600 dark:bg-slate-700/50 dark:text-sky-400' },
        { id: '/productivity/task-management-calculator.html', name: 'Task Manager', icon: '<i class="fas fa-tasks"></i>', category: 'Productivity', colorClass: 'bg-teal-100/50 text-teal-600 dark:bg-slate-700/50 dark:text-teal-400' },
        { id: '/productivity/task-calendar-generator.html', name: 'Task Calendar', icon: '<i class="fas fa-calendar-alt"></i>', category: 'Productivity', colorClass: 'bg-teal-100/50 text-teal-600 dark:bg-slate-700/50 dark:text-teal-400' }
    ];

    // Determine the base path prefix (e.g., if hosted at /calcsuite/ or local file path)
    // To make this fully robust across nested folders in local `file://` usage or standard root servers:
    const isLocal = window.location.protocol === 'file:';

    // We compute the true 'root' of our app by finding the distance from the current path.
    // If the URL contains an inner directory like '/finance/', we need to step back one folder '../'.
    const innerDirs = ['calculators', 'finance', 'health', 'math', 'time', 'conversion', 'lifestyle', 'business', 'productivity'];
    const depth = window.location.pathname.split('/').reverse().findIndex(p => innerDirs.includes(p));
    const rootPrefix = depth > -1 ? '../' : './';

    // 1. Inject Sidebar HTML statically to avoid CORS issues on file:// protocol
    const sidebarHtml = `
<nav class="sidebar bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/30 dark:border-white/5 w-full md:w-72 p-6 md:p-8 flex flex-col justify-between z-20 transition-all duration-300">
    <div>
        <!-- Header & Theme Toggle -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <i class="fas fa-calculator text-lg"></i>
                </div>
                <!-- Important: link back to root dashboard -->
                <a href="${rootPrefix}index.html" class="text-xl font-bold tracking-tight text-slate-800 dark:text-white hover:opacity-80 transition-opacity">
                    Calc<span class="text-indigo-500">Suit</span>
                </a>
            </div>
            <button id="theme-toggle"
                class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                aria-label="Toggle Dark Mode">
                <i class="fas fa-moon text-lg dark:hidden"></i>
                <i class="fas fa-sun text-lg hidden dark:block"></i>
            </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"><i class="fas fa-search"></i></span>
            <input type="text" id="calc-search"
                class="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                placeholder="Search calculators...">
        </div>

        <!-- Dynamic Navigation Tabs Injected via JS -->
        <div id="dynamic-sidebar" class="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar"></div>
    </div>

    <div class="mt-10 text-center text-sm font-medium text-slate-400 dark:text-slate-500 opacity-70">
        Crafted with <i class="fas fa-heart text-red-400 mx-1"></i>
    </div>
</nav>
    `;

    // 2. Initialize Theme System globally so standalone pages without sidebars still receive correct color themes
    const htmlElement = document.documentElement;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // 2.5 Initialize Standalone Header Dropdown
    const headerDropdown = document.getElementById('header-calculator-dropdown');
    if (headerDropdown) {
        const categories = [...new Set(calculatorConfig.map(c => c.category))];
        let dropdownHtml = '';
        categories.forEach(cat => {
            if (cat === 'General') return; // Skip dashboard item
            const items = calculatorConfig.filter(c => c.category === cat);
            dropdownHtml += `<div class="px-4 py-2 mt-2 mb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-400 dark:text-indigo-500 border-b border-slate-100 dark:border-slate-700/50">${cat}</div>`;
            items.forEach(c => {
                dropdownHtml += `
                    <a href="../${c.id.replace(/^\//, '')}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                        <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-colors">
                            ${c.icon}
                        </div>
                        ${c.name}
                    </a>
                `;
            });
        });
        headerDropdown.innerHTML = dropdownHtml;
    }

    const themeToggleHeaderBtn = document.getElementById('theme-toggle-header');
    if (themeToggleHeaderBtn) {
        themeToggleHeaderBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            if (htmlElement.classList.contains('dark')) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
        });
    }

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHtml;
        
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                htmlElement.classList.toggle('dark');
                if (htmlElement.classList.contains('dark')) {
                    localStorage.theme = 'dark';
                } else {
                    localStorage.theme = 'light';
                }
            });
        }
    } else {
        console.warn("Deploying in standalone mode: no sidebar initialized.");
        return; // Safe exit: standalone pages do not need active sidebar link computations
    }

    // 3. Render Dynamic Sidebar
    const dynamicSidebar = document.getElementById('dynamic-sidebar');
    const currentPath = window.location.pathname.replace(/\/home\//, '/'); // normalize local root
    let activeId = '/';

    // figure out which tab is active based on url
    calculatorConfig.forEach(calc => {
        if (calc.id !== '/' && window.location.pathname.includes(calc.id.replace(/^\//, ''))) {
            activeId = calc.id;
        }
    });

    if (dynamicSidebar) {
        const categories = [...new Set(calculatorConfig.map(c => c.category))];
        dynamicSidebar.innerHTML = categories.map(cat => {
            const items = calculatorConfig.filter(c => c.category === cat);
            const isDashboardCat = cat === 'General';

            // Determine if this category contains the active item
            const hasActiveChild = items.some(item => item.id === activeId);

            return `
                <div class="sidebar-category mb-2">
                    ${!isDashboardCat ? `
                    <button class="accordion-btn w-full text-left flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-indigo-500 transition-colors">
                        <span>${cat}</span>
                        <i class="fas fa-chevron-down text-[10px] transition-transform duration-300 ${hasActiveChild ? 'rotate-180' : ''}"></i>
                    </button>
                    ` : ''}
                    <ul class="space-y-1 ${!isDashboardCat ? `accordion-content px-2 ${hasActiveChild ? '' : 'hidden'}` : ''}">
                        ${items.map(c => {
                const isActive = c.id === activeId;
                // Resolve correct path prefix for links
                // If base URL has a trailing file ending like .html, link directly.
                // Dashboard links map to index.html in our setup if we want it to work locally over file:// protocol
                let href = c.id === '/' ? 'index.html' : c.id.replace(/^\//, '');
                href = rootPrefix + href;

                let activeClassString = isActive ? 'active-tab shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50';
                let iconBg = isActive ? 'bg-indigo-600 text-white' : c.colorClass;

                // Handle special case for dashboard transparency icon logic
                if (isActive && c.id === '/') iconBg = 'bg-transparent text-indigo-600';

                return `
                                <li class="nav-item">
                                    <a href="${href}" class="tab-btn w-full text-left px-4 py-3 rounded-2xl transition-all font-medium flex items-center gap-4 group ${activeClassString}">
                                        <span class="w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">${c.icon}</span> 
                                        <span class="tab-name">${c.name}</span>
                                    </a>
                                </li>
                            `;
            }).join('')}
                    </ul>
                </div>
            `;
        }).join('');

        // Setup Accordion Listeners
        document.querySelectorAll('.accordion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
    }

    // 4. Sidebar Search Filter
    const searchInput = document.getElementById('calc-search');
    if (searchInput && dynamicSidebar) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const categories = dynamicSidebar.querySelectorAll('.sidebar-category');

            categories.forEach(category => {
                const items = category.querySelectorAll('.nav-item');
                const btn = category.querySelector('.accordion-btn');
                const content = category.querySelector('.accordion-content');
                let hasMatch = false;

                items.forEach(item => {
                    const text = item.querySelector('.tab-name').textContent.toLowerCase();
                    if (text.includes(term)) {
                        item.style.display = 'block';
                        hasMatch = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (btn && content) {
                    if (term.length > 0 && hasMatch) {
                        content.classList.remove('hidden');
                        btn.querySelector('i').classList.add('rotate-180');
                    }
                }

                if (hasMatch) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    }

    // 5. Global Copy to Clipboard & Toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl transform transition-transform duration-300 translate-x-[200%] flex items-center gap-3 z-50 font-medium';
    toast.innerHTML = '<i class="fas fa-check-circle text-xl"></i><span>Copied to clipboard!</span>';
    document.body.appendChild(toast);

    let toastTimeout;
    window.showToast = () => {
        toast.style.transform = 'translateX(0)';
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.transform = 'translateX(200%)';
        }, 2000);
    };

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-trigger');
        if (!btn) return;

        e.stopPropagation();
        let valToCopy = "";
        const targetId = btn.dataset.target;

        if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                // remove HTML entities like mdash or literal hyphens that act as placeholders
                valToCopy = targetEl.innerText.replace(/&mdash;|—|-/g, '').trim();
            }
        }

        if (!valToCopy || valToCopy === 'Error' || valToCopy === '') return;

        navigator.clipboard.writeText(valToCopy).then(() => {
            window.showToast();
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });

    // 6. Global Keyboard Support (Dynamic)
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

        // Find the active/visible calculator view
        const container = document.querySelector('.calculator-view');
        if (!container) return;

        const key = e.key;
        let buttonToClick = null;

        if (/[0-9]/.test(key)) {
            buttonToClick = container.querySelector(`.calc-btn.btn-number[data-value="${key}"]`);
        } else if (key === '.' || key === ',') {
            buttonToClick = container.querySelector(`.calc-btn[data-action="decimal"]`);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            let action = '';
            if (key === '+') action = 'add';
            if (key === '-') action = 'subtract';
            if (key === '*') action = 'multiply';
            if (key === '/') action = 'divide';
            buttonToClick = container.querySelector(`.calc-btn[data-action="${action}"]`);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            buttonToClick = container.querySelector(`.calc-btn[data-action="calculate"]`);
        } else if (key === 'Backspace' || key === 'Delete') {
            buttonToClick = container.querySelector(`.calc-btn[data-action="backspace"]`);
        } else if (key === 'Escape') {
            buttonToClick = container.querySelector(`.calc-btn[data-action="clear"]`);
        } else if (key === '%') {
            buttonToClick = container.querySelector(`.calc-btn[data-action="percentage"]`);
        }

        if (buttonToClick) {
            buttonToClick.click();
            buttonToClick.classList.add('bg-indigo-100', 'dark:bg-slate-700/50');
            setTimeout(() => {
                buttonToClick.classList.remove('bg-indigo-100', 'dark:bg-slate-700/50');
            }, 100);
        }
    });

});
