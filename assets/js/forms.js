/**
 * SOLSERVA GREENTECH - FORMS, TICKETS & ACCORDION MODULE
 */
/* ===================================================================
   7. FORM SUBMISSIONS (Section 5 Reusable Forms)
   =================================================================== */
function initFormSubmissions() {
  // 5.1 General Enquiry Form
  const genForm = document.getElementById('generalEnquiryForm');
  if (genForm) {
    genForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('genName')?.value?.trim() || '';
      const phone = document.getElementById('genPhone')?.value?.trim() || '';
      const email = document.getElementById('genEmail')?.value?.trim() || '';
      const location = document.getElementById('genLocation')?.value?.trim() || '';
      const custType = document.getElementById('genCustomerType')?.value || '';
      const srv = document.getElementById('genServiceRequired')?.value || '';
      const msg = document.getElementById('genMessage')?.value?.trim() || '';

      const refNo = `SLV-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('genStatusMsg');

      const waText = `*New SOLServa Service Enquiry (${refNo})*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Location:* ${encodeURIComponent(location)}%0A` +
        `*Customer Type:* ${encodeURIComponent(custType)}%0A` +
        `*Service:* ${encodeURIComponent(srv)}%0A` +
        `*Details:* ${encodeURIComponent(msg || 'General consultation requested.')}`;

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:14px; border-radius:8px;">
            <strong>✓ Enquiry Logged Successfully (Ref: ${refNo})</strong>
            <p style="font-size:0.85rem; margin:6px 0 10px;">Our technical team will review your requirements and reach out within 24 hours.</p>
            <a href="https://wa.me/919033983133?text=${waText}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; padding:8px 14px; font-size:0.85rem;">
              Connect Instantly on WhatsApp &rarr;
            </a>
          </div>
        `;
      }
      genForm.reset();
    });
  }

  // 5.2 Plant Compatibility Form
  const compatForm = document.getElementById('compatForm');
  if (compatForm) {
    compatForm.addEventListener('submit', (e) => {
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

      const waText = `*SOLServa Plant Compatibility Request (${refNo})*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Contact:* ${encodeURIComponent(contact)}%0A` +
        `*Location:* ${encodeURIComponent(loc)}%0A` +
        `*Plant Type:* ${encodeURIComponent(plantType)}%0A` +
        `*Capacity:* ${encodeURIComponent(cap)}%0A` +
        `*Inverter Model:* ${encodeURIComponent(brand)}%0A` +
        `*Required Service:* ${encodeURIComponent(srv)}`;

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:14px; border-radius:8px;">
            <strong>✓ Compatibility Request Registered (Ref: ${refNo})</strong>
            <p style="font-size:0.85rem; margin:6px 0 10px;">We are checking our database for ${brand}. You can also send inverter nameplate photos on WhatsApp:</p>
            <a href="https://wa.me/919033983133?text=${waText}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; padding:8px 14px; font-size:0.85rem;">
              Send Details to Technical Desk &rarr;
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
    epcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const comp = document.getElementById('epcCompName')?.value?.trim() || '';
      const person = document.getElementById('epcContactPerson')?.value?.trim() || '';
      const email = document.getElementById('epcEmail')?.value?.trim() || '';
      const phone = document.getElementById('epcPhone')?.value?.trim() || '';
      const portfolio = document.getElementById('epcPortfolioSize')?.value?.trim() || '';
      const model = document.getElementById('epcModel')?.value || '';

      const refNo = `SLV-EPC-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('epcStatusMsg');

      const waText = `*SOLServa EPC Partner Application (${refNo})*%0A%0A` +
        `*Company:* ${encodeURIComponent(comp)}%0A` +
        `*Contact Person:* ${encodeURIComponent(person)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Portfolio Size:* ${encodeURIComponent(portfolio)}%0A` +
        `*Preferred Model:* ${encodeURIComponent(model)}`;

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#064e3b; padding:14px; border-radius:8px;">
            <strong>✓ Partner Application Received (Ref: ${refNo})</strong>
            <p style="font-size:0.85rem; margin:6px 0 10px;">Our partnership coordinator will review your portfolio details and schedule a presentation.</p>
            <a href="https://wa.me/919033983133?text=${waText}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; padding:8px 14px; font-size:0.85rem;">
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
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cust = document.getElementById('ticketCustomer')?.value?.trim() || '';
      const contact = document.getElementById('ticketContact')?.value?.trim() || '';
      const plantId = document.getElementById('ticketPlantId')?.value?.trim() || 'N/A';
      const loc = document.getElementById('ticketLocation')?.value?.trim() || '';
      const cat = document.getElementById('ticketCategory')?.value || '';
      const desc = document.getElementById('ticketDesc')?.value?.trim() || '';

      const ticketNo = `SLV-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      const statusBox = document.getElementById('ticketStatusMsg');

      const waText = `*SOLServa Fault Ticket Raised (${ticketNo})*%0A%0A` +
        `*Customer/Firm:* ${encodeURIComponent(cust)}%0A` +
        `*Phone:* ${encodeURIComponent(contact)}%0A` +
        `*Plant ID:* ${encodeURIComponent(plantId)}%0A` +
        `*Location:* ${encodeURIComponent(loc)}%0A` +
        `*Issue Category:* ${encodeURIComponent(cat)}%0A` +
        `*Details:* ${encodeURIComponent(desc)}`;

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="background:#fffbeb; border:1px solid #f59e0b; color:#92400e; padding:14px; border-radius:8px;">
            <strong>✓ Ticket Logged: ${ticketNo} [Status: New &rarr; Acknowledged]</strong>
            <p style="font-size:0.85rem; margin:6px 0 10px;">Assigned to Technical On-Call Engineer. For urgent grid trips, please ping directly on WhatsApp with ticket ID:</p>
            <a href="https://wa.me/919033983133?text=${waText}" target="_blank" rel="noopener" class="btn btn-solar" style="display:inline-flex; padding:8px 14px; font-size:0.85rem;">
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

