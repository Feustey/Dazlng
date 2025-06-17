import { useCallback } from 'react';
import Cookies from 'js-cookie';

const PUBKEY_COOKIE = 'daznode_pubkey';

export function usePubkeyCookie() {
  const getPubkey = useCallback(() => {
    return Cookies.get(PUBKEY_COOKIE) || null;
  }, []);

  const setPubkey = useCallback((pubkey: string) => {
    Cookies.set(PUBKEY_COOKIE, pubkey, { expires: 365 });
  }, []);

  const removePubkey = useCallback(() => {
    Cookies.remove(PUBKEY_COOKIE);
  }, []);

  return {
    getPubkey,
    setPubkey,
    removePubkey
  };
} 