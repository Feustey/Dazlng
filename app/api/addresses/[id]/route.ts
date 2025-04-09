import { NextRequest, NextResponse } from "next/server";
import { Address } from "@/models";
import { connectToDatabase } from "../../../lib/db";

// GET /api/addresses/[id] - Récupérer une adresse spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const addressId = params.id;

    const address = await Address.findById(addressId);
    if (!address) {
      return NextResponse.json(
        { error: "Adresse non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'adresse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/addresses/[id] - Mettre à jour une adresse
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const addressId = params.id;
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

    // Vérifier si l'adresse existe
    const address = await Address.findById(addressId);
    if (!address) {
      return NextResponse.json(
        { error: "Adresse non trouvée" },
        { status: 404 }
      );
    }

    // Si c'est l'adresse par défaut, mettre à jour les autres adresses
    if (isDefault) {
      await Address.updateMany(
        {
          userId: address.userId,
          type,
          isDefault: true,
          _id: { $ne: addressId },
        },
        { isDefault: false }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (type) updateData.type = type;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (street) updateData.street = street;
    if (street2 !== undefined) updateData.street2 = street2;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (postalCode) updateData.postalCode = postalCode;
    if (country) updateData.country = country;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Mettre à jour l'adresse
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adresse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/addresses/[id] - Supprimer une adresse
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const addressId = params.id;

    // Vérifier si l'adresse existe
    const address = await Address.findById(addressId);
    if (!address) {
      return NextResponse.json(
        { error: "Adresse non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'adresse
    await Address.findByIdAndDelete(addressId);

    return NextResponse.json(
      { message: "Adresse supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'adresse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
