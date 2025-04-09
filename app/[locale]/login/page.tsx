"use client";

import { Card } from "../../components/ui/card";
import Link from "next/link";
import LoginForm from "../../components/auth/LoginForm";
import AuthOptions from "../../components/auth/AuthOptions";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const params = useParams();

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          DazNode
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Cette plateforme a révolutionné la façon dont je gère mon
              nœud Lightning. C&apos;est simple, efficace et puissant.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Connexion à votre compte
            </h1>
            <p className="text-sm text-muted-foreground">
              Entrez vos identifiants ci-dessous pour vous connecter
            </p>
          </div>
          <Card className="p-6">
            <AuthOptions />
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continuez avec
                </span>
              </div>
            </div>
            <LoginForm />
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href={`/${params.locale}/register`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
