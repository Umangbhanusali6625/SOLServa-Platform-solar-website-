/**
 * SOLSERVA GREENTECH - SOLAR CALCULATOR & INTERACTIVE WIDGETS MODULE
 */
/* ===================================================================
   3. SERVICE TABS SWITCHER (Section 4.2 - 4.7)
   =================================================================== */
function switchServiceTab(tabKey) {
  const tabs = ['monitoring', 'analytics', 'om', 'audit', 'logger'];
  if (!tabs.includes(tabKey)) return;

  tabs.forEach(key => {
    const btn = document.getElementById(`srvTabBtn_${key}`);
    const card = document.getElementById(`srvContent_${key}`);
    if (btn) btn.classList.remove('active');
    if (card) card.style.display = 'none';
  });

  const activeBtn = document.getElementById(`srvTabBtn_${tabKey}`);
  const targetCard = document.getElementById(`srvContent_${tabKey}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (targetCard) targetCard.style.display = 'grid';
}
window.switchServiceTab = switchServiceTab;

function initServiceTabs() {
  function getTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    return ['monitoring', 'analytics', 'om', 'audit', 'logger'].includes(hash) ? hash : 'monitoring';
  }

  const initialTab = getTabFromHash();
  switchServiceTab(initialTab);

  window.addEventListener('hashchange', () => {
    const tab = getTabFromHash();
    switchServiceTab(tab);
    const target = document.getElementById(tab) || document.getElementById(`srvContent_${tab}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ===================================================================
   4. DASHBOARD PREVIEW TOGGLES (Section 4.1 & Section 7)
   =================================================================== */
function switchDashView(view, btnElement) {
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));

  const genVal = document.getElementById('dashGenVal');
  const powerVal = document.getElementById('dashPowerVal');
  const prVal = document.getElementById('dashPrVal');

  if (view === 'realtime') {
    if (genVal) genVal.textContent = '1,248 kWh';
    if (powerVal) powerVal.textContent = '285.4 kW';
    if (prVal) prVal.textContent = '81.6%';
  } else if (view === 'inverters') {
    if (genVal) genVal.textContent = '4 / 4 Online';
    if (powerVal) powerVal.textContent = '98.2% Avg Eff';
    if (prVal) prVal.textContent = '300 kW Cap';
  } else if (view === 'alerts') {
    if (genVal) genVal.textContent = '1 Warning';
    if (powerVal) powerVal.textContent = '1 Info Alert';
    if (prVal) prVal.textContent = '0 Faults';
  } else if (view === 'tickets') {
    if (genVal) genVal.textContent = '1 Open';
    if (powerVal) powerVal.textContent = 'SLV-TKT-1042';
    if (prVal) prVal.textContent = 'Assigned';
  }

  // Highlight clicked button safely
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('active');
  } else {
    // Fallback: match by onclick attribute or first tab
    const matched = Array.from(tabBtns).find(b => b.getAttribute('onclick')?.includes(view));
    if (matched) matched.classList.add('active');
  }
}
window.switchDashView = switchDashView;

/* ===================================================================
   5. SOLAR ESTIMATOR CALCULATOR
   =================================================================== */
function initCalculator() {
  const billSlider = document.getElementById('calcBillSlider');
  const billValueDisplay = document.getElementById('calcBillVal');
  const propTypeBtns = document.querySelectorAll('.property-type-btn');

  const resSystemSize = document.getElementById('resSystemSize');
  const resSubsidy = document.getElementById('resSubsidy');
  const subsidyCard = document.querySelector('.result-metric-card.subsidy-card');
  const resAnnualSavings = document.getElementById('resAnnualSavings');
  const resRoofArea = document.getElementById('resRoofArea');
  const resPayback = document.getElementById('resPayback');
  const resLifetimeSavings = document.getElementById('resLifetimeSavings');
  const applyCalcBtn = document.getElementById('applyCalcQuoteBtn');

  if (!billSlider) return;

  let currentPropertyType = 'residential';

  propTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      propTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPropertyType = btn.getAttribute('data-type');
      calculateSolar();
    });
  });

  billSlider.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    billValueDisplay.textContent = `₹${val.toLocaleString('en-IN')}`;
    calculateSolar();
  });

  function calculateSolar() {
    const bill = Number(billSlider.value);
    let tariff = 7.5;
    if (currentPropertyType === 'commercial') tariff = 9.5;
    if (currentPropertyType === 'industrial') tariff = 8.2;

    const monthlyUnits = bill / tariff;
    let systemKw = Math.round((monthlyUnits / 120) * 10) / 10;
    if (systemKw < 1) systemKw = 1;
    if (systemKw > 150) systemKw = 150;

    const roofArea = Math.round(systemKw * 100);

    let subsidy = 0;
    // PM Surya Ghar subsidy applies strictly to Residential installations
    if (currentPropertyType === 'residential') {
      if (systemKw >= 3) subsidy = 78000;
      else if (systemKw >= 2) subsidy = 60000;
      else if (systemKw >= 1) subsidy = 30000;
      if (subsidyCard) {
        subsidyCard.style.display = 'flex';
      }
      if (resSubsidy) {
        resSubsidy.textContent = `₹${subsidy.toLocaleString('en-IN')}`;
      }
    } else {
      // Non-residential projects: hide PM Surya Ghar subsidy card
      if (subsidyCard) {
        subsidyCard.style.display = 'none';
      }
    }

    const grossCost = Math.round(systemKw * 58000);
    const netCost = Math.max(grossCost - subsidy, 0);

    const monthlySavings = Math.round(systemKw * 120 * tariff);
    const annualSavings = Math.min(monthlySavings * 12, bill * 12);
    const paybackYears = (netCost / (annualSavings || 1)).toFixed(1);
    const lifetimeSavings = Math.round((annualSavings * 25) - netCost);

    if (resSystemSize) resSystemSize.textContent = `${systemKw} kW`;
    if (resAnnualSavings) resAnnualSavings.textContent = `₹${annualSavings.toLocaleString('en-IN')}`;
    if (resRoofArea) resRoofArea.textContent = `${roofArea.toLocaleString('en-IN')} sq.ft`;
    if (resPayback) resPayback.textContent = `${paybackYears} Years`;
    if (resLifetimeSavings) resLifetimeSavings.textContent = `₹${(lifetimeSavings / 100000).toFixed(2)} Lakhs`;
  }

  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', () => {
      window.location.href = '/contact/';
    });
  }

  calculateSolar();
}

/* ===================================================================
   DATA LOGGER DEVICE IMAGE SWITCHER & ASSET PRELOADER
   =================================================================== */
// Preload all hardware logger images into browser cache for instantaneous display
(function preloadLoggerAssets() {
  const loggerAssets = [
    '/assets/images/stick-logger-with-usb-connector.webp',
    '/assets/images/solserva-greentech-stick-logger.webp',
    '/assets/images/stick-logger-with-green-connector.webp',
    '/assets/images/solserva-stick-logger-junction-box.webp'
  ];
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      loggerAssets.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  }
})();

function switchLoggerDevice(type, btnElement) {
  const devices = {
    usb: {
      img: '/assets/images/stick-logger-with-usb-connector.webp',
      alt: 'SOLServa USB Stick Logger for plug-and-play inverter monitoring',
      caption: 'SOLServa USB Stick Logger',
      subcaption: 'Direct Inverter USB Port Telemetry • 4G LTE / WiFi Dual Band',
      badge: 'USB 2.0 Inverter Port'
    },
    rs485: {
      img: '/assets/images/solserva-greentech-stick-logger.webp',
      alt: 'SOLServa RS-485 Modbus serial data logger for industrial inverters',
      caption: 'SOLServa RS-485 Modbus Logger',
      subcaption: 'Industrial Multi-Drop Serial Gateway • Inverters & Energy Meters',
      badge: 'RS485 / DB9 Serial'
    },
    aviation: {
      img: '/assets/images/stick-logger-with-green-connector.webp',
      alt: 'SOLServa circular aviation port stick logger with green twist-lock connector',
      caption: 'SOLServa Circular Port Stick Logger',
      subcaption: 'Vibration-Proof 4-Pin Twist-Lock Telemetry • 4G LTE / WiFi • Make in India',
      badge: '4-Pin Aviation Port'
    },
    junction: {
      img: '/assets/images/solserva-stick-logger-junction-box.webp',
      alt: 'SOLServa weatherproof IP65 outdoor junction box logger deployment',
      caption: 'Field Junction Box Deployment',
      subcaption: 'Heavy-Duty IP65 Weatherproof Enclosure • Rooftop & Ground Plants',
      badge: 'IP65 Weatherproof Field Unit'
    }
  };

  const selected = devices[type];
  if (!selected) return;

  document.querySelectorAll('.logger-device-showcase-box').forEach(box => {
    const imgEl = box.querySelector('.logger-device-img-display img');
    const captionEl = box.querySelector('.logger-device-caption');
    const subcaptionEl = box.querySelector('.logger-device-subcaption');
    const badgeEl = box.querySelector('.logger-device-badge-top');

    if (imgEl) {
      imgEl.src = selected.img;
      imgEl.alt = selected.alt;
    }
    if (captionEl) captionEl.textContent = selected.caption;
    if (subcaptionEl) subcaptionEl.textContent = selected.subcaption;
    if (badgeEl) badgeEl.innerHTML = `<span>⚡</span> ${selected.badge}`;

    box.querySelectorAll('.logger-thumb-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === type);
    });
  });
}
window.switchLoggerDevice = switchLoggerDevice;
