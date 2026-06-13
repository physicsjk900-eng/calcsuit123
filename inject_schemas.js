const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\Calculators';
const layoutPath = path.join(rootDir, 'js', 'layout.js');

if (!fs.existsSync(layoutPath)) {
    console.error('layout.js not found!');
    process.exit(1);
}

const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const match = layoutContent.match(/const\s+calculatorConfig\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
if (!match) {
    console.error('Could not find calculatorConfig array in layout.js');
    process.exit(1);
}

let calculatorConfig;
try {
    // Safely evaluate the array literal from layout.js
    calculatorConfig = eval(match[1]);
} catch (e) {
    console.error('Failed to parse calculatorConfig:', e);
    process.exit(1);
}

console.log(`Found ${calculatorConfig.length} items in config.`);

const categoryMap = {
    'Financial': 'finance',
    'Math': 'math',
    'Standard': 'calculators',
    'Health': 'health',
    'Time & Date': 'time',
    'Conversion': 'conversion',
    'Lifestyle': 'lifestyle',
    'Technical': 'lifestyle',
    'Industrial': 'Industrial',
    'Physics': 'physics',
    'Productivity': 'productivity'
};

for (const calc of calculatorConfig) {
    if (calc.id === '/' || calc.id.startsWith('http')) {
        continue;
    }

    const filePath = path.join(rootDir, calc.id.replace(/\//g, path.sep));
    if (!fs.existsSync(filePath)) {
        console.warn(`File does not exist: ${filePath}`);
        continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Extract Title
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : `${calc.name} Calculator | CalcSuit`;

    // 2. Extract Meta Description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
        html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : `Use the free ${calc.name} calculator on CalcSuit to get instant results, formulas, and step-by-step working.`;

    // 3. Construct Canonical URL
    const canonicalUrl = `https://calcsuit.com${calc.id}`;

    // 4. Construct category and breadcrumb name
    const category = calc.category || 'Utility';
    const toolName = calc.name || 'Calculator';
    const categoryDir = categoryMap[category] || category.toLowerCase().replace(/[^a-z0-9]/g, '');
    const categoryUrl = `https://calcsuit.com/${categoryDir}/`;

    // 5. Try to extract pre-existing FAQPage schema
    let existingFaq = null;
    const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    for (const m of jsonLdMatches) {
        const jsonStr = m[1];
        if (jsonStr.includes('"FAQPage"') || jsonStr.includes("'FAQPage'")) {
            try {
                // Parse it to ensure it is valid JSON
                const parsed = JSON.parse(jsonStr.trim());
                existingFaq = parsed;
            } catch (e) {
                // If parsing fails, fall back to string extraction
                existingFaq = jsonStr.trim();
            }
            break;
        }
    }

    // Extract questions and answers from HTML if no valid pre-existing FAQPage exists
    let extractedFaqs = [];
    if (!existingFaq) {
        // Look for accordion patterns or custom FAQ triggers
        const faqTriggers = [...html.matchAll(/class=["']faq-trigger[\s\S]*?["']>([\s\S]*?)<\/button>[\s\S]*?class=["']faq-answer[\s\S]*?["']>([\s\S]*?)<\/div>/gi)];
        if (faqTriggers.length > 0) {
            for (const ft of faqTriggers) {
                const q = ft[1].replace(/<[^>]*>/g, '').trim();
                const a = ft[2].replace(/<[^>]*>/g, '').trim();
                if (q && a) {
                    extractedFaqs.push({ q, a });
                }
            }
        }

        // If still no FAQs, look for general Q&A patterns like <h5>Question</h5> <p>Answer</p>
        if (extractedFaqs.length === 0) {
            const h5Faqs = [...html.matchAll(/<h5[^>]*>([\s\S]*?)<\/h5>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi)];
            if (h5Faqs.length > 0) {
                for (const h5 of h5Faqs) {
                    const q = h5[1].replace(/<[^>]*>/g, '').trim();
                    const a = h5[2].replace(/<[^>]*>/g, '').trim();
                    if (q.endsWith('?') && q && a) {
                        extractedFaqs.push({ q, a });
                    }
                }
            }
        }

        // Check for general accordion or custom headers with questions
        if (extractedFaqs.length === 0) {
            const accItems = [...html.matchAll(/<span[^>]*class=["']font-bold[^>]*>([\s\S]*?)<\/span>[\s\S]*?<div class=["']accordion-content[\s\S]*?>([\s\S]*?)<\/div>/gi)];
            if (accItems.length > 0) {
                for (const item of accItems) {
                    const q = item[1].replace(/<[^>]*>/g, '').replace(/^\d+\.\s*/, '').trim();
                    const a = item[2].replace(/<[^>]*>/g, '').trim();
                    if (q && a) {
                        extractedFaqs.push({ q, a });
                    }
                }
            }
        }

        // Fallback standard high-quality FAQs based on the tool type if none found
        if (extractedFaqs.length === 0) {
            extractedFaqs = [
                {
                    q: `How do I use the ${toolName} Calculator?`,
                    a: `Using the ${toolName} Calculator is simple. Enter the required inputs in the fields provided, and the tool will instantly compute the results, complete with formulas and working where applicable.`
                },
                {
                    q: `Is this ${toolName} solver free to use?`,
                    a: `Yes! The ${toolName} Calculator is 100% free, private, and works directly in your web browser with no ad interruptions.`
                }
            ];
        }
    }

    // 6. Build Schemas
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://calcsuit.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": category,
                "item": categoryUrl
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": toolName,
                "item": canonicalUrl
            }
        ]
    };

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${toolName} Calculator`,
        "description": description,
        "applicationCategory": "CalculatorApplication",
        "operatingSystem": "Web",
        "url": canonicalUrl,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": canonicalUrl
    };

    // Form FAQPage schema string
    let faqSchemaStr = "";
    if (existingFaq) {
        faqSchemaStr = `<script type="application/ld+json">\n${JSON.stringify(existingFaq, null, 2)}\n</script>`;
    } else if (extractedFaqs.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": extractedFaqs.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            }))
        };
        faqSchemaStr = `<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`;
    }

    // Build the script blocks to insert
    const breadcrumbStr = `<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n</script>`;
    const softwareStr = `<script type="application/ld+json">\n${JSON.stringify(softwareSchema, null, 2)}\n</script>`;
    const webpageStr = `<script type="application/ld+json">\n${JSON.stringify(webpageSchema, null, 2)}\n</script>`;

    const combinedSchemas = `\n    <!-- Structured Data (SEO) -->\n    ${breadcrumbStr}\n    ${softwareStr}\n    ${webpageStr}\n    ${faqSchemaStr}\n`;

    // 7. Clean up existing application/ld+json scripts to avoid duplicates
    let cleanedHtml = html;

    const blockRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    cleanedHtml = cleanedHtml.replace(blockRegex, (match, p1) => {
        if (p1.includes('"SoftwareApplication"') || p1.includes('"WebPage"') || p1.includes('"BreadcrumbList"') || p1.includes('"FAQPage"') ||
            p1.includes("'SoftwareApplication'") || p1.includes("'WebPage'") || p1.includes("'BreadcrumbList'") || p1.includes("'FAQPage'")) {
            return ''; // Remove this schema block
        }
        return match; // Keep other blocks
    });

    // 7.1 Update canonical URL tag
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    const canonicalRegex = /<link\s+[^>]*rel=["']?canonical["']?[^>]*\/?>|<link\s+[^>]*href=["']?[^"'\s>]+["']?[^>]*rel=["']?canonical["']?[^>]*\/?>/i;
    if (cleanedHtml.match(canonicalRegex)) {
        cleanedHtml = cleanedHtml.replace(canonicalRegex, canonicalTag);
    } else {
        if (cleanedHtml.includes('</head>')) {
            cleanedHtml = cleanedHtml.replace('</head>', `    ${canonicalTag}\n</head>`);
        }
    }

    // 7.2 Update og:url tag if present
    const ogUrlRegex = /<meta\s+property=["']og:url["']\s+content=["']([^"']*)["'][^>]*>|<meta\s+content=["']([^"']*)["']\s+property=["']og:url["'][^>]*>/i;
    const ogUrlTag = `<meta property="og:url" content="${canonicalUrl}">`;
    if (cleanedHtml.match(ogUrlRegex)) {
        cleanedHtml = cleanedHtml.replace(ogUrlRegex, ogUrlTag);
    }

    // 7.3 Update twitter:url tag if present
    const twitterUrlRegex = /<meta\s+property=["']twitter:url["']\s+content=["']([^"']*)["'][^>]*>|<meta\s+name=["']twitter:url["']\s+content=["']([^"']*)["'][^>]*>|<meta\s+content=["']([^"']*)["']\s+(?:property|name)=["']twitter:url["'][^>]*>/i;
    const twitterUrlTag = `<meta name="twitter:url" content="${canonicalUrl}">`;
    if (cleanedHtml.match(twitterUrlRegex)) {
        cleanedHtml = cleanedHtml.replace(twitterUrlRegex, twitterUrlTag);
    }

    // 8. Inject just before </head>
    if (cleanedHtml.includes('</head>')) {
        cleanedHtml = cleanedHtml.replace('</head>', `${combinedSchemas}</head>`);
        fs.writeFileSync(filePath, cleanedHtml, 'utf8');
        console.log(`Injected schemas into ${calc.id}`);
    } else {
        console.warn(`Could not find </head> in ${filePath}`);
    }
}
console.log('Successfully injected schemas into all calculator files!');
