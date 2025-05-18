"use client";

import * as React from "react";

import Button from "@components/ui/Button";

// import { useCurrentLocaleClient } from '@/app/lib/getCurrentLocale';

interface AlbyLoginButtonProps {
  onClick?: () => void;
}

export default function AlbyLoginButton({ onClick }: AlbyLoginButtonProps) {
  // const locale = useCurrentLocaleClient();

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onPress={onClick ?? (() => {})}
    >
      Se connecter avec Alby
    </Button>
  );
}
