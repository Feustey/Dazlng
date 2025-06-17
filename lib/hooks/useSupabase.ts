import { useMemo } from 'react';
import { createSupabaseBrowserClient } from '../supabase';

export function useSupabase() {
  return useMemo(() => createSupabaseBrowserClient(), []);
} 