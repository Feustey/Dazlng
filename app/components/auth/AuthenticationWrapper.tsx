"use client";

import dynamicImport from "next/dynamic";
import { useSession } from "next-auth/react";

const LoginModal = dynamicImport(() => import("./LoginModal"), {
  loading: () => null,
  ssr: false,
});

interface AuthenticationWrapperProps {
  children: React.ReactNode;
  showLoginModal: boolean;
  onCloseModal: () => void;
}

export function AuthenticationWrapper({
  children,
  showLoginModal,
  onCloseModal,
}: AuthenticationWrapperProps) {
  const { data: session } = useSession();

  return (
    <>
      {children}
      {showLoginModal && !session && (
        <LoginModal isOpen={showLoginModal} onClose={onCloseModal} />
      )}
    </>
  );
}
