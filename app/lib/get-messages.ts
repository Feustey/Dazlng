"use client";

import { notFound } from "next/navigation";

export async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (_error: unknown) {
    notFound();
  }
}
