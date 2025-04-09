import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { Profile } from "@/models";

// GET /api/profiles - Récupérer tous les profils (admin seulement)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Vérifier si l'utilisateur est admin (à implémenter avec votre système d'authentification)
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    // }

    const profiles = await Profile.find({}).populate(
      "userId",
      "firstName lastName email"
    );
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/profiles - Créer un nouveau profil
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId, phoneNumber, bio, preferences, socialLinks } = body;

    // Vérifier si un profil existe déjà pour cet utilisateur
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return NextResponse.json(
        { error: "Un profil existe déjà pour cet utilisateur" },
        { status: 400 }
      );
    }

    // Créer le nouveau profil
    const newProfile = await Profile.create({
      userId,
      phoneNumber,
      bio,
      preferences,
      socialLinks,
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
