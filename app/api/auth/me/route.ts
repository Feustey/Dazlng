import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json(session.user);
  } catch (error) {
    // console.error(
    //   "Erreur lors de la récupération des informations utilisateur:",
    //   error
    // );
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
