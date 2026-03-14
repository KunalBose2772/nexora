# Nexora Health: The "Perfect System" Pending Checklist

This document serves as the absolute blueprint for making Nexora Health 100% complete, air-tight, and enterprise-ready. It covers every loophole, operational necessity, and front-to-back workflow that a top-tier hospital requires.

## 1. Universal Printing & Export Engine (Pixel-Perfect)
Every interaction must end with a perfect physical or digital document.
- [x] **Universal Print Button**: Every view/record (Invoice, Prescription, Appointment Slip, Lab Report, Discharge Summary, Shift Roster, OT Schedule) must have a dedicated `.pdf` generation and "Print" button.
- [x] **Customizable Templates**: Pixel-perfect templates that allow each hospital tenant to inject their Logo, Header, Address, specific Tax/GST Numbers, and Footer terms.
- [x] **Thermal/Receipt Printer Support**: For front-desk token generation, queue slips, quick payment receipts, and IPD advances.
- [x] **Barcode/QR Codes on Prints**: Every generated document should have a QR code (e.g., scanning the QR on an invoice opens the digital bill, scanning a patient wristband opens their EHR).

## 2. Advanced Patient Portal & Engagement
The patient needs complete autonomy over their data.
- [x] **Patient Web Portal / App**: Secure login using OTP/Password.
- [x] **Self-Service**: Book/reschedule/cancel appointments directly based on doctor live availability.
- [x] **Digital Records**: View and download final PDF Lab Reports, Prescriptions, and Receipts.
- [x] **Payment Gateway**: Online invoice payment (Razorpay) via a secure link and integrated Patient Portal button.
- [x] **Telemedicine Suite**: Integrated video calling for virtual consultations.
- [x] **Feedback/Grievance System**: Allow patients to rate their consultation or report issues directly to hospital admin.

## 3. Financials & RCM (Zero Revenue Leakage)
Closing all loopholes where money or inventory could be lost.
- [x] **Itemized IPD Billing**: Automatic daily accrual of bed charges, nursing charges, doctor visit fees, and dietary fees to the patient's running final bill.
- [x] **Strict Discount & Void Policies**: 
    - Receptionists can only apply up to 5% discount; anything more requires a Manager's PIN/Approval.
    - Invoices cannot be "deleted" (hard delete). They can only be "Cancelled/Voided" with a mandatory reason attached, keeping the audit trail.
- [x] **TPA / Insurance Workflows**: Pre-authorization request forms, co-pay split calculations (e.g., Insurance pays 80%, patient pays 20%), and claim status tracking.
- [x] **Advance Deposits**: Collecting and adjusting ward admission deposits against the final discharge bill.
- [x] **Petty Cash & Shift Handover**: Cashiers must "close their register" at the end of a shift, declaring cash-in-hand vs system-calculated cash.

## 4. Airtight Security & Approvals (Maker-Checker)
No single user should be able to bypass hospital protocols.
- [x] **Granular RBAC (Role-Based Access Control)**: Restrict access deeply. For example: Nurses can view patient data but only for their assigned ward; Doctors cannot see hospital overall revenue; Receptionists can book but not delete appointments.
- [x] **Clinical Approval Chains**: Junior/Resident doctors write the initial discharge summary or prescription, but it remains "Draft" until the Senior Consultant digitally signs/approves it.
- [x] **Complete Audit Trails**: 
    - `createdBy`, `updatedBy`, `deletedBy` on EVERY database table.
    - **History Logs**: If a prescription is altered, keep version 1 and version 2 to prevent medical-legal tampering.
    - Track IP addresses and timestamps for all sensitive actions.
- [x] **Medico-Legal Cases (MLC)**: Special flags for police cases (accidents, poisonings) that lock the record from deletion and require specific forensic templates.

## 5. Pharmacy & Inventory (Zero Pilferage)
Complete end-to-end tracking of physical goods.
- [x] **Multi-Warehouse**: Main Store (bulk) vs. Departmental Sub-stores (e.g., Ward 3 Pharmacy cabinet).
- [x] **Indenting System**: Ward sister places an "Indent" (internal request) to the Main store for 50 Paracetamol strips. Main store approves and transfers stock.
- [x] **Barcode Scanning Validation**: Scanning medicine barcodes/batch at dispensation to ensure integrity.
- [x] **Expiry/FEFO Logic**: System prompts FEFO warning if a soonest-to-expire batch is skipped.
- [x] **Supplier Purchase Orders (PO)**: Generating POs, tracking Goods Receipt Notes (GRN), and handling returned/damaged stock.

## 6. Full Inpatient (IPD) / Ward Lifecycle
Tracking the patient seamlessly from admission to leaving the building.
- [x] **ADT Workflows (Admission, Discharge, Transfer)**: 
    - Transferring a patient from Normal Ward to ICU creates automated logs and changes the room billing rate instantly.
- [x] **Nursing Station Dashboards**: Digital flowsheets for recording hourly vitals, fluid intake/output charts, and Medication Administration Records (MAR) - ensuring a nurse physically clicks "Given" next to a scheduled drug.
- [x] **Clearance/Discharge Workflow**: Patient cannot be computationally discharged until clearance is given by Ward, Pharmacy, and Finance.

## 7. Automated Alerts && Ecosystem Integrations
The system must be proactive, not reactive.
- [x] **Omnichannel Notifications**: Automated SMS/WhatsApp messages for Appointment Confirmations, Lab Results Ready, and Bill Reminders.
- [x] **Critical Lab Alarms**: If a lab result returns a dangerously abnormal value (e.g., Troponin for heart attack), a high-priority push notification is sent instantly to the assigned doctor.
- [x] **Machine Integration (LIS)**: Connecting physical auto-analyzer lab machines bi-directionally to the system so results populate automatically without human typing.
- [x] **Biometrics/RFID**: Integrating staff ID cards/fingerprints for attendance and shift tracking in the HRMS module.

## 8. Specific Advanced Modules
Completing the puzzle for specialized departments.
- [x] **Operation Theatre (OT) Management**: Surgeon scheduling, pre-op anesthesia clearance checklists, tracking implant serial numbers (e.g., pacemakers) used during surgery.
- [x] **Dietary & Kitchen**: System auto-generates the daily kitchen load based on active patients and their doctor's dietary orders (e.g., 5 Diabetic diets, 2 Liquid diets).
- [x] **Central Sterile Services Department (CSSD)**: Tracking surgical instruments going into autoclaves and coming out sterile, mapped to specific upcoming surgeries.
- [x] **Biomedical Asset Management**: Tracking the maintenance, calibration schedules, and downtime of expensive machinery (e.g., MRI, Ventilators).
