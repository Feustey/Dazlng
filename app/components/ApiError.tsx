"use client";

import { useEffect } from "react";
import { useAlert } from "@/app/hooks/useAlert";

interface ApiErrorProps {
  error: Error | null;
}

export default function ApiError({ error }: ApiErrorProps) {
  const { showAlert } = useAlert();

  useEffect(() => {
    if (error) {
      showAlert("error", error.message);
    }
  }, [error, showAlert]);

  return null;
}
