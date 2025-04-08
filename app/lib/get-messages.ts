import { notFound } from "next/navigation";

export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
}
