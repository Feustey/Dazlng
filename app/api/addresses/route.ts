import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { Address } from "@/app/models/Address";
import { getToken } from "next-auth/jwt";

// GET /api/addresses - Récupérer toutes les adresses d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const userId = token.sub;
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

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
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
        { userId: token.sub, type, isDefault: true },
        { isDefault: false }
      );
    }

    // Créer la nouvelle adresse
    const newAddress = await Address.create({
      userId: token.sub,
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
