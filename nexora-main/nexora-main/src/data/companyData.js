import {
    HeartPulse, Globe, FileText, Users, Layers, Award, Target,
    CheckCircle, Activity, Briefcase, Zap, Compass, MessageSquare,
    Shield, Cloud, Lock, Network, Cpu, Banknote, Database, Key,
    ClipboardList, Fingerprint, LayoutDashboard
} from 'lucide-react';

export const COMPANY_DATA = {
    'about-nexora': {
        title: 'About Nexora Health',
        tagline: 'Built for clinical excellence. Engineered for scale.',
        desc: 'Driven by clinical excellence and operational efficiency. Nexora Health is committed to modernizing hospital administration in India through scalable cloud architecture, intelligent modules, and frictionless interoperability.',
        icon: HeartPulse,
        stats: [
            { label: 'Hospitals Powered', value: '1,000+' },
            { label: 'Platform Uptime', value: '99.9%' },
            { label: 'Data Centers', value: 'Mumbai & AWS' },
        ],
        features: [
            { title: 'Our Mission', desc: 'To drastically reduce administrative burdens so doctors and nurses can focus 100% on patient care rather than paperwork.', icon: Target },
            { title: 'Digital First', desc: 'We believe that modern hospital administration requires discarding legacy fragmentation for unified, web-based excellence.', icon: Activity },
            { title: 'Security Above All', desc: 'Medical records are sensitive. That is why our core principle is defense-in-depth, treating every hospital as a private vault.', icon: Shield },
            { title: 'Clinical Autonomy', desc: 'Technology should conform to doctors, not the other way around. We build interfaces reflecting real-world clinical workflows.', icon: Layers },
            { title: 'Relentless Innovation', desc: 'From HL7 integrations to automated bi-directional lab feeds, we consistently push the boundaries of healthcare tech.', icon: Zap },
            { title: 'Award Winning Support', desc: 'Our dedicated success managers and 24/7 technical team ensure your hospital operations never skip a beat.', icon: Award }
        ],
        workflow: [
            { step: '2023', title: 'The Genesis', desc: 'Nexora Health was founded by a team of engineers and clinical administrators frustrated with legacy, disjointed HMS tools.' },
            { step: '2024', title: 'Seed Architecture', desc: 'Development of the core Multi-Tenant SaaS engine, ensuring true database isolation per hospital.' },
            { step: '2025', title: 'Market Expansion', desc: 'Onboarding our first 100 mid-sized hospitals across India, demonstrating absolute stability.' },
            { step: '2026', title: 'Enterprise Scale', desc: 'Launching advanced pharmacy analytics, native billing integrations, and scaling our operations Pan-India.' }
        ]
    },
    'about-global-webify': {
        title: 'The Parent Company',
        tagline: 'Global Webify: The visionaries behind Nexora Health.',
        desc: 'Nexora Health is a flagship product wholly owned and developed by Global Webify. We are a premier technology company dedicated to building enterprise-grade SaaS platforms that transform industries, starting with healthcare.',
        icon: Globe,
        stats: [
            { label: 'Ownership', value: '100% In-House' },
            { label: 'Global Reach', value: 'Expanding' },
            { label: 'Core Focus', value: 'Enterprise SaaS' },
        ],
        features: [
            { title: 'Product Visionaries', desc: 'We don’t just write code; we conceptualize, fund, and scale massive platforms like Nexora Health from the ground up.', icon: Target },
            { title: 'End-to-End Ownership', desc: 'From the first line of code to global marketing, Global Webify manages every aspect of the Nexora ecosystem.', icon: Layers },
            { title: 'Engineering Excellence', desc: 'Our elite internal team of software architects builds robust, cloud-native infrastructure for highly secure environments.', icon: Cloud },
            { title: 'Healthcare Transformation', desc: 'We recognized the fragmented state of hospital software and purpose-built Nexora to modernize the entire industry.', icon: HeartPulse },
            { title: 'Sustainable Growth', desc: 'As a profitable product company, we invest heavily in long-term R&D rather than short-term consultancy gigs.', icon: Banknote },
            { title: 'Security First', desc: 'Owning the product means we take absolute responsibility for our ISO/HIPAA compliant security architecture.', icon: Lock }
        ],
        workflow: [
            { step: 'Vision', title: 'Identifying the Gap', desc: 'Global Webify recognized the critical need for a modern, unified hospital management system in a fragmented market.' },
            { step: 'Incubate', title: 'In-House Development', desc: 'Our dedicated teams spent years architecting the multi-tenant SaaS foundation that would become Nexora.' },
            { step: 'Launch', title: 'Bringing to Market', desc: 'We officially launched Nexora Health as our flagship product, directly managing all sales and deployments.' },
            { step: 'Scale', title: 'Continuous Innovation', desc: 'Global Webify continuously pushes massive R&D resources into expanding Nexora’s clinical capabilities.' }
        ]
    },
    'blog': {
        title: 'Hospital Insights',
        tagline: 'Leading the conversation on healthcare IT.',
        desc: 'Get the latest trends, operational best practices, and insights on hospital administration, healthcare IT security, and compliance updates in India.',
        icon: FileText,
        stats: [
            { label: 'Published Articles', value: '150+' },
            { label: 'Monthly Readers', value: '45,000' },
            { label: 'Expert Contributors', value: '12' },
        ],
        features: [
            { title: 'Operational Efficiency', desc: 'Articles detailing how to reduce patient wait times and optimize your IPD bed turnover rate.', icon: Target },
            { title: 'Compliance & Legal', desc: 'Breaking down the latest changes in GST for pharmacies and Indian data privacy bills.', icon: FileText },
            { title: 'Tech Deep Dives', desc: 'Explaining the benefits of HL7 FHIR standards and bi-directional lab interfacing.', icon: Cpu },
            { title: 'Case Studies', desc: 'Real-world examples of mid-size clinics transforming their revenue cycle with Nexora.', icon: Briefcase },
            { title: 'Leadership Interviews', desc: 'Q&As with leading hospital CEOs regarding the future of telemedicine.', icon: MessageSquare },
            { title: 'Product Updates', desc: 'Detailed release notes outlining new features, optimizations, and API endpoints.', icon: Zap }
        ],
        workflow: [
            { step: '01', title: 'Clinical Feedback', desc: 'Our researchers interview hospital directors to understand their daily paint points.' },
            { step: '02', title: 'Data Analysis', desc: 'We analyze anonymized aggregate data to uncover macro trends in hospital revenue cycles.' },
            { step: '03', title: 'Expert Drafting', desc: 'Technical writers and medical consultants draft actionable, high-quality insights.' },
            { step: '04', title: 'Community Sharing', desc: 'The articles are distributed across our newsletter, LinkedIn, and hospital admin portals.' }
        ]
    },
    'careers': {
        title: 'Build the Future of Healthcare',
        tagline: 'Your code can save lives.',
        desc: 'Join our team of passionate software engineers and healthcare innovators. Help us shape the future of medical care administration, reduce clinical friction, and scale a truly impactful SaaS platform.',
        icon: Users,
        stats: [
            { label: 'Current Team Size', value: '85 Staff' },
            { label: 'Open Positions', value: '12 Active' },
            { label: 'Employee NPS', value: '4.8/5' },
        ],
        features: [
            { title: 'Mission-Driven Work', desc: 'Know that the dashboard you optimized today helps a doctor treat a critical patient faster tomorrow.', icon: HeartPulse },
            { title: 'Engineering Culture', desc: 'We value clean code, peer reviews, rigorous typing, and architectural elegance.', icon: LayoutDashboard },
            { title: 'Competitive Compensation', desc: 'Top-of-market salaries, comprehensive health insurance, and generous equity packages.', icon: Banknote },
            { title: 'Remote-First Flexibility', desc: 'Work from our hubs or your home office. We judge by output and impact, not hours logged.', icon: Compass },
            { title: 'Continuous Growth', desc: 'Annual budgets for courses, AWS certifications, and tech conference attendances.', icon: Award },
            { title: 'Inclusive Environment', desc: 'A diverse, psychological safe workspace where the best idea wins, regardless of title.', icon: Users }
        ],
        workflow: [
            { step: '01', title: 'Application', desc: 'Submit your resume and, importantly, your GitHub or portfolio displaying complex problem solving.' },
            { step: '02', title: 'Screening', desc: 'A 30-minute introductory call to align on mutual expectations, culture, and your career goals.' },
            { step: '03', title: 'Technical Assessment', desc: 'A practical take-home assignment or live coding session relevant to the actual work you will do.' },
            { step: '04', title: 'Final Interview', desc: 'Meeting the founders and team leads to discuss architecture, vision, and final offer details.' }
        ]
    },
    'press-kit': {
        title: 'Media & Press Resources',
        tagline: 'Everything you need to cover our journey.',
        desc: 'Download high-resolution vector logos, official brand assets, executive team bios, and comprehensive PDF fact sheets for media coverage and partnership literature.',
        icon: Layers,
        stats: [
            { label: 'Media Mentions', value: '45+' },
            { label: 'Brand Assets', value: 'High Res SVG' },
            { label: 'Fact Sheet', value: 'Updated 2026' },
        ],
        features: [
            { title: 'Brand Guidelines', desc: 'The official rulebook on our colors (#00C2FF, #0A2E4D), typography, and logo clear-space.', icon: Target },
            { title: 'High-Res Logos', desc: 'Download our primary, monochrome, and stacked SVG/PNG logos for light and dark backgrounds.', icon: Layers },
            { title: 'Executive Headshots', desc: 'Professionally captured, high-resolution photographs of our founding and leadership team.', icon: Users },
            { title: 'Product Screenshots', desc: 'Approved, anonymized UI captures demonstrating the clinical dashboard and EMR interface.', icon: LayoutDashboard },
            { title: 'Company Fact Sheet', desc: 'A 2-page PDF summarizing our founding story, total hospitals onboarded, and core value proposition.', icon: FileText },
            { title: 'Media Contact', desc: 'Direct secure lines to our PR and communications department for interview scheduling.', icon: MessageSquare }
        ],
        workflow: [
            { step: 'Logos', title: 'Visuals', desc: 'Ensure you use the provided SVG variants to maintain crispness across all digital publications.' },
            { step: 'Colors', title: 'Palette', desc: 'Do not alter the gradient vectors. Stick to our primary deep navy and cyan highlights.' },
            { step: 'Stats', title: 'Accuracy', desc: 'Please reference the downloadable fact sheet for the most up-to-date hospital growth numbers.' },
            { step: 'Contact', title: 'Inquiries', desc: 'Reach out to press@nexorahealth.com for any custom asset requests or founder interview slots.' }
        ]
    }
};

export const LEGAL_DATA = {
    'privacy-policy': {
        title: 'Privacy Policy',
        tagline: 'Your privacy is non-negotiable.',
        desc: 'Review our comprehensive policies regarding data collection, patient confidentiality processing, footprint tracking, and information security in strict compliance with current Indian data protection laws.',
        icon: FileText,
        stats: [
            { label: 'Last Updated', value: 'Oct 2025' },
            { label: 'Data Mining', value: 'Zero' },
            { label: 'Consent Model', value: 'Opt-in Only' },
        ],
        features: [
            { title: 'Data Minimization', desc: 'We only collect the absolute minimum administrative data required to provide the SaaS service.', icon: Target },
            { title: 'Tenant Isolation', desc: 'Your hospital data is never aggregated or co-mingled with other tenants for "analytics".', icon: Shield },
            { title: 'Patient Confidentiality', desc: 'We cannot and do not read any PHI (Protected Health Information) stored in the EMR.', icon: Lock },
            { title: 'No Third-Party Sales', desc: 'Nexora Health will never sell, rent, or lease hospital or patient data to pharma or ad networks.', icon: Banknote },
            { title: 'Cookie Policy', desc: 'We only use session and security cookies on the dashboard—zero cross-site tracking pixels.', icon: Compass },
            { title: 'Right to Erasure', desc: 'Hospitals have the right to request a complete cryptographic wipe of their tenant database upon exit.', icon: Database }
        ]
    },
    'terms-of-service': {
        title: 'Terms of Service',
        tagline: 'The rules of engagement.',
        desc: 'The definitive agreement governing your access to and use of Nexora Health\'s multi-tenant software, mobile applications, APIs, and associated documentation.',
        icon: FileText,
        stats: [
            { label: 'Current Version', value: 'v3.2' },
            { label: 'Jurisdiction', value: 'India' },
            { label: 'SLA Guarantee', value: '99.9%' },
        ],
        features: [
            { title: 'Acceptable Use', desc: 'The platform is solely for clinical and administrative management. Spamming API endpoints is strictly prohibited.', icon: Shield },
            { title: 'Subscription Terms', desc: 'Details regarding trial periods, monthly and annual billing cycles, and our prorated refund policies.', icon: Banknote },
            { title: 'Intellectual Property', desc: 'Nexora Health retains all rights to the source code, UI/UX, and algorithms. The hospital retains 100% rights to their data.', icon: Key },
            { title: 'Service Level Agreement', desc: 'Outlining our 99.9% uptime commitment, scheduled maintenance windows, and resulting credit policies for downtime.', icon: Activity },
            { title: 'Account Suspension', desc: 'Conditions under which an account may be suspended (e.g., non-payment, malicious activity).', icon: Lock },
            { title: 'Limitation of Liability', desc: 'Standard business limitations regarding indirect damages or clinical outcomes based on software usage.', icon: ClipboardList }
        ]
    },
    'data-processing': {
        title: 'Data Processing Agreement',
        tagline: 'How we handle your sensitive records.',
        desc: 'Detailed regulatory terms defining our role as a data processor for your hospital\'s sensitive patient electronic health records and financial data.',
        icon: Database,
        stats: [
            { label: 'Compliance Level', value: 'Maximum' },
            { label: 'Role', value: 'Processor' },
            { label: 'Encryption', value: 'AES-256' },
        ],
        features: [
            { title: 'Processor Obligations', desc: 'Nexora acts solely on the documented instructions of the Hospital (the Data Controller).', icon: FileText },
            { title: 'Security Safeguards', desc: 'Implementing technical measures like AES-256 encryption at rest and TLS 1.3 in transit.', icon: Lock },
            { title: 'Sub-processors', desc: 'A transparent list of infrastructure providers we use (e.g., AWS, Razorpay) and their compliance status.', icon: Layers },
            { title: 'Breach Notification', desc: 'Our strict commitment to notify the hospital admin within 24 hours of uncovering a confirmed security incident.', icon: ShieldAlert },
            { title: 'Audit Rights', desc: 'Enterprise hospitals have the right to request third-party SOC2 compliance reports and penetration testing summaries.', icon: CheckCircle },
            { title: 'Data Portability', desc: 'Our mechanism for allowing hospitals to export their entire PostgreSQL database upon contract termination.', icon: Network }
        ]
    },
    'hipaa-compliance': {
        title: 'HIPAA & Compliance Alignment',
        tagline: 'Security measures meeting international standards.',
        desc: 'Explore the technical safeguards and physical security measures our SaaS ERP platform takes to maintain strict HIPAA alignment and Indian healthcare data regulatory compliance.',
        icon: Shield,
        stats: [
            { label: 'Access Control', value: 'RBAC Active' },
            { label: 'Audit Logging', value: 'Comprehensive' },
            { label: 'Transmission', value: 'TLS 1.3 Only' },
        ],
        features: [
            { title: 'Unique User Identification', desc: 'Every doctor and nurse must log in with unique, non-shared credentials with strong password hashing.', icon: Key },
            { title: 'Automatic Logoff', desc: 'Sessions automatically expire after a period of inactivity to prevent unauthorized terminal access.', icon: Clock },
            { title: 'Emergency Access Rules', desc: 'Defined "break-glass" protocols for administrators to override access during critical clinical emergencies.', icon: Activity },
            { title: 'Audit Controls', desc: 'Hardware, software, and procedural mechanisms that record and examine activity in information systems.', icon: Fingerprint },
            { title: 'Integrity Controls', desc: 'Corroborating that electronic protected health information has not been altered or destroyed in an unauthorized manner.', icon: Database },
            { title: 'Transmission Security', desc: 'Strict guards against unauthorized access to medical data being transmitted over an electronic communications network.', icon: Lock }
        ]
    },
    'security': {
        title: 'Platform Security Posture',
        tagline: 'Built like a digital fortress.',
        desc: 'Read about our AES-256 cloud encryption, strict per-tenant database isolation, rate limiting middleware, and routine penetration testing ensuring system safety.',
        icon: Lock,
        stats: [
            { label: 'Database Architecture', value: 'Per-Tenant Isolation' },
            { label: 'Password Storage', value: 'Bcrypt Hashed' },
            { label: 'Pen Test Frequency', value: 'Bi-Annual' },
        ],
        features: [
            { title: 'Network Firewalls', desc: 'Strict ingress and egress AWS security groups ensure the database is never exposed to the public internet.', icon: Shield },
            { title: 'Rate Limiting', desc: 'Advanced middleware throttles brute-force login attempts and DDoS attacks by analyzing IP velocity.', icon: Activity },
            { title: 'Role-Based Access (RBAC)', desc: 'Granular permissions ensure a receptionist cannot view detailed surgical notes meant only for the Chief Medical Officer.', icon: Users },
            { title: 'Daily Automated Backups', desc: 'Snapshots are securely stored in S3 across multiple availability zones with point-in-time recovery capabilities.', icon: Cloud },
            { title: 'Static Code Analysis', desc: 'Every code deployment runs through automated SAST tools looking for SQL injection and XSS vulnerabilities.', icon: Cpu },
            { title: 'Vulnerability Disclosure', desc: 'A formal bug bounty pipeline allowing security researchers to report findings securely to our engineering team.', icon: AlertTriangle }
        ]
    }
};

import { ShieldAlert, AlertTriangle, Clock } from 'lucide-react';
