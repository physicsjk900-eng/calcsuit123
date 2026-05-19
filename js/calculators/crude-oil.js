document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const valDensity = document.getElementById('val-density');
    const unitDensity = document.getElementById('unit-density');
    const valMass = document.getElementById('val-mass');
    const unitMass = document.getElementById('unit-mass');
    const valVolume = document.getElementById('val-volume');
    const unitVolume = document.getElementById('unit-volume');
    const btnReset = document.getElementById('btn-reset');

    // UI Elements
    const blockDensity = document.getElementById('block-density');
    const blockMass = document.getElementById('block-mass');
    const blockVolume = document.getElementById('block-volume');
    const badgeDensity = document.getElementById('badge-density');
    const badgeMass = document.getElementById('badge-mass');
    const badgeVolume = document.getElementById('badge-volume');
    const extendedResults = document.getElementById('extended-results');
    const conversionsGrid = document.getElementById('conversions-grid');
    const extendedResultsTitle = document.getElementById('extended-results-title');

    // Constants for Water Density at 60F
    const WATER_DENSITY_KG_M3 = 999.012;

    // Track recently modified inputs (keeps max 2 to determine what to calculate)
    let manualInputs = []; // e.g. ['density', 'mass']

    // Setup Event Listeners
    [valDensity, valMass, valVolume].forEach(input => {
        input.addEventListener('input', (e) => {
            const type = e.target.id.split('-')[1]; // 'density', 'mass', or 'volume'
            recordManualInput(type);
            calculateMissing();
        });
    });

    [unitDensity, unitMass, unitVolume].forEach(select => {
        select.addEventListener('change', () => {
            calculateMissing();
        });
    });

    btnReset.addEventListener('click', () => {
        valDensity.value = '';
        valMass.value = '';
        valVolume.value = '';
        manualInputs = [];
        resetUI();
    });

    function recordManualInput(type) {
        // If type is already the most recent, do nothing
        if (manualInputs[manualInputs.length - 1] === type) return;

        // Remove type if it exists elsewhere in the array
        manualInputs = manualInputs.filter(item => item !== type);
        
        // Add to end of array
        manualInputs.push(type);
        
        // Keep only the last 2 interactions
        if (manualInputs.length > 2) {
            manualInputs.shift();
        }
    }

    function calculateMissing() {
        if (manualInputs.length < 2) {
            resetUI();
            return;
        }

        const typeToCalculate = ['density', 'mass', 'volume'].find(t => !manualInputs.includes(t));
        
        const dVal = parseFloat(valDensity.value);
        const mVal = parseFloat(valMass.value);
        const vVal = parseFloat(valVolume.value);

        const canCalculate = (typeToCalculate === 'volume' && !isNaN(dVal) && !isNaN(mVal)) ||
                             (typeToCalculate === 'mass' && !isNaN(dVal) && !isNaN(vVal)) ||
                             (typeToCalculate === 'density' && !isNaN(mVal) && !isNaN(vVal));

        if (!canCalculate) {
            resetUI();
            return;
        }

        let densityKgM3, massKg, volumeM3;

        try {
            if (typeToCalculate === 'volume') {
                densityKgM3 = toKgM3(dVal, unitDensity.value);
                massKg = toKg(mVal, unitMass.value);
                if (densityKgM3 <= 0) throw new Error("Invalid Density");
                volumeM3 = massKg / densityKgM3;
                valVolume.value = formatNumber(fromM3(volumeM3, unitVolume.value));
            } else if (typeToCalculate === 'mass') {
                densityKgM3 = toKgM3(dVal, unitDensity.value);
                volumeM3 = toM3(vVal, unitVolume.value);
                if (densityKgM3 <= 0) throw new Error("Invalid Density");
                massKg = densityKgM3 * volumeM3;
                valMass.value = formatNumber(fromKg(massKg, unitMass.value));
            } else if (typeToCalculate === 'density') {
                massKg = toKg(mVal, unitMass.value);
                volumeM3 = toM3(vVal, unitVolume.value);
                if (volumeM3 <= 0) throw new Error("Invalid Volume");
                densityKgM3 = massKg / volumeM3;
                valDensity.value = formatNumber(fromKgM3(densityKgM3, unitDensity.value));
            }

            updateUI(typeToCalculate);

            // Populate Extended Results for the calculated property
            if (typeToCalculate === 'volume') showExtendedVolume(volumeM3);
            else if (typeToCalculate === 'mass') showExtendedMass(massKg);
            else if (typeToCalculate === 'density') showExtendedDensity(densityKgM3);

        } catch (e) {
            console.error(e);
            resetUI();
        }
    }

    function updateUI(calculatedType) {
        // Reset all blocks
        [blockDensity, blockMass, blockVolume].forEach(b => b.classList.remove('calculated-glow'));
        [badgeDensity, badgeMass, badgeVolume].forEach(b => b.classList.add('hidden'));

        // Highlight calculated block
        if (calculatedType === 'density') {
            blockDensity.classList.add('calculated-glow');
            badgeDensity.classList.remove('hidden');
        } else if (calculatedType === 'mass') {
            blockMass.classList.add('calculated-glow');
            badgeMass.classList.remove('hidden');
        } else if (calculatedType === 'volume') {
            blockVolume.classList.add('calculated-glow');
            badgeVolume.classList.remove('hidden');
        }
        
        extendedResults.classList.remove('hidden');
    }

    function resetUI() {
        [blockDensity, blockMass, blockVolume].forEach(b => b.classList.remove('calculated-glow'));
        [badgeDensity, badgeMass, badgeVolume].forEach(b => b.classList.add('hidden'));
        extendedResults.classList.add('hidden');
    }

    // --- Conversion Functions ---

    // Density
    function toKgM3(val, unit) {
        switch (unit) {
            case 'api': return (141.5 / (val + 131.5)) * WATER_DENSITY_KG_M3;
            case 'kgm3': return val;
            case 'gcm3': return val * 1000;
            case 'lbgal': return val * 119.826427;
            case 'lbft3': return val * 16.018463;
            default: return val;
        }
    }

    function fromKgM3(val, unit) {
        switch (unit) {
            case 'api': return (141.5 / (val / WATER_DENSITY_KG_M3)) - 131.5;
            case 'kgm3': return val;
            case 'gcm3': return val / 1000;
            case 'lbgal': return val / 119.826427;
            case 'lbft3': return val / 16.018463;
            default: return val;
        }
    }

    // Mass
    function toKg(val, unit) {
        switch (unit) {
            case 'kg': return val;
            case 'ton': return val * 1000;
            case 'g': return val / 1000;
            case 'lb': return val * 0.45359237;
            case 'longton': return val * 1016.0469088;
            case 'shortton': return val * 907.18474;
            default: return val;
        }
    }

    function fromKg(val, unit) {
        switch (unit) {
            case 'kg': return val;
            case 'ton': return val / 1000;
            case 'g': return val * 1000;
            case 'lb': return val / 0.45359237;
            case 'longton': return val / 1016.0469088;
            case 'shortton': return val / 907.18474;
            default: return val;
        }
    }

    // Volume
    function toM3(val, unit) {
        switch (unit) {
            case 'm3': return val;
            case 'bbl': return val * 0.158987295;
            case 'usgal': return val * 0.00378541178;
            case 'ukgal': return val * 0.00454609;
            case 'liter': return val / 1000;
            case 'ft3': return val * 0.0283168466;
            default: return val;
        }
    }

    function fromM3(val, unit) {
        switch (unit) {
            case 'm3': return val;
            case 'bbl': return val / 0.158987295;
            case 'usgal': return val / 0.00378541178;
            case 'ukgal': return val / 0.00454609;
            case 'liter': return val * 1000;
            case 'ft3': return val / 0.0283168466;
            default: return val;
        }
    }

    // --- Extended Results Rendering ---

    function formatNumber(num) {
        if (Math.abs(num) < 0.0001 || Math.abs(num) > 1000000) {
            return num.toExponential(4);
        }
        return parseFloat(num.toFixed(4));
    }

    function createConversionCard(label, value, symbol) {
        return `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center shadow-sm">
                <div class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">${label}</div>
                <div class="text-xl font-black text-slate-800 dark:text-white break-all">${formatNumber(value)} <span class="text-sm font-medium text-slate-400">${symbol}</span></div>
            </div>
        `;
    }

    function showExtendedVolume(m3) {
        extendedResultsTitle.textContent = "Calculated Volume Conversions";
        conversionsGrid.innerHTML = `
            ${createConversionCard("Barrels", fromM3(m3, 'bbl'), "bbl")}
            ${createConversionCard("US Gallons", fromM3(m3, 'usgal'), "gal")}
            ${createConversionCard("UK Gallons", fromM3(m3, 'ukgal'), "gal")}
            ${createConversionCard("Liters", fromM3(m3, 'liter'), "L")}
            ${createConversionCard("Cubic Meters", fromM3(m3, 'm3'), "m³")}
            ${createConversionCard("Cubic Feet", fromM3(m3, 'ft3'), "ft³")}
        `;
    }

    function showExtendedMass(kg) {
        extendedResultsTitle.textContent = "Calculated Mass Conversions";
        conversionsGrid.innerHTML = `
            ${createConversionCard("Metric Tons", fromKg(kg, 'ton'), "t")}
            ${createConversionCard("Kilograms", fromKg(kg, 'kg'), "kg")}
            ${createConversionCard("Pounds", fromKg(kg, 'lb'), "lbs")}
            ${createConversionCard("Long Tons", fromKg(kg, 'longton'), "lt")}
            ${createConversionCard("Short Tons", fromKg(kg, 'shortton'), "st")}
            ${createConversionCard("Grams", fromKg(kg, 'g'), "g")}
        `;
    }

    function showExtendedDensity(kgm3) {
        extendedResultsTitle.textContent = "Calculated Density Conversions";
        conversionsGrid.innerHTML = `
            ${createConversionCard("API Gravity", fromKgM3(kgm3, 'api'), "°API")}
            ${createConversionCard("kg / m³", fromKgM3(kgm3, 'kgm3'), "")}
            ${createConversionCard("g / cm³", fromKgM3(kgm3, 'gcm3'), "")}
            ${createConversionCard("lb / US gal", fromKgM3(kgm3, 'lbgal'), "")}
            ${createConversionCard("lb / ft³", fromKgM3(kgm3, 'lbft3'), "")}
        `;
    }

    // --- Flow Rate Engine Logic ---
    const valFlowDensity = document.getElementById('val-flow-density');
    const unitFlowDensity = document.getElementById('unit-flow-density');
    const valFlowVol = document.getElementById('val-flow-vol');
    const unitFlowVol = document.getElementById('unit-flow-vol');
    const valFlowMass = document.getElementById('val-flow-mass');
    const unitFlowMass = document.getElementById('unit-flow-mass');
    
    const badgeFlowDensity = document.getElementById('badge-flow-density');
    const badgeFlowVol = document.getElementById('badge-flow-vol');
    const badgeFlowMass = document.getElementById('badge-flow-mass');
    const btnResetFlow = document.getElementById('btn-reset-flow');

    let lastFlowEditSource = null;
    let flowCalculateMode = null; // 'density', 'vol', 'mass'

    function resetFlowBadges() {
        if(badgeFlowDensity) badgeFlowDensity.classList.add('hidden');
        if(badgeFlowVol) badgeFlowVol.classList.add('hidden');
        if(badgeFlowMass) badgeFlowMass.classList.add('hidden');
    }

    function calculateFlow() {
        if (!valFlowDensity || !valFlowVol || !valFlowMass) return;

        let dInput = parseFloat(valFlowDensity.value);
        let vInput = parseFloat(valFlowVol.value);
        let mInput = parseFloat(valFlowMass.value);

        let hasD = !isNaN(dInput) && valFlowDensity.value.trim() !== '';
        let hasV = !isNaN(vInput) && valFlowVol.value.trim() !== '';
        let hasM = !isNaN(mInput) && valFlowMass.value.trim() !== '';

        if (!hasD && !hasV && !hasM) return;

        if (flowCalculateMode === 'density' && hasV && hasM) {
            let vBase = vInput * flowVolMultipliers[unitFlowVol.value]; // m3/s
            let mBase = mInput * flowMassMultipliers[unitFlowMass.value]; // kg/s
            if (vBase > 0) {
                let dBase = mBase / vBase; // kg/m3
                valFlowDensity.value = formatNumber(convertFromKgm3(dBase, unitFlowDensity.value));
                resetFlowBadges();
                badgeFlowDensity.classList.remove('hidden');
            }
        } else if (flowCalculateMode === 'vol' && hasD && hasM) {
            let dBase = getDensityKgm3(dInput, unitFlowDensity.value); // kg/m3
            let mBase = mInput * flowMassMultipliers[unitFlowMass.value]; // kg/s
            if (dBase > 0) {
                let vBase = mBase / dBase; // m3/s
                valFlowVol.value = formatNumber(vBase / flowVolMultipliers[unitFlowVol.value]);
                resetFlowBadges();
                badgeFlowVol.classList.remove('hidden');
            }
        } else if (flowCalculateMode === 'mass' && hasD && hasV) {
            let dBase = getDensityKgm3(dInput, unitFlowDensity.value); // kg/m3
            let vBase = vInput * flowVolMultipliers[unitFlowVol.value]; // m3/s
            if (dBase > 0) {
                let mBase = dBase * vBase; // kg/s
                valFlowMass.value = formatNumber(mBase / flowMassMultipliers[unitFlowMass.value]);
                resetFlowBadges();
                badgeFlowMass.classList.remove('hidden');
            }
        }
    }

    if (valFlowDensity && valFlowVol && valFlowMass) {
        valFlowDensity.addEventListener('input', () => {
            if (lastFlowEditSource === 'vol') flowCalculateMode = 'mass';
            else if (lastFlowEditSource === 'mass') flowCalculateMode = 'vol';
            else flowCalculateMode = 'mass';
            lastFlowEditSource = 'density';
            calculateFlow();
        });
        
        valFlowVol.addEventListener('input', () => {
            if (lastFlowEditSource === 'density') flowCalculateMode = 'mass';
            else if (lastFlowEditSource === 'mass') flowCalculateMode = 'density';
            else flowCalculateMode = 'mass';
            lastFlowEditSource = 'vol';
            calculateFlow();
        });
        
        valFlowMass.addEventListener('input', () => {
            if (lastFlowEditSource === 'density') flowCalculateMode = 'vol';
            else if (lastFlowEditSource === 'vol') flowCalculateMode = 'density';
            else flowCalculateMode = 'vol';
            lastFlowEditSource = 'mass';
            calculateFlow();
        });
        
        [unitFlowDensity, unitFlowVol, unitFlowMass].forEach(select => {
            select.addEventListener('change', calculateFlow);
        });
        
        if (btnResetFlow) {
            btnResetFlow.addEventListener('click', () => {
                valFlowDensity.value = '';
                valFlowVol.value = '';
                valFlowMass.value = '';
                lastFlowEditSource = null;
                flowCalculateMode = null;
                resetFlowBadges();
            });
        }
    }

    // --- Live Price Calculator Logic ---
    const API_KEY = ''; // Leave blank for Demo Mode
    
    const priceCommodity = document.getElementById('price-commodity');
    const valPriceQty = document.getElementById('val-price-qty');
    const unitPriceQty = document.getElementById('unit-price-qty');
    const priceDisplayRate = document.getElementById('price-display-rate');
    const priceTotalValue = document.getElementById('price-total-value');
    const priceStatusBadge = document.getElementById('price-status-badge');

    // Mock Live Data Fallback
    const mockCommodityData = {
        WTI: { price: 82.50, baseUnit: 'bbl', symbol: 'USD/bbl' },
        BRENT: { price: 86.20, baseUnit: 'bbl', symbol: 'USD/bbl' },
        NATGAS: { price: 2.85, baseUnit: 'mmbtu', symbol: 'USD/MMBtu' },
        GASOLINE: { price: 2.65, baseUnit: 'gal', symbol: 'USD/gal' },
        HEATINGOIL: { price: 2.55, baseUnit: 'gal', symbol: 'USD/gal' }
    };

    let activeCommodities = { ...mockCommodityData };

    function fetchLivePrices() {
        if (!API_KEY) {
            // Demo mode
            updatePriceUI();
            return;
        }

        // Implementation stub for live API (e.g., Commodities-API)
        /*
        fetch(`https://commodities-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=BRENTOIL,WTIOIL,NG,RBOB`)
            .then(res => res.json())
            .then(data => {
                // Map data to activeCommodities...
                priceStatusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Data';
                updatePriceUI();
            })
            .catch(err => {
                console.error("Failed to fetch live prices, falling back to demo.", err);
                updatePriceUI();
            });
        */
    }

    function getQuantityInBaseUnit(qty, fromUnit, baseUnit) {
        if (fromUnit === baseUnit) return qty;
        
        // Convert to intermediate unit (bbl)
        let bbl = 0;
        switch(fromUnit) {
            case 'bbl': bbl = qty; break;
            case 'gal': bbl = qty / 42; break;
            case 'mt': bbl = qty * 7.33; break;
            case 'mmbtu': bbl = qty / 5.8; break; // approximate conversion
        }
        
        // Convert from bbl to target baseUnit
        switch(baseUnit) {
            case 'bbl': return bbl;
            case 'gal': return bbl * 42;
            case 'mt': return bbl / 7.33;
            case 'mmbtu': return bbl * 5.8;
        }
        return qty;
    }

    function updatePriceUI() {
        if (!priceCommodity || !valPriceQty || !priceTotalValue) return;

        const selectedCode = priceCommodity.value;
        const commData = activeCommodities[selectedCode];
        
        if (commData) {
            priceDisplayRate.textContent = `$${commData.price.toFixed(2)} ${commData.symbol}`;
            
            const qty = parseFloat(valPriceQty.value);
            if (isNaN(qty) || qty < 0) {
                priceTotalValue.textContent = '0.00';
                return;
            }

            const baseQty = getQuantityInBaseUnit(qty, unitPriceQty.value, commData.baseUnit);
            const totalValue = baseQty * commData.price;
            
            priceTotalValue.textContent = totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    if (priceCommodity && valPriceQty && unitPriceQty) {
        priceCommodity.addEventListener('change', updatePriceUI);
        valPriceQty.addEventListener('input', updatePriceUI);
        unitPriceQty.addEventListener('change', updatePriceUI);
        
        // Initial fetch/render
        fetchLivePrices();
    }

});
