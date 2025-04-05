import { Metadata } from "next";
import AuthForm from "@/app/components/AuthForm";

export const metadata: Metadata = {
  title: "Authentification | DazLng",
  description: "Connectez-vous ou créez un compte pour accéder à DazLng",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DazLng</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos nœuds Lightning Network en toute simplicité
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
