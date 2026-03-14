/**
 * userStore.js — Client-side user & tenant store (localStorage)
 *
 * In production this would be replaced by real API calls to your backend.
 * For local testing everything persists in localStorage so data survives page refresh.
 */

const USERS_KEY = 'nexora_users';
const TENANTS_KEY = 'nexora_tenants';
const SESSION_KEY = 'nexora_session';

/* ── Default seed data ── */
const DEFAULT_USERS = [
    {
        id: 'USR-0001',
        name: 'Super Admin',
        email: 'admin@nexorahealth.com',
        password: 'admin@123',
        role: 'superadmin',
        tenantSlug: null,
        tenantName: null,
        status: 'Active',
        createdAt: new Date('2024-01-01').toISOString(),
    },
    {
        id: 'USR-0002',
        name: 'Apollo Admin',
        email: 'admin@apollo.com',
        password: 'apollo@123',
        role: 'hospital_admin',
        tenantSlug: 'apollo',
        tenantName: 'Apollo Health Systems',
        status: 'Active',
        createdAt: new Date('2024-01-15').toISOString(),
    },
    {
        id: 'USR-0003',
        name: 'CityGeneral Admin',
        email: 'admin@citygeneral.com',
        password: 'city@123',
        role: 'hospital_admin',
        tenantSlug: 'citygeneral',
        tenantName: 'City General Medical Center',
        status: 'Active',
        createdAt: new Date('2024-02-01').toISOString(),
    },
    {
        id: 'USR-0004',
        name: 'MediCare Admin',
        email: 'admin@medicare.com',
        password: 'medi@123',
        role: 'hospital_admin',
        tenantSlug: 'medicare',
        tenantName: 'MediCare Clinics',
        status: 'Active',
        createdAt: new Date('2024-02-10').toISOString(),
    },
    {
        id: 'USR-0005',
        name: 'PrimeHeart Admin',
        email: 'admin@primeheart.com',
        password: 'prime@123',
        role: 'hospital_admin',
        tenantSlug: 'primeheart',
        tenantName: 'Prime Heart Institute',
        status: 'Active',
        createdAt: new Date('2024-03-01').toISOString(),
    },
    {
        id: 'USR-0006',
        name: 'Sunrise Admin',
        email: 'admin@sunrise.com',
        password: 'sunrise@123',
        role: 'hospital_admin',
        tenantSlug: 'sunrise',
        tenantName: 'Sunrise Diagnostics Hub',
        status: 'Suspended',
        createdAt: new Date('2024-03-15').toISOString(),
    },
];

const DEFAULT_TENANTS = [
    { name: 'Apollo Health Systems', id: 'TEN-9201', slug: 'apollo', plan: 'Enterprise Annual', users: '1,240', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'City General Medical Center', id: 'TEN-8492', slug: 'citygeneral', plan: 'Professional Monthly', users: '450', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'MediCare Clinics', id: 'TEN-8104', slug: 'medicare', plan: 'Basic Quarterly', users: '42', status: 'Payment Due', badge: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { name: 'Prime Heart Institute', id: 'TEN-7221', slug: 'primeheart', plan: 'Enterprise Custom', users: '820', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'Sunrise Diagnostics Hub', id: 'TEN-6019', slug: 'sunrise', plan: 'Professional Monthly', users: '120', status: 'Suspended', badge: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
];

/* ── Helpers ── */
function isBrowser() {
    return typeof window !== 'undefined';
}

function seed() {
    if (!isBrowser()) return;
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(TENANTS_KEY)) {
        localStorage.setItem(TENANTS_KEY, JSON.stringify(DEFAULT_TENANTS));
    }
}

/* ── USERS ── */
export function getUsers() {
    seed();
    if (!isBrowser()) return DEFAULT_USERS;
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsers(users) {
    if (!isBrowser()) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(userData) {
    const users = getUsers();
    const newUser = {
        id: `USR-${String(users.length + 1).padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'Active',
        ...userData,
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function updateUser(id, changes) {
    const users = getUsers();
    const updated = users.map(u => u.id === id ? { ...u, ...changes } : u);
    saveUsers(updated);
    return updated;
}

export function deleteUser(id) {
    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);
}

export function authenticateUser(email, password) {
    const users = getUsers();
    return users.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    ) || null;
}

/* ── TENANTS ── */
export function getTenants() {
    seed();
    if (!isBrowser()) return DEFAULT_TENANTS;
    return JSON.parse(localStorage.getItem(TENANTS_KEY) || '[]');
}

export function saveTenants(tenants) {
    if (!isBrowser()) return;
    localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
}

export function createTenant(tenantData) {
    const tenants = getTenants();
    tenants.unshift(tenantData);
    saveTenants(tenants);
}

export function updateTenant(id, changes) {
    const tenants = getTenants().map(t => t.id === id ? { ...t, ...changes } : t);
    saveTenants(tenants);
    return tenants;
}

export function deleteTenant(id) {
    const tenants = getTenants().filter(t => t.id !== id);
    saveTenants(tenants);
}

/* ── SESSION ── */
export function setSession(user) {
    if (!isBrowser()) return;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantSlug: user.tenantSlug,
        tenantName: user.tenantName,
    }));
}

export function getSession() {
    if (!isBrowser()) return null;
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
}

export function clearSession() {
    if (!isBrowser()) return;
    localStorage.removeItem(SESSION_KEY);
}

/* ── Password generator ── */
export function generateTempPassword(slug) {
    return `${slug}@Nexora1`;
}
