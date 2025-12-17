import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'pms_current_org';

export function useOrganization() {
  const [organizationSlug, setOrganizationSlug] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'demo-org';
    }
    return 'demo-org';
  });

  const setOrganization = useCallback((slug: string) => {
    setOrganizationSlug(slug);
    localStorage.setItem(STORAGE_KEY, slug);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setOrganizationSlug(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { organizationSlug, setOrganization };
}

export default useOrganization;
