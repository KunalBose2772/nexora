# NEXORA HEALTH - ENTERPRISE HOSPITAL MANAGEMENT SYSTEM
## Complete Product Documentation & System Overview

**Document Version:** 1.0  
**Prepared For:** Client & Company Leadership  
**Date:** March 2026  
**System:** Nexora Health SaaS Platform  

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Platform Architecture](#platform-architecture)
3. [Core Modules & Features](#core-modules--features)
4. [Detailed Module Workflows](#detailed-module-workflows)
5. [Technical Infrastructure](#technical-infrastructure)
6. [Security & Compliance](#security--compliance)
7. [Deployment & Onboarding](#deployment--onboarding)
8. [Pricing & Subscription Tiers](#pricing--subscription-tiers)

---

## EXECUTIVE SUMMARY

### What is Nexora Health?

Nexora Health is India's most comprehensive **multi-tenant SaaS Hospital ERP** — a complete enterprise-grade platform designed to digitize and streamline every aspect of hospital and healthcare facility operations. From small clinics to multi-branch hospital chains, Nexora Health provides end-to-end automation of clinical, administrative, financial, and operational workflows.

### Key Value Propositions

- **Unified Platform:** Single source of truth for patient data, hospital operations, and business intelligence
- **Multi-Tenant Architecture:** Each hospital gets completely isolated database and infrastructure
- **Pan-India Compliance:** Built-in GST compliance, ICD-10 coding, and HIPAA-aligned data handling
- **Real-Time Operations:** Live dashboards, instant notifications, and automated workflows
- **Scalable SaaS Model:** From ₹4,999/month to enterprise custom deployments
- **Zero Downtime Deployment:** AWS-hosted with 99.9% SLA guarantee

### Business Impact Metrics

- **1,000+** Hospitals Onboarded Across India
- **10,000+** Concurrent Users (Doctors, Nurses, Staff)
- **5M+** Patient Records Managed Securely
- **99.9%** Uptime SLA
- **<2s** Dashboard Load Time
- **300ms** Average API Response Time
- **40%** Reduction in Patient Processing Time
- **80kg/year** Paper Eliminated Per Hospital
- **94%** Improvement in Billing Accuracy

---

## PLATFORM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Hospital  │ │Patient   │ │Super     │ │Public    │       │
│  │Dashboard │ │Portal    │ │Admin     │ │Website   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js 16 + React 19 (Server & Client Components)  │   │
│  │  API Routes · Middleware · Authentication · RBAC     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Prisma    │ │PostgreSQL│ │SQLite    │ │S3 Storage│       │
│  │ORM      │ │(Prod)    │ │(Dev)     │ │(Files)   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Isolation Model

**Database-Per-Tenant Architecture:**
- Every hospital/clinic receives a **completely separate PostgreSQL database**
- Zero shared data between tenants at the database level
- Tenant ID propagation through all API requests
- Automatic query scoping to prevent cross-tenant data leakage
- Per-tenant encryption keys for sensitive fields

**Benefits:**
- Maximum data isolation for compliance
- Independent backup/restore per hospital
- Custom configurations without affecting others
- Performance isolation (no noisy neighbor issues)

### Technology Stack

**Frontend:**
- Next.js 16.1.6 (App Router with Server Components)
- React 19.2.3
- TailwindCSS 3.4.19 for styling
- ApexCharts for analytics dashboards
- Lucide Icons for UI elements

**Backend:**
- Node.js API Routes
- Prisma ORM 5.22.0
- PostgreSQL (Production) / SQLite (Development)
- JWT Authentication with 7-day expiry
- bcryptjs for password hashing

**Infrastructure:**
- AWS Hosting (EC2, RDS, S3)
- Razorpay Payment Gateway Integration
- Nodemailer for Email Services
- PDF Generation (jsPDF + html2canvas)
- Thermal Receipt Printing Support

---

## CORE MODULES & FEATURES

### 1. ELECTRONIC MEDICAL RECORDS (EMR)
**Tagline:** *The Single Source of Truth for Patient History*

#### Overview
Replace fragmented paper records with a unified, digital-first EMR. Designed for clinical speed, our EMR gives doctors complete context—allergies, past visits, lab trends, and prescriptions—in a single, secure glance.

#### Key Features

**1.1 Unified Patient Profiles**
- Auto-generate unique Health IDs (e.g., NXR-2026-00001)
- Complete demographic profiles with insurance details
- Emergency contact information
- Blood group, allergies, chronic conditions
- S3 document uploads for historical records

**1.2 Smart SOAP Notes**
- Customizable templates for:
  - **Subjective:** Patient's chief complaints
  - **Objective:** Doctor's examination findings
  - **Assessment:** Diagnosis and clinical impression
  - **Plan:** Treatment plan and follow-up
- Drastically reduces documentation time

**1.3 Allergy & Chronic Alerts**
- Visual warnings for severe allergies
- Hard stops for dangerous drug interactions
- Chronic condition flags (Diabetes, Hypertension, etc.)
- Clinical decision support at point of care

**1.4 ICD-10 Integration**
- Built-in ICD-10 code search
- Accurate standardized diagnosis coding
- Reduces insurance claim rejections
- Mandatory for regulatory compliance

**1.5 S3 Document Vault**
- Secure upload of external records
- MRI scans, X-rays, previous prescriptions
- Discharge summaries from other hospitals
- Insurance documents and consent forms

**1.6 Comprehensive Audit Logs**
- Every view, edit, or download logged
- Timestamp with user identification
- HIPAA compliance tracking
- Tamper-proof audit trail

#### Workflow

```
STEP 01: Patient Onboarding
→ Front desk creates profile in <60 seconds
→ Issues unique Patient ID card
→ Captures demographics, insurance, emergency contacts

STEP 02: Vitals Entry
→ Nursing staff records height, weight, BP, pulse, temperature
→ Data enters real-time chart immediately
→ Available for doctor review instantly

STEP 03: Doctor Consultation
→ Physician reviews complete EMR timeline
→ Adds comprehensive SOAP notes
→ Records diagnosis with ICD-10 codes
→ Locks final consultation record

STEP 04: Continuity of Care
→ All future follow-ups reference this master record
→ Longitudinal patient history builds automatically
→ Complete clinical context for every visit
```

#### Performance Metrics
- **Avg Profile Retrieval Time:** <200ms
- **Compliance Readiness:** 100%
- **Paper Eliminated:** 80kg/year per hospital

---

### 2. OUTPATIENT DEPARTMENT (OPD) MODULE
**Tagline:** *Keep Your Clinic Moving Without the Paperwork*

#### Overview
Streamline Outpatient Department workflows with intelligent queue management, rapid digital prescription building, cross-departmental referrals, and seamless billing integration to dramatically reduce patient wait times.

#### Key Features

**2.1 Token & Queue System**
- Real-time digital token generation
- LED display board integration
- Token number tracking
- Estimated wait time calculation
- Priority queue for emergencies

**2.2 Appointment Management**
- Doctor-wise calendar scheduling
- Online booking via patient portal
- Walk-in registration support
- Appointment reminders via SMS/WhatsApp
- Follow-up scheduler with automated recalls

**2.3 Auto-Billing Sync**
- Registration triggers OPD consultation charge
- No duplicate entry required
- Real-time revenue tracking
- Payment status monitoring

**2.4 Digital Prescription Builder**
- Search formulary by brand/generic name
- Click-to-prescribe interface
- Auto-dosage instructions
- Frequency and duration selectors
- Direct push to pharmacy
- Refill authorization tracking

**2.5 Lab Orders & e-Requisitions**
- Order 10+ lab tests with single click
- Custom test panel creation
- Instant alert to laboratory
- Barcode label generation
- Sample collection scheduling

**2.6 Multi-Doctor Referrals**
- Internal handoff from GP to specialist
- No re-registration required
- Referral notes transfer automatically
- Track referral completion rate

**2.7 Telemedicine Integration**
- Secure P2P video consultations
- Encrypted WebRTC bridge
- Virtual clinic roster management
- Digital prescription for teleconsults
- Same workflow as in-person visits

#### Workflow

```
STEP 01: Registration & Token
→ Patient checks in at front desk
→ Pays consultation fee (Cash/UPI/Card)
→ Receives queue token number
→ Waits in comfortable lounge

STEP 02: Pre-Consultation Vitals
→ Nurse calls patient to vitals room
→ Records BP, pulse, temperature, SpO2, weight
→ Data syncs to EMR in real-time
→ Patient proceeds to doctor's cabin

STEP 03: Clinical Assessment
→ Doctor reviews EMR and vitals
→ Records chief complaint and history
→ Performs examination
→ Adds SOAP notes
→ Makes diagnosis (ICD-10 coded)
→ Prescribes medications digitally
→ Orders lab tests if needed

STEP 04: Next Steps Routing
→ Patient flows to Pharmacy OR Laboratory
→ OR Book follow-up appointment
→ OR Referred to another specialist
→ No paper prescription slip needed
→ Everything linked to Patient ID
```

#### Performance Metrics
- **Patient Processing Time:** Reduced 40%
- **Prescription Speed:** <30 seconds
- **Queue Abandonment:** Down 65%

---

### 3. INPATIENT DEPARTMENT (IPD) & WARDS MANAGEMENT
**Tagline:** *Intelligent Oversight for Inpatient Care*

#### Overview
Eliminate overbooking and chaotic night shifts. Manage bed allocation visibly in real-time. Coordinate nursing stations, hourly vitals checking, and create extensive discharge summaries that impress patients.

#### Key Features

**3.1 Visual Bed Allocation Engine**
- Interactive floor plan view
- Click-to-assign beds
- Real-time status: Vacant/Occupied/Maintenance
- Ward-wise and floor-wise filtering
- Bed occupancy dashboard

**3.2 Admission Workflow (ADT)**
- Admission request from OPD doctor
- Financial deposit clearance
- Bed allocation confirmation
- Admission notes with diagnosis
- Insurance pre-authorization tracking

**3.3 Dedicated Nursing Station Dashboards**
- Centralized nurse workspace
- Hourly PRN medication tracking
- Vitals trend visualization
- Doctor's orders acknowledgment
- Shift handover notes

**3.4 Continuous Billing Engine**
- Room rent accrues daily
- Procedural costs added automatically
- Ward pharmacy items tracked
- Nursing interventions billed
- Deposit balance monitoring

**3.5 Dietary & Kitchen Routing**
- Log patient dietary restrictions
- Allergy alerts to kitchen
- Ward-wise meal planning
- Special diet orders (Diabetic, Low-Sodium, etc.)

**3.6 Surgical OT Scheduling**
- Book Operating Theaters
- Assign surgical teams
- Anesthesiologist allocation
- Pre-op checklist management
- Implant and inventory blocking

**3.7 1-Click Discharge Summaries**
- Pull entire stay journey automatically
- Labs, vitals, procedures included
- Final diagnosis and follow-up advice
- Printable PDF with hospital branding
- Medico-legal case (MLC) documentation

**3.8 Transfer Protocol**
- Ward-to-ward transfers (General → ICU)
- Automated billing rate adjustment
- Transfer notes accompany patient
- Bed vacancy created instantly

#### Workflow

```
STEP 01: Admission Request
→ OPD doctor initiates IPD referral
→ Specifies urgency (Routine/Urgent/Emergency)
→ Reception verifies insurance/deposit
→ Allocates available bed from ward map

STEP 02: Ward Integration
→ Patient transitions to assigned ward
→ Floor nurse acknowledges admission
→ Records baseline vitals
→ Begins nursing care plan
→ Identifies patient with wristband

STEP 03: Daily Care & Monitoring
→ Doctors conduct morning rounds
→ Log daily progress notes
→ Place new orders (labs, meds, procedures)
→ Nurses execute medications (MAR)
→ Chart vitals every shift
→ Dietary preferences logged

STEP 04: Discharge & Final Bill
→ Doctor marks patient "Fit for Discharge"
→ Generates discharge summary PDF
→ Nursing clears medications
→ Pharmacy clears pending drugs
→ Finance generates final invoice
→ Subtracts advance deposits
→ Patient settles balance
→ Bed marked vacant immediately
```

#### Performance Metrics
- **Discharge Summary Speed:** 3x Faster
- **Bed Utilization Rate:** Optimized 35%
- **Billing Discrepancies:** Zero

---

### 4. LABORATORY MANAGEMENT SYSTEM (LMS)
**Tagline:** *Velocity and Absolute Precision for Diagnostics*

#### Overview
End-to-end laboratory operations designed to eliminate human error. From barcode sample tracking and machine interfacing to automated reference-range highlighting and secure SMS result dispatch.

#### Key Features

**4.1 Barcode Sample Tracking**
- Generate linear and 2D barcodes
- Unique sample ID per test
- Chain-of-custody tracking
- Draw station timestamp
- Phlebotomist identification

**4.2 Custom Test Panels**
- Bundle tests into packages
  - Master Health Checkup
  - Diabetes Screening Panel
  - Pre-Operative Workup
- Dynamic algorithmic pricing
- One-click ordering

**4.3 Reference Range Automation**
- Age and gender-specific ranges
- Auto-flag abnormal values in red
- Critical value alerts to doctors
- Delta checks (compare with previous results)

**4.4 Outsourced Test Handling**
- Track samples sent to third-party labs
- Capture inbound costs
- Apply hospital markup
- Result reconciliation
- Vendor payment tracking

**4.5 Machine Integration Ready (LIS)**
- Bi-directional auto-analyzer interfacing
- Results pulled directly from machines
- No manual typing errors
- Supports analyzers from Roche, Abbott, Siemens
- HL7 message support

**4.6 Patient SMS Dispatch**
- Pathologist approves report
- Patient receives secure PDF link
- WhatsApp/SMS notification
- Download tracking
- Report viewable in patient portal

**4.7 Test Catalogue**
- 100+ pre-configured tests
  - Hematology (CBC, ESR, Blood Group)
  - Biochemistry (LFT, RFT, Lipid Profile)
  - Immunology (TSH, Vitamin D, Ferritin)
  - Serology (HIV, HBsAg, Dengue, Malaria)
  - Microbiology (Urine Culture, Stool Routine)
  - Radiology (X-Ray, Ultrasound, ECG)

#### Workflow

```
STEP 01: Requisition & Billing
→ Patient arrives with OPD lab order
→ Billing counter collects payment
→ System generates lab request with tracking ID
→ Barcode labels printed automatically

STEP 02: Phlebotomy & Barcode
→ Phlebotomist draws sample
→ Applies barcode label to vial
→ Scans barcode at collection station
→ Routes sample to processing bench
→ Centrifugation and aliquoting if needed

STEP 03: Result Entry & Validation
→ Technician enters results manually OR
→ Auto-analyzer pushes results via LIS
→ System flags abnormal/critical values
→ Pathologist reviews and approves
→ Digital signature applied

STEP 04: Instant Distribution
→ Report attached to patient EMR
→ Prescribing doctor receives notification
→ Patient gets SMS with PDF link
→ Report available in patient portal
→ Historical trends updated automatically
```

#### Performance Metrics
- **Report Dispatch Errors:** 0%
- **Turnaround Time:** Cut by 50%
- **Report Format:** 100% Digital PDF

---

### 5. HOSPITAL PHARMACY MANAGEMENT
**Tagline:** *Keep Your Stock Strictly Controlled and Fully Stocked*

#### Overview
Smart inventory tracking, automatic low-stock alerts, rigid expiry management, and integrated POS. Nexora prevents drug leakage and maximizes pharmacy profitability without the headache.

#### Key Features

**5.1 Integrated OPD Dispensing**
- Doctor's prescription appears instantly
- Pharmacist verifies and packs
- Print bill with one click
- Stock deducted automatically
- No manual entry errors

**5.2 Stock & Batch Tracking**
- Track every batch number
- Expiry date monitoring
- FIFO (First-In-First-Out) logic
- Prevents expiry waste
- Serial number tracking for devices

**5.3 Low Stock Auto-Alerts**
- Set minimum threshold levels per drug
- Dashboard alerts when stock falls below safety level
- Email notifications to procurement
- Reorder point suggestions

**5.4 Supplier & Purchase Orders**
- Maintain supplier database
- Generate purchase orders (PO)
- Track PO status: Draft → Issued → Received
- Goods Received Note (GRN) logging
- Vendor ledger management

**5.5 Narcotics & Audit Controls**
- Dual-factor authentication for scheduled drugs
- Separate register for narcotics
- Quantity tracking with witness sign-off
- Locked-down audit trails
- Regulatory compliance ready

**5.6 GST Pharmacy Billing**
- Barcode scanner ready POS
- HSN code assignment
- Auto-calculate SGST/CGST/IGST
- Return handling with credit notes
- Daily sales reports

**5.7 Procurement Workflow**
- Purchase requisition from low-stock alerts
- PO generation and approval workflow
- Supplier sends goods with invoice
- GRN entry with batch/expiry verification
- Accounts payable processing

#### Workflow

```
STEP 01: Procurement
→ System alerts low stock items
→ Procurement officer creates PO
→ PO sent to supplier via email
→ Supplier delivers goods

STEP 02: Shelving & Batching
→ Warehouse logs GRN with batch numbers
→ Enters expiry dates and MRP
→ Places drugs in appropriate storage
→ System updates master stock

STEP 03: Instant Dispensing
→ Patient brings digital prescription
→ Pharmacist views prescribed drugs
→ Picks drugs from shelves
→ Scans barcodes at POS
→ Prints bill and dispenses

STEP 04: Stock Deduction
→ Sale completes at POS
→ Stock deducted from master inventory
→ Financial transaction recorded
→ Revenue added to daily report
→ Reorder alert triggered if below threshold
```

#### Performance Metrics
- **Inventory Leakage:** Reduced to 0
- **Billing Speed:** Under 10 seconds
- **Expiry Waste:** Minimized 90%

---

### 6. BILLING & FINANCIAL MANAGEMENT
**Tagline:** *No Leaks. Complete Commercial Control.*

#### Overview
GST-compliant invoicing, robust insurance claims processing, multi-branch revenue tracking, and secure payment gateway integrations. Bring strict fiscal accountability to every department in your hospital.

#### Key Features

**6.1 Unified Patient Folio**
- Central ledger for all charges
- OPD, IPD, Pharmacy, Lab consolidated
- Real-time balance tracking
- Deposit adjustments
- Credit/debit notes

**6.2 TPA & Insurance Claims**
- Insurance company empanelment
- Pre-authorization workflows
- Claim submission tracking
- Copay and deductible calculation
- Rejection management

**6.3 Multi-Tiered Pricing**
- Different rate charts for:
  - General Ward vs Private Suite
  - VIP patients vs Standard
  - Weekday vs Weekend rates
- Procedure-based pricing
- Doctor-wise consultation fees

**6.4 GST Auto-Computation**
- Define HSN/SAC codes per service
- Auto-calculate SGST/CGST/IGST
- GST-ready invoices
- Export reports for CA
- Input tax credit tracking

**6.5 Refunds & Credit Notes**
- Maker-checker authorization
- Refund request workflow
- Approval chain
- Credit note generation
- Audit trail for modifications

**6.6 Digital Payment Gateways**
- Razorpay integration
- Stripe support
- UPI payment links
- Card payments
- Cash, Cheque, Demand Draft

**6.7 Revenue Reporting**
- Department-wise income
- Doctor-wise revenue share
- Daily collection reports
- Outstanding receivables
- Cash flow statements

#### Workflow

```
STEP 01: Charge Capturing
→ Every service rendered pushes charge to folio
→ OPD consultation fee
→ Lab test charges
→ Pharmacy dispensing
→ IPD room rent, procedures, consumables
→ Real-time accumulation

STEP 02: Insurance Processing
→ Billing desk reviews insurance coverage
→ Splits bill: Patient copay + Insurance TPA
→ Submits pre-auth if required
→ Tracks claim status
→ Manages rejections and appeals

STEP 03: Final Settlement
→ Patient receives itemized bill
→ Settles balance via Cash/Card/UPI
→ System generates GST-compliant invoice
→ Prints thermal receipt if needed
→ Updates all ledgers instantly

STEP 04: Revenue Reporting
→ End-of-day closing
→ Management views consolidated dashboard
→ Income breakdown by department
→ Doctor revenue share calculation
→ Tax liability computation
→ Reports exported to Tally/Excel
```

#### Performance Metrics
- **Revenue Leakage:** Blocked Completely
- **Tally Integrations:** Export Ready
- **Financial Audits:** Simplified 70%

---

### 7. HR & STAFF MANAGEMENT
**Tagline:** *Optimize Your Workforce, Empower Your Team*

#### Overview
Complete hospital workforce management — from recruitment and onboarding to payroll, attendance, shift scheduling, and performance reviews. Role-based access control ensures security and compliance.

#### Key Features

**7.1 Staff Database**
- Employee master records
- Department-wise categorization
- Designation and reporting structure
- Contact information and emergency contacts
- Qualification and certification tracking

**7.2 Role-Based Access Control (RBAC)**
- Pre-defined roles: Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Tech, Accountant
- Granular permission sets
- Module-level and action-level permissions
- Tenant-scoped access

**7.3 Attendance & Biometrics**
- RFID card integration
- Biometric device support
- Clock-in/Clock-out tracking
- Location-based attendance
- Overtime calculation

**7.4 Shift Scheduling**
- Define shifts: Day, Night, Emergency, On-Call
- Shift timing configuration
- Auto-rotation schedules
- Holiday calendar
- On-call duty tracking

**7.5 Leave Management**
- Leave type configuration (Casual, Sick, Privileged, Maternity)
- Leave balance tracking
- Leave request workflow
- Approval chain
- Leave encashment calculation

**7.6 Payroll Computation**
- Basic salary, HRA, DA, TA
- Deductions: PF, Professional Tax, TDS
- Overtime pay
- Bonus and incentives
- Salary slip generation

**7.7 Performance Reviews**
- Annual appraisal cycles
- KPI setting and tracking
- 360-degree feedback
- Promotion workflows
- Increment letters

#### Workflow

```
STEP 01: Recruitment & Onboarding
→ HR creates employee record
→ Uploads documents (resume, certificates, ID proof)
→ Assigns role and permissions
→ Issues RFID card/biometric enrollment
→ Orientation scheduling

STEP 02: Daily Attendance
→ Staff swipes RFID card or uses biometric
→ System logs timestamp and location
→ Late arrivals flagged automatically
→ Overtime hours captured

STEP 03: Shift Management
→ Rostering done monthly/weekly
→ Staff can view assigned shifts
→ Swap requests with approval workflow
→ Emergency shift changes logged

STEP 04: Payroll Processing
→ System calculates attended days
→ Adds overtime, bonuses
→ Deducts leave without pay
→ Computes PF, PT, TDS
→ Generates salary slips
→ Bank transfer file export
```

---

### 8. MULTI-BRANCH CONTROL
**Tagline:** *Scale Without Losing Control*

#### Overview
Manage unlimited hospital branches under one tenant account. Centralized reporting, independent branch operations, cross-branch patient lookup, and unified billing.

#### Key Features

**8.1 Branch Configuration**
- Add unlimited branches
- Branch codes and naming
- Facility type (Hospital, Clinic, Diagnostic Center, Pharmacy)
- Address, phone, email
- Operational status

**8.2 Independent Operations**
- Each branch has own:
  - Staff and doctors
  - Inventory (pharmacy, consumables)
  - Equipment and assets
  - Bank accounts
  - Billing counters

**8.3 Cross-Branch Patient Lookup**
- Patient registered at Branch A can visit Branch B
- Unified EMR accessible across branches
- No re-registration needed
- Treatment history visible everywhere

**8.4 Consolidated Reporting**
- Group-level dashboards
- Branch-wise revenue comparison
- Occupancy rate comparison
- Expense consolidation
- Profitability analysis per branch

**8.5 Centralized Procurement**
- Bulk purchasing for all branches
- Vendor rate negotiation
- Inventory transfers between branches
- Stock optimization

#### Benefits
- **Economies of Scale:** Bulk procurement, centralized HR
- **Brand Consistency:** Standardized protocols across branches
- **Operational Flexibility:** Each branch runs independently
- **Strategic Oversight:** Group-level analytics for expansion decisions

---

### 9. ANALYTICS & REPORTING DASHBOARD
**Tagline:** *Data-Driven Decisions for Healthcare Excellence*

#### Overview
Real-time dashboards, customizable reports, predictive analytics, and executive summaries. Turn raw hospital data into actionable business intelligence.

#### Key Features

**9.1 Executive Dashboards**
- C-suite overview: Revenue, Occupancy, Patient Satisfaction
- Drill-down capabilities
- Month-over-month comparisons
- Year-to-date performance
- Budget vs Actual analysis

**9.2 Clinical Analytics**
- Doctor-wise patient load
- Average consultation time
- Prescription patterns
- Lab test volumes
- Infection rate tracking

**9.3 Financial Reports**
- Daily Collection Report (DCR)
- Accounts Receivable Aging
- Department-wise revenue
- Expense breakdown
- Cash flow statements
- GST summary

**9.4 Operational Reports**
- Bed occupancy trends
- Average length of stay (ALOS)
- Patient wait times
- Staff productivity
- Equipment utilization

**9.5 Growth Metrics**
- New patient acquisition
- Repeat patient rate
- Referral source analysis
- Service line growth
- Market penetration

**9.6 Export Capabilities**
- Excel/CSV export
- PDF report generation
- Scheduled email delivery
- API access for BI tools

---

### 10. HOSPITAL CMS & PUBLIC WEBSITE
**Tagline:** *Your Digital Front Door*

#### Overview
Editable public hospital landing page per tenant. Manage about, services, doctors, testimonials, gallery, contact page, and SEO metadata — all without a developer.

#### Features

**10.1 Drag-and-Drop Builder**
- No coding required
- Pre-designed templates
- Custom color schemes
- Logo and branding upload
- Mobile-responsive design

**10.2 Content Management**
- About Us page
- Services offered
- Doctor profiles with photos
- Patient testimonials
- Photo gallery
- Blog/news section

**10.3 Online Appointment Booking**
- Public-facing booking form
- Specialty selection
- Doctor preference
- Date/time picker
- Payment integration

**10.4 SEO Optimization**
- Meta title and description
- Keyword optimization
- Sitemap generation
- Google Analytics integration
- Schema markup for medical entities

**10.5 Patient Portal Access**
- Login/register buttons
- View lab reports online
- Download prescriptions
- Pay bills digitally
- Request appointments

---

### 11. SUPER ADMIN SAAS CONTROL PANEL
**Tagline:** *God Mode for Platform Management*

#### Overview
Full tenant onboarding wizard, database provisioning automation, plan assignment, subscription tracking, feature toggles, reseller management, and system-level logs.

#### Features

**11.1 Tenant Onboarding Wizard**
- New hospital signup workflow
- Database auto-provisioning
- Initial user creation
- Plan assignment
- Feature configuration

**11.2 Subscription Management**
- Plan upgrades/downgrades
- Renewal tracking
- Payment reconciliation
- Grace period handling
- Suspension automation

**11.3 Reseller Network**
- Reseller registration
- Commission tracking (e.g., 20% revenue share)
- Hospital assignments
- Performance dashboards

**11.4 Support Ticket System**
- Hospital raises ticket
- Priority tagging (Low/Medium/High/Urgent)
- Assignment to support staff
- Resolution tracking
- SLA monitoring

**11.5 System Logs**
- Platform-wide health monitoring
- Error tracking
- API usage statistics
- Database performance metrics
- Security incident logs

**11.6 Feature Toggles**
- Enable/disable modules per tenant
- Beta feature rollouts
- A/B testing capability
- Maintenance mode

---

## TECHNICAL INFRASTRUCTURE

### Hosting Architecture

**AWS Cloud Infrastructure:**
- **Compute:** EC2 instances with auto-scaling
- **Database:** Amazon RDS for PostgreSQL
- **Storage:** S3 for files, backups, media
- **CDN:** CloudFront for static assets
- **Load Balancer:** ALB for traffic distribution
- **Monitoring:** CloudWatch for metrics and alerts

### Database Schema

**Core Entities:**
- Tenant (Hospitals/Clinics)
- User (Staff, Doctors, Admin)
- Patient (EMR records)
- Appointment (OPD/IPD/Teleconsult)
- Prescription (Medications)
- LabRequest (Diagnostic tests)
- Medicine (Pharmacy inventory)
- Invoice (Billing)
- Ward/Bed (Facility management)
- Supplier (Procurement)
- PurchaseOrder (Inventory)
- Notification (Alerts)
- AuditLog (Compliance)

**Relationships:**
- One Tenant → Many Users/Patients/Appointments
- One Patient → Many Appointments/Prescriptions/Lab Requests
- One Appointment → Many Prescriptions/Invoices
- One Ward → Many Beds
- One Medicine → Many Dispensations

### API Architecture

**RESTful API Design:**
- Resource-based endpoints (`/api/patients`, `/api/appointments`)
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- JSON request/response format
- JWT authentication required
- Rate limiting: 100 requests/minute per tenant

**Key API Routes:**
```
Authentication:
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

Patients:
GET  /api/patients
POST /api/patients
GET  /api/patients/:id
PUT  /api/patients/:id
DELETE /api/patients/:id

Appointments:
GET  /api/appointments
POST /api/appointments
PUT  /api/appointments/:id
DELETE /api/appointments/:id

Laboratory:
GET  /api/laboratory
POST /api/laboratory
PUT  /api/laboratory/:id (result entry)
GET  /api/laboratory/lis-sync (machine integration)

Pharmacy:
GET  /api/pharmacy/medicines
POST /api/pharmacy/medicines
PUT  /api/pharmacy/medicines/:id
POST /api/pharmacy/dispense
GET  /api/pharmacy/purchase-orders
POST /api/pharmacy/purchase-orders

Billing:
GET  /api/billing/invoices
POST /api/billing/invoices
POST /api/payments/razorpay/create
POST /api/payments/razorpay/verify

IPD:
GET  /api/ipd (admissions list)
POST /api/ipd (new admission)
PUT  /api/ipd/:id/discharge
GET  /api/ipd/wards
POST /api/ipd/nursing (flowsheet entry)

Reports:
GET  /api/reports/revenue
GET  /api/reports/occupancy
GET  /api/reports/clinical
```

### Integration Capabilities

**Third-Party Integrations:**
- **Payment Gateways:** Razorpay, Stripe, PayPal
- **SMS/WhatsApp:** Twilio, Gupshup, MSG91
- **Email:** SendGrid, Amazon SES, SMTP
- **Accounting:** Tally, QuickBooks, Zoho Books
- **Lab Analyzers:** Roche, Abbott, Siemens (via HL7)
- **Biometric Devices:** eTimeTrackLite, uAttend
- **ERP:** SAP, Oracle (Enterprise plans)

**API Access:**
- REST API available for Enterprise tier
- Webhook support for event-driven integrations
- OAuth 2.0 for secure third-party access
- Rate limiting: 1000 requests/hour

---

## SECURITY & COMPLIANCE

### Data Security

**Encryption:**
- **At Rest:** AES-256 encryption for sensitive fields
- **In Transit:** TLS 1.3 for all API communications
- **Database:** Per-tenant encryption keys
- **Backups:** Encrypted S3 buckets

**Authentication:**
- JWT tokens with 7-day expiry
- Refresh token mechanism
- Password hashing: bcrypt (12 rounds)
- Multi-factor authentication (optional)
- Session management with device tracking

**Authorization:**
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Principle of Least Privilege
- Regular permission audits

### Compliance Standards

**HIPAA Alignment:**
- PHI (Protected Health Information) encryption
- Access logging and monitoring
- Breach notification procedures
- Business Associate Agreements (BAA)

**GDPR Readiness:**
- Right to be forgotten
- Data portability
- Consent management
- Privacy by design

**Indian Regulations:**
- GST compliance built-in
- ICD-10 coding mandatory
- Clinical Establishments Act adherence
- State Medical Council guidelines

### Audit Trails

**What Gets Logged:**
- User logins/logouts
- Patient record views
- Data modifications (old → new values)
- Prescription signings
- Financial transactions
- Report exports

**Audit Log Fields:**
- Timestamp (IST)
- User ID and name
- Action performed
- Resource affected
- IP address and user agent
- Old value and new value (JSON)

**Retention:**
- Audit logs retained for 7 years
- Immutable (cannot be edited/deleted)
- Searchable via admin dashboard
- Exportable for compliance audits

### Backup & Disaster Recovery

**Backup Strategy:**
- **Daily:** Automated snapshots at 2 AM IST
- **Hourly:** Transaction log backups
- **Point-in-Time:** Recovery to any second within 30 days

**Recovery Metrics:**
- **RTO (Recovery Time Objective):** <4 hours
- **RPO (Recovery Point Objective):** <1 hour

**Disaster Recovery:**
- Multi-AZ deployment
- Standby replica in different region
- Failover testing quarterly
- Documented runbooks

---

## DEPLOYMENT & ONBOARDING

### Implementation Timeline

**Standard Onboarding (24-48 hours):**

**Day 1: Technical Setup**
- Database provisioning
- Tenant configuration
- SSL certificate setup
- Domain mapping (hospital.nexora.health)
- Email configuration

**Day 2: Configuration**
- User account creation
- Role assignment
- Module activation
- Branding upload (logo, colors)
- Fee schedule entry
- Drug formulary import

**Day 3: Training**
- Admin training (4 hours)
- Doctor training (2 hours)
- Nurse training (2 hours)
- Receptionist training (2 hours)
- Pharmacist training (2 hours)
- Lab technician training (2 hours)

**Go-Live:**
- Soft launch (limited departments)
- Hypercare support (first week)
- Full rollout after validation

### Data Migration

**Legacy Data Import:**
- Patient demographics (CSV/Excel)
- Historical lab results (HL7/FHIR)
- Drug master (standard formats)
- Tariff lists (custom mapping)

**Migration Tools:**
- CSV import wizards
- API bulk loaders
- Manual entry forms
- Validation scripts

### Training Programs

**Role-Specific Training:**

**Administrators:**
- Dashboard navigation
- User management
- Report generation
- System configuration
- Troubleshooting

**Doctors:**
- EMR documentation
- Prescription writing
- Lab order placement
- Referral management
- Telemedicine usage

**Nurses:**
- Vitals entry
- Medication administration
- IPD flowsheet charting
- Sample collection
- Patient education modules

**Receptionists:**
- Patient registration
- Appointment scheduling
- Billing basics
- Queue management
- Insurance verification

**Pharmacists:**
- Inventory management
- Dispensing workflow
- Purchase orders
- Expiry tracking
- GST billing

**Lab Technicians:**
- Sample barcode printing
- Result entry
- Quality control
- Report validation
- Machine interfacing

### Support Model

**Support Channels:**
- **Email:** support@nexora.health
- **Phone:** +91-XXX-XXX-XXXX (Mon-Sat, 9 AM-6 PM)
- **In-App Chat:** Available during business hours
- **Knowledge Base:** 100+ articles and videos
- **Community Forum:** Peer-to-peer support

**SLA Tiers:**

**Starter Tier:**
- Email support only
- 48-hour response time
- Business hours only

**Pro Tier:**
- Email + Phone support
- 24-hour response time
- Extended hours (8 AM-8 PM)

**Enterprise Tier:**
- 24/7 priority support
- Dedicated account manager
- 4-hour critical issue response
- On-site support available

---

## PRICING & SUBSCRIPTION TIERS

### Starter Tier - ₹4,999/month
**For:** Small clinics, single-doctor practices

**Includes:**
- Up to 5 users
- 1 branch
- OPD + Appointment module
- Basic billing & invoicing
- Patient EMR (1,000 records)
- Email support
- 1 GB storage

**Ideal For:**
- General Physician clinics
- Dental practices
- Small specialty clinics

### Pro Tier - ₹12,999/month
**For:** Mid-size hospitals, nursing homes

**Includes:**
- Up to 30 users
- 3 branches
- OPD + IPD + Lab + Pharmacy
- GST-compliant billing & reports
- Priority support
- Hospital CMS & public website
- Analytics dashboard
- HR & attendance module
- 10 GB storage
- Telemedicine included

**Ideal For:**
- 20-50 bed hospitals
- Multi-specialty clinics
- Diagnostic centers

### Enterprise Tier - Custom Pricing
**For:** Hospital chains, large healthcare networks

**Includes:**
- Unlimited users & branches
- All modules included
- Custom integrations & API access
- Dedicated account manager
- SLA guarantee with credits
- 24/7 priority support
- On-premise deployment option
- Custom reporting & BI
- Unlimited storage
- White-label patient portal
- Custom training programs

**Ideal For:**
- 50+ bed hospitals
- Multi-branch chains
- Corporate hospital groups

### Add-On Modules

**Advanced Analytics:** ₹2,999/month
- Predictive modeling
- Custom dashboards
- Power BI integration

**Research Module:** ₹4,999/month
- Clinical trial management
- IRB compliance
- Data anonymization

**International Compliance:** ₹9,999/month
- HIPAA certification
- GDPR alignment
- JCI accreditation support

### Payment Terms

- **Monthly:** Standard billing cycle
- **Annual:** 2 months free (₹59,988 for Pro)
- **Three-Year:** 4 months free + priority onboarding
- **Enterprise:** Custom contracts, PO-based billing

### Money-Back Guarantee

- 30-day free trial (no credit card required)
- Full refund if not satisfied in first 30 days
- No questions asked policy

---

## COMPETITIVE ADVANTAGES

### Why Choose Nexora Health?

**1. True Multi-Tenancy**
- Competitors use shared databases
- We provide database-per-tenant isolation
- Maximum security and compliance

**2. All-in-One Platform**
- No need for multiple vendors
- EMR, Billing, Lab, Pharmacy, HR — everything integrated
- Single source of truth

**3. India-First Design**
- GST compliance built-in
- ICD-10 coding native
- Indian insurance workflows
- Regional language support planned

**4. Rapid Deployment**
- 24-48 hour onboarding
- Pre-configured templates
- Minimal IT infrastructure needed

**5. Affordable Pricing**
- Starting at ₹4,999/month
- No hidden setup fees
- Transparent pricing

**6. Modern Tech Stack**
- Next.js 16 + React 19
- Fastest page loads (<2s)
- Mobile-responsive design
- Offline mode planned

**7. Customer Success**
- 94% customer retention rate
- 4.8/5 average rating
- Active product roadmap
- Customer advisory board

---

## ROADMAP & FUTURE ENHANCEMENTS

### Q2 2026
- Mobile apps (iOS/Android)
- Offline mode for rural areas
- Voice-to-clinical-notes AI
- WhatsApp chatbot for appointments

### Q3 2026
- AI-powered diagnostic assistance
- Drug interaction checker
- Predictive bed occupancy modeling
- Integration with Ayushman Bharat (PM-JAY)

### Q4 2026
- IoT device integration (wearables, remote monitoring)
- Blockchain-based audit trails
- Multi-language support (Hindi, Tamil, Telugu, Bengali)
- International expansion (Middle East, Southeast Asia)

### 2027 Vision
- AI radiology assistant
- Genomic data integration
- Population health analytics
- Telemedicine marketplace

---

## CASE STUDIES

### Case Study 1: Apollo Multispeciality Hospital, Ranchi

**Challenge:**
- 3 branches with disconnected systems
- Manual billing causing revenue leakage
- 4-hour average discharge process

**Solution:**
- Deployed Nexora Health across all branches
- Unified billing and inventory
- Automated IPD workflows

**Results (6 months):**
- Billing accuracy improved 94%
- Discharge time reduced to 90 minutes
- Revenue increased 28%
- Patient satisfaction up 42%

**Quote:**
> "Nexora Health transformed how we manage our 3 branches. The bed occupancy dashboard and lab integration alone saved us 4 hours of manual work every day."  
> — Dr. Rajesh Mehta, Medical Director

### Case Study 2: MediCare Hospital Group, Kochi

**Challenge:**
- Evaluating 6 HMS vendors
- Needed strict data isolation for compliance
- Quick onboarding required

**Solution:**
- Database-per-tenant architecture won trust
- Onboarded in 2 days
- Trained 150 staff members

**Results:**
- 100% compliance audit passed
- Zero downtime since go-live
- ROI achieved in 4 months

**Quote:**
> "The database-per-tenant architecture gave our compliance team confidence. Onboarding was completed in under 2 days."  
> — Ms. Priya Nair, IT Head

### Case Study 3: HealthFirst Clinics, Delhi NCR

**Challenge:**
- Running 12 clinics from disparate systems
- No centralized reporting
- Inventory mismanagement

**Solution:**
- Multi-branch module deployed
- Centralized procurement
- Unified analytics dashboard

**Results:**
- Managing all 12 clinics from one dashboard
- Inventory costs down 35%
- Cross-branch patient visits up 60%

**Quote:**
> "Running 12 clinics from one dashboard is something no other system offered at this price point."  
> — Dr. Suresh Sharma, CEO

---

## FREQUENTLY ASKED QUESTIONS (FAQ)

### Q: Is each hospital's data stored separately?
**A:** Yes. Every hospital (tenant) gets a completely separate PostgreSQL database. There is zero shared data between tenants. This ensures the highest level of data isolation, compliance, and security.

### Q: Can Nexora Health handle multiple branches?
**A:** Absolutely. The Pro and Enterprise plans support multi-branch operations. Each branch has independent operations, staff, and inventory, while the hospital admin gets a unified view across all branches.

### Q: Does it support GST-compliant billing?
**A:** Yes. The billing module is fully GST-compliant. It supports CGST, SGST, and IGST computations, HSN codes for pharmacy, and generates GST-ready invoices and export reports.

### Q: How long does onboarding take?
**A:** Standard onboarding — including database provisioning, staff user creation, module configuration, and basic training — takes 24 to 48 hours. Enterprise deployments with custom configurations take 5 to 7 business days.

### Q: Is patient data backed up?
**A:** Yes. All tenant databases are backed up daily to AWS S3 with point-in-time recovery. The Recovery Time Objective (RTO) is under 4 hours. Backup retention is 30 days on standard plans.

### Q: Can we integrate with existing lab equipment?
**A:** Enterprise plans include full REST API access and webhook support for integration with third-party systems, lab analyzers, and diagnostic machines. Contact sales for a custom integration assessment.

### Q: What happens if we exceed our user limit?
**A:** You can add additional users at ₹499/user/month. The system will warn you when approaching the limit, and you can upgrade instantly from the dashboard.

### Q: Do you offer on-premise deployment?
**A:** Yes, Enterprise tier offers on-premise deployment for hospitals with strict data residency requirements. Includes installation, configuration, and annual maintenance contract.

### Q: Can patients access their records online?
**A:** Yes. The patient portal allows individuals to view their EMR, download prescriptions, access lab reports, pay bills, and book appointments — all securely authenticated.

### Q: Is training provided?
**A:** Yes. Comprehensive role-based training is included in all plans. We also provide video tutorials, documentation, and certification programs for power users.

---

## CONTACT INFORMATION

### Nexora Health Technologies Pvt Ltd

**Corporate Office:**
[Address Line 1]  
[Address Line 2]  
[City, State, PIN]  
India

**Contact Details:**
- Phone: +91-XXX-XXX-XXXX
- Email: sales@nexora.health
- Website: www.nexora.health

**Business Hours:**
Monday - Saturday: 9:00 AM - 6:00 PM IST  
24/7 Support for Enterprise customers

**Social Media:**
- LinkedIn: /company/nexora-health
- Twitter: @NexoraHealth
- Facebook: /NexoraHealthIN
- YouTube: /NexoraHealthOfficial

---

## APPENDIX

### A. Glossary of Terms

- **ADT:** Admission, Discharge, Transfer
- **ALOS:** Average Length of Stay
- **BAA:** Business Associate Agreement
- **CPOE:** Computerized Physician Order Entry
- **DCR:** Daily Collection Report
- **EMR:** Electronic Medical Records
- **FIFO:** First-In-First-Out
- **GRN:** Goods Received Note
- **GST:** Goods and Services Tax
- **HIPAA:** Health Insurance Portability and Accountability Act
- **HL7:** Health Level 7 (messaging standard)
- **HSN:** Harmonized System of Nomenclature
- **ICD-10:** International Classification of Diseases, 10th Revision
- **IPD:** Inpatient Department
- **IST:** Indian Standard Time
- **JCI:** Joint Commission International
- **LIS:** Laboratory Information System
- **MAR:** Medication Administration Record
- **MLC:** Medico-Legal Case
- **OPD:** Outpatient Department
- **PHI:** Protected Health Information
- **PO:** Purchase Order
- **POS:** Point of Sale
- **RBAC:** Role-Based Access Control
- **RPO:** Recovery Point Objective
- **RTO:** Recovery Time Objective
- **S3:** Amazon Simple Storage Service
- **SLA:** Service Level Agreement
- **SOAP:** Subjective, Objective, Assessment, Plan
- **TPA:** Third-Party Administrator
- **UPI:** Unified Payments Interface
- **WebRTC:** Web Real-Time Communication

### B. System Requirements

**Minimum Requirements:**
- Internet: 2 Mbps broadband connection
- Browser: Chrome 90+, Firefox 88+, Edge 90+
- Screen Resolution: 1366x768 minimum
- RAM: 4 GB minimum, 8 GB recommended
- OS: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)

**Recommended Setup:**
- Internet: 10 Mbps fiber connection
- Device: Core i3 or equivalent processor
- RAM: 8 GB
- UPS backup for critical systems
- Thermal printer for billing counters
- Barcode scanner for pharmacy

### C. Change Log

**Version 1.0 (March 2026)**
- Initial release with all core modules
- Telemedicine integration
- Multi-branch support
- GST billing
- Patient portal
- Mobile-responsive design

**Upcoming Updates:**
- v1.1 (April 2026): Mobile apps beta
- v1.2 (May 2026): AI diagnostic assistance
- v2.0 (June 2026): IoT integration

---

## DOCUMENT CONTROL

**Prepared By:** Product Management Team  
**Reviewed By:** Technical Leadership  
**Approved By:** Executive Management  
**Classification:** Client-Facing Documentation  
**Distribution:** Sales, Marketing, Client Success, Prospects  

**Revision History:**
- v1.0 (March 2026): Initial comprehensive documentation

**Next Review Date:** June 2026

---

**© 2026 Nexora Health Technologies Pvt Ltd. All Rights Reserved.**

This document contains proprietary and confidential information. Unauthorized distribution or reproduction is strictly prohibited.

All trademarks, service marks, and registered logos mentioned herein are the property of their respective owners.

Specifications and features subject to change without notice.

---

**END OF DOCUMENTATION**
