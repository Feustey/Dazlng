import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { Address } from "@/app/models/Address";

// GET /api/addresses - Récupérer toutes les adresses d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Récupérer l'ID de l'utilisateur à partir de la session (à implémenter)
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }
    // const userId = session.user.id;

    // Pour l'exemple, nous utilisons un ID fixe
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    const addresses = await Address.find({ userId });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Erreur lors de la récupération des adresses:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/addresses - Créer une nouvelle adresse
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      userId,
      type,
      firstName,
      lastName,
      street,
      street2,
      city,
      state,
      postalCode,
      country,
      isDefault,
      phoneNumber,
    } = body;

    // Si c'est l'adresse par défaut, mettre à jour les autres adresses
    if (isDefault) {
      await Address.updateMany(
        { userId, type, isDefault: true },
        { isDefault: false }
      );
    }

    // Créer la nouvelle adresse
    const newAddress = await Address.create({
      userId,
      type,
      firstName,
      lastName,
      street,
      street2,
      city,
      state,
      postalCode,
      country,
      isDefault,
      phoneNumber,
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'adresse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
