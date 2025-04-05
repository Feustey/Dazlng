"use client";

import { useEffect } from "react";

export default function ClientInitializer() {
  useEffect(() => {
    console.log("Application client initialisée");
  }, []);

  return null;
}
