"use client";

import { useState, useEffect } from "react";

interface AdminContact {
  name: string;
  email: string;
  phone: string;
  instagram: string;
}

export default function FreezePopup() {
  const [frozen, setFrozen] = useState(false);
  const [contact, setContact] = useState<AdminContact | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.frozen) {
          setFrozen(true);
          setContact(d.adminContact);
        }
      })
      .catch(() => {});
  }, []);

  if (!frozen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="max-w-md w-full rounded-2xl p-8 text-center shadow-2xl"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--hairline)' }}
      >
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
          Account Frozen
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--ink-subtle)' }}>
          Your account has been temporarily suspended due to suspicious activity. You can
          still browse, but actions are restricted.
        </p>

        <div
          className="p-4 rounded-xl mb-6 text-left"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Contact Admin to restore access:
          </p>
          {contact && (
            <div className="space-y-1.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
              <p>👤 {contact.name}</p>
              <p>📧 {contact.email}</p>
              <p>📞 {contact.phone}</p>
              <p>📷 {contact.instagram}</p>
            </div>
          )}
        </div>

        <p className="text-[0.6rem]" style={{ color: 'var(--ink-tertiary)' }}>
          JalaJO Security System · Unauthorized access is monitored
        </p>
      </div>
    </div>
  );
}
