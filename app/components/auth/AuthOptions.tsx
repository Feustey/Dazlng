"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

export function AuthOptions() {
  const t = useTranslations("auth");

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full"
      >
        <FaGithub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full"
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
