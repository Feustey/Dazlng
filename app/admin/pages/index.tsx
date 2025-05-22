import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex(): null {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);
  return null;
} 