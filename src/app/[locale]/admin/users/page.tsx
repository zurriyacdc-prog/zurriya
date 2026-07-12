'use client';

import { useState }  from 'react';
import { USERS }     from '@/lib/portal-mock';

const ROLE_STYLES: Record<string, string> = {
  admin:     'bg-night text-white',
  therapist: 'bg-teal-pale text-teal',
  parent:    'bg-sage-pale text-sage',
};

type User = typeof USERS[number] & { statusEn: string; statusAr: string };

export default function AdminUsersPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [users, setUsers] = useState<User[]>(
    USERS.map((u) => ({ ...u, statusEn: 'Active', statusAr: 'نشط' }))
  );
  const [creating, setCreating] = useState(false);
  const [search, setSearch]     = useState('');

  const filtered = users.filter((u) =>
    (isAr ? u.nameAr : u.nameEn).toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id
        ? { ...u, statusEn: u.statusEn === 'Active' ? 'Inactive' : 'Active', statusAr: u.statusAr === 'نشط' ? 'غير نشط' : 'نشط' }
        : u
    ));
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'المستخدمون' : 'Users'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">{users.length} {isAr ? 'مستخدم' : 'accounts'}</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-1.5 bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors shadow-sm"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إنشاء حساب' : 'Create Account'}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-teal-pale border border-teal/20 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-teal">{isAr ? 'حساب جديد' : 'New Account'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder={isAr ? 'الاسم' : 'Full name'} className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" style={{direction:isAr?'rtl':'ltr'}} />
            <input placeholder="Email" className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" dir="ltr" />
          </div>
          <select className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
            <option value="parent">{isAr ? 'ولي أمر' : 'Parent'}</option>
            <option value="therapist">{isAr ? 'معالج' : 'Therapist'}</option>
            <option value="admin">{isAr ? 'مدير' : 'Administrator'}</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setCreating(false)} className="flex-1 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">{isAr ? 'إنشاء' : 'Create'}</button>
            <button onClick={() => setCreating(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm text-ink-2 hover:bg-white transition-colors">{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="absolute top-1/2 -translate-y-1/2 start-3.5 text-ink-2/40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث عن مستخدم...' : 'Search users...'}
          className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        />
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.map((u, idx) => (
          <div key={u.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors ${idx!==filtered.length-1?'border-b border-border/60':''}`}>
            <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-teal">{(isAr?u.nameAr:u.nameEn).charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-ink">{isAr?u.nameAr:u.nameEn}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_STYLES[u.role]}`}>{u.role}</span>
              </div>
              <p className="text-xs text-ink-2/60 mt-0.5" dir="ltr">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Active toggle */}
              <button
                onClick={() => toggleStatus(u.id)}
                className={`w-10 h-5 rounded-full relative transition-colors ${u.statusEn==='Active'?'bg-sage':'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${u.statusEn==='Active'?'start-5':'start-0.5'}`} />
              </button>
              <button className="text-ink-2/40 hover:text-teal p-1 transition-colors">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
