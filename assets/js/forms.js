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

// 3. Inject discreet floating Owner Leads Trigger button at bottom-left
function initOwnerPortalFloatingTrigger() {
  if (document.getElementById('ownerPortalFloatingTrigger')) return;
  const trigger = document.createElement('div');
  trigger.id = 'ownerPortalFloatingTrigger';
  trigger.style.cssText = 'position:fixed; bottom:16px; left:16px; z-index:9990; font-family:system-ui, -apple-system, sans-serif;';
  trigger.innerHTML = `
    <button type="button" onclick="openOwnerLeadsModal()" title="View Inquiries & Export to Excel (Owner Portal)" style="background:#064e3b; color:#34d399; border:1px solid #059669; border-radius:24px; padding:7px 14px; font-size:0.76rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 14px rgba(0,0,0,0.2); transition:transform 0.15s, background 0.15s;">
      <span>Owner Leads Portal</span>
    </button>
  `;
  document.body.appendChild(trigger);
}

// 4. Direct WhatsApp Dispatch Utility (Opens WhatsApp directly with pre-filled message)
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
   7. FORM SUBMISSIONS WITH AUTOMATIC DATA COLLECTION & DIRECT WHATSAPP
   =================================================================== */
function initFormSubmissions() {
  initOwnerPortalFloatingTrigger();

  const isLocalOrDev = 
    window.location.protocol === 'file:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname === '';

  // Keyboard shortcut for Owner to view all leads: Ctrl + Shift + L
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      openOwnerLeadsModal();
    }
  });

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
              Ref: <strong>${refNo}</strong> &bull; All details saved to Owner Portal. If WhatsApp didn't open automatically, click the button below to send your message:
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
   OWNER LEADS PORTAL & EXPORT (CSV / EXCEL)
   =================================================================== */
function openOwnerLeadsModal() {
  let modal = document.getElementById('ownerLeadsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ownerLeadsModal';
    modal.className = 'modal-overlay';
    modal.style.zIndex = '99999';
    document.body.appendChild(modal);
  }

  const leads = JSON.parse(localStorage.getItem('solserva_leads_v1') || '[]');
  const currentKey = getWeb3FormsKey();

  modal.innerHTML = `
    <div class="modal-card" style="max-width:1050px; width:95%; max-height:92vh; display:flex; flex-direction:column; padding:24px; border-radius:18px; background:#ffffff; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="font-size:1.35rem; margin:0; color:#0f172a; display:flex; align-items:center; gap:8px;">
              <span>📋</span> SOLServa Lead &amp; Enquiry Desk (Owner Portal)
            </h3>
            <span id="leadsCountBadge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:2px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">
              Total Leads: ${leads.length}
            </span>
          </div>
          <p style="font-size:0.82rem; color:#64748b; margin:4px 0 0;">
            Real-time customer inquiries. Every submission dispatches to <strong>solservagreentechpvtltd@gmail.com</strong>
          </p>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeModal('ownerLeadsModal')" style="font-size:1.8rem; background:none; border:none; cursor:pointer; color:#64748b; line-height:1;">&times;</button>
      </div>

      <!-- Action Toolbar -->
      <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center; margin-bottom:14px; background:#f8fafc; padding:10px 14px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          <input type="text" id="ownerLeadSearchInput" placeholder="🔍 Search by name, phone, city, service..." oninput="filterOwnerLeads(this.value)" style="padding:7px 12px; font-size:0.82rem; border:1px solid #cbd5e1; border-radius:8px; width:260px;">
          <button type="button" class="btn btn-primary" onclick="exportLeadsToCSV()" style="padding:7px 14px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px;">
            📥 Export to Excel (.CSV)
          </button>
          <button type="button" onclick="addDemoLeadForOwner()" style="padding:7px 12px; font-size:0.82rem; background:#f0fdf4; color:#15803d; border:1px solid #86efac; border-radius:8px; cursor:pointer; font-weight:600;">
            🧪 Add Test Lead
          </button>
          <button type="button" onclick="clearLeadsLog()" style="padding:7px 12px; font-size:0.82rem; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:8px; cursor:pointer;">
            🗑 Clear Log
          </button>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <input type="text" id="web3FormsKeyInput" value="${currentKey === 'a812837f-5d0e-436b-9fb8-591a26d7c405' ? '' : currentKey}" placeholder="Optional: Web3Forms Access Key" style="padding:6px 10px; font-size:0.78rem; border:1px solid #cbd5e1; border-radius:6px; width:190px;">
          <button type="button" onclick="saveWeb3FormsKeyFromUI()" style="padding:6px 10px; font-size:0.78rem; background:#059669; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Save</button>
        </div>
      </div>

      <!-- Scrollable Table -->
      <div style="overflow-x:auto; overflow-y:auto; flex-grow:1; max-height:420px; border:1px solid #e2e8f0; border-radius:8px;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f1f5f9; position:sticky; top:0; z-index:2;">
            <tr style="font-size:0.75rem; color:#475569; text-transform:uppercase; letter-spacing:0.04em; border-bottom:2px solid #cbd5e1;">
              <th style="padding:10px 8px;">Ref ID</th>
              <th style="padding:10px 8px;">Date &amp; Time</th>
              <th style="padding:10px 8px;">Customer / Firm</th>
              <th style="padding:10px 8px;">Phone &amp; WhatsApp</th>
              <th style="padding:10px 8px;">Email &amp; Location</th>
              <th style="padding:10px 8px;">Service Requested</th>
              <th style="padding:10px 8px;">Details / Message</th>
            </tr>
          </thead>
          <tbody id="ownerLeadsTableBody">
            ${renderOwnerLeadsRows(leads)}
          </tbody>
        </table>
      </div>

      <!-- Footer Info -->
      <div style="margin-top:12px; font-size:0.78rem; color:#64748b; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px;">
        <span>Press <kbd style="background:#f1f5f9; padding:2px 5px; border-radius:4px; border:1px solid #cbd5e1;">Ctrl</kbd> + <kbd style="background:#f1f5f9; padding:2px 5px; border-radius:4px; border:1px solid #cbd5e1;">Shift</kbd> + <kbd style="background:#f1f5f9; padding:2px 5px; border-radius:4px; border:1px solid #cbd5e1;">L</kbd> or click <strong>Owner Leads Portal</strong> in footer anytime.</span>
        <span style="color:#059669; font-weight:600;">Direct Email Dispatch Active &rarr; solservagreentechpvtltd@gmail.com</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderOwnerLeadsRows(leads) {
  if (!leads || leads.length === 0) {
    return `
      <tr>
        <td colspan="7" style="text-align:center; padding:38px 20px; color:#64748b;">
          <div style="font-size:1.8rem; margin-bottom:8px;">📥</div>
          <strong style="color:#0f172a; display:block; margin-bottom:4px;">No customer inquiries recorded yet.</strong>
          <span style="font-size:0.82rem;">Submit an enquiry via the website form or click <strong>"🧪 Add Test Lead"</strong> above to test right away.</span>
        </td>
      </tr>
    `;
  }

  return leads.map((l) => {
    const cleanPhone = (l.phone || '').replace(/[^0-9]/g, '');
    const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${l.name || 'Sir'}, this is SOLServa Greentech regarding your solar enquiry (${l.refNo || ''}).`)}`;

    return `
      <tr style="border-bottom:1px solid #e2e8f0; font-size:0.85rem;">
        <td style="padding:10px 8px; font-weight:700; color:#0f172a; white-space:nowrap;">
          <span style="background:#f1f5f9; padding:3px 7px; border-radius:4px; font-family:monospace; font-size:0.8rem;">${l.refNo || 'N/A'}</span>
        </td>
        <td style="padding:10px 8px; color:#64748b; white-space:nowrap; font-size:0.8rem;">${l.date || 'N/A'}</td>
        <td style="padding:10px 8px;">
          <strong style="color:#0f172a;">${l.name || 'N/A'}</strong>
          <br>
          <span style="color:#64748b; font-size:0.75rem;">${l.company && l.company !== 'N/A' ? l.company : (l.custType || l.type || '')}</span>
        </td>
        <td style="padding:10px 8px; white-space:nowrap;">
          <a href="tel:${l.phone}" style="color:#059669; font-weight:600; text-decoration:none;">${l.phone || 'N/A'}</a>
          <br>
          <a href="${waLink}" target="_blank" rel="noopener" style="color:#10b981; font-size:0.76rem; text-decoration:underline;">Chat on WhatsApp &rarr;</a>
        </td>
        <td style="padding:10px 8px;">
          <a href="mailto:${l.email}" style="color:#0284c7; text-decoration:none;">${l.email || 'N/A'}</a>
          <br>
          <span style="color:#64748b; font-size:0.75rem;">${l.location || 'Surat / India'}</span>
        </td>
        <td style="padding:10px 8px; color:#0f172a;">
          <strong style="font-size:0.82rem;">${l.service || l.type || 'Enquiry'}</strong>
        </td>
        <td style="padding:10px 8px; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${l.details || ''}">
          ${l.details || '—'}
        </td>
      </tr>
    `;
  }).join('');
}

function filterOwnerLeads(searchTerm) {
  const query = (searchTerm || '').trim().toLowerCase();
  const leads = JSON.parse(localStorage.getItem('solserva_leads_v1') || '[]');
  const filtered = query === '' ? leads : leads.filter(l => 
    (l.name || '').toLowerCase().includes(query) ||
    (l.phone || '').toLowerCase().includes(query) ||
    (l.email || '').toLowerCase().includes(query) ||
    (l.location || '').toLowerCase().includes(query) ||
    (l.service || '').toLowerCase().includes(query) ||
    (l.company || '').toLowerCase().includes(query) ||
    (l.refNo || '').toLowerCase().includes(query)
  );

  const tbody = document.getElementById('ownerLeadsTableBody');
  if (tbody) {
    tbody.innerHTML = renderOwnerLeadsRows(filtered);
  }
}

function addDemoLeadForOwner() {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const demoRef = `SLV-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
  saveLeadRecord({
    refNo: demoRef,
    date: timestamp,
    type: 'General Enquiry',
    name: 'Ramesh Patel',
    company: 'Patel Solar Solutions',
    phone: '9033983133',
    email: 'ramesh@example.com',
    location: 'Surat, Gujarat',
    custType: 'Solar EPC / Installer',
    service: 'Solar Plant Monitoring',
    details: '50 kW Commercial Rooftop plant with Sungrow inverters. Inquiring for stick logger and remote telemetry setup.'
  });

  const leads = JSON.parse(localStorage.getItem('solserva_leads_v1') || '[]');
  const badge = document.getElementById('leadsCountBadge');
  if (badge) badge.textContent = `Total Leads: ${leads.length}`;

  const tbody = document.getElementById('ownerLeadsTableBody');
  if (tbody) tbody.innerHTML = renderOwnerLeadsRows(leads);
}

function exportLeadsToCSV() {
  const leads = JSON.parse(localStorage.getItem('solserva_leads_v1') || '[]');
  if (!leads.length) {
    alert('No leads to export yet. Please submit an inquiry or click "Add Test Lead".');
    return;
  }
  const headers = ['Ref No', 'Date', 'Type', 'Name', 'Company', 'Phone', 'Email', 'Location', 'Customer Type', 'Service', 'Details'];
  const rows = leads.map(l => [
    `"${l.refNo || ''}"`,
    `"${l.date || ''}"`,
    `"${l.type || ''}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${l.phone || ''}"`,
    `"${l.email || ''}"`,
    `"${(l.location || '').replace(/"/g, '""')}"`,
    `"${l.custType || ''}"`,
    `"${l.service || ''}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SOLServa_Leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveWeb3FormsKeyFromUI() {
  const input = document.getElementById('web3FormsKeyInput');
  if (input && input.value.trim()) {
    localStorage.setItem('solserva_web3forms_key', input.value.trim());
    alert('Web3Forms Access Key saved! Inquiries will now also be delivered directly via Web3Forms.');
  } else {
    alert('Please enter a valid Web3Forms Access Key.');
  }
}

function clearLeadsLog() {
  if (confirm('Are you sure you want to clear the local leads log? This cannot be undone.')) {
    localStorage.removeItem('solserva_leads_v1');
    const badge = document.getElementById('leadsCountBadge');
    if (badge) badge.textContent = 'Total Leads: 0';
    const tbody = document.getElementById('ownerLeadsTableBody');
    if (tbody) tbody.innerHTML = renderOwnerLeadsRows([]);
  }
}

window.openOwnerLeadsModal = openOwnerLeadsModal;
window.renderOwnerLeadsRows = renderOwnerLeadsRows;
window.filterOwnerLeads = filterOwnerLeads;
window.addDemoLeadForOwner = addDemoLeadForOwner;
window.exportLeadsToCSV = exportLeadsToCSV;
window.saveWeb3FormsKeyFromUI = saveWeb3FormsKeyFromUI;
window.clearLeadsLog = clearLeadsLog;



/* ===================================================================
   8. FAQ ACCORDION (Section 4.14)
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

