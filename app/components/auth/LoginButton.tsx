import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button variant="outline" onClick={() => signOut()}>
        Se déconnecter
      </Button>
    );
  }

  return (
    <Button variant="default" onClick={() => signIn()}>
      Se connecter
    </Button>
  );
}
