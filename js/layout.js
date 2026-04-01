// js/layout.js

document.addEventListener('DOMContentLoaded', async () => {

    const calculatorConfig = [
        { id: '/', name: 'Dashboard', icon: '<i class="fas fa-home"></i>', category: 'General', colorClass: 'text-slate-500' },
        { id: '/calculators/basic-calculator.html', name: 'Basic', icon: '<i class="fas fa-equals text-sm"></i>', category: 'Standard', colorClass: 'text-indigo-600' },
        { id: '/calculators/scientific-calculator.html', name: 'Scientific', icon: '<i class="fas fa-flask"></i>', category: 'Standard', colorClass: 'text-indigo-600' },
        { id: '/calculators/percentage-calculator.html', name: 'Percentage', icon: '<i class="fas fa-percent"></i>', category: 'Standard', colorClass: 'text-indigo-600' },
        { id: '/calculators/age-calculator.html', name: 'Age', icon: '<i class="fas fa-user-clock"></i>', category: 'Standard', colorClass: 'text-indigo-600' },
        { id: '/math/fraction-calculator.html', name: 'Fraction', icon: '<i class="fas fa-divide"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/squareroot-calculator.html', name: 'Square Root', icon: '<i class="fas fa-square-root-variable"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/exponent-calculator.html', name: 'Exponent', icon: '<i class="fas fa-superscript"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/ratio-calculator.html', name: 'Ratio', icon: '<i class="fas fa-balance-scale"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/average-calculator.html', name: 'Average', icon: '<i class="fas fa-chart-line"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/stdev-calculator.html', name: 'Std Dev', icon: '<i class="fas fa-chart-pie"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/log-calculator.html', name: 'Logarithm', icon: '<i class="fas fa-calculator"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/matrix-calculator.html', name: 'Matrix', icon: '<i class="fas fa-border-all"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/quadratic-calculator.html', name: 'Quadratic Solver', icon: '<i class="fas fa-superscript"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/probability-calculator.html', name: 'Probability', icon: '<i class="fas fa-dice"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/gcd-lcm-calculator.html', name: 'GCD & LCM', icon: '<i class="fas fa-layer-group"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/prime-calculator.html', name: 'Prime Numbers', icon: '<i class="fas fa-list-ol"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/base-converter.html', name: 'Base Converter', icon: '<i class="fas fa-hashtag"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/bandwidth-calculator.html', name: 'Bandwidth Hub', icon: '<i class="fas fa-wifi"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/triangle-calculator.html', name: 'Triangle Pro', icon: '<i class="fas fa-draw-polygon"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/math/variance-calculator.html', name: 'Percent Variance', icon: '<i class="fas fa-chart-line"></i>', category: 'Math', colorClass: 'text-sky-600' },
        { id: '/health/bmi-calculator.html', name: 'BMI', icon: '<i class="fas fa-weight"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/bmr-calculator.html', name: 'BMR', icon: '<i class="fas fa-bolt"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/calorie-calculator.html', name: 'Calorie', icon: '<i class="fas fa-fire"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/body-fat-calculator.html', name: 'Body Fat', icon: '<i class="fas fa-percentage"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/ideal-weight-calculator.html', name: 'Ideal Weight', icon: '<i class="fas fa-balance-scale"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/macro-calculator.html', name: 'Macro Blueprint', icon: '<i class="fas fa-utensils"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/water-intake-calculator.html', name: 'Hydration Master', icon: '<i class="fas fa-tint"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/heart-rate-calculator.html', name: 'HR Zones', icon: '<i class="fas fa-heartbeat"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/pregnancy-calculator.html', name: 'Pregnancy Due', icon: '<i class="fas fa-baby"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/whr-calculator.html', name: 'Waist-to-Hip', icon: '<i class="fas fa-ruler-horizontal"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/bsa-calculator.html', name: 'Body Surface', icon: '<i class="fas fa-expand-alt"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/bp-calculator.html', name: 'Blood Pressure', icon: '<i class="fas fa-stethoscope"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/health/caffeine-calculator.html', name: 'Caffeine Logic', icon: '<i class="fas fa-coffee"></i>', category: 'Health', colorClass: 'text-rose-600' },
        { id: '/finance/emi-calculator.html', name: 'EMI', icon: '<i class="fas fa-money-bill-wave"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/loan-calculator.html', name: 'Loan Architect', icon: '<i class="fas fa-hand-holding-dollar"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/loan-optimizer.html', name: 'Loan Optimizer', icon: '<i class="fas fa-rocket"></i>', category: 'Financial', colorClass: 'text-amber-500' },
        { id: '/finance/interest-calculator.html', name: 'Interest', icon: '<i class="fas fa-chart-line"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/compound-interest-calculator.html', name: 'Compound Growth', icon: '<i class="fas fa-chart-line"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/salary-calculator.html', name: 'Salary Estimator', icon: '<i class="fas fa-wallet"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/break-even-calculator.html', name: 'Break-Even', icon: '<i class="fas fa-balance-scale-right"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/margin-calculator.html', name: 'Markup/Margin', icon: '<i class="fas fa-tags"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/drip-calculator.html', name: 'DRIP Growth', icon: '<i class="fas fa-seedling"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/tax-calculator.html', name: 'VAT/GST Calc', icon: '<i class="fas fa-file-invoice-dollar"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/savings-goal-calculator.html', name: 'Savings Goal', icon: '<i class="fas fa-bullseye"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/credit-card-payoff.html', name: 'Credit Payoff', icon: '<i class="fas fa-credit-card"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/finance/retirement-calculator.html', name: 'Retirement (FIRE)', icon: '<i class="fas fa-umbrella-beach"></i>', category: 'Financial', colorClass: 'text-emerald-600' },
        { id: '/time/date-diff-calculator.html', name: 'Date Difference', icon: '<i class="far fa-calendar-alt"></i>', category: 'Time & Date', colorClass: 'text-purple-600' },
        { id: '/time/work-hours-calculator.html', name: 'Work Hours', icon: '<i class="far fa-clock"></i>', category: 'Time & Date', colorClass: 'text-purple-600' },
        { id: '/time/time-duration-calculator.html', name: 'Time Duration', icon: '<i class="fas fa-stopwatch"></i>', category: 'Time & Date', colorClass: 'text-purple-600' },
        { id: '/time/countdown-calculator.html', name: 'Countdown', icon: '<i class="fas fa-hourglass-start"></i>', category: 'Time & Date', colorClass: 'text-purple-600' },
        { id: '/time/days-between-calculator.html', name: 'Days Between', icon: '<i class="far fa-calendar-check"></i>', category: 'Time & Date', colorClass: 'text-purple-600' },
        { id: '/conversion/length-converter.html', name: 'Length', icon: '<i class="fas fa-ruler"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/weight-converter.html', name: 'Weight', icon: '<i class="fas fa-weight-hanging"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/temperature-converter.html', name: 'Temperature', icon: '<i class="fas fa-temperature-high"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/speed-converter.html', name: 'Speed', icon: '<i class="fas fa-tachometer-alt"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/currency-converter.html', name: 'Currency', icon: '<i class="fas fa-money-bill-alt"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/area-converter.html', name: 'Area', icon: '<i class="fas fa-vector-square"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/volume-converter.html', name: 'Volume', icon: '<i class="fas fa-tint"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/energy-converter.html', name: 'Energy', icon: '<i class="fas fa-bolt"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/conversion/pressure-converter.html', name: 'Pressure', icon: '<i class="fas fa-compress-arrows-alt"></i>', category: 'Conversion', colorClass: 'text-amber-600' },
        { id: '/finance/mortgage-afford-calculator.html', name: 'Mortgage Affordability', icon: '<i class="fas fa-home"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/rent-vs-buy-calculator.html', name: 'Rent vs Buy', icon: '<i class="fas fa-balance-scale"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/electricity-calculator.html', name: 'Electricity Bill', icon: '<i class="fas fa-plug"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/fuel-cost-calculator.html', name: 'Fuel Cost', icon: '<i class="fas fa-gas-pump"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/tip-calculator.html', name: 'Tip Calculator', icon: '<i class="fas fa-receipt"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/wedding-budget-calculator.html', name: 'Wedding Budget', icon: '<i class="fas fa-ring"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/party-budget-calculator.html', name: 'Party Budget', icon: '<i class="fas fa-glass-cheers"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/Love-calculator.html', name: 'Love Calculator', icon: '<i class="fas fa-heart"></i>', category: 'Lifestyle', colorClass: 'text-rose-500' },
        { id: '/lifestyle/sleep-calculator.html', name: 'Sleep Cycle', icon: '<i class="fas fa-bed"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/kitchen-calculator.html', name: 'Kitchen Pro', icon: '<i class="fas fa-blender"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/pet-age-calculator.html', name: 'Pet Age Master', icon: '<i class="fas fa-paw"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/physics/ohms-law-calculator.html', name: 'Ohm’s Law', icon: '<i class="fas fa-bolt"></i>', category: 'Technical', colorClass: 'text-sky-600' },
        { id: '/lifestyle/unit-converter.html', name: 'Unit Master', icon: '<i class="fas fa-exchange-alt"></i>', category: 'Technical', colorClass: 'text-sky-600' },
        { id: '/lifestyle/timezone-calculator.html', name: 'Temporal Hub', icon: '<i class="fas fa-globe-americas"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/fuel-calculator.html', name: 'Fuel Cost Pro', icon: '<i class="fas fa-gas-pump"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/random-generator.html', name: 'Entropy Hub', icon: '<i class="fas fa-random"></i>', category: 'Technical', colorClass: 'text-sky-600' },
        { id: '/lifestyle/screen-time-impact.html', name: 'Screen Impact', icon: '<i class="fas fa-mobile-alt"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/carbon-footprint.html', name: 'CO2 Footprint', icon: '<i class="fas fa-leaf"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/lifestyle/vacation-planner.html', name: 'Vacation Budget', icon: '<i class="fas fa-plane"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' },
        { id: '/productivity/task-management-calculator.html', name: 'Task Manager', icon: '<i class="fas fa-tasks"></i>', category: 'Productivity', colorClass: 'text-teal-600' },
        { id: '/productivity/task-calendar-generator.html', name: 'Task Calendar', icon: '<i class="fas fa-calendar-alt"></i>', category: 'Productivity', colorClass: 'text-teal-600' }
    ];

    const isLocal = window.location.protocol === 'file:';
    const innerDirs = ['calculators', 'finance', 'health', 'math', 'time', 'conversion', 'lifestyle', 'business', 'productivity', 'physics'];
    const depth = window.location.pathname.split('/').reverse().findIndex(p => innerDirs.includes(p));
    const rootPrefix = depth > -1 ? '../' : './';

    // Extrapolate for global indexing
    window.calculatorConfig = calculatorConfig;
    window.rootPrefix = rootPrefix;

    let activeId = '/';
    calculatorConfig.forEach(calc => {
        if (calc.id !== '/' && window.location.pathname.includes(calc.id.replace(/^\//, ''))) {
            activeId = calc.id;
        }
    });

    // Define Suite Configuration for optimized Navigation
    const suites = [
        { name: 'Math & Systems', categories: ['Standard', 'Math', 'Technical', 'Physics'], icon: '<i class="fas fa-microchip"></i>' },
        { name: 'Wealth & Growth', categories: ['Financial', 'Business'], icon: '<i class="fas fa-vault"></i>' },
        { name: 'Health & Life', categories: ['Health', 'Lifestyle'], icon: '<i class="fas fa-heartbeat"></i>' },
        { name: 'Utility Hub', categories: ['Time & Date', 'Conversion', 'Productivity'], icon: '<i class="fas fa-tools"></i>' }
    ];

    // Generate Desktop Navigation Items (Consolidated Suite Model)
    const desktopNavHtml = suites.map(suite => {
        const suiteItems = calculatorConfig.filter(c => suite.categories.includes(c.category));
        const isActiveSuite = suiteItems.some(item => item.id === activeId);
        
        // Multi-column optimization for large suites
        const columnClass = suiteItems.length > 8 ? 'grid-cols-2 w-[480px]' : 'grid-cols-1 w-64';

        return `
            <div class="relative group h-full flex items-center">
                <button class="flex items-center gap-2 font-semibold text-[13px] transition-colors ${isActiveSuite ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}">
                    <span class="opacity-60 text-xs">${suite.icon}</span>
                    ${suite.name}
                    <i class="fas fa-chevron-down text-[9px] opacity-40 group-hover:rotate-180 transition-transform duration-200"></i>
                </button>
                <div class="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 grid ${columnClass} gap-1">
                        ${suiteItems.map(c => {
                            const isItemActive = c.id === activeId;
                            let href = rootPrefix + c.id.replace(/^\//, '');
                            return `
                                <a href="${href}" class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${isItemActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'}">
                                    <span class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-[10px] ${isItemActive ? 'text-indigo-600 dark:text-indigo-400' : c.colorClass} shrink-0">${c.icon}</span>
                                    <span class="truncate">${c.name}</span>
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const categories = [...new Set(calculatorConfig.map(c => c.category))].filter(c => c !== 'General');
    const mobileNavHtml = categories.map(cat => {
        const items = calculatorConfig.filter(c => c.category === cat);
        return `
            <div class="mb-5">
                <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-3 mb-2">${cat}</h4>
                <div class="space-y-1">
                    ${items.map(c => {
                        const isItemActive = c.id === activeId;
                        let href = rootPrefix + c.id.replace(/^\//, '');
                        return `
                            <a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isItemActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
                                <span class="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${isItemActive ? 'text-indigo-600 dark:text-indigo-400' : c.colorClass} shrink-0">${c.icon}</span>
                                <span class="truncate">${c.name}</span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');

    // 1. Inject SaaS Top Header HTML instead of Sidebar
    const headerHtml = `
<header class="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">
            
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center gap-3">
                <button id="mobile-menu-btn" class="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="hidden sm:flex w-9 h-9 rounded-lg bg-indigo-600 items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                    <i class="fas fa-calculator text-sm"></i>
                </div>
                <!-- Important: link back to root dashboard -->
                <a href="${rootPrefix}index.html" class="text-xl font-bold tracking-tight text-slate-900 dark:text-white ml-2 sm:ml-0">
                    Calc<span class="text-indigo-600 dark:text-indigo-400">Suit</span>
                </a>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden lg:flex space-x-6 h-16" id="desktop-nav" role="navigation" aria-label="Main Navigation">
                ${desktopNavHtml}
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center gap-4">
                <div class="relative hidden sm:block w-48 xl:w-64">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><i class="fas fa-search text-xs"></i></span>
                    <input type="text" id="calc-search"
                        class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="Search tools...">
                    
                    <!-- Search Results Dropdown -->
                    <div id="search-results" class="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden hidden"></div>
                </div>

                <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                <button id="theme-toggle"
                    class="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle Dark Mode">
                    <i class="fas fa-moon text-sm dark:hidden"></i>
                    <i class="fas fa-sun text-sm hidden dark:block"></i>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] hidden opacity-0 transition-opacity duration-300">
        <div class="absolute inset-0 cursor-pointer" id="mobile-menu-bg"></div>
        <div id="mobile-menu-panel" class="absolute top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-white dark:bg-slate-900 shadow-2xl transform -translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col border-r border-slate-200 dark:border-slate-800" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                        <i class="fas fa-calculator text-xs"></i>
                    </div>
                    <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Calc<span class="text-indigo-600 dark:text-indigo-400">Suit</span></span>
                </div>
                <button id="mobile-menu-close" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors rounded-full bg-slate-100 dark:bg-slate-800">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 pb-12">
                ${mobileNavHtml}
            </div>
        </div>
    </div>
</header>
    `;

    // 2. Initialize Theme System
    const htmlElement = document.documentElement;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = headerHtml;

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

        // Mobile Menu Initialization
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileMenuBg = document.getElementById('mobile-menu-bg');

        function toggleMobileMenu(show) {
            if (!mobileMenuOverlay || !mobileMenuPanel) return;
            if (show) {
                mobileMenuOverlay.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuOverlay.classList.remove('opacity-0');
                    mobileMenuPanel.classList.remove('-translate-x-full');
                }, 10);
            } else {
                mobileMenuOverlay.classList.add('opacity-0');
                mobileMenuPanel.classList.add('-translate-x-full');
                setTimeout(() => {
                    mobileMenuOverlay.classList.add('hidden');
                }, 300);
            }
        }

        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
        if (mobileMenuClose) mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
        if (mobileMenuBg) mobileMenuBg.addEventListener('click', () => toggleMobileMenu(false));
    }

    // 4. Search Filter
    const searchInput = document.getElementById('calc-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (term.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }

            const results = calculatorConfig.filter(c => c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term));

            if (results.length > 0) {
                searchResults.innerHTML = results.map(c => {
                    let href = rootPrefix + (c.id === '/' ? 'index.html' : c.id.replace(/^\//, ''));
                    return `
                        <a href="${href}" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <span class="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center ${c.colorClass} shrink-0">${c.icon}</span>
                            <div>
                                <div class="text-sm font-medium text-slate-700 dark:text-slate-200">${c.name}</div>
                                <div class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">${c.category}</div>
                            </div>
                        </a>
                    `;
                }).join('');
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = `<div class="px-4 py-4 text-sm text-slate-500 text-center">No tools found for "${term}"</div>`;
                searchResults.classList.remove('hidden');
            }
        });

        // Hide search on outside click
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }

    // 5. Global Copy to Clipboard & Toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-lg shadow-xl transform transition-transform duration-300 translate-y-[200%] flex items-center gap-3 z-50 font-medium border dark:border-slate-200';
    toast.innerHTML = '<i class="fas fa-check-circle text-emerald-400 dark:text-emerald-500"></i><span class="text-sm shadow-none font-semibold">Copied to clipboard</span>';
    document.body.appendChild(toast);

    let toastTimeout;
    window.showToast = () => {
        toast.style.transform = 'translateY(0)';
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.transform = 'translateY(200%)';
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
            buttonToClick.classList.add('bg-slate-200', 'dark:bg-slate-700');
            setTimeout(() => {
                buttonToClick.classList.remove('bg-slate-200', 'dark:bg-slate-700');
            }, 100);
        }
    });

    // 7. Global Multi-Language Translator Widget
    const translateContainerHtml = `
        <div id="google_translate_element" style="display:none;"></div>
        <div class="fixed bottom-6 left-6 z-[200] group">
            <button class="w-12 h-12 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg transition-all duration-300 hover:shadow-xl hover:text-indigo-600 dark:hover:text-indigo-400">
                <i class="fas fa-language"></i>
            </button>
            <div class="absolute bottom-full left-0 mb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-bottom-left scale-95 group-hover:scale-100">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[200px]">
                    <div id="custom-translate-container" class="translate-wrapper"></div>
                </div>
            </div>
        </div>
        <style>
            body { top: 0 !important; }
            .skiptranslate.goog-te-banner-frame { display: none !important; }
            #goog-gt-tt { display: none !important; }
            .goog-tooltip, .goog-tooltip:hover { display: none !important; }
            .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
            #custom-translate-container .goog-te-combo { 
                width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; 
                background-color: #f8fafc; color: #334155; font-size: 13px; outline: none; cursor: pointer;
            }
            html.dark #custom-translate-container .goog-te-combo {
                border-color: #334155; background-color: #0f172a; color: #e2e8f0;
            }
            .goog-logo-link { display: none !important; }
            .goog-te-gadget { color: transparent !important; font-size: 0 !important; }
            .goog-te-gadget .goog-te-combo { margin: 0 !important; }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', translateContainerHtml);

    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'custom-translate-container');
    };

    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

});
