import {
    Shield, Building2, Layers, Cpu, Server, Activity, Database, Lock, Globe,
    LayoutDashboard, Network, Key, Workflow, Cloud, FileText, Users, CalendarDays
} from 'lucide-react';

export const PLATFORM_DATA = {
    'super-admin': {
        title: 'Super Admin Control Panel',
        tagline: 'Absolute oversight over your SaaS empire.',
        desc: 'Centrally manage your SaaS platform with total visibility. Handle tenants, subscriptions, database provisioning, system-wide metrics, and granular feature toggles from a command center built for scale.',
        icon: Shield,
        stats: [
            { label: 'Tenant Onboarding', value: '< 2 Mins' },
            { label: 'System Visibility', value: '100% Granular' },
            { label: 'Uptime Tracking', value: '99.9%' },
        ],
        features: [
            { title: 'Tenant Provisioning', desc: 'Create a new hospital tenant with an isolated PostgreSQL database running on AWS instantly.', icon: Database },
            { title: 'Subscription Management', desc: 'Upgrade, downgrade, or suspend hospital accounts. Manage Stripe and Razorpay webhook integrations seamlessly.', icon: Activity },
            { title: 'Feature Toggles', desc: 'Enable or disable specific modules (like Pharmacy or IPD) per tenant. The UI reacts instantly for the hospital.', icon: LayoutDashboard },
            { title: 'System Audits', desc: 'Monitor error logs, failed logins, and webhook delivery status across all tenants in one global dashboard.', icon: Lock },
            { title: 'Reseller Management', desc: 'Create partner accounts that allow agents to onboard hospitals and earn strict commissions tracked by the system.', icon: Network },
            { title: 'Global Announcements', desc: 'Push maintenance windows or new feature release banners straight to all logged-in hospital staff.', icon: Globe }
        ],
        workflow: [
            { step: '01', title: 'Hospital Signup', desc: 'A hospital registers online and selects a subscription plan (Starter, Pro, Enterprise).' },
            { step: '02', title: 'Automated Provisioning', desc: 'The Super Admin engine spins up a dedicated database and isolates S3 storage for the tenant.' },
            { step: '03', title: 'Onboarding Email', desc: 'Hospital admin securely receives credentials to login to their isolated environment.' },
            { step: '04', title: 'Ongoing Monitoring', desc: 'Super admin passively monitors billing usage and API rate limits per tenant.' }
        ]
    },
    'multi-branch': {
        title: 'Multi-Branch Support Architecture',
        tagline: 'Scale endlessly without losing control.',
        desc: 'A unified single-tenant architecture deliberately designed to manage multiple hospital branches seamlessly. Centralized patient data with strictly localized financial control and inventory isolation.',
        icon: Building2,
        stats: [
            { label: 'Max Supported Branches', value: 'Unlimited' },
            { label: 'Cross-Branch Sync', value: 'Instant' },
            { label: 'Data Isolation', value: 'Complete' },
        ],
        features: [
            { title: 'Universal Patient ID (UHID)', desc: 'A patient registered in Branch A can visit Branch B. Their complete medical history follows them securely.', icon: Key },
            { title: 'Localized Inventory', desc: 'Branch A’s pharmacy stock is completely hidden and isolated from Branch B, preventing accounting nightmares.', icon: Layers },
            { title: 'Role Access by Branch', desc: 'Assign a doctor to multiple branches, but restrict a receptionist to logging into only their specific location.', icon: Shield },
            { title: 'Consolidated Reporting', desc: 'Management can view revenue aggregations across all branches, or filter down to a single location’s performance.', icon: LayoutDashboard },
            { title: 'Inter-Branch Stock Transfers', desc: 'Move medical supplies between your hospitals using formal transfer orders and Goods Receipt Notes (GRN).', icon: Network },
            { title: 'Unified Patient Portal', desc: 'Patients log into one app to see all their appointments and reports, regardless of which branch they visited.', icon: Globe }
        ],
        workflow: [
            { step: '01', title: 'Branch Creation', desc: 'Tenant admin creates a new facility profile, assigning it a location, GST number, and billing prefix.' },
            { step: '02', title: 'Staff Allocation', desc: 'Doctors, nurses, and receptionists are assigned specific roles tied only to that branch.' },
            { step: '03', title: 'Independent Operations', desc: 'The new branch operates its own OPD, IPD, and Pharmacy, processing daily patients.' },
            { step: '04', title: 'Centralized Visibility', desc: 'Hospital management views a consolidated P&L report securely from headquarters.' }
        ]
    },
    'hospital-cms': {
        title: 'Hospital CMS & Public Website',
        tagline: 'Your hospital’s digital front door.',
        desc: 'Empower your hospital to build, manage, and update their patient-facing website directly from the administration dashboard—no coding or external developers required.',
        icon: Globe,
        stats: [
            { label: 'Website Uptime', value: '99.9%' },
            { label: 'SEO Readiness', value: 'Enterprise Grade' },
            { label: 'Deployment Time', value: 'Instant Publish' },
        ],
        features: [
            { title: 'Visual Page Builder', desc: 'Create unlimited pages (About, Services, Testimonials) using modular blocks directly in the admin panel.', icon: LayoutDashboard },
            { title: 'Doctor Directory Integration', desc: 'Staff added as "Doctors" in the HR module automatically populate on the public website with their specialties.', icon: Users },
            { title: 'Integrated Appointment Booking', desc: 'Patients browsing the public site can book real-time OPD slots that instantly reflect in the receptionist\'s calendar.', icon: CalendarDays },
            { title: 'Dynamic SEO Control', desc: 'Set custom meta titles, descriptions, and OpenGraph tags per page to dominate local search results.', icon: Globe },
            { title: 'Secure Blogs & Press', desc: 'Publish health tips and hospital news to establish clinical authority in your region.', icon: FileText },
            { title: 'Custom Domain Mapping', desc: 'Hospitals can seamlessly map their own domain (e.g., cityhospital.com) to our hosted CMS.', icon: Network }
        ],
        workflow: [
            { step: '01', title: 'Theme Selection', desc: 'Hospital admin selects a modern, conversion-optimized template and uploads their logo.' },
            { step: '02', title: 'Content Population', desc: 'Easily update text for the hero section, services, and add high-resolution gallery images.' },
            { step: '03', title: 'Meta Optimization', desc: 'Add SEO keywords and configure Google Analytics tracking IDs effortlessly.' },
            { step: '04', title: 'Live Deployment', desc: 'Click publish. The website goes live immediately, ready to capture patient leads.' }
        ]
    },
    'api-access': {
        title: 'Developer REST APIs',
        tagline: 'The extensibility your IT department demands.',
        desc: 'Connect your hospital infrastructure securely. Seamlessly integrate diagnostic auto-analyzers, external HR software, PowerBI dashboards, and custom mobile apps directly to your sandbox.',
        icon: Cpu,
        stats: [
            { label: 'Average Rate Limit', value: '1000 req/min' },
            { label: 'Response Time', value: '< 150ms' },
            { label: 'API Security', value: 'Stateless JWT' },
        ],
        features: [
            { title: 'HL7 & FHIR Compliance', desc: 'Structured payloads built around modern health data standards ensuring interoperability.', icon: Shield },
            { title: 'Bi-Directional Lab Interfacing', desc: 'Push orders from the EMR precisely to your specific cell counters and pull results back automatically.', icon: Activity },
            { title: 'Granular API Keys', desc: 'Issue access tokens that restrict specific systems (e.g., read-only patient demographics for marketing).', icon: Key },
            { title: 'Comprehensive Webhooks', desc: 'Listen to real-time events—like patient admission or bill generation—and trigger workflows in Zapier or custom code.', icon: Network },
            { title: 'Custom Analytics Feeds', desc: 'Securely extract an anonymized daily feed of financial and clinical data into external BI tools like Tableau.', icon: Database },
            { title: 'Interactive Developer Docs', desc: 'Beautifully crafted Swagger/OpenAPI documentation letting your IT team test endpoints right in the browser.', icon: FileText }
        ],
        workflow: [
            { step: '01', title: 'Token Generation', desc: 'IT engineer generates a secure JWT Bearer Token in the hospital admin panel.' },
            { step: '02', title: 'Endpoint Testing', desc: 'Using the provided Swagger documentation, developers test reading patient records and posting lab results.' },
            { step: '03', title: 'Integration Build', desc: 'The hospital writes lightweight middleware connecting their physical lab machine to Nexora\'s REST endpoint.' },
            { step: '04', title: 'Production Go-Live', desc: 'The auto-analyzer now seamlessly syncs data into patient charts without human intervention.' }
        ]
    },
    'integrations': {
        title: 'Ecosystem Integrations',
        tagline: 'Nexora plays well with everyone.',
        desc: 'Pre-built, click-to-install connectors for payment gateways, WhatsApp notifications, accounting software, and insurance claim portals to make your workflow frictionless.',
        icon: Server,
        stats: [
            { label: 'WhatsApp Delivery Rate', value: '99.8%' },
            { label: 'Payment Sync Failures', value: '0%' },
            { label: 'Available Apps', value: '15+ Core' },
        ],
        features: [
            { title: 'Razorpay & Stripe Integration', desc: 'Instantly collect advance booking fees or IPD deposits safely via cards, UPI, or NetBanking.', icon: Lock },
            { title: 'WhatsApp Business API', desc: 'Send automated appointment reminders, lab report PDFs, and payment receipts directly to patient numbers.', icon: Globe },
            { title: 'Tally & QuickBooks Export', desc: 'Generate 1-click accounting journal entries mapping your hospital\'s ledger directly for CA compliance.', icon: Activity },
            { title: 'Email SMTP Configuration', desc: 'Use Amazon SES, SendGrid, or your own SMTP credentials for delivering marketing campaigns and billing notifications.', icon: Server },
            { title: 'National Health ID (ABHA)', desc: 'Generate and link Indian Ayushman Bharat Health Accounts for patients seamlessly from the reception.', icon: Shield },
            { title: 'Cloud PACS & DICOM Viewers', desc: 'Embed external diagnostic imaging viewers directly inside our EMR window via specialized iframe connections.', icon: Layers }
        ],
        workflow: [
            { step: '01', title: 'Select App', desc: 'Hospital admin navigates to the Integrations Marketplace in the dashboard.' },
            { step: '02', title: 'Provide Keys', desc: 'Admin enters their specific API Keys (e.g., Razorpay Key ID and Secret) securely into the TLS-encrypted vault.' },
            { step: '03', title: 'Activate Webhooks', desc: 'Nexora automatically registers the required event listeners with the third party.' },
            { step: '04', title: 'Automated Operations', desc: 'Patients instantly start receiving WhatsApp alerts for their upcoming scheduled visits.' }
        ]
    }
};
