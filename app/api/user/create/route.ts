import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { email, prenom, nom, pubkey, tempToken } = await req.json();

    console.log('[CREATE-USER] Tentative de création pour', {
      email,
      prenom,
      nom,
      pubkey: pubkey ? `${pubkey.substring(0, 10)}...` : 'non fourni'
    });

    // Vérifier le token temporaire
    try {
      const decoded = jwt.verify(tempToken, JWT_SECRET) as any;
      if (!decoded.temp || decoded.email !== email) {
        return new Response(JSON.stringify({ 
          error: 'Token temporaire invalide' 
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('[CREATE-USER] Token invalide:', error);
      return new Response(JSON.stringify({ 
        error: 'Token temporaire invalide ou expiré' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validation des données
    if (!email?.trim() || !prenom?.trim() || !nom?.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Email, prénom et nom sont requis',
        details: {
          email: !email?.trim() ? 'Email manquant' : null,
          prenom: !prenom?.trim() ? 'Prénom manquant' : null,
          nom: !nom?.trim() ? 'Nom manquant' : null
        }
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier que l'utilisateur n'existe pas déjà
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'Un compte existe déjà pour cet email' 
      }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer l'utilisateur
    const { data: newUser, error: createError } = await supabase
      .from('profiles')
      .insert([{ 
        email: email.trim(),
        nom: nom.trim(),
        prenom: prenom.trim(),
        t4g_tokens: 1,
        pubkey: pubkey?.trim() || null,
        auth_method: 'otp'
      }])
      .select()
      .single();

    if (createError) {
      console.error('[CREATE-USER] Erreur création utilisateur:', createError);
      return new Response(JSON.stringify({ 
        error: 'Erreur lors de la création du compte',
        details: createError.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[CREATE-USER] Utilisateur créé avec succès:', newUser.email);

    // Construire le nom complet pour l'affichage
    const fullName = `${newUser.prenom} ${newUser.nom}`.trim();

    // Générer le token JWT final
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        name: fullName,
        verified: true,
        auth_method: 'otp'
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: fullName,
        prenom: newUser.prenom,
        nom: newUser.nom,
        verified: true,
        auth_method: 'otp',
        isNewUser: true
      }
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('[CREATE-USER] Erreur:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la création du compte' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 