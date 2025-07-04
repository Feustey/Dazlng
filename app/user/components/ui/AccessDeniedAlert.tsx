'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AccessDeniedAlert(): JSX.Element | null {
  const searchParams = useSearchParams();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'access_denied') {
      setShowAccessDenied(true);
      // Masquer le message après 5 secondes
      setTimeout(() => setShowAccessDenied(false), 5000);
    }
  }, [searchParams]);

  if (!showAccessDenied) return null;

  return (
    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <h3 className="font-bold">{t('user.accs_refus')}</h3>
      <p>{t('user.vous_navez_pas_les_permissions')}</p>
    </div>
  );
}
export const dynamic = "force-dynamic";
