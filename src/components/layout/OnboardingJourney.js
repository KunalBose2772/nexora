'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

// ── Tour steps: each targets a real DOM element by ID ─────────────────────────
// selector: CSS selector of element to highlight
// place: where to put the tooltip card relative to the spotlight
// (auto = we calculate the best side)
const TOUR_STEPS = [
    {
        selector: null, // null = full-screen welcome card, no spotlight
        title: 'Welcome to Nexora Health! 👋',
        emoji: '🏥',
        description: "You're about to get a guided tour of your hospital management system. We'll walk through every section — one by one — so you know exactly where everything is. You can skip any time.",
        position: 'center',
    },
    {
        selector: '#nav-dashboard',
        title: 'Dashboard',
        emoji: '📊',
        description: "This is your home base. The Dashboard gives you a real-time summary of today's appointments, current inpatients, revenue collected, and any critical alerts — all in one glance.",
        position: 'right',
    },
    {
        selector: '#tour-kpi-patients',
        title: 'Total Patients',
        emoji: '👥',
        description: "This card shows how many patients are registered in the system. Click it to go to the full Patient Management module where you can view EMRs, history, and documents.",
        position: 'bottom',
    },
    {
        selector: '#tour-kpi-today',
        title: "Today's Appointments",
        emoji: '📅',
        description: "Real-time count of appointments scheduled for today, along with how many are still pending. Click to view and manage the appointment queue.",
        position: 'bottom',
    },
    {
        selector: '#tour-kpi-ipd',
        title: 'Active Inpatients (IPD)',
        emoji: '🛏️',
        description: "Shows the number of patients currently admitted in your wards. Click to go to the IPD module where you can check their ward, bed, and daily status.",
        position: 'bottom',
    },
    {
        selector: '#tour-kpi-revenue-today',
        title: "Today's Revenue",
        emoji: '💰',
        description: "Revenue collected from paid invoices today. The subtitle shows your all-time total collected. Click to enter the Billing module.",
        position: 'bottom',
    },
    {
        selector: '#tour-quick-actions',
        title: 'Quick Actions',
        emoji: '⚡',
        description: "One-click shortcuts to the most common hospital tasks — Register a new patient, Book an appointment, Admit to IPD, create a Lab Request, Prescribe medicine, and more.",
        position: 'top',
    },
    {
        selector: '#nav-patients',
        title: 'Patient Management',
        emoji: '🧑‍⚕️',
        description: "The complete Electronic Medical Record (EMR) module. Register new patients, search by name or UH-ID, view visit history, upload documents, and track prescriptions.",
        position: 'right',
    },
    {
        selector: '#nav-appointments',
        title: 'Appointments',
        emoji: '🗓️',
        description: "Schedule and manage OPD and IPD appointments. Assign doctors, set times, and track statuses from Scheduled → In Progress → Completed.",
        position: 'right',
    },
    {
        selector: '#nav-opd',
        title: 'OPD — Outpatient',
        emoji: '🩺',
        description: "The live OPD queue. Walk-in and appointment patients appear here. It even announces patient names via audio in English & Hindi — completely hands-free for receptionists.",
        position: 'right',
    },
    {
        selector: '#nav-ipd',
        title: 'IPD / Wards',
        emoji: '🏨',
        description: "Admit patients, assign ward beds, track daily inpatient status, and discharge them. The Wards view shows you a real-time bed occupancy map by ward.",
        position: 'right',
    },
    {
        selector: '#nav-laboratory',
        title: 'Laboratory',
        emoji: '🔬',
        description: "Create lab test requests linked directly to patients. Track each test's status from Pending → Sample Collected → Completed. Results are stored against the patient record.",
        position: 'right',
    },
    {
        selector: '#nav-pharmacy',
        title: 'Pharmacy',
        emoji: '💊',
        description: "Manage your medicine inventory with real-time stock levels, expiry tracking, and low-stock alerts. Prescriptions from doctors auto-create dispensation requests here.",
        position: 'right',
    },
    {
        selector: '#nav-billing',
        title: 'Billing & Finance',
        emoji: '🧾',
        description: "Generate GST-compliant invoices for OPD, IPD, pharmacy and lab services. Track hospital expenses, outstanding dues, and overall financial performance.",
        position: 'right',
    },
    {
        selector: '#nav-hr',
        title: 'HR & Staff',
        emoji: '👩‍💼',
        description: "Add doctors, nurses, and admin staff. Assign roles and departments (Doctor, Nurse, Receptionist, Admin). Each staff member gets their own login with role-based access.",
        position: 'right',
    },
    {
        selector: '#nav-reports',
        title: 'Analytics & Reports',
        emoji: '📈',
        description: "Comprehensive data reports — monthly revenue charts, department-wise analytics, patient growth trends, and appointment summaries. Export for management or compliance needs.",
        position: 'right',
    },
    {
        selector: '#nav-branding',
        title: 'Website Branding',
        emoji: '🎨',
        description: "Customise your hospital's public-facing identity — upload logo, hero banner, set brand colours and tagline. This data powers your public hospital webpage.",
        position: 'right',
    },
    {
        selector: '#nav-branches',
        title: 'Branches',
        emoji: '🏢',
        description: "If you manage multiple hospital locations or clinics, add each branch here with its contact details, address, and status. All branches operate under the same account.",
        position: 'right',
    },
    {
        selector: '#nav-settings',
        title: 'Settings',
        emoji: '⚙️',
        description: "Configure your hospital profile, notification preferences, user management, and system-level configurations. Admin and above roles can access this section.",
        position: 'right',
    },
    {
        selector: null, // Final step — centered card
        title: "Tour Complete! 🚀",
        emoji: '✅',
        description: "You now know your way around Nexora Health. Start by registering your first patient or setting up your hospital profile in Settings. You can replay this tour anytime from your user menu.",
        position: 'center',
    },
];

const PADDING = 12; // spotlight padding around element

function useRect(selector) {
    const [rect, setRect] = useState(null);

    const measure = useCallback(() => {
        if (!selector) { setRect(null); return; }
        const el = document.querySelector(selector);
        if (!el) { setRect(null); return; }
        const r = el.getBoundingClientRect();
        setRect({
            top: r.top - PADDING,
            left: r.left - PADDING,
            width: r.width + PADDING * 2,
            height: r.height + PADDING * 2,
            bottom: r.bottom + PADDING,
            right: r.right + PADDING,
            centerX: r.left + r.width / 2,
            centerY: r.top + r.height / 2,
        });
    }, [selector]);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, true);
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure, true);
        };
    }, [measure]);

    return rect;
}

function Spotlight({ rect }) {
    if (!rect) return null;

    // Use SVG with a cutout: a full-screen rect minus the spotlight hole
    return (
        <svg
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9990,
                pointerEvents: 'none',
            }}
        >
            <defs>
                <mask id="spotlight-mask">
                    {/* White = show overlay; Black = transparent hole */}
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <rect
                        x={rect.left}
                        y={rect.top}
                        width={rect.width}
                        height={rect.height}
                        rx="12"
                        fill="black"
                    />
                </mask>
            </defs>
            {/* Dark backdrop with the hole cut out */}
            <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(7, 18, 32, 0.82)"
                mask="url(#spotlight-mask)"
            />
            {/* Glowing border around the spotlight */}
            <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx="12"
                fill="none"
                stroke="#00C2FF"
                strokeWidth="2"
                opacity="0.8"
                style={{ filter: 'drop-shadow(0 0 8px #00C2FF)' }}
            />
        </svg>
    );
}

function RipplePulse({ rect }) {
    if (!rect) return null;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r = Math.max(rect.width, rect.height) / 2 + 8;

    return (
        <svg
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9991,
                pointerEvents: 'none',
            }}
        >
            {[0, 0.4, 0.8].map((delay, i) => (
                <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#00C2FF"
                    strokeWidth="1.5"
                    opacity="0"
                    style={{
                        animation: `ripplePulse 2s ease-out ${delay}s infinite`,
                    }}
                />
            ))}
        </svg>
    );
}

function TooltipCard({ rect, step, stepIndex, totalSteps, onNext, onPrev, onSkip, isFirst, isLast }) {
    const CARD_W = 340;
    const CARD_H = 240; // estimated
    const ARROW_SIZE = 10;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

    let style = {};
    let arrowStyle = {};
    let arrowDir = null;

    if (!rect || step.position === 'center') {
        // Centered welcome/done card
        style = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: `${CARD_W}px`,
        };
    } else {
        // Position tooltip relative to the spotlight
        // Prefer right, then left, then bottom, then top
        const pos = step.position;
        const gutter = 20;

        if (pos === 'right' && rect.right + CARD_W + gutter < vw) {
            style = {
                position: 'fixed',
                top: `${Math.min(Math.max(rect.top, 10), vh - CARD_H - 10)}px`,
                left: `${rect.right + gutter}px`,
                zIndex: 9999,
                width: `${CARD_W}px`,
            };
            arrowDir = 'left';
            arrowStyle = {
                position: 'absolute',
                left: `-${ARROW_SIZE}px`,
                top: '24px',
                borderTop: `${ARROW_SIZE}px solid transparent`,
                borderBottom: `${ARROW_SIZE}px solid transparent`,
                borderRight: `${ARROW_SIZE}px solid #FFFFFF`,
            };
        } else if (pos === 'left' && rect.left - CARD_W - gutter > 0) {
            style = {
                position: 'fixed',
                top: `${Math.min(Math.max(rect.top, 10), vh - CARD_H - 10)}px`,
                left: `${rect.left - CARD_W - gutter}px`,
                zIndex: 9999,
                width: `${CARD_W}px`,
            };
            arrowDir = 'right';
            arrowStyle = {
                position: 'absolute',
                right: `-${ARROW_SIZE}px`,
                top: '24px',
                borderTop: `${ARROW_SIZE}px solid transparent`,
                borderBottom: `${ARROW_SIZE}px solid transparent`,
                borderLeft: `${ARROW_SIZE}px solid #FFFFFF`,
            };
        } else if (pos === 'bottom' && rect.bottom + CARD_H + gutter < vh) {
            style = {
                position: 'fixed',
                top: `${rect.bottom + gutter}px`,
                left: `${Math.min(Math.max(rect.left, 10), vw - CARD_W - 10)}px`,
                zIndex: 9999,
                width: `${CARD_W}px`,
            };
            arrowDir = 'top';
            arrowStyle = {
                position: 'absolute',
                top: `-${ARROW_SIZE}px`,
                left: '32px',
                borderLeft: `${ARROW_SIZE}px solid transparent`,
                borderRight: `${ARROW_SIZE}px solid transparent`,
                borderBottom: `${ARROW_SIZE}px solid #FFFFFF`,
            };
        } else {
            // top fallback
            style = {
                position: 'fixed',
                bottom: `${vh - rect.top + gutter}px`,
                left: `${Math.min(Math.max(rect.left, 10), vw - CARD_W - 10)}px`,
                zIndex: 9999,
                width: `${CARD_W}px`,
            };
            arrowDir = 'bottom';
            arrowStyle = {
                position: 'absolute',
                bottom: `-${ARROW_SIZE}px`,
                left: '32px',
                borderLeft: `${ARROW_SIZE}px solid transparent`,
                borderRight: `${ARROW_SIZE}px solid transparent`,
                borderTop: `${ARROW_SIZE}px solid #FFFFFF`,
            };
        }
    }

    return (
        <div
            style={{
                ...style,
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,194,255,0.2)',
                padding: '24px',
                animation: 'tooltipSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
        >
            {/* Gradient top bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, #00C2FF, #10B981, #8B5CF6)',
                borderRadius: '16px 16px 0 0',
            }} />

            {/* Arrow */}
            {arrowDir && <div style={{ width: 0, height: 0, ...arrowStyle }} />}

            {/* Step counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#00C2FF', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(0,194,255,0.08)', padding: '4px 10px', borderRadius: '20px' }}>
                    Step {stepIndex + 1} of {totalSteps}
                </span>
                <button
                    onClick={onSkip}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, padding: '4px 8px', borderRadius: '6px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                    <X size={13} /> Skip Tour
                </button>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{step.emoji}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    {step.title}
                </h3>
            </div>

            {/* Description */}
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.65, margin: '0 0 20px' }}>
                {step.description}
            </p>

            {/* Progress bar */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '99px',
                            background: i <= stepIndex ? '#00C2FF' : '#E2E8F0',
                            transition: 'background 0.3s',
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {!isFirst && (
                    <button
                        onClick={onPrev}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '9px 16px', background: '#F8FAFC',
                            border: '1px solid #E2E8F0', borderRadius: '9px',
                            fontSize: '13px', fontWeight: 600, color: '#64748B',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
                    >
                        <ChevronLeft size={14} /> Back
                    </button>
                )}
                <button
                    onClick={onNext}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px 18px',
                        background: isLast
                            ? 'linear-gradient(135deg, #10B981, #059669)'
                            : 'linear-gradient(135deg, #0A2E4D, #00C2FF)',
                        color: 'white',
                        border: 'none', borderRadius: '9px',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: isLast
                            ? '0 4px 12px rgba(16,185,129,0.3)'
                            : '0 4px 12px rgba(0,194,255,0.25)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {isLast ? <>Done! <ArrowRight size={14} /></> : <>Next <ChevronRight size={14} /></>}
                </button>
            </div>
        </div>
    );
}

export default function OnboardingJourney() {
    const [visible, setVisible] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem('nexora_onboarding_done');
        if (!done) {
            setTimeout(() => setVisible(true), 700);
        }
    }, []);

    const dismiss = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            setClosing(false);
            localStorage.setItem('nexora_onboarding_done', '1');
        }, 300);
    }, []);

    const next = useCallback(() => {
        if (stepIndex < TOUR_STEPS.length - 1) {
            setStepIndex(i => i + 1);
        } else {
            dismiss();
        }
    }, [stepIndex, dismiss]);

    const prev = useCallback(() => {
        if (stepIndex > 0) setStepIndex(i => i - 1);
    }, [stepIndex]);

    const step = TOUR_STEPS[stepIndex];
    const rect = useRect(step?.selector ?? null);

    // Scroll element into view when spotlight targets it
    useEffect(() => {
        if (!step?.selector) return;
        const el = document.querySelector(step.selector);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [step?.selector]);

    if (!visible) return null;

    const isFirst = stepIndex === 0;
    const isLast = stepIndex === TOUR_STEPS.length - 1;

    return (
        <>
            {/* Full-screen dark overlay (for no-selector intro/outro steps) */}
            {!rect && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9990,
                        background: 'rgba(7, 18, 32, 0.82)',
                        backdropFilter: 'blur(4px)',
                        animation: closing ? 'backdropFadeOut 0.3s ease forwards' : 'backdropFadeIn 0.3s ease forwards',
                    }}
                    onClick={dismiss}
                />
            )}

            {/* SVG Spotlight with cutout */}
            {rect && <Spotlight rect={rect} />}

            {/* Pulsing ripple on spotlighted element */}
            {rect && <RipplePulse rect={rect} />}

            {/* Tooltip card */}
            <TooltipCard
                rect={rect}
                step={step}
                stepIndex={stepIndex}
                totalSteps={TOUR_STEPS.length}
                onNext={next}
                onPrev={prev}
                onSkip={dismiss}
                isFirst={isFirst}
                isLast={isLast}
            />

            <style>{`
                @keyframes backdropFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes backdropFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes tooltipSlideIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes ripplePulse {
                    0% { opacity: 0.6; r: 0; }
                    100% { opacity: 0; r: 60; }
                }
            `}</style>
        </>
    );
}
