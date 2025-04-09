import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const k1 = searchParams.get("k1");
  const sig = searchParams.get("sig");
  const key = searchParams.get("key");

  if (!k1 || !sig || !key) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=missing_params`
    );
  }

  try {
    const result = await signIn("lnurl", {
      k1,
      sig,
      key,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=${result.error}`
      );
    }

    return NextResponse.redirect(process.env.NEXTAUTH_URL || "/");
  } catch (error) {
    console.error("Erreur lors du callback LNURL:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=callback_error`
    );
  }
}
