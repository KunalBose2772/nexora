'use client';

export default function Skeleton({ className = '', height = '1rem', width = '100%', borderRadius = '4px' }) {
    return (
        <div
            className={`animate-pulse bg-slate-200 ${className}`}
            style={{
                height,
                width,
                borderRadius
            }}
        />
    );
}
