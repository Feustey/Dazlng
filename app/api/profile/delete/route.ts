import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { Session } from "@/app/models/Session";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer toutes les sessions de l'utilisateur
    await Session.deleteMany({ userId });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
