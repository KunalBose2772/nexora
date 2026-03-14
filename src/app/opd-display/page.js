'use client';
import { useState, useEffect, useRef } from 'react';
import { Activity, Clock, LogOut, ArrowRight, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function TokenDisplayPage() {
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch queue', err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const intervalId = setInterval(fetchQueue, 5000);
    const clockId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(intervalId);
      clearInterval(clockId);
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const opdAppointments = appointments.filter(
    (a) =>
      a.date === todayStr &&
      a.status !== 'Cancelled' &&
      a.status !== 'Completed',
  );

  const inProgress = opdAppointments.filter((a) => a.status === 'In Progress');
  const waitingQueue = opdAppointments.filter(
    (a) => a.status === 'Waiting' || a.status === 'Scheduled',
  );

  const announcedIds = useRef(new Set());

  useEffect(() => {
    if (
      inProgress.length > 0 &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      inProgress.forEach((apt) => {
        if (!announcedIds.current.has(apt.id)) {
          const doctorEng = apt.doctorName
            ? apt.doctorName.replace('Dr. ', 'Doctor ')
            : 'the Doctor';
          const doctorHi = apt.doctorName
            ? apt.doctorName.replace('Dr. ', 'Daaktar ')
            : 'Daaktar';

          const voices = window.speechSynthesis.getVoices();
          const enInVoice = voices.find(
            (v) => v.lang === 'en-IN' || v.name.includes('India'),
          );
          const hiInVoice = voices.find(
            (v) =>
              v.lang === 'hi-IN' ||
              v.lang === 'hi' ||
              v.name.includes('Hindi'),
          );

          for (let i = 0; i < 2; i++) {
            const msgEng = new SpeechSynthesisUtterance(
              `Patient ${apt.patientName}, please proceed to ${doctorEng}.`,
            );
            if (enInVoice) msgEng.voice = enInVoice;
            else msgEng.lang = 'en-IN';
            msgEng.rate = 0.85;
            window.speechSynthesis.speak(msgEng);

            const msgHi = new SpeechSynthesisUtterance(
              `Mरीज ${apt.patientName}, kripaya ${doctorHi} ke paas jaayen.`,
            );
            if (hiInVoice) msgHi.voice = hiInVoice;
            else msgHi.lang = 'hi-IN';
            msgHi.rate = 0.85;
            window.speechSynthesis.speak(msgHi);
          }

          announcedIds.current.add(apt.id);
        }
      });
    }
  }, [inProgress]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 48px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#0EA5E9',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            }}
          >
            <Activity size={32} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                margin: 0,
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
              }}
            >
              Nexora Health
            </h1>
            <p
              style={{
                margin: 0,
                color: '#94A3B8',
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.5px',
              }}
            >
              OUTPATIENT LIVE QUEUE
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#0EA5E9',
                lineHeight: 1.1,
                fontFamily: 'monospace',
              }}
            >
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div
              style={{
                fontSize: '16px',
                color: '#94A3B8',
                fontWeight: 500,
                marginTop: '4px',
              }}
            >
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                const voices = window.speechSynthesis.getVoices();
                const hiVoice = voices.find(
                  (v) => v.lang === 'hi-IN' || v.lang === 'hi',
                );

                const msgEng = new SpeechSynthesisUtterance(
                  'Audio announcements enabled.',
                );
                msgEng.lang = 'en-IN';
                window.speechSynthesis.speak(msgEng);

                const msgHi = new SpeechSynthesisUtterance(
                  'Aawaz chaalu kar di gayi hai.',
                );
                if (hiVoice) msgHi.voice = hiVoice;
                else msgHi.lang = 'hi-IN';
                window.speechSynthesis.speak(msgHi);
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '14px',
              borderRadius: '50%',
              color: '#FFFFFF',
              transition: 'all 0.2s',
              display: 'flex',
            }}
            title="Test & Enable Audio (English + Hindi)"
          >
            <Volume2 size={24} />
          </button>

          <Link
            href="/opd"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '14px',
              borderRadius: '50%',
              color: '#FFFFFF',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'flex',
            }}
            title="Exit Display Mode"
          >
            <LogOut size={24} />
          </Link>
        </div>
      </header>

      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '48px',
          padding: '48px',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingBottom: '8px',
              borderBottom: '2px solid #E2E8F0',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
                animation: 'pulse-green 2s infinite',
              }}
            />
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                margin: 0,
                color: '#0F172A',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Now Serving
            </h2>
          </div>

          {inProgress.length === 0 ? (
            <div
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                border: '2px dashed #CBD5E1',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              }}
            >
              <Activity size={64} color="#CBD5E1" style={{ marginBottom: '24px' }} />
              <h3 style={{ margin: 0, fontSize: '24px', color: '#64748B', fontWeight: 600 }}>
                No consultations currently in progress
              </h3>
              <p style={{ marginTop: '12px', color: '#94A3B8', fontSize: '16px' }}>
                The next patient will be called shortly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              {inProgress.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeft: '8px solid #10B981',
                    borderRadius: '16px',
                    padding: '32px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#64748B',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '8px',
                      }}
                    >
                      Patient Name
                    </div>
                    <div
                      style={{
                        fontSize: '56px',
                        fontWeight: 800,
                        color: '#0F172A',
                        marginBottom: '12px',
                        lineHeight: 1.1,
                        letterSpacing: '-1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '400px',
                      }}
                    >
                      {apt.patientName}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span style={{ color: '#94A3B8' }}>Token:</span> {apt.apptCode}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#0F172A',
                        fontSize: '28px',
                        fontWeight: 700,
                        marginBottom: '12px',
                      }}
                    >
                      {apt.doctorName}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        padding: '10px 20px',
                        borderRadius: '100px',
                        fontSize: '18px',
                        color: '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {apt.department || 'Consultation Room'}
                    </div>
                    <div
                      style={{
                        marginTop: '24px',
                        background: '#DCFCE7',
                        color: '#166534',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '16px',
                        display: 'inline-block',
                        letterSpacing: '1px',
                      }}
                    >
                      PLEASE PROCEED INSIDE
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '2px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={28} color="#F59E0B" />
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Waiting Queue
              </h2>
            </div>
            <div
              style={{
                background: '#FEF3C7',
                color: '#B45309',
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              {waitingQueue.length} Pending
            </div>
          </div>

          {waitingQueue.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '20px', color: '#64748B', fontWeight: 500 }}>
                No patients waiting in queue.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto',
                paddingRight: '8px',
                maxHeight: 'calc(100vh - 300px)',
              }}
            >
              {waitingQueue.map((apt, index) => (
                <div
                  key={apt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: index === 0 ? '#F0F9FF' : '#F8FAFC',
                    border:
                      index === 0 ? '2px solid #BAE6FD' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s',
                    boxShadow: index === 0 ? '0 4px 12px rgba(14, 165, 233, 0.1)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {index === 0 ? (
                      <div
                        style={{
                          background: '#0EA5E9',
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                        }}
                      >
                        <ArrowRight size={28} strokeWidth={3} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#94A3B8',
                        }}
                      >
                        #{index + 1}
                      </div>
                    )}

                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#64748B',
                          textTransform: 'uppercase',
                          marginBottom: '4px',
                        }}
                      >
                        Patient Name
                      </div>
                      <div
                        style={{
                          fontSize: '26px',
                          fontWeight: 800,
                          color: index === 0 ? '#0284C7' : '#0F172A',
                          lineHeight: 1.2,
                        }}
                      >
                        {apt.patientName}
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          color: '#475569',
                          marginTop: '4px',
                          fontWeight: 500,
                        }}
                      >
                        Token: <span style={{ fontWeight: 700 }}>{apt.apptCode}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '6px',
                      }}
                    >
                      {apt.doctorName}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#64748B',
                        fontWeight: 500,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        display: 'inline-block',
                      }}
                    >
                      {apt.time || 'Walk-in'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; border-radius: 8px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
}

