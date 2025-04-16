"use client";

import * as React from "react";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface AlbyLoginButtonProps {
  onClick?: () => void;
}

export default function AlbyLoginButton({ onClick }: AlbyLoginButtonProps) {
  return (
    <Button
      onClick={onClick || (() => signIn("alby", { callbackUrl: "/" }))}
      className="bg-yellow-500 hover:bg-yellow-600 text-white"
    >
      Se connecter avec Alby
    </Button>
  );
}
