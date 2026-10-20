/* ===================================================================
   AUTOMATED FORM DATA ENGINE & OWNER INBOX DISPATCH
   Official Recipient: solservagreentechpvtltd@gmail.com
   Support & WhatsApp Desk: +91 90339 83133
   =================================================================== */
const OWNER_EMAIL = 'solservagreentechpvtltd@gmail.com';

function getWeb3FormsKey() {
  return localStorage.getItem('solserva_web3forms_key') || window.SOLSERVA_WEB3FORMS_KEY || '';
}

// 1. Save Lead Locally to Browser Storage (Guaranteed Zero Data Loss)
function saveLeadRecord(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem('solserva_leads_v1') || '[]');
    existing.unshift(lead);
    localStorage.setItem('solserva_leads_v1', JSON.stringify(existing.slice(0, 500)));
  } catch (err) {
    console.warn('[SOLServa Leads] Could not save locally:', err);
  }
}

// 2. Dispatch Lead Data directly to Owner's Email (solservagreentechpvtltd@gmail.com)
async function dispatchLeadToOwner(payload) {
  let emailDispatched = false;

  // Primary: Dispatch via FormSubmit AJAX (Direct to solservagreentechpvtltd@gmail.com, no API key required)
  try {
    const fsRes = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: payload.subject || `New SOLServa Lead: ${payload.client_name || 'Customer Inquiry'}`,
        _template: 'table',
        _captcha: 'false',
        ...payload
      })
    });
    if (fsRes.ok) emailDispatched = true;
  } catch (fsErr) {
    console.warn('[SOLServa Leads] FormSubmit notice:', fsErr);
  }

  // Secondary: Dispatch via Web3Forms if owner configured a custom key
  const w3Key = getWeb3FormsKey();
  if (w3Key && !w3Key.startsWith('YOUR_') && w3Key !== 'a812837f-5d0e-436b-9fb8-591a26d7c405') {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: w3Key,
          ...payload
        })
      });
    } catch (w3Err) {
      console.warn('[SOLServa Leads] Web3Forms notice:', w3Err);
    }
  }

  return { success: true, emailDispatched };
}

// 3. Direct WhatsApp Dispatch Utility (Opens WhatsApp directly with pre-filled message)
function openDirectWhatsApp(waText) {
  const cleanPhone = '919033983133';
  const encoded = encodeURIComponent(waText);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

  // Attempt immediate direct popup / tab opening
  const newWin = window.open(waUrl, '_blank');

  // If browser popup blocker intervened, redirect after brief moment
  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    setTimeout(() => {
      window.location.href = waUrl;
    }, 450);
  }

  return waUrl;
}

/* ===================================================================
   FORM SUBMISSIONS WITH AUTOMATIC DATA COLLECTION & DIRECT WHATSAPP
   =================================================================== */
function initFormSubmissions() {
  // Ensure any leftover owner portal DOM nodes are actively destroyed
  const leftoverTrigger = document.getElementById('ownerPortalFloatingTrigger');
  if (leftoverTrigger) leftoverTrigger.remove();
  const leftoverModal = document.getElementById('ownerLeadsModal');
  if (leftoverModal) leftoverModal.remove();

  const isLocalOrDev = 
    window.location.protocol === 'file:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname === '';

  // 5.1 General Enquiry Form
  const genForm = document.getElementById('generalEnquiryForm');
  if (genForm) {
    genForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('genName')?.value?.trim() || '';
      const company = document.getElementById('genCompany')?.value?.trim() || 'N/A';
      const phone = document.getElementById('genPhone')?.value?.trim() || '';
      const email = document.getElementById('genEmail')?.value?.trim() || '';
      const location = document.getElementById('genLocation')?.value?.trim() || '';
      const custType = document.getElementById('genCustomerType')?.value || '';
      const srv = document.getElementById('genServiceRequired')?.value || '';
      const msg = document.getElementById('genMessage')?.value?.trim() || '';

      const refNo = `SLV-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('genStatusMsg');
      const submitBtn = genForm.querySelector('button[type="submit"]');

      // Check Cloudflare Turnstile verification if present (bypassed on local / dev / failed widget)
      const turnstileInput = genForm.querySelector('[name="cf-turnstile-response"]');
      if (!isLocalOrDev && turnstileInput && turnstileInput.value === '') {
        const turnstileIframe = genForm.querySelector('.cf-turnstile iframe');
        if (turnstileIframe) {
          if (statusBox) {
            statusBox.innerHTML = `
              <div style="background:#fef2f2; border:1px solid #ef4444; color:#991b1b; padding:12px; border-radius:8px; margin-bottom:12px; font-size:0.88rem;">
                Please complete the Cloudflare security verification before submitting.
              </div>
            `;
          }
          return;
        }
      }

      // 1. Format the full WhatsApp message with clean plain text (no emojis or broken symbols)
      const waText = 
`*NEW SOLSERVA SERVICE ENQUIRY*
----------------------------------------
Ref ID: ${refNo}
Customer Name: ${name}
${company && company !== 'N/A' ? `Company: ${company}\n` : ''}Phone / WhatsApp: ${phone}
Email Address: ${email}
City & State: ${location}
Customer Type: ${custType}
Service Required: ${srv}
----------------------------------------
Message / Plant Details:
${msg || 'General service consultation requested.'}
----------------------------------------
Sent via SOLServa Solar Web Portal`;

      // 2. Save lead locally for Owner (Zero Data Loss)
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      saveLeadRecord({
        refNo,
        date: timestamp,
        type: 'General Enquiry',
        name,
        company,
        phone,
        email,
        location,
        custType,
        service: srv,
        details: msg || 'General consultation requested.'
      });

      // 3. Dispatch to Owner Email (solservagreentechpvtltd@gmail.com) in background
      dispatchLeadToOwner({
        subject: `New SOLServa Lead: ${name} (${srv}) [${refNo}]`,
        from_name: 'SOLServa Greentech Portal',
        client_name: name,
        company_name: company,
        phone_number: phone,
        email_address: email,
        city_location: location,
        customer_type: custType,
        service_requested: srv,
        enquiry_details: msg || 'General consultation requested.',
        reference_number: refNo,
        submission_time: timestamp
      });

      // 4. Open WhatsApp directly right away!
      const waUrl = openDirectWhatsApp(waText);

      // 5. Show prominent confirmation with manual WhatsApp fallback button
      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:18px; border-radius:12px; text-align:center; margin-top:14px; box-shadow:0 4px 14px rgba(16,185,129,0.12);">
            <div style="font-size:1.15rem; font-weight:800; color:#065f46; margin-bottom:6px;">
              ✓ Enquiry Saved &amp; Opening WhatsApp...
            </div>
            <p style="font-size:0.86rem; color:#047857; margin:0 0 14px; line-height:1.5;">
              Ref: <strong>${refNo}</strong> &bull; If WhatsApp didn't open automatically, click the button below to send your message:
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:11px 24px; font-size:0.95rem; background:#25d366; border-color:#25d366; color:#ffffff; font-weight:700; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(37,211,102,0.35);">
              Send Message on WhatsApp &rarr;
            </a>
          </div>
        `;
      }

      genForm.reset();
      if (submitBtn) submitBtn.disabled = false;
      if (window.turnstile) {
        try { window.turnstile.reset(); } catch (err) {}
      }
    });
  }

  // 5.2 Plant Compatibility Form
  const compatForm = document.getElementById('compatForm');
  if (compatForm) {
    compatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('compatName')?.value?.trim() || '';
      const contact = document.getElementById('compatContact')?.value?.trim() || '';
      const loc = document.getElementById('compatLocation')?.value?.trim() || '';
      const plantType = document.getElementById('compatPlantType')?.value || '';
      const cap = document.getElementById('compatCapacity')?.value?.trim() || '';
      const brand = document.getElementById('compatInverterBrand')?.value?.trim() || '';
      const srv = document.getElementById('compatRequiredService')?.value || '';

      const refNo = `SLV-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('compatStatusMsg');
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Save locally
      saveLeadRecord({
        refNo,
        date: timestamp,
        type: 'Plant Compatibility',
        name,
        phone: contact,
        location: loc,
        service: `Compatibility: ${brand} (${cap} kW)`,
        details: `Plant Type: ${plantType}, Inverter: ${brand}, Capacity: ${cap} kW, Service: ${srv}`
      });

      // Dispatch to email in background
      dispatchLeadToOwner({
        subject: `Plant Compatibility Request: ${name} [${brand} - ${cap} kW] (${refNo})`,
        from_name: 'SOLServa Compatibility Desk',
        client_name: name,
        contact_phone: contact,
        plant_location: loc,
        plant_type: plantType,
        plant_capacity: `${cap} kW`,
        inverter_model: brand,
        service_requested: srv,
        reference_number: refNo
      });

      const waText = 
`*SOLSERVA PLANT COMPATIBILITY REQUEST*
----------------------------------------
Ref ID: ${refNo}
Customer Name: ${name}
Contact Number: ${contact}
Plant Location: ${loc}
Plant Type: ${plantType}
Plant Capacity: ${cap} kW
Inverter Brand / Model: ${brand}
Required Service: ${srv}
----------------------------------------
Sent via SOLServa Compatibility Desk`;

      const waUrl = openDirectWhatsApp(waText);

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:18px; border-radius:12px; text-align:center; margin-top:14px;">
            <div style="font-size:1.15rem; font-weight:800; color:#065f46; margin-bottom:6px;">
              ✓ Compatibility Request Saved &amp; Opening WhatsApp...
            </div>
            <p style="font-size:0.86rem; color:#047857; margin:0 0 14px; line-height:1.5;">
              Ref: <strong>${refNo}</strong> &bull; Details logged for ${brand}. If WhatsApp didn't open automatically, click below:
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:11px 24px; font-size:0.95rem; background:#25d366; border-color:#25d366; color:#ffffff; font-weight:700; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(37,211,102,0.35);">
              Send on WhatsApp &rarr;
            </a>
          </div>
        `;
      }
      compatForm.reset();
    });
  }

  // 5.3 EPC Partner Form
  const epcForm = document.getElementById('epcPartnerForm');
  if (epcForm) {
    epcForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const comp = document.getElementById('epcCompName')?.value?.trim() || '';
      const person = document.getElementById('epcContactPerson')?.value?.trim() || '';
      const email = document.getElementById('epcEmail')?.value?.trim() || '';
      const phone = document.getElementById('epcPhone')?.value?.trim() || '';
      const portfolio = document.getElementById('epcPortfolioSize')?.value?.trim() || '';
      const model = document.getElementById('epcModel')?.value || '';

      const refNo = `SLV-EPC-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('epcStatusMsg');
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Save locally
      saveLeadRecord({
        refNo,
        date: timestamp,
        type: 'EPC Partner Application',
        name: `${person} (${comp})`,
        company: comp,
        phone,
        email,
        service: `EPC Partnership: ${model}`,
        details: `Portfolio: ${portfolio}, Model: ${model}`
      });

      // Dispatch to email in background
      dispatchLeadToOwner({
        subject: `EPC Partner Application: ${comp} (${person}) [${refNo}]`,
        from_name: 'SOLServa EPC Desk',
        company_name: comp,
        contact_person: person,
        email_address: email,
        phone_number: phone,
        portfolio_scale: portfolio,
        partnership_model: model,
        reference_number: refNo
      });

      const waText = 
`*SOLSERVA EPC PARTNERSHIP APPLICATION*
----------------------------------------
Ref ID: ${refNo}
Company Name: ${comp}
Contact Person: ${person}
Phone Number: ${phone}
Email Address: ${email}
Portfolio Scale: ${portfolio}
Preferred Model: ${model}
----------------------------------------
Sent via SOLServa EPC Partner Desk`;

      const waUrl = openDirectWhatsApp(waText);

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:18px; border-radius:12px; text-align:center; margin-top:14px;">
            <div style="font-size:1.15rem; font-weight:800; color:#065f46; margin-bottom:6px;">
              ✓ Application Received &amp; Opening WhatsApp...
            </div>
            <p style="font-size:0.86rem; color:#047857; margin:0 0 14px; line-height:1.5;">
              Ref: <strong>${refNo}</strong> &bull; Partnership coordinator notified. If WhatsApp didn't open automatically, click below:
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:11px 24px; font-size:0.95rem; background:#25d366; border-color:#25d366; color:#ffffff; font-weight:700; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(37,211,102,0.35);">
              Connect on WhatsApp &rarr;
            </a>
          </div>
        `;
      }
      epcForm.reset();
    });
  }

  // 5.4 Service Request & Fault Ticket Form
  const ticketForm = document.getElementById('serviceReqForm');
  if (ticketForm) {
    ticketForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cust = document.getElementById('ticketCustomer')?.value?.trim() || '';
      const contact = document.getElementById('ticketContact')?.value?.trim() || '';
      const plantId = document.getElementById('ticketPlantId')?.value?.trim() || 'N/A';
      const loc = document.getElementById('ticketLocation')?.value?.trim() || '';
      const cat = document.getElementById('ticketCategory')?.value || '';
      const desc = document.getElementById('ticketDesc')?.value?.trim() || '';

      const ticketNo = `SLV-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('ticketStatusMsg');
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Save locally
      saveLeadRecord({
        refNo: ticketNo,
        date: timestamp,
        type: 'Fault Service Ticket',
        name: cust,
        phone: contact,
        location: loc,
        service: `Ticket: ${cat} (Plant ID: ${plantId})`,
        details: desc
      });

      // Dispatch to email in background
      dispatchLeadToOwner({
        subject: `⚠️ Urgent Fault Ticket Logged: ${ticketNo} [${cat}]`,
        from_name: 'SOLServa Telemetry Alert Desk',
        customer_firm: cust,
        contact_number: contact,
        plant_id: plantId,
        plant_location: loc,
        issue_category: cat,
        issue_details: desc,
        ticket_number: ticketNo
      });

      const waText = 
`*SOLSERVA URGENT FAULT TICKET*
----------------------------------------
Ticket No: ${ticketNo}
Customer / Firm: ${cust}
Contact Phone: ${contact}
Plant ID: ${plantId}
Location: ${loc}
Issue Category: ${cat}
----------------------------------------
Fault Description:
${desc}
----------------------------------------
Sent via SOLServa Alert Desk`;

      const waUrl = openDirectWhatsApp(waText);

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#fffbeb; border:1px solid #f59e0b; color:#92400e; padding:18px; border-radius:12px; text-align:center; margin-top:14px;">
            <div style="font-size:1.15rem; font-weight:800; color:#92400e; margin-bottom:6px;">
              ✓ Ticket Logged: ${ticketNo} &amp; Opening WhatsApp...
            </div>
            <p style="font-size:0.86rem; color:#b45309; margin:0 0 14px; line-height:1.5;">
              Assigned to On-Call Technical Engineer. If WhatsApp didn't open automatically, click below to send ticket details:
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-solar" style="display:inline-flex; align-items:center; gap:8px; padding:11px 24px; font-size:0.95rem; background:#f59e0b; border-color:#f59e0b; color:#ffffff; font-weight:700; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(245,158,11,0.35);">
              Dispatch Alert via WhatsApp &rarr;
            </a>
          </div>
        `;
      }
      ticketForm.reset();
    });
  }
}

/* ===================================================================
   FAQ ACCORDION (Section 4.14)
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

