'use client';
import { useEffect, useState } from 'react';

interface UserRecord {
  id: string;
  nickname: string;
  streak: number;
  bestScore: number;
  sessions: number;
  unlockedBadges: string[];
  lastSeen: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'tajweed2025';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) fetchUsers();
  }, [auth]);

  if (!auth) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2f23 100%)',
        fontFamily: 'Outfit, Arial, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(42,122,78,0.3)', borderRadius: 24, padding: 48,
          textAlign: 'center', minWidth: 320
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>لوحة تحكم المدير</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>محراب الصوت — Tajweed AI Coach</p>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuth(true)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: '1.5px solid rgba(42,122,78,0.4)', background: 'rgba(255,255,255,0.07)',
              color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none',
              boxSizing: 'border-box', marginBottom: 12, direction: 'ltr'
            }}
          />
          <button
            onClick={() => password === ADMIN_PASSWORD && setAuth(true)}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #2a7a4e, #15803d)',
              color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer'
            }}
          >دخول</button>
          {password && password !== ADMIN_PASSWORD &&
            <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>كلمة المرور غير صحيحة</p>
          }
        </div>
      </div>
    );
  }

  const totalSessions = users.reduce((s, u) => s + (u.sessions || 0), 0);
  const avgScore = users.length ? Math.round(users.reduce((s, u) => s + (u.bestScore || 0), 0) / users.length) : 0;
  const totalBadges = users.reduce((s, u) => s + (u.unlockedBadges?.length || 0), 0);

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f1923 0%, #1a2f23 100%)',
      fontFamily: 'Outfit, Arial, sans-serif', direction: 'rtl', padding: 24
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: 0 }}>🕌 لوحة تحكم المدير</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', fontSize: 13 }}>محراب الصوت — Tajweed AI Coach</p>
          </div>
          <button onClick={fetchUsers} style={{
            padding: '10px 20px', borderRadius: 12, border: '1.5px solid rgba(42,122,78,0.4)',
            background: 'rgba(42,122,78,0.15)', color: '#4ade80', fontWeight: 700,
            cursor: 'pointer', fontSize: 13
          }}>🔄 تحديث</button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '👥', label: 'إجمالي المشاركين', value: users.length, color: '#60a5fa' },
            { icon: '🎯', label: 'إجمالي الجلسات', value: totalSessions, color: '#4ade80' },
            { icon: '⭐', label: 'متوسط أفضل دقة', value: `${avgScore}%`, color: '#fbbf24' },
            { icon: '🏆', label: 'إجمالي الشارات', value: totalBadges, color: '#c084fc' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '20px 24px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>📋 قائمة المشاركين</h2>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.4)' }}>⏳ جاري التحميل...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌙</div>
              <p>لا يوجد مشاركون بعد — سيظهرون هنا بمجرد فتح أي شخص التطبيق</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(42,122,78,0.1)' }}>
                    {['#', 'الاسم', 'أيام متتالية 🔥', 'أفضل دقة ⭐', 'الجلسات 💪', 'الشارات 🏆', 'آخر ظهور'].map((h, i) => (
                      <th key={i} style={{
                        padding: '14px 16px', color: 'rgba(255,255,255,0.6)',
                        fontSize: 12, fontWeight: 700, textAlign: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.06)'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#fff', fontWeight: 700 }}>
                        {u.nickname || `مستخدم ${u.id.slice(-4)}`}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#fbbf24', fontWeight: 800 }}>{u.streak || 0}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          background: u.bestScore >= 90 ? 'rgba(74,222,128,0.15)' : u.bestScore >= 70 ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                          color: u.bestScore >= 90 ? '#4ade80' : u.bestScore >= 70 ? '#fbbf24' : '#f87171',
                          padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700
                        }}>{u.bestScore || 0}%</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#60a5fa', fontWeight: 700 }}>{u.sessions || 0}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#c084fc', fontWeight: 700 }}>{u.unlockedBadges?.length || 0}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                        {u.lastSeen ? new Date(u.lastSeen).toLocaleDateString('ar-EG') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
