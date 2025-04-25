"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RagRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learn/rag");
  }, [router]);

  return <div>Redirection vers le Centre de Connaissances...</div>;
}
