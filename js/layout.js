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
        /* { id: '/math/gcd-lcm-calculator.html', name: 'GCD & LCM', icon: '<i class="fas fa-layer-group"></i>', category: 'Math', colorClass: 'text-sky-600' },
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
        { id: '/finance/subscription-drain-auditor.html', name: 'Subscription Drain Auditor', icon: '<i class="fas fa-eye-slash"></i>', category: 'Financial', colorClass: 'text-rose-600' },
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
        { id: '/lifestyle/vacation-planner.html', name: 'Vacation Budget', icon: '<i class="fas fa-plane"></i>', category: 'Lifestyle', colorClass: 'text-sky-600' }, */
        { id: '/productivity/task-management-calculator.html', name: 'Task Manager', icon: '<i class="fas fa-tasks"></i>', category: 'Productivity', colorClass: 'text-teal-600' },
        { id: '/productivity/task-calendar-generator.html', name: 'Task Calendar', icon: '<i class="fas fa-calendar-alt"></i>', category: 'Productivity', colorClass: 'text-teal-600' },
        /* { id: '/productivity/circadian-rhythm-energy-calculator.html', name: 'Circadian Rhythm Energy', icon: '<i class="fas fa-brain"></i>', category: 'Productivity', colorClass: 'text-violet-600' },
        { id: '/productivity/commute-cost-calculator.html', name: 'Commute Cost Arbitrage', icon: '<i class="fas fa-car-side"></i>', category: 'Productivity', colorClass: 'text-teal-600' },
        { id: '/productivity/neural-task-architect.html', name: 'Neural Task Architect', icon: '<i class="fas fa-microchip"></i>', category: 'Productivity', colorClass: 'text-violet-600' },
        { id: '/productivity/brand-deal-calculator.html', name: 'Sponsorship Architect', icon: '<i class="fas fa-hand-holding-usd"></i>', category: 'Productivity', colorClass: 'text-violet-600' }*/
    ];

    const isLocal = window.location.protocol === 'file:';
    const innerDirs = ['calculators', 'finance', 'health', 'math', 'time', 'conversion', 'lifestyle', 'business', 'productivity', 'physics'];
    const depth = window.location.pathname.split('/').reverse().findIndex(p => innerDirs.includes(p));
    const rootPrefix = depth > -1 ? '../' : './';

    // Extrapolate for global indexing
    window.calculatorConfig = calculatorConfig;
    window.rootPrefix = rootPrefix;

    const currentPath = window.location.pathname;
    let activeId = '/';
    calculatorConfig.forEach(calc => {
        if (calc.id !== '/' && currentPath.includes(calc.id.replace(/^\//, ''))) {
            activeId = calc.id;
        }
    });

    const currentTool = calculatorConfig.find(c => c.id === activeId);

    // --- Helper: Generate Breadcrumbs ---
    function generateBreadcrumbs() {
        if (activeId === '/' || !currentTool) return '';
        return `
            <nav class="w-full max-w-5xl mx-auto mb-6 px-4 flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth">
                <a href="${rootPrefix}index.html" class="hover:text-indigo-500 transition-colors shrink-0">Home</a>
                <i class="fas fa-chevron-right text-[8px] opacity-30 shrink-0"></i>
                <span class="text-slate-300 shrink-0">${currentTool.category}</span>
                <i class="fas fa-chevron-right text-[8px] opacity-30 shrink-0"></i>
                <span class="text-indigo-500 shrink-0">${currentTool.name}</span>
            </nav>
        `;
    }

    // --- Helper: Generate Category Navigator (Dynamic & Visual) ---
    function generateCategoryNavigator() {
        if (activeId === '/' || !currentTool) return '';

        // Only show categories that have at least one active tool
        const activeCategories = [...new Set(calculatorConfig.map(c => c.category))];

        const allCats = [
            { name: 'Standard', icon: '<i class="fas fa-equals"></i>', color: 'text-indigo-500' },
            { name: 'Math', icon: '<i class="fas fa-divide"></i>', color: 'text-sky-500' },
            { name: 'Financial', icon: '<i class="fas fa-wallet"></i>', color: 'text-emerald-500' },
            { name: 'Health', icon: '<i class="fas fa-heartbeat"></i>', color: 'text-rose-500' },
            { name: 'Time & Date', icon: '<i class="far fa-calendar-alt"></i>', color: 'text-purple-500' },
            { name: 'Conversion', icon: '<i class="fas fa-exchange-alt"></i>', color: 'text-amber-500' },
            { name: 'Productivity', icon: '<i class="fas fa-tasks"></i>', color: 'text-teal-500' }
        ];

        const cats = allCats.filter(c => activeCategories.includes(c.name));

        return `
            <div class="w-full max-w-5xl mx-auto mb-10 px-4">
                <div class="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    ${cats.map(c => {
            const isActive = currentTool && currentTool.category === c.name;
            return `
                            <a href="${rootPrefix}index.html?cat=${c.name}" class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500'}">
                                <span class="${isActive ? 'text-white' : c.color} text-xs">${c.icon}</span>
                                <span class="text-xs font-bold whitespace-nowrap">${c.name}</span>
                            </a>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }



    // --- Helper: Generate Related Tools ---
    function generateRelatedTools() {
        if (activeId === '/' || !currentTool) return '';

        const categoryTools = calculatorConfig.filter(c => c.category === currentTool.category && c.id !== '/');
        const currentIndex = categoryTools.findIndex(c => c.id === activeId);

        const prevTool = currentIndex > 0 ? categoryTools[currentIndex - 1] : categoryTools[categoryTools.length - 1];
        const nextTool = currentIndex < categoryTools.length - 1 ? categoryTools[currentIndex + 1] : categoryTools[0];

        const related = calculatorConfig
            .filter(c => c.category === currentTool.category && c.id !== activeId && c.id !== '/')
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        return `
            <!-- Next/Prev Subtle Nav -->
            <div class="w-full max-w-5xl mx-auto mb-12 px-4">
                <div class="flex justify-between items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                    <a href="${rootPrefix}${prevTool.id.replace(/^\//, '')}" class="flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors group">
                        <i class="fas fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
                        <div class="hidden sm:block">
                            <div class="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Previous</div>
                            <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300">${prevTool.name}</div>
                        </div>
                    </a>
                    <div class="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
                    <a href="${rootPrefix}${nextTool.id.replace(/^\//, '')}" class="flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors group text-right">
                        <div class="hidden sm:block">
                            <div class="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Next</div>
                            <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300">${nextTool.name}</div>
                        </div>
                        <i class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            <div class="w-full max-w-5xl mx-auto mt-16 mb-12 px-4">
                <div class="flex items-center justify-between mb-8">
                    <h3 class="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
                        <span class="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs shadow-lg shadow-indigo-500/20">
                            <i class="fas fa-layer-group"></i>
                        </span>
                        Other ${currentTool.category} Tools
                    </h3>
                    <a href="${rootPrefix}index.html" class="text-xs font-bold text-indigo-500 hover:underline">View All &rarr;</a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${related.map(r => `
                        <a href="${rootPrefix}${r.id.replace(/^\//, '')}" class="group bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-xl">
                            <div class="flex flex-col gap-4">
                                <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${r.colorClass} group-hover:scale-110 transition-transform">
                                    ${r.icon}
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-black text-slate-800 dark:text-white mb-1">${r.name}</div>
                                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${r.category}</div>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Helper: Cookie Consent Initialization ---


    // --- Helper: Google Analytics Initialization ---
    function initAnalytics() {
        const gaId = 'G-TWGM5ZWN6X';
        if (window.gtagInitialized) return;
        window.gtagInitialized = true;
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', gaId);
    }

    // --- Helper: Dynamic Security Hardening (CSP Fallback) ---
    function initSecurityHardening() {
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const csp = document.createElement('meta');
            csp.httpEquiv = "Content-Security-Policy";
            csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com; connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com;";
            document.head.appendChild(csp);
        }
    }

    // Define Suite Configuration for optimized Navigation
    const suites = [
        { name: 'Math & Systems', categories: ['Standard', 'Math', 'Technical', 'Physics'], icon: '<i class="fas fa-microchip"></i>' },
        /* { name: 'Wealth & Growth', categories: ['Financial', 'Business'], icon: '<i class="fas fa-vault"></i>' },
        { name: 'Health & Life', categories: ['Health', 'Lifestyle'], icon: '<i class="fas fa-heartbeat"></i>' }, */
        { name: 'Utility Hub', categories: ['Time & Date', 'Conversion', 'Productivity'], icon: '<i class="fas fa-tools"></i>' }
    ];

    // Generate Desktop Navigation Items (Mega-Menu Model)
    const desktopNavHtml = suites.map(suite => {
        const suiteItems = calculatorConfig.filter(c => suite.categories.includes(c.category));
        const isActiveSuite = suiteItems.some(item => item.id === activeId);

        // Optimization: Multi-column grid for dense suites (Enterprise look)
        const columnClass = suiteItems.length > 10 ? 'grid-cols-3 w-[720px]' : (suiteItems.length > 5 ? 'grid-cols-2 w-[480px]' : 'grid-cols-1 w-64');

        return `
            <div class="relative group h-full flex items-center">
                <button class="flex items-center gap-2 font-bold text-[13px] transition-all duration-300 py-1 px-3 rounded-lg group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 ${isActiveSuite ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}">
                    <span class="opacity-70 text-xs">${suite.icon}</span>
                    ${suite.name}
                    <i class="fas fa-chevron-down text-[8px] opacity-40 group-hover:rotate-180 transition-transform duration-300"></i>
                </button>
                
                <!-- Mega Dropdown -->
                <div class="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 p-4 grid ${columnClass} gap-x-6 gap-y-1">
                        <div class="col-span-full mb-3 pb-2 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center px-2">
                            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">${suite.name} Registry</span>
                            <span class="text-[9px] text-slate-300">${suiteItems.length} Professional Tools</span>
                        </div>
                        ${suiteItems.map(c => {
            const isItemActive = c.id === activeId;
            let href = rootPrefix + c.id.replace(/^\//, '');

            // Highlight "Hero" products
            const isHero = ['Circadian Rhythm', 'Commute Cost', 'Subscription Drain'].some(h => c.name.includes(h));
            const badge = isHero ? '<span class="ml-auto text-[8px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-black tracking-tighter uppercase">Hot</span>' : '';

            return `
                                <a href="${href}" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 group/link ${isItemActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'}">
                                    <span class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] ${isItemActive ? 'text-indigo-600 dark:text-indigo-400 shadow-sm border-indigo-100' : c.colorClass + ' opacity-70 group-hover/link:opacity-100 group-hover/link:scale-110 transition-transform'} shrink-0">${c.icon}</span>
                                    <span class="truncate">${c.name}</span>
                                    ${badge}
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
<header class="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[100] transition-all duration-300">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div class="flex justify-between items-center h-14 sm:h-16">
            
            <!-- Logo & Mobile Toggle -->
            <div class="flex-shrink-0 flex items-center gap-2 sm:gap-3">
                <button id="mobile-menu-btn" class="lg:hidden w-9 h-9 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <i class="fas fa-bars text-sm"></i>
                </button>
                <div class="hidden sm:flex w-9 h-9 rounded-lg bg-indigo-600 items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                    <i class="fas fa-calculator text-sm"></i>
                </div>
                <a href="${rootPrefix}index.html" class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Calc<span class="text-indigo-600 dark:text-indigo-400">Suit</span>
                </a>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden lg:flex space-x-6 h-16" id="desktop-nav">
                ${desktopNavHtml}
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center gap-2 sm:gap-4">
                <div class="relative hidden sm:block w-48 xl:w-64">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><i class="fas fa-search text-xs"></i></span>
                    <input type="text" id="calc-search"
                        class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="Search tools...">
                </div>

                <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                <button id="theme-toggle"
                    class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                    <i class="fas fa-moon text-sm dark:hidden"></i>
                    <i class="fas fa-sun text-sm hidden dark:block"></i>
                </button>
            </div>
        </div>
    </div>
</header>
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
        <div class="p-5 flex flex-col gap-4">
            <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><i class="fas fa-search text-xs"></i></span>
                <input type="text" id="mobile-search"
                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Search all tools...">
            </div>
            <a href="${rootPrefix}index.html" class="flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                <i class="fas fa-home w-5 text-center"></i> Dashboard Home
            </a>
            <div class="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
            ${mobileNavHtml}
        </div>
    </div>
</div>
    `;

    const footerHtml = `
<footer class="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 mt-16 sm:mt-32 relative overflow-hidden transition-all duration-300">
    <!-- Decorative Authority Strip -->
    <div class="h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 opacity-50"></div>
    
    <div class="max-w-[1440px] mx-auto px-6 py-12 sm:py-20 lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            
            <!-- Column 1: Brand & Bio -->
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                        <i class="fas fa-calculator text-xs"></i>
                    </div>
                    <span class="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Calc<span class="text-indigo-600 dark:text-indigo-400">Suit</span></span>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    The gold standard for high-precision online modeling and biological energy architecture. CalcSuit professional tools are engineered for speed, accuracy, and enterprise-grade authority.
                </p>
                <!-- Authority Badge -->
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group">
                    <i class="fas fa-shield-check text-emerald-500 text-xs"></i>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Precision Guaranteed &mdash; 95+ Engines</span>
                </div>
            </div>

            <!-- Column 2: Ecosystem Quick Links -->
            <div class="space-y-6">
                <h5 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Suite Ecosystem</h5>
                <nav class="flex flex-col gap-3">
                    <a href="${rootPrefix}index.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-chevron-right text-[8px] opacity-40"></i> Financial Tools
                    </a>
                    <a href="${rootPrefix}explore.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-chevron-right text-[8px] opacity-40"></i> Full Directory
                    </a>
                    <a href="${rootPrefix}productivity/task-management-calculator.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-chevron-right text-[8px] opacity-40"></i> Task Management Hub
                    </a>
                    <a href="${rootPrefix}sitemap.xml" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-chevron-right text-[8px] opacity-40"></i> Google Index Sitemap
                    </a>
                </nav>
            </div>

            <!-- Column 3: Legal & Trust -->
            <div class="space-y-6">
                <h5 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Legal Authority</h5>
                <nav class="flex flex-col gap-3">
                    <a href="${rootPrefix}privacy.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-lock text-[10px] opacity-40"></i> Privacy Policy
                    </a>
                    <a href="${rootPrefix}terms.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-file-contract text-[10px] opacity-40"></i> Terms & Conditions
                    </a>
                    <a href="${rootPrefix}about.html" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-info-circle text-[10px] opacity-40"></i> About Us
                    </a>
                </nav>
            </div>

            <!-- Column 4: Authority Score -->
            <div class="space-y-8 lg:text-right flex flex-col lg:items-end justify-between">
                <!-- <div class="space-y-4">
                    <h5 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">CALCSUIT AUTHORITY</h5>
                    <div class="flex lg:justify-end gap-3">
                         <a href="#" class="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-slate-800 transition-all"><i class="fab fa-twitter"></i></a>
                         <a href="#" class="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-slate-800 transition-all"><i class="fab fa-github"></i></a>
                    </div>
                </div> -->
                <div class="pt-6 border-t border-slate-50 dark:border-slate-800 w-full">
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">&copy; 2026 CALCSUIT ENTERPRISE</p>
                    <p class="text-[9px] font-medium text-slate-300 dark:text-slate-600 mt-2 italic leading-relaxed">Decision Intelligence Architecture engineered with pride.<br/>Validated Global Standards Compliant.</p>
                </div>
            </div>
        </div>
    </div>
</footer>
    `;

    // 2. Initialize Theme System
    const htmlElement = document.documentElement;

    // Inject Universal SaaS Look & Feel Logic
    const headStyle = document.createElement('style');
    headStyle.textContent = `
        :root { --p: #6366f1; --p-h: #4f46e5; }
        body { font-family: 'Inter', sans-serif !important; letter-spacing: -0.01em !important; background-color: #f8fafc !important; }
        .dark body { background-color: #010409 !important; }
        
        /* Modern Container Scaling */
        .glass-panel, #app-container { 
            border-radius: 2rem !important; 
            border: 1px solid rgba(226, 232, 240, 0.8) !important; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1) !important; 
            background: white !important; 
            transition: all 0.3s ease !important;
        }
        .dark .glass-panel, .dark #app-container { 
            background: #0d1117 !important; 
            border-color: #21262d !important; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5) !important;
        }

        /* SaaS Input Design */
        input[type="number"], input[type="text"], input[type="time"], select, textarea { 
            border-radius: 0.75rem !important; 
            padding: 0.8rem 1rem !important; 
            border: 1.5px solid #f1f5f9 !important; 
            transition: all 0.2s ease !important;
            font-weight: 600 !important;
            background: #ffffff !important;
            color: #1e293b !important;
        }
        .dark input, .dark select, .dark textarea { 
            border-color: #30363d !important; 
            background: #0d1117 !important; 
            color: #c9d1d9 !important; 
        }
        input:focus { border-color: var(--p) !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; }

        /* SaaS Button Refinement */
        .calc-btn, button[class*="btn-"], button:has(.fas), button:has(.far) { 
            border-radius: 0.75rem !important; 
            font-weight: 700 !important; 
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            letter-spacing: -0.01em !important;
        }
    `;
    document.head.appendChild(headStyle);

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    let sidebarContainer = document.getElementById('sidebar-container');

    // Auto-injection fallback if container is missing
    if (!sidebarContainer) {
        sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'sidebar-container';
        document.body.prepend(sidebarContainer);
    }

    // --- Helper: Global Style Injection for Responsiveness ---
    function initGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            img { max-width: 100%; height: auto; border-radius: 1rem; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            @media (max-width: 640px) {
                h1 { font-size: 1.875rem !important; line-height: 2.25rem !important; }
                h2 { font-size: 1.5rem !important; line-height: 2rem !important; }
                .prose p { font-size: 1rem !important; line-height: 1.625rem !important; }
            }
            .back-to-top {
                position: fixed; bottom: 2rem; right: 2rem;
                background: #4f46e5; color: white;
                width: 3rem; height: 3rem; border-radius: 1rem;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 90; opacity: 0; visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
            }
            .back-to-top.visible { opacity: 1; visibility: visible; }
            .back-to-top:hover { transform: translateY(-5px); background: #4338ca; }
        `;
        document.head.appendChild(style);

        const btt = document.createElement('div');
        btt.className = 'back-to-top';
        btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btt);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) btt.classList.add('visible');
            else btt.classList.remove('visible');
        });

        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }



    if (sidebarContainer) {
        sidebarContainer.innerHTML = headerHtml;

        // Inject Footer globally
        const existingFooter = document.querySelector('footer');
        if (existingFooter) existingFooter.remove();
        document.body.insertAdjacentHTML('beforeend', footerHtml);

        // Inject Breadcrumbs if #app-container exists
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.insertAdjacentHTML('beforebegin', `
                ${generateBreadcrumbs()}
                ${generateCategoryNavigator()}
            `);
            appContainer.insertAdjacentHTML('afterend', `
                ${generateRelatedTools()}
            `);
        }


        initAnalytics();
        initSecurityHardening();
        initGlobalStyles();

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
                searchResults.innerHTML = '';
                return;
            }

            const results = calculatorConfig.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.category.toLowerCase().includes(term)
            ).slice(0, 8);

            if (results.length > 0) {
                searchResults.innerHTML = `
                    <div class="p-2">
                        <div class="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-2 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <span>Search Results</span>
                            <span class="text-[9px] bg-slate-50 dark:bg-slate-700 px-2 rounded-full">${results.length} Found</span>
                        </div>
                        <div class="grid grid-cols-1 gap-1">
                            ${results.map(c => {
                    let href = rootPrefix + (c.id === '/' ? 'index.html' : c.id.replace(/^\//, ''));
                    return `
                                    <a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20">
                                        <span class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs ${c.colorClass} shrink-0 group-hover:scale-110 transition-transform shadow-sm">${c.icon}</span>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">${c.name}</div>
                                            <div class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">${c.category}</div>
                                        </div>
                                        <i class="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all text-indigo-400"></i>
                                    </a>
                                `;
                }).join('')}
                        </div>
                    </div>
                `;
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = `
                    <div class="p-8 text-center">
                        <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                            <i class="fas fa-search-minus text-xl"></i>
                        </div>
                        <p class="text-sm font-bold text-slate-400">No tools found for "${term}"</p>
                        <p class="text-[10px] text-slate-500 mt-2">Try searching for "tax", "loan", or "commute"</p>
                    </div>
                `;
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

    // 8. Cookie Consent
    function initCookieConsent() {
        if (localStorage.getItem('cookie-consent-accepted')) return;

        const consentHtml = `
            <div id="cookie-consent" class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 rounded-[2rem] z-[300] flex flex-col md:flex-row items-center gap-6 transform translate-y-20 opacity-0 transition-all duration-700">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <i class="fas fa-cookie-bite text-2xl"></i>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Privacy Notice</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        We use cookies to optimize your experience and analyze traffic. By using our tools, you agree to our <a href="${rootPrefix}privacy.html" class="text-indigo-500 font-bold hover:underline">Privacy Policy</a>.
                    </p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <button id="deny-cookies" class="flex-1 md:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        Deny
                    </button>
                    <button id="accept-cookies" class="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                        Accept
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', consentHtml);
        const banner = document.getElementById('cookie-consent');

        setTimeout(() => {
            banner.classList.remove('translate-y-20', 'opacity-0');
        }, 1000);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            banner.classList.add('translate-y-20', 'opacity-0');
            localStorage.setItem('cookie-consent-accepted', 'true');
            setTimeout(() => banner.remove(), 700);
        });

        document.getElementById('deny-cookies').addEventListener('click', () => {
            banner.classList.add('translate-y-20', 'opacity-0');
            localStorage.setItem('cookie-consent-accepted', 'false'); // Remember choice to not annoy user
            setTimeout(() => banner.remove(), 700);
        });
    }
    initCookieConsent();

    // 9. Visual Sidebar Switcher (Internal Linking Boost)
    function initVisualSwitcher() {
        if (activeId === '/') return;

        const topTools = calculatorConfig.filter(c => c.id !== '/' && c.id !== activeId).slice(0, 5);
        const switcherHtml = `
            <div class="fixed left-6 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-3 group">
                <div class="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Quick Switch</div>
                ${topTools.map(t => `
                    <a href="${rootPrefix}${t.id.replace(/^\//, '')}" class="w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center ${t.colorClass} shadow-sm hover:shadow-xl hover:scale-110 hover:border-indigo-500 transition-all group/item relative">
                        ${t.icon}
                        <div class="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all whitespace-nowrap shadow-xl">
                            ${t.name}
                        </div>
                    </a>
                `).join('')}
                <a href="${rootPrefix}index.html" class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-110 transition-all mt-4">
                    <i class="fas fa-th-large text-xs"></i>
                </a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', switcherHtml);
    }
    initVisualSwitcher();

    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

});
