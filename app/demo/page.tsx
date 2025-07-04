import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default function DemoPage() {
  // Rediriger vers la page optimized-demo existante
  redirect("/optimized-demo");
} 