import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n.config.base";

export default function DefaultAuthRoute() {
  redirect(`/${defaultLocale}`);
}
