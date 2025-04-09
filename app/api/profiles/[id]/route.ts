import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { Profile } from "@/models";

// GET /api/profiles/[id] - Récupérer un profil spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const profileId = params.id;

    const profile = await Profile.findById(profileId).populate(
      "userId",
      "firstName lastName email"
    );
    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/profiles/[id] - Mettre à jour un profil
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const profileId = params.id;
    const body = await req.json();
    const { phoneNumber, avatar, bio, preferences, socialLinks } = body;

    // Vérifier si le profil existe
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (avatar) updateData.avatar = avatar;
    if (bio) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // Mettre à jour le profil
    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "firstName lastName email");

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/profiles/[id] - Supprimer un profil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const profileId = params.id;

    // Vérifier si le profil existe
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    // Supprimer le profil
    await Profile.findByIdAndDelete(profileId);

    return NextResponse.json(
      { message: "Profil supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
