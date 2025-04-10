import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = await getToken({ req: request });
    if (!token || !token.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données du corps de la requête
    const profileData = await request.json();

    // Validation basique
    if (!profileData) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Ici, vous implémenteriez la logique pour sauvegarder le profil dans votre base de données
    // Exemple:
    // await User.findOneAndUpdate(
    //   { email: token.email },
    //   {
    //     $set: {
    //       profile: {
    //         bio: profileData.bio,
    //         pronouns: profileData.pronouns,
    //         organization: profileData.organization,
    //         location: profileData.location,
    //         displayLocalTime: profileData.displayLocalTime,
    //         website: profileData.website,
    //         twitter: profileData.twitter,
    //         linkedin: profileData.linkedin,
    //         lightningAddress: profileData.lightningAddress,
    //       }
    //     }
    //   },
    //   { new: true }
    // );

    // Pour l'instant, simulons une mise à jour réussie
    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
