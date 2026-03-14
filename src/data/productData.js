import {
    Users, Activity, Shield, FileText, Database, Fingerprint,
    CalendarDays, Pill, Receipt, FlaskConical, BedDouble,
    Zap, Lock, ClipboardList, Microchip, Layers, Banknote, ShieldAlert
} from 'lucide-react';

export const PRODUCT_DATA = {
    'patient-emr': {
        title: 'Electronic Medical Records (EMR)',
        tagline: 'The single source of truth for patient history.',
        desc: 'Replace fragmented paper records with a unified, digital-first EMR. Designed for clinical speed, our EMR gives doctors complete context—allergies, past visits, lab trends, and prescriptions—in a single, secure glance.',
        icon: Users,
        stats: [
            { label: 'Avg Profile Retrieval Time', value: '< 200ms' },
            { label: 'Compliance Readines', value: '100%' },
            { label: 'Paper Eliminated', value: '80kg/yr' },
        ],
        features: [
            { title: 'Unified Patient Profiles', desc: 'Auto-generate unique Health IDs. Access demographics, insurance, and medical history in one secure place.', icon: Users },
            { title: 'Smart SOAP Notes', desc: 'Customizable templates for Subjective, Objective, Assessment, and Plan notes to drastically speed up documentation.', icon: FileText },
            { title: 'Allergy & Chronic Alerts', desc: 'Visual warnings and hard stops for severe allergies, drug interactions, and chronic conditions to ensure patient safety.', icon: Activity },
            { title: 'ICD-10 Integration', desc: 'Built-in ICD-10 search for accurate standardized diagnosis coding, drastically reducing insurance claim rejections.', icon: Database },
            { title: 'S3 Document Vault', desc: 'Securely upload and view historical paper records, external MRI scans, and lab reports directly attached to the patient profile.', icon: Shield },
            { title: 'Comprehensive Audit Logs', desc: 'Every view, edit, or download of a patient record is logged and timestamped for strict HIPAA compliance and accountability.', icon: Fingerprint }
        ],
        workflow: [
            { step: '01', title: 'Patient Onboarding', desc: 'Front desk creates a profile and issues a unique Patient ID card within seconds.' },
            { step: '02', title: 'Vitals Entry', desc: 'Nursing staff records height, weight, BP, pulse, and temperature directly into the real-time chart.' },
            { step: '03', title: 'Doctor Consultation', desc: 'Physician reviews the timeline, adds comprehensive SOAP notes, and locks the final diagnosis.' },
            { step: '04', title: 'Continuity of Care', desc: 'All future follow-ups automatically trace back to this master record for ongoing clinical context.' }
        ]
    },
    'opd-module': {
        title: 'Outpatient Department (OPD)',
        tagline: 'Keep your clinic moving without the paperwork.',
        desc: 'Streamline Outpatient Department workflows with intelligent queue management, rapid digital prescription building, cross-departmental referrals, and seamless billing integration to dramatically reduce patient wait times.',
        icon: CalendarDays,
        stats: [
            { label: 'Patient Processing Time', value: 'Reduced 40%' },
            { label: 'Prescription Speed', value: '< 30s' },
            { label: 'Queue Abandonment', value: 'Down 65%' },
        ],
        features: [
            { title: 'Token & Queue System', desc: 'Real-time digital token generation and display board integration to manage waiting rooms effectively.', icon: Layers },
            { title: 'Auto-Billing Sync', desc: 'Registration automatically triggers OPD consultation charges in the billing system—no duplicate entry.', icon: Receipt },
            { title: 'Digital Prescription Builder', desc: 'Search formulary and click to prescribe with auto-dosage instructions, and direct push to the pharmacy.', icon: Pill },
            { title: 'Lab Orders & e-Requisitions', desc: 'Doctors can order 10+ lab tests with a single custom panel click, instantly alerting the diagnostic lab.', icon: FlaskConical },
            { title: 'Multi-Doctor Referrals', desc: 'Frictionless internal handoffs. Send a patient from General Medicine to Orthopedics without re-registration.', icon: Users },
            { title: 'Follow-Up Schedulers', desc: 'Automatically plot the patient’s next visit date and send WhatsApp/SMS reminders to boost retention.', icon: CalendarDays }
        ],
        workflow: [
            { step: '01', title: 'Registration & Token', desc: 'Patient checks in at front desk, pays the consultation fee, and receives a queue token.' },
            { step: '02', title: 'Pre-Consultation Vitals', desc: 'Nurses capture primary vitals before the patient enters the consulting room.' },
            { step: '03', title: 'Clinical Assessment', desc: 'Doctor reviews records, prescribes drugs, and advises immediate lab tests via the interface.' },
            { step: '04', title: 'Next Steps Routing', desc: 'Patient seamlessly flows to Pharmacy or Lab with their ID—no paper prescription slip needed.' }
        ]
    },
    'ipd-wards': {
        title: 'IPD & Wards Management',
        tagline: 'Intelligent oversight for inpatient care.',
        desc: 'Eliminate overbooking and chaotic night shifts. Manage bed allocation visibly in real-time. Coordinate nursing stations, hourly vitals checking, and create extensive discharge summaries that impress patients.',
        icon: BedDouble,
        stats: [
            { label: 'Discharge Summary Speed', value: '3x Faster' },
            { label: 'Bed Utilization Rate', value: 'Optimized' },
            { label: 'Billing Discrepancies', value: 'Zero' },
        ],
        features: [
            { title: 'Visual Bed Allocation', desc: 'Click-to-assign interactive floor plans. View vacant, occupied, or maintenance beds across all wards instantly.', icon: BedDouble },
            { title: 'Dedicated Nursing Station', desc: 'Centralized dashboards for nurses to monitor hourly PRN medications, vitals trends, and doctor orders.', icon: ClipboardList },
            { title: 'Dietary & Kitchen Routing', desc: 'Log patient dietary restrictions and automatically generate ward-wise meal plans for the hospital kitchen.', icon: Activity },
            { title: 'Surgical OT Scheduling', desc: 'Book Operating Theaters, assign anesthesiologists, and block specific inventory for upcoming surgeries.', icon: CalendarDays },
            { title: 'Continuous Billing Engine', desc: 'Room rent, procedural costs, and ward pharmacy items are silently tallied daily attached to the final IPD folio.', icon: Banknote },
            { title: '1-Click Discharge Summaries', desc: 'Pull the patient’s entire stay journey—labs, vitals, procedures—into an elegant, printable discharge PDF.', icon: FileText }
        ],
        workflow: [
            { step: '01', title: 'Admission Request', desc: 'OPD doctor initiates an IPD request. Reception clears financial deposits and allocates an available bed.' },
            { step: '02', title: 'Ward Integration', desc: 'Patient transitions to the assigned ward. Floor nurse acknowledges and begins the daily care plan.' },
            { step: '03', title: 'Daily Care & Monitoring', desc: 'Doctors conduct rounds, logging daily notes and placing orders. Nurses execute medications and document vitals.' },
            { step: '04', title: 'Discharge & Final Bill', desc: 'Doctor initiates discharge. Billing generates the final invoice, subtracting deposits, releasing the bed instantly.' }
        ]
    },
    'laboratory': {
        title: 'Laboratory Management System (LMS)',
        tagline: 'Velocity and absolute precision for diagnostics.',
        desc: 'End-to-end laboratory operations designed to eliminate human error. From barcode sample tracking and machine interfacing to automated reference-range highlighting and secure SMS result dispatch.',
        icon: FlaskConical,
        stats: [
            { label: 'Report Dispatch Errors', value: '0%' },
            { label: 'Turnaround Time', value: 'Cut by 50%' },
            { label: 'Report Format', value: '100% Digital PDF' },
        ],
        features: [
            { title: 'Barcode Sample Tracking', desc: 'Generate linear and 2D barcodes at the draw station to ensure rigid chain-of-custody for every vial.', icon: Fingerprint },
            { title: 'Custom Test Panels', desc: 'Bundle individual tests into packages (e.g., Master Health Checkup) with dynamic, algorithmic pricing.', icon: Layers },
            { title: 'Reference Range Automation', desc: 'System automatically flags abnormal and critical values in bold red, alerting the prescribing physician instantly.', icon: ShieldAlert },
            { title: 'Outsourced Test Handling', desc: 'Easily track samples sent to third-party labs, capturing their inbound costs and your hospital’s markup.', icon: Activity },
            { title: 'Machine Integration Ready', desc: 'Support for interfacing with bi-directional auto-analyzers to pull results straight into the software without typing.', icon: Zap },
            { title: 'Patient SMS Dispatch', desc: 'Once the pathologist approves the report, patients receive a secure link to download their PDF via WhatsApp or SMS.', icon: FileText }
        ],
        workflow: [
            { step: '01', title: 'Requisition & Billing', desc: 'Patient arrives with OPD order. Billing collects payment to unblock the lab request.' },
            { step: '02', title: 'Phlebotomy & Barcode', desc: 'Technician draws sample, applies generated barcode, and routes it to the specific processing bench.' },
            { step: '03', title: 'Result Finalization', desc: 'Results enter the system, undergoing validation and pathologist digital signature approval.' },
            { step: '04', title: 'Instant Distribution', desc: 'Report is securely attached to the EMR for the doctor and dispatched to the patient’s phone.' }
        ]
    },
    'pharmacy': {
        title: 'Hospital Pharmacy Management',
        tagline: 'Keep your stock strictly controlled and fully stocked.',
        desc: 'Smart inventory tracking, automatic low-stock alerts, rigid expiry management, and integrated POS. Nexora prevents drug leakage and maximizes pharmacy profitability without the headache.',
        icon: Pill,
        stats: [
            { label: 'Inventory Leakage', value: 'Reduced to 0' },
            { label: 'Billing Speed', value: 'Under 10s' },
            { label: 'Expiry Waste', value: 'Minimized' },
        ],
        features: [
            { title: 'Integrated OPD Dispensing', desc: 'When a doctor prescribes in OPD, the pharmacy sees it instantly. Just verify, pack, and print the bill.', icon: Zap },
            { title: 'Stock & Batch Tracking', desc: 'Strict tracking of items down to the batch and serial number. First-In-First-Out (FIFO) logic prevents expiry waste.', icon: Layers },
            { title: 'Low Stock Auto-Alerts', desc: 'Set minimum threshold levels. Receive dashboard and email alerts when critical drugs fall below safety stock.', icon: ShieldAlert },
            { title: 'Supplier & Purchase Orders', desc: 'Generate standard POs for distributors, track inbound GRNs, and manage vendor ledgers all in one place.', icon: FileText },
            { title: 'Narcotics & Audit Controls', desc: 'Stringent dual-factor authentication required for dispensing scheduled drugs and locked-down audit trails.', icon: Lock },
            { title: 'GST Pharmacy Billing', desc: 'Barcode-scanner ready POS system applying precise SGST/CGST on HSN codes with seamless return handling.', icon: Receipt }
        ],
        workflow: [
            { step: '01', title: 'Procurement', desc: 'System alerts low stock. Procurement team sends PO to supplier and logs incoming GRN.' },
            { step: '02', title: 'Shelving & Batching', desc: 'Drugs enter inventory with precise expiry dates and are placed accurately in the master stock.' },
            { step: '03', title: 'Instant Dispensing', desc: 'Patient arrives at counter. Pharmacist scans drugs to fulfill the doctor\'s digital prescription immediately.' },
            { step: '04', title: 'Stock Deduction', desc: 'Completing the sale triggers instant deduction from master stock and records the financial transaction.' }
        ]
    },
    'billing-finance': {
        title: 'Billing & Financial Management',
        tagline: 'No leaks. Complete commercial control.',
        desc: 'GST-compliant invoicing, robust insurance claims processing, multi-branch revenue tracking, and secure payment gateway integrations. Bring strict fiscal accountability to every department in your hospital.',
        icon: Receipt,
        stats: [
            { label: 'Revenue Leakage', value: 'Blocked' },
            { label: 'Tally Integrations', value: 'Export Ready' },
            { label: 'Financial Audits', value: 'Simplfied' },
        ],
        features: [
            { title: 'Unified Patient Folio', desc: 'A central ledger tracking every charge a patient accrues across OPD, IPD, Pharmacy, and Diagnostics.', icon: FileText },
            { title: 'TPA & Insurance Claims', desc: 'Manage copays, deductibles, pre-authorizations, and track the status of bulk insurance claims.', icon: Shield },
            { title: 'Multi-Tiered Pricing', desc: 'Configure different rate charts for general ward versus private suites, or VIP patients vs standard consultations.', icon: Layers },
            { title: 'GST Auto-Computation', desc: 'Define HSN/SAC codes for services. The system auto-calculates SGST, CGST, and IGST for rigorous tax compliance.', icon: Receipt },
            { title: 'Refunds & Credit Notes', desc: 'Secure, maker-checker authorization workflows required to process any financial refunds or bill modifications.', icon: Lock },
            { title: 'Digital Payment Gateways', desc: 'Send UPI payment links to patients or capture Razorpay/Stripe payments directly within the hospital portal.', icon: Zap }
        ],
        workflow: [
            { step: '01', title: 'Charge Capturing', desc: 'Every service performed across departments pushes a financial charge silently to the patient folio.' },
            { step: '02', title: 'Insurance Processing', desc: 'Billing desk splits the bill between the patient copay and the insurance TPA limits.' },
            { step: '03', title: 'Final Settlement', desc: 'Patient settles the remaining balance via cash, card, or UPI. A clean, itemized tax invoice is printed.' },
            { step: '04', title: 'Revenue Reporting', desc: 'End of day, management views a consolidated dashboard breaking down income by department and doctor.' }
        ]
    }
};
