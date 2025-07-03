import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Adresse wallet requise'
        },
        { status: 400 }
      )
    }

    // Validation basique de l'adresse Algorand
    if (typeof address !== 'string' || address.length !== 58) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Format d\'adresse wallet invalide'
        },
        { status: 400 }
      )
    }

    // Ici, ajoutez votre logique de vérification
    // Par exemple, vérifier si l'adresse existe dans votre base de données
    // Créer une session, etc.
    
    console.log('Vérification du wallet:', address)
    
    // Simulation d'une vérification réussie
    return NextResponse.json({ 
      success: true,
      message: 'Wallet vérifié avec succès',
      address
    })
  } catch (error) {
    console.error('Erreur dans verify-wallet:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Erreur de vérification du wallet'
      },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic";
