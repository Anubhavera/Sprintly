/**
 * Custom hook for managing organization context
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'pms_current_org';

export function useOrganization() {
  const [organizationSlug, setOrganizationSlug] = useState<string>(() => {
    // Try to get from localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'demo-org';
    }
    return 'demo-org';
  });

  const setOrganization = useCallback((slug: string) => {
    setOrganizationSlug(slug);
    localStorage.setItem(STORAGE_KEY, slug);
  }, []);

  // Sync with localStorage changes from other tabs
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
