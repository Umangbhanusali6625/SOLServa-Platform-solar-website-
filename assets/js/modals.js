/**
 * SOLSERVA GREENTECH - MODALS & EXECUTIVE BIOS MODULE
 */
/* ===================================================================
   2. MODALS MANAGEMENT
   =================================================================== */
function openModal(modalId) {
  if (modalId === 'legalModal_disclaimer' && !document.getElementById('legalModal_disclaimer')) {
    modalId = 'legalModal_scope';
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  if (modalId === 'legalModal_disclaimer' && !document.getElementById('legalModal_disclaimer')) {
    modalId = 'legalModal_scope';
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function initModalBackdrops() {
  // Close on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = 'auto';
    }
  });
}

// Make accessible to inline onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;


/* ===================================================================
   6. VERIFIED TEAM MEMBERS DATA & MODAL
   =================================================================== */
const teamMembersData = {
  yogesh_eng: {
    name: "Yogeshkumar Savaliya",
    designation: "Founder & Senior Electrical Consultant | Solserva Greentech Pvt. Ltd.",
    qualifications: "Chartered Engineer | Senior Electrical Engineer | 20+ Years Experience",
    image: "assets/images/Yogesh Savaliya.png",
    overview: `Yogeshkumar Savaliya is a Chartered Engineer and Senior Electrical Engineer with more than 20 years of international and domestic experience in power distribution network planning, operation, and maintenance.

He has long served with the Electricity and Water Authority, Kingdom of Bahrain, where his portfolio covers power network development, primary substation and high-voltage cable projects, and grid connection of solar plants. He combines deep engineering mastery with project finance and is a certified Member of the Institution of Valuers, India, in Plant & Machinery.`,
    expertise: [
      "Power Distribution Network Planning & High-Voltage Systems",
      "Grid Connection & Synchronization of Solar Plants",
      "Substation & HT/LT Cable Infrastructure Engineering",
      "Technical Due Diligence & Solar Asset Valuation",
      "Chartered Engineer (India) - Institution of Engineers (India) (M-1845173)",
      "Project Management Professional (PMP - Member ID 2775760)",
      "Life Associate Member - Institution of Valuers (India) (A-33729)",
      "Bachelor of Engineering (B.E.), Electrical Engineering",
      "Master of Business Administration (MBA) - Project & Power Management"
    ],
    philosophy: `"Engineering precision and rigorous power grid standards are the foundation of true green energy reliability."`
  },
  pragnesh: {
    name: "Pragneshkumar Dineshbhai Savaliya",
    designation: "Quality Head | Solserva Greentech Pvt. Ltd.",
    qualifications: "Mechanical Engineering | Quality Management | 16+ Years Experience",
    image: "assets/images/Pragnesh Savaliya.png",
    overview: `A mechanical engineering professional with over 16 years of specialized industrial experience in Quality Management Systems (QMS), quality assurance, precision engineering, and process standardization.

At Solserva Greentech Pvt. Ltd., he oversees structural integrity, mounting hardware compliance, supplier quality benchmarking, and technical performance standardization.`,
    expertise: [
      "Quality Management Systems (QMS) & Standardization",
      "Mechanical Structural Integrity & Solar Mounting Rigidity",
      "Supplier Quality Benchmarking & Component Inspection",
      "Process Standardization & Operational Defect Minimization",
      "Technical Documentation & Lifecycle Quality Audits",
      "Root Cause Analysis & Continuous Process Improvement",
      "Customer Satisfaction & Long-term Mechanical Reliability"
    ],
    philosophy: `"Delivering excellence through quality, precision, continuous improvement, and engineering innovation."`
  },
  kirit: {
    name: "Kiritkumar Dineshbhai Savaliya",
    designation: "Managing Director | Solserva Greentech Pvt. Ltd.",
    qualifications: "Chartered Accountant (CA) | 16+ Years Industry Experience",
    image: "assets/images/Kirit Savaliya.png",
    overview: `A qualified Chartered Accountant with over 16 years of extensive experience in corporate finance, financial management, taxation, corporate governance, and strategic business advisory.

As Managing Director at Solserva Greentech Pvt. Ltd., he brings strong financial expertise, commercial insight, and strategic leadership to the company's renewable energy business operations. His professional approach focuses on financial discipline, operational efficiency, risk management, and sustainable business growth.`,
    expertise: [
      "Corporate Finance & Financial Management",
      "Strategic Financial Planning & Business Advisory",
      "Financial Analysis & Investment Evaluation",
      "Cost Optimization & Profitability Management",
      "Taxation, Compliance & Corporate Governance",
      "Financial Risk Assessment & Management",
      "Solar Project Financial Feasibility & ROI Analysis",
      "Renewable Energy Project Economics",
      "Business Development & Sustainable Growth Strategy"
    ],
    philosophy: `"Driving sustainable growth through financial excellence, strategic vision, and clean energy innovation."`
  },
  hitesh: {
    name: "Adv. Hiteshbhai Devrajbhai Maniya",
    designation: "Managing Director | Solserva Greentech Pvt. Ltd.",
    qualifications: "Advocate | Legal & Corporate Advisory Professional | 18+ Years Experience",
    image: "assets/images/Hitesh Maniya.jpeg",
    overview: `An experienced Advocate with over 18 years of professional experience in the legal and statutory sector, bringing extensive knowledge of corporate legal advisory, regulatory compliance, legal documentation, contractual matters, and commercial business laws.

As Managing Director at Solserva Greentech Pvt. Ltd., he anchors regulatory compliance, DISCOM sanctions, contractual safeguards, corporate governance, and ethical corporate integrity for clean energy developments.`,
    expertise: [
      "Legal Advisory & Strategic Corporate Consultation",
      "Corporate Legal Affairs & Regulatory Compliance",
      "Contract Drafting, Review & Project Documentation",
      "Business Agreements & Commercial Legal Matters",
      "Legal Risk Assessment & Mitigation",
      "Corporate Governance & Legal Due Diligence",
      "Commercial Negotiations & Dispute Management",
      "Renewable Energy Project Legal & DISCOM Considerations",
      "Business Compliance & Strategic Decision Support"
    ],
    philosophy: `"Building sustainable business growth through legal integrity, strategic vision, and professional excellence."`
  },
  yogesh_ops: {
    name: "Yogesh Vallabhbhai Chovatiya",
    designation: "Director & Operations Head | Solserva Greentech Pvt. Ltd.",
    qualifications: "Engineering & Industrial Management Professional | 14+ Years Experience",
    image: "assets/images/Yogesh Chovatiya.png",
    overview: `An experienced engineering and industrial operations professional with over 14 years of hands-on expertise in quality management, production planning, supply-chain stores, and industrial fire safety systems.

He oversees Solserva Greentech's operational discipline, vendor inventory quality checks, on-site workforce safety protocols, and execution timeliness.`,
    expertise: [
      "Quality Assurance & In-process Inspection Systems",
      "Production Planning, Scheduling & Operational Monitoring",
      "Store & Inventory Traceability & Component Reconciliation",
      "Fire Safety & Industrial Occupational Health Management",
      "Defect Root Cause Analysis & Corrective Actions",
      "Workforce Safety Standards & Emergency Preparedness",
      "Resource Utilization & Lean Process Execution"
    ],
    philosophy: `"Quality in every product, efficiency in every process, accuracy in every inventory movement, and safety in every operation."`
  },
  suresh: {
    name: "Sureshbhai Kachhadiya",
    designation: "Technical Head | Solserva Greentech Pvt. Ltd.",
    qualifications: "Electronics and Communication Engineer | 18 Years Vodafone Idea Experience | Solar IoT Specialist",
    image: "assets/images/Sureshbhai Kachhadiya.png",
    overview: `With an academic background in Electronics and Communication Engineering and 18 years of high-level professional experience at Vodafone Idea Ltd., Sureshbhai Kachhadiya brings an unparalleled foundation in telecommunications infrastructure, hardware/software fault diagnosis, IoT data pipelines, and remote connectivity.

His mission is to pioneer intelligent IoT and telemetry for the solar industry, enabling EPC contractors, manufacturers, and plant owners to have real-time visibility and predictive fault diagnostics.`,
    expertise: [
      "Hardware & Software Troubleshooting & Diagnostic Rectification",
      "18 Years Telecom Infrastructure Experience at Vodafone Idea Ltd.",
      "IoT Communication Architecture for Solar Inverters & Weather Stations",
      "Solar Production Data Monitoring & Cloud Telemetry Logging",
      "AI-Driven Solar Generation Data Analysis & Anomaly Detection",
      "Specialized Solutions for Solar EPCs, Panel Manufacturers & Plant Owners",
      "Remote Performance Ratio (PR) Tracking & Rapid Fault Alerting",
      "System-Level Reliability & Continuity Engineering"
    ],
    philosophy: `"Connecting Technology. Enabling Solar Intelligence."`
  },
  hardik: {
    name: "Hardik Ratibhai Radadiya",
    designation: "Electrical Head | Solserva Greentech Pvt. Ltd.",
    qualifications: "Electrical Engineer | 16+ Years Experience",
    image: "assets/images/Hardik Radadiya.png",
    overview: `Hardik Ratibhai Radadiya serves as the Electrical Head at Solserva Greentech Pvt. Ltd., bringing 16 years of deep electrical engineering expertise to the forefront of solar data intelligence. Instead of physical installations, Hardik Ratibhai Radadiya directs the technical architecture behind the company's advanced data monitoring, performance analytics, and predictive maintenance services, ensuring solar assets worldwide operate at peak efficiency.

Graduating as an Electrical Engineer in 2010, Hardik Ratibhai Radadiya spent the foundational years of his career mastering electrical power systems. As the renewable sector evolved, he recognized that the future of solar efficiency lay in data. Over the past 16 years, Hardik Ratibhai Radadiya transitioned his core electrical knowledge into the digital space, becoming an expert in solar asset performance management and data-driven optimization.`,
    expertise: [
      "Solar Telemetry & Monitoring: Designing and deploying IoT-based data acquisition systems to track real-time solar plant performance",
      "Performance Analytics: Utilizing electrical engineering principles to analyze generation data, detect degradation, and minimize downtime",
      "Smart Grid & SCADA Systems: Integrating Supervisory Control and Data Acquisition (SCADA) systems for seamless cloud-based data reporting",
      "Root-Cause Fault Diagnosis: Leading technical audits to identify underperformance issues, inverter inefficiencies, and grid anomalies",
      "Solar Asset Performance Management & Data-Driven Optimization",
      "Electrical Power Systems & Predictive Maintenance Architecture"
    ],
    philosophy: `"Hardware only generates power; data optimizes it. At Solserva Greentech, we transform raw solar metrics into actionable intelligence, ensuring our clients maximize every single ray of sunlight."`
  }
};

function openBioModal(memberKey) {
  const data = teamMembersData[memberKey];
  if (!data) return;

  const modalBody = document.getElementById('bioModalBody');
  const modalTitle = document.getElementById('bioModalTitle');

  if (modalTitle) modalTitle.textContent = `${data.name} — Profile`;

  const expertiseHtml = data.expertise.map(exp => `<li style="margin-bottom:6px;">✔ ${exp}</li>`).join('');

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; margin-bottom:20px;">
        <img src="${data.image}" alt="${data.name}" style="width:130px; height:150px; object-fit:cover; border-radius:12px; box-shadow:var(--shadow-md); border:1px solid var(--border-light);">
        <div style="flex:1; min-width:240px;">
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${data.designation}</div>
          <h3 style="font-size:1.35rem; color:var(--text-dark); margin:4px 0 8px;">${data.name}</h3>
          <div style="font-size:0.88rem; font-weight:600; color:var(--text-muted); background:var(--bg-alt); padding:6px 12px; border-radius:6px; display:inline-block;">${data.qualifications}</div>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:1.05rem; color:var(--text-dark); border-bottom:2px solid var(--primary-light); padding-bottom:6px; margin-bottom:10px;">Professional Overview</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.65; white-space:pre-line;">${data.overview}</p>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:1.05rem; color:var(--text-dark); border-bottom:2px solid var(--primary-light); padding-bottom:6px; margin-bottom:10px;">Areas of Expertise & Competencies</h4>
        <ul style="font-size:0.88rem; color:var(--text-dark); line-height:1.5; display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:6px;">
          ${expertiseHtml}
        </ul>
      </div>

      <div style="background:var(--primary-light); border-left:4px solid var(--primary); padding:14px 18px; border-radius:6px;">
        <div style="font-size:0.75rem; font-weight:800; color:var(--primary); text-transform:uppercase;">Professional Philosophy</div>
        <div style="font-size:0.92rem; font-style:italic; font-weight:600; color:#064e3b; margin-top:2px;">${data.philosophy}</div>
      </div>
    `;
  }

  openModal('bioModal');
}
window.openBioModal = openBioModal;

