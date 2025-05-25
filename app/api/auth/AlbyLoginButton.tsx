"use client";

import * as React from "react";

import Button from "../../../components/shared/ui/Button";

// import { useCurrentLocaleClient } from '@/app/lib/getCurrentLocale';

interface AlbyLoginButtonProps {
  onClick?: () => void;
}

export default function AlbyLoginButton({ onClick }: AlbyLoginButtonProps): React.ReactElement {
  // const locale = useCurrentLocaleClient();

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={onClick ?? (() => {})}
    >
      Se connecter avec votre wallet
    </Button>
  );
}
