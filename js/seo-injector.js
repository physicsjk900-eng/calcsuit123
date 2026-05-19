// js/seo-injector.js

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        // Prevent running multiple times or on index/blog pages
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.includes('/blog/') || window.location.pathname.includes('/guides/')) {
            return;
        }

        // Wait a small bit for layout.js config to be ready
        setTimeout(initSEO, 100);
    });

    function initSEO() {
        const config = window.calculatorConfig || [];
        const currentPath = window.location.pathname;
        let currentTool = null;

        // Match current tool
        config.forEach(calc => {
            if (calc.id !== '/' && currentPath.includes(calc.id.replace(/^\//, ''))) {
                currentTool = calc;
            }
        });

        if (!currentTool) return;

        // Check if there is already an element with id="seo-content"
        if (document.getElementById('seo-content') || document.querySelector('.seo-rich-content')) {
            return; 
        }

        // Generate the custom SEO content based on the tool
        const seoData = getSEOContent(currentTool);
        
        // Build the HTML structure
        const seoSection = document.createElement('section');
        seoSection.id = 'seo-content';
        seoSection.className = 'w-full max-w-5xl mx-auto mt-20 mb-16 px-4';
        seoSection.innerHTML = `
            <div class="glass-panel p-8 md:p-16 rounded-[2.5rem] shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-300">
                <header class="text-center mb-12">
                    <span class="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        CalcSuit Decision Intelligence
                    </span>
                    <h2 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
                        Mastering the ${currentTool.name}
                    </h2>
                    <p class="text-slate-500 dark:text-slate-400 mt-4 text-base max-w-2xl mx-auto font-medium">
                        ${seoData.intro}
                    </p>
                </header>

                <!-- Tabs Selector -->
                <div class="flex flex-wrap justify-center border-b border-slate-100 dark:border-slate-800 gap-2 mb-10 pb-2">
                    <button class="seo-tab-btn active px-5 py-2.5 rounded-t-xl text-sm font-bold border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 transition-all" data-tab="guide">
                        <i class="fas fa-book-open mr-2 text-xs"></i>Guide & Formula
                    </button>
                    <button class="seo-tab-btn px-5 py-2.5 rounded-t-xl text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-indigo-500 transition-all" data-tab="examples">
                        <i class="fas fa-calculator mr-2 text-xs"></i>Step-by-Step Examples
                    </button>
                    <button class="seo-tab-btn px-5 py-2.5 rounded-t-xl text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-indigo-500 transition-all" data-tab="use-cases">
                        <i class="fas fa-lightbulb mr-2 text-xs"></i>Practical Use Cases
                    </button>
                    <button class="seo-tab-btn px-5 py-2.5 rounded-t-xl text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-indigo-500 transition-all" data-tab="faqs">
                        <i class="fas fa-question-circle mr-2 text-xs"></i>Frequently Asked FAQs
                    </button>
                </div>

                <!-- Tab Contents -->
                <div class="seo-tab-content active transition-all duration-300" id="tab-guide">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div class="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                            <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">Understanding the Core Concepts</h3>
                            <p>${seoData.guideBody}</p>
                            <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                <h4 class="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-2">Pro Tip</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 italic">${seoData.proTip}</p>
                            </div>
                        </div>
                        <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col justify-between">
                            <div>
                                <span class="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded-md">Mathematical Formula</span>
                                <h4 class="text-lg font-bold text-slate-800 dark:text-white mt-4 mb-4">The Logic of the Calculation</h4>
                                <div class="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center font-mono my-4 text-base overflow-x-auto text-indigo-600 dark:text-indigo-400 select-all font-bold">
                                    ${seoData.formula}
                                </div>
                            </div>
                            <p class="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed mt-4">
                                *Note: Variables are standardized. Absolute mathematical verification is applied before processing.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="seo-tab-content hidden transition-all duration-300" id="tab-examples">
                    <div class="space-y-8">
                        <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">Worked Calculation Scenarios</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${seoData.examples.map((ex, index) => `
                                <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                    <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-4">0${index + 1}</div>
                                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">${ex.title}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">${ex.problem}</p>
                                    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-850 font-mono text-[11px] leading-relaxed text-indigo-600 dark:text-indigo-400">
                                        ${ex.steps.map(step => `<div>&bull; ${step}</div>`).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="seo-tab-content hidden transition-all duration-300" id="tab-use-cases">
                    <div class="space-y-8">
                        <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">Real-world Use Cases</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            ${seoData.useCases.map(uc => `
                                <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900/20">
                                    <div class="text-indigo-500 text-xl"><i class="${uc.icon}"></i></div>
                                    <h4 class="font-extrabold text-slate-850 dark:text-white text-base">${uc.title}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">${uc.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="seo-tab-content hidden transition-all duration-300" id="tab-faqs">
                    <div class="space-y-6 max-w-3xl mx-auto">
                        <h3 class="text-xl font-extrabold text-slate-800 dark:text-white text-center mb-8">Frequently Asked Questions</h3>
                        <div class="space-y-4">
                            ${seoData.faqs.map((faq, i) => `
                                <div class="faq-item border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                                    <button class="faq-toggle-btn w-full p-5 text-left font-bold text-sm text-slate-800 dark:text-white flex justify-between items-center transition-colors" data-index="${i}">
                                        <span>${faq.q}</span>
                                        <i class="fas fa-plus text-xs opacity-50 transition-transform"></i>
                                    </button>
                                    <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-slate-950/40">
                                        <div class="p-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-850">
                                            ${faq.a}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject the section at the correct position (after the main calculator app-container)
        const appContainer = document.getElementById('app-container') || document.querySelector('main');
        if (appContainer) {
            appContainer.parentNode.insertBefore(seoSection, appContainer.nextSibling);
        } else {
            document.body.appendChild(seoSection);
        }

        // Attach Tab Events
        const tabs = seoSection.querySelectorAll('.seo-tab-btn');
        const contents = seoSection.querySelectorAll('.seo-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active', 'border-indigo-600', 'text-indigo-600', 'dark:border-indigo-400', 'dark:text-indigo-400');
                    t.classList.add('text-slate-500', 'dark:text-slate-400', 'border-b-2', 'border-transparent');
                });
                tab.classList.add('active', 'border-indigo-600', 'text-indigo-600', 'dark:border-indigo-400', 'dark:text-indigo-400');
                tab.classList.remove('text-slate-500', 'dark:text-slate-400', 'border-transparent');

                contents.forEach(c => c.classList.add('hidden'));
                const activeContent = seoSection.querySelector(`#tab-${tab.dataset.tab}`);
                if (activeContent) activeContent.classList.remove('hidden');
            });
        });

        // FAQ accordion logic
        const faqToggles = seoSection.querySelectorAll('.faq-toggle-btn');
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.parentElement;
                const answer = item.querySelector('.faq-answer');
                const icon = toggle.querySelector('i');
                
                const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

                // Close all others
                seoSection.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = '0px');
                seoSection.querySelectorAll('.faq-toggle-btn i').forEach(i => i.className = 'fas fa-plus text-xs opacity-50');

                if (!isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.className = 'fas fa-minus text-xs text-indigo-500';
                } else {
                    answer.style.maxHeight = '0px';
                    icon.className = 'fas fa-plus text-xs opacity-50';
                }
            });
        });

        // Inject FAQ Schema.org JSON-LD
        injectFAQSchema(seoData.faqs);
    }

    function injectFAQSchema(faqs) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Comprehensive content database builder
    function getSEOContent(tool) {
        const name = tool.name;
        const category = tool.category;

        // Custom high-priority calculators database to ensure hand-crafted feel
        const customDb = {
            'Percentage': {
                intro: 'Calculate percentage growth, discounts, split tips, and fractional change instantly. Optimize financial decisions, calculate margins, and speed up mathematical workflows.',
                guideBody: 'Percentages are a way to express a number as a fraction of 100. In mathematical contexts, they represent a dimensionless ratio. While simple on the surface, percentage calculations can get complex when compounding or determining relative changes. A common pitfall is misunderstanding the difference between percentage changes: if an investment drops by 50%, you need a 100% gain (not 50%) to break even.',
                proTip: 'To calculate a percentage in your head quickly, remember that X% of Y is always equal to Y% of X. For example, 16% of 50 is equal to 50% of 16, which is simply 8.',
                formula: 'Percentage = (Part / Whole) &times; 100',
                examples: [
                    { title: 'Calculating Discount', problem: 'Find the final cost of a $120 item discounted by 25%.', steps: ['Discount Value = $120 * 0.25 = $30', 'Final Cost = $120 - $30 = $90'] },
                    { title: 'Percentage Increase', problem: 'Calculate percentage growth from 50 to 75.', steps: ['Absolute Difference = 75 - 50 = 25', 'Divide by Original = 25 / 50 = 0.50', 'Multiply by 100 = 50.00%'] }
                ],
                useCases: [
                    { icon: 'fas fa-shopping-cart', title: 'Shopping Savings', desc: 'Determine discount rates, sales tax rates, and final prices during retail promotions.' },
                    { icon: 'fas fa-chart-line', title: 'Financial Returns', desc: 'Analyze quarterly portfolio growth, interest rates, and profit margin fluctuations.' },
                    { icon: 'fas fa-utensils', title: 'Service Tipping', desc: 'Calculate the correct tip percentage and split the bill among any number of dining guests.' }
                ],
                faqs: [
                    { q: 'How do I calculate a discount?', a: 'Multiply the original price by the discount decimal (e.g. 20% = 0.2) to get the savings, then subtract that from the original price.' },
                    { q: 'What is percentage change?', a: 'It measures the relative difference between a final and initial value, calculated as: ((Final - Initial) / Initial) * 100.' },
                    { q: 'Is X% of Y equal to Y% of X?', a: 'Yes. Multiplication is commutative, so (X/100) * Y is identical to (Y/100) * X.' }
                ]
            },
            'BMI': {
                intro: 'Determine your Body Mass Index (BMI) instantly. Analyze clinical weight brackets, view metric/imperial ratios, and screen for potential health categories.',
                guideBody: 'The Body Mass Index (BMI) is a clinical screening metric developed to evaluate whether an individual has a healthy ratio of weight to height. While it does not measure body fat directly, research shows that BMI correlates highly with gold-standard body fat indicators (like DEXA scans) and serves as an excellent baseline indicator of metabolic health risks.',
                proTip: 'Athletes with high muscle mass may trigger an Overweight or Obese bracket despite having low body fat, because muscle is denser than fat. Combine BMI with Waist-to-Hip measurements for a complete picture.',
                formula: 'Metric: Weight (kg) / Height&sup2; (m&sup2;) | Imperial: (Weight (lbs) / Height&sup2; (in&sup2;)) &times; 703',
                examples: [
                    { title: 'Metric Calculation', problem: 'Calculate BMI for a person weighing 70kg standing 1.75 meters tall.', steps: ['Square Height = 1.75 * 1.75 = 3.0625', 'Divide Weight = 70 / 3.0625 = 22.86 (Healthy range)'] },
                    { title: 'Imperial Calculation', problem: 'Calculate BMI for a person weighing 150 lbs standing 5 feet 6 inches (66 inches) tall.', steps: ['Square Height = 66 * 66 = 4356', 'Divide Weight = 150 / 4356 = 0.0344', 'Multiply by 703 Scalar = 0.0344 * 703 = 24.2'] }
                ],
                useCases: [
                    { icon: 'fas fa-stethoscope', title: 'Medical Screening', desc: 'Used by physicians to screen for health risks associated with obesity or being underweight.' },
                    { icon: 'fas fa-dumbbell', title: 'Fitness Tracking', desc: 'Monitor body composition progress during weight management programs.' },
                    { icon: 'fas fa-heartbeat', title: 'Metabolic Health', desc: 'Assess baseline risk factors for cardiovascular disease, diabetes, and hypertension.' }
                ],
                faqs: [
                    { q: 'What is a healthy BMI range?', a: 'According to WHO standards, a normal/healthy BMI for adults is between 18.5 and 24.9.' },
                    { q: 'Does BMI measure body fat directly?', a: 'No, it measures weight relative to height. It does not distinguish between muscle, bone, and adipose fat tissues.' },
                    { q: 'How often should I calculate my BMI?', a: 'Monthly is ideal, as significant height and weight changes in adults occur gradually over weeks or months.' }
                ]
            },
            'Average': {
                intro: 'Compute Arithmetic Mean, Median, Count, Sum, and Range instantly. Filter outliers, process lists of decimals, and get a complete dataset overview.',
                guideBody: 'In statistics, the "average" represents the center of a data distribution. The Arithmetic Mean is the sum of all elements divided by their count. The Median is the true middle value when the list is sorted. Looking at both helps you detect data skewness: if the mean is much higher than the median, your data has positive outliers.',
                proTip: 'If your dataset has extreme outliers (like house prices or salaries), the Median is usually a more accurate representation of the "typical" value than the Mean.',
                formula: 'Mean (x&macr;) = &Sigma;x / n',
                examples: [
                    { title: 'Arithmetic Mean', problem: 'Find the average of the set: 10, 15, 20, 25, 30.', steps: ['Sum the Values = 10 + 15 + 20 + 25 + 30 = 100', 'Count the Elements (n) = 5', 'Divide Sum by Count = 100 / 5 = 20'] },
                    { title: 'Median Calculation', problem: 'Determine the median of the set: 5, 20, 15, 10, 8.', steps: ['Sort the Set = 5, 8, 10, 15, 20', 'Locate Middle Value = 10 (3rd of 5 elements)'] }
                ],
                useCases: [
                    { icon: 'fas fa-graduation-cap', title: 'Academic Grading', desc: 'Calculate weighted test scores, homework grades, and cumulative GPA averages.' },
                    { icon: 'fas fa-chart-bar', title: 'Sales Analytics', desc: 'Track average transaction values, daily order totals, and customer acquisition costs.' },
                    { icon: 'fas fa-cloud-sun', title: 'Weather Observations', desc: 'Determine average monthly temperatures, rainfalls, and seasonal indices.' }
                ],
                faqs: [
                    { q: 'What is the difference between Mean and Median?', a: 'The mean is the calculated center of a dataset (sum/count), whereas the median is the physical middle value when the data is sorted.' },
                    { q: 'How does an outlier affect the average?', a: 'Extreme values pull the mean strongly in their direction, while the median remains unaffected, showing stable central tendency.' },
                    { q: 'Can I input decimals and negative values?', a: 'Yes. Our calculator fully supports fractions, decimals, and negative integers.' }
                ]
            }
        };

        // If a customized database matches the tool name or a substring, use it!
        for (let key in customDb) {
            if (name.includes(key)) {
                return customDb[key];
            }
        }

        // --- Category Fallback Generator ---
        // Dynamically build content tailored to the category for maximum relevance and authority.
        const catTemplates = {
            'Math': {
                intro: `Solve complex equations, calculate mathematical relationships, and verify statistical datasets instantly with our premium, high-precision ${name}.`,
                guideBody: `The ${name} is designed to perform numerical optimizations and mathematical calculations. It utilizes standardized algebra structures to ensure accuracy. Correct variable mapping is vital: inputs are filtered for syntax anomalies to prevent decimal truncation and division-by-zero errors.`,
                proTip: `Verify the domain boundaries of your variables. In complex calculations, check if equations require radians vs. degrees or integers vs. real float numbers.`,
                formula: `${name} Output = f(Variables x&sup1;, x&sup2;, ... x&sup2;)`,
                examples: [
                    { title: 'Standard Scenario', problem: `Evaluate values for ${name} with standard positive integers.`, steps: ['Map variables to inputs.', 'Calculate using standardized mathematical orders (PEMDAS).', 'Observe outputs and verify convergence.'] },
                    { title: 'Floating Point Scenario', problem: `Compute solutions using fractional parts or decimal coordinates.`, steps: ['Convert integers to double-precision floats.', 'Apply rounding parameters.', 'Observe the finalized absolute result.'] }
                ],
                useCases: [
                    { icon: 'fas fa-square-root-variable', title: 'Academic Research', desc: 'Ideal for verifying algebraic homework, complex geometry, and calculus sets.' },
                    { icon: 'fas fa-microchip', title: 'Engineering Modeling', desc: 'Apply structural formulas to calculate physical constants, dimensions, and variables.' },
                    { icon: 'fas fa-chart-line', title: 'Data Analytics', desc: 'Determine variances, distributions, ratios, and coordinates for databases.' }
                ],
                faqs: [
                    { q: `What is the primary function of the ${name}?`, a: `It provides a fast, browser-based engine to solve formulas and calculations related to ${name} with zero installation required.` },
                    { q: 'Does this calculator support negative numbers?', a: 'Yes, all standard negative integers and floating point values are verified and fully supported.' },
                    { q: 'How does it handle rounding errors?', a: 'It utilizes standard JS floating-point arithmetic optimized to reduce binary rounding anomalies, showing up to 10 decimal digits.' }
                ]
            },
            'Financial': {
                intro: `Model interest trajectories, optimize amortization schedules, and track long-term savings projections using the ${name}.`,
                guideBody: `Financial mathematics focuses on evaluating cash flows over time. The ${name} uses interest rates, time periods, and principal values to determine present and future values. A crucial rule in financial compounding is adjusting your interest rate to match your compounding frequency (e.g. monthly, quarterly, or yearly).`,
                proTip: `Even tiny increases in compound frequency or minor interest adjustments can cause massive differences over long compounding windows. Model multiple scenarios to spot optimal rates.`,
                formula: `Compound Future Value = P &times; (1 + r/n)^(nt)`,
                examples: [
                    { title: 'Standard Term Growth', problem: 'Compute standard variables over a fixed interest term.', steps: ['Enter core Principal and Interest Rate.', 'Apply the annual calculation period.', 'Analyze interest gains and final capital balance.'] },
                    { title: 'Amortization Scenario', problem: 'Break down payment schedules to view principal reduction over time.', steps: ['Map loan periods and payment intervals.', 'Calculate interest slice per payment.', 'Observe how interest decreases as principal gets repaid.'] }
                ],
                useCases: [
                    { icon: 'fas fa-hand-holding-dollar', title: 'Wealth Management', desc: 'Model stock returns, mutual fund compound growth, and retirement assets.' },
                    { icon: 'fas fa-house', title: 'Loan & Debt Planning', desc: 'Compare mortgage options, calculate monthly EMI obligations, and design payoff schedules.' },
                    { icon: 'fas fa-business-time', title: 'Business Budgeting', desc: 'Assess startup breakeven margins, product margins, and cash flow structures.' }
                ],
                faqs: [
                    { q: 'How does interest compounding affect my results?', a: 'Compounding calculates interest on your previously accumulated interest, meaning your total balances grow exponentially faster than simple interest.' },
                    { q: 'Can I calculate weekly or bi-weekly schedules?', a: 'Yes, adjust your time inputs or interest parameters to match the shorter compounding intervals.' },
                    { q: 'Are tax parameters included in these models?', a: 'Unless stated, our calculators model pre-tax growth. You should adjust results to account for local tax rates.' }
                ]
            },
            'Health': {
                intro: `Monitor vital statistics, calculate daily calorie benchmarks, and track physical health ratios with our clinical ${name}.`,
                guideBody: `Biomedical calculations use variables like age, height, gender, and weight to determine physiological profiles. The ${name} provides baseline insights based on clinical studies. Remember, physiological statistics are general guidance and cannot replace individualized diagnostic consultations.`,
                proTip: `Ensure you enter height and weight in consistent metric or imperial coordinates. Inconsistent scales are the most common source of calculation error.`,
                formula: `Physiological Output = Base Coefficient &times; Metabolic Scale Factor`,
                examples: [
                    { title: 'Metric Assessment', problem: 'Determine metabolic output using metric values.', steps: ['Enter weight in kilograms and height in centimeters.', 'Input age and biological parameters.', 'View calculated results and standard clinical brackets.'] },
                    { title: 'Imperial Assessment', problem: 'Calculate statistics using standard US units.', steps: ['Convert height to inches and weight to pounds.', 'Execute the target scaling equation.', 'View the calculated outputs.'] }
                ],
                useCases: [
                    { icon: 'fas fa-apple-whole', title: 'Nutritional Planning', desc: 'Calculate optimal macro distributions, daily water intake goals, and caloric budgets.' },
                    { icon: 'fas fa-dumbbell', title: 'Athletic Conditioning', desc: 'Identify target heart rate zones and track energy burn parameters.' },
                    { icon: 'fas fa-heartbeat', title: 'Preventative Wellness', desc: 'Assess body surface areas, body fat percentages, and general health indexes.' }
                ],
                faqs: [
                    { q: `What clinical index does the ${name} use?`, a: `It uses standard formulas approved by organizations such as WHO, the CDC, and the American Heart Association.` },
                    { q: 'Are these calculations medically diagnostic?', a: 'No, they are screening tools. Always consult a health professional for clinical diagnostic advice.' },
                    { q: 'How do gender inputs affect the formulas?', a: 'Gender parameters adjust coefficient constants to account for baseline biological differences in muscle mass, bone density, and hormone levels.' }
                ]
            },
            'Time & Date': {
                intro: `Measure time durations, calculate days between calendar milestones, and plan work hours with our precise ${name}.`,
                guideBody: `Calendar math can be surprisingly tricky due to varying month lengths, leap years, and time zones. The ${name} normalizes date structures to absolute millisecond values before converting them back into user-friendly units (years, months, weeks, days, hours, and minutes).`,
                proTip: `When planning projects, distinguish between 'Total Days' (which includes weekends and holidays) and 'Working Days' to set realistic deadlines.`,
                formula: `Duration = Date End - Date Start (Normalized to Epoch)`,
                examples: [
                    { title: 'Date Range Calculation', problem: 'Find the duration between two custom calendar days.', steps: ['Select the starting and ending dates in the calendar pickers.', 'Calculate total days, weeks, and months.', 'Examine the breakdown of differences.'] },
                    { title: 'Hour Tracking Scenario', problem: 'Add hours and minutes across split timesheet entries.', steps: ['Input individual shift times.', 'Sum hours and minutes independently.', 'Convert leftover minutes to standard hours.'] }
                ],
                useCases: [
                    { icon: 'fas fa-tasks', title: 'Project Management', desc: 'Calculate milestones, schedule gaps, and compute delivery lead times.' },
                    { icon: 'fas fa-business-time', title: 'Timesheet Audits', desc: 'Sum daily work hours, calculate overtime, and audit contractor timesheets.' },
                    { icon: 'fas fa-calendar-alt', title: 'Personal Event Tracking', desc: 'Set up retirement countdowns, track pregnancy progress, and check birthdays.' }
                ],
                faqs: [
                    { q: 'How does it handle leap years?', a: 'Our engine utilizes standard JS Date systems which automatically account for leap years and correct February date lengths.' },
                    { q: 'Can I calculate negative dates or past dates?', a: 'Yes. Date ranges work in both directions (past to future or future to past) to calculate historical elapsed time.' },
                    { q: 'Does this tool support timezone differences?', a: 'Yes, it normalizes inputs using UTC coordinates to ensure accuracy regardless of regional shifts.' }
                ]
            },
            'Conversion': {
                intro: `Convert physical properties, unit coordinates, and scale factors instantly using our verified ${name}.`,
                guideBody: `Dimensional analysis ensures that physical quantities are measured in standard units. The ${name} uses exact conversion factors defined by international standards (such as the SI system). Multi-step conversions are handled with high precision to prevent numerical rounding drift.`,
                proTip: `When transferring values between CAD models, spreadsheets, or scientific reports, always copy the raw output values without rounding to preserve maximum accuracy.`,
                formula: `Target Unit = Source Unit &times; Precision Scalar`,
                examples: [
                    { title: 'Standard Conversion', problem: 'Convert source values to standard metrics.', steps: ['Select the input unit and output target unit.', 'Input the source quantity.', 'Examine the converted output and scientific notations.'] },
                    { title: 'Scale Shift Scenario', problem: 'Convert fractional properties to high-precision decimals.', steps: ['Enter compound values.', 'Apply precise division coefficients.', 'Observe the finalized absolute conversion.'] }
                ],
                useCases: [
                    { icon: 'fas fa-plane-departure', title: 'Travel & Relocation', desc: 'Convert temperatures, speeds, fuel efficiency, and currencies across regions.' },
                    { icon: 'fas fa-compass', title: 'Technical Documentation', desc: 'Change architectural metrics, blueprints, and engineering files to different unit scales.' },
                    { icon: 'fas fa-flask', title: 'Laboratory Research', desc: 'Convert molecular densities, energy measures, pressures, and volumes.' }
                ],
                faqs: [
                    { q: 'Are the conversion values updated regularly?', a: 'Yes, currency exchange parameters utilize live APIs, while physical units rely on permanent mathematical constants.' },
                    { q: 'How many decimals are supported?', a: 'We output up to 10 decimal places to satisfy engineering and laboratory precision standards.' },
                    { q: 'Can I convert compound units directly?', a: 'Yes, choose our combined modes to process multiple unit types concurrently.' }
                ]
            },
            'Lifestyle': {
                intro: `Plan budgets, optimize household resources, and calculate personal milestones using the ${name}.`,
                guideBody: `Lifestyle analytics helps you make data-driven decisions about everyday choices. The ${name} simplifies complex budget templates and schedules into clear, actionable advice, helping you plan weddings, calculate sleep schedules, or manage utilities.`,
                proTip: `When creating household budgets or planning events, always add a 10% contingency buffer to account for unexpected pricing spikes or hidden fees.`,
                formula: `Calculated Resource = Base Cost + (Variable Usage &times; Time Index)`,
                examples: [
                    { title: 'Budget Allocation', problem: 'Distribute costs across wedding or party parameters.', steps: ['Enter the total available event budget.', 'Assign target percentage shares to venue, dining, and styling.', 'Optimize individual costs to prevent overspending.'] },
                    { title: 'Cycle Planning Scenario', problem: 'Determine sleep patterns or daily habits.', steps: ['Input your targeted wake-up or start time.', 'Subtract standard biological cycles.', 'Identify optimal bedtime window suggestions.'] }
                ],
                useCases: [
                    { icon: 'fas fa-wallet', title: 'Event Budgeting', desc: 'Track wedding guest limits, venue rates, and catering estimates.' },
                    { icon: 'fas fa-bed', title: 'Health Optimization', desc: 'Plan sleep rhythms, resting windows, and timezone changes.' },
                    { icon: 'fas fa-house', title: 'Domestic Management', desc: 'Model electricity utility costs, fuel bills, and rent vs buy margins.' }
                ],
                faqs: [
                    { q: `How does the ${name} personalize my results?`, a: 'It processes your custom local rates, utility pricing, and lifestyle variables to output tailored, individual estimates.' },
                    { q: 'Can I save or export my planned budgets?', a: 'Yes, copy the outputs directly using the clipboard controls, or use your browser print settings to save a PDF copy.' },
                    { q: 'Are these budgets legally binding contract advice?', a: 'No, these are estimates. Always verify final cost quotes with vendors and suppliers.' }
                ]
            },
            'Productivity': {
                intro: `Optimize task schedules, structure work flows, and calculate performance metrics using our ${name}.`,
                guideBody: `Productivity metrics leverage time-blocking algorithms and energy-cycle data to streamline daily routines. The ${name} calculates workloads, breaks tasks into manageable segments, and organizes calendars, helping you complete projects efficiently.`,
                proTip: `Focus on energy cycles rather than just time schedules. Schedule high-focus tasks during peak energy levels, and leave routine administration for low-energy windows.`,
                formula: `Workload Index = Total Tasks / Available Energy Hours`,
                examples: [
                    { title: 'Task Allocation', problem: 'Organize project deliverables across calendar days.', steps: ['List your total tasks and deadlines.', 'Estimate hours required for each item.', 'Generate a daily breakdown to prevent burnout.'] },
                    { title: 'Energy Rhythms Scenario', problem: 'Align peak productivity periods with sleep cycles.', steps: ['Input average sleep and wake cycles.', 'Identify natural peak focus windows.', 'Designate dedicated blocks for deep work.'] }
                ],
                useCases: [
                    { icon: 'fas fa-calendar-check', title: 'Project Management', desc: 'Structure calendar milestones, calculate delivery cycles, and organize sprints.' },
                    { icon: 'fas fa-battery-three-quarters', title: 'Energy Architecture', desc: 'Analyze circadian cycles, optimize commute schedules, and schedule breaks.' },
                    { icon: 'fas fa-brain', title: 'Cognitive Optimization', desc: 'Design task hierarchies, map complex schedules, and audit productivity drain.' }
                ],
                faqs: [
                    { q: `How does the ${name} calculate my schedules?`, a: 'It utilizes proven time-management principles (like the Pomodoro technique or time blocking) to distribute hours evenly.' },
                    { q: 'Can I import calendar files directly?', a: 'Use our calendar generators to export `.ics` files that import directly into Google Calendar, Outlook, or Apple Calendar.' },
                    { q: 'Is my task data saved on external servers?', a: 'No. All task names and parameters remain local to your browser session to ensure 100% privacy.' }
                ]
            }
        };

        // Fallback to Math if category is not specifically matched
        const chosenTemplate = catTemplates[category] || catTemplates['Math'];

        // Build generic custom templates
        return {
            intro: chosenTemplate.intro,
            guideBody: chosenTemplate.guideBody,
            proTip: chosenTemplate.proTip,
            formula: chosenTemplate.formula,
            examples: chosenTemplate.examples,
            useCases: chosenTemplate.useCases,
            faqs: chosenTemplate.faqs
        };
    }
})();
