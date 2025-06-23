import { useMemo } from 'react';
import { getSupabaseBrowserClient } from '../supabase';

export function useSupabase() {
  return useMemo(() => getSupabaseBrowserClient(), []);
} 