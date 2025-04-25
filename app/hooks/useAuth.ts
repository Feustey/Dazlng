import { useSession, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();

  const user = session?.user;

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    user,
    logout,
  };
}
