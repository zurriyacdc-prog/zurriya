import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zurriya — Registration Form',
  robots: 'noindex,nofollow',
};

export default function IntakeLandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f0eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Arial, Tahoma, sans-serif',
      }}
    >
      {/* Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#1B5E6E',
            color: '#fff',
            padding: '28px 32px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>
            ذرية &nbsp;·&nbsp; Zurriya
          </div>
          <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '6px' }}>
            Child Development Center
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 32px' }}>
          {/* English prompt */}
          <p
            style={{
              fontSize: '15px',
              color: '#555',
              marginBottom: '8px',
              textAlign: 'left',
              direction: 'ltr',
            }}
          >
            Please select your preferred language to begin the registration form.
          </p>
          {/* Arabic prompt */}
          <p
            style={{
              fontSize: '15px',
              color: '#555',
              marginBottom: '28px',
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            يرجى اختيار اللغة المفضلة لديكم لبدء استمارة التسجيل.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Arabic button */}
            <Link
              href="/ar/intake"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderRadius: '12px',
                border: '2px solid #1B5E6E',
                background: '#1B5E6E',
                color: '#fff',
                textDecoration: 'none',
                direction: 'rtl',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 700 }}>العربية</span>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>استمارة التسجيل</span>
            </Link>

            {/* English button */}
            <Link
              href="/en/intake"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderRadius: '12px',
                border: '2px solid #e8eeef',
                background: '#f5fafa',
                color: '#1B5E6E',
                textDecoration: 'none',
                direction: 'ltr',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 700 }}>English</span>
              <span style={{ fontSize: '13px', color: '#777' }}>Registration form</span>
            </Link>
          </div>

          <p
            style={{
              marginTop: '24px',
              fontSize: '11px',
              color: '#aaa',
              textAlign: 'center',
            }}
          >
            سري وخاص &nbsp;·&nbsp; Strictly Confidential
          </p>
        </div>
      </div>
    </div>
  );
}
