import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { OTPService } from '@/lib/services/OTPService';
import { RateLimitService } from '@/lib/services/RateLimitService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { email, code, name, pubkey } = await req.json();
    
    console.log('[VERIFY-CODE] Tentative de vérification', { 
      email, 
      code: code ? `${code.length} caractères` : 'null',
      name: name || 'non fourni',
      pubkey: pubkey ? `${pubkey.substring(0, 10)}...` : 'non fourni'
    });
    
    if (!email?.trim() || !code?.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Email et code requis',
        details: {
          email: !email?.trim() ? 'Email manquant' : null,
          code: !code?.trim() ? 'Code manquant' : null
        }
      }), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Vérifier le rate limiting pour les tentatives de vérification
    const rateLimitService = new RateLimitService();
    const rateLimit = await rateLimitService.checkRateLimit(`verify-code:${email}`, {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000 // 15 minutes
    });

    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Trop de tentatives de vérification. Veuillez réessayer plus tard.',
        resetTime: rateLimit.resetTime.toISOString()
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier le code OTP avec le nouveau service
    const otpService = new OTPService();
    const verificationResult = await otpService.verifyOTP(email, code);
    
    if (!verificationResult.isValid) {
      console.log('[VERIFY-CODE] Code invalide pour', email);
      return new Response(JSON.stringify({ 
        error: 'Code invalide ou expiré' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[VERIFY-CODE] Code validé et supprimé pour', email);
    const { conversionAnalysis } = verificationResult;

    // Vérifier/créer l'utilisateur dans profiles
    let { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    let isNewUser = false;
    if (!user) {
      // Traiter le nom - séparer prénom et nom si possible
      let prenom = '';
      let nom = '';
      
      if (name?.trim()) {
        const nameParts = name.trim().split(' ');
        if (nameParts.length >= 2) {
          prenom = nameParts[0];
          nom = nameParts.slice(1).join(' ');
        } else {
          prenom = nameParts[0];
          nom = '';
        }
      } else {
        // Générer un nom par défaut basé sur l'email
        prenom = email.split('@')[0] || 'Utilisateur';
        nom = '';
      }
      
      const { data: newUser, error: createError } = await supabase
        .from('profiles')
        .insert([{ 
          email,
          nom,
          prenom,
          t4g_tokens: 1,
          pubkey: pubkey || null,
          // Marquer le type d'authentification utilisé
          auth_method: 'otp'
        }])
        .select()
        .single();

      if (createError) {
        console.error('[VERIFY-CODE] Erreur création utilisateur:', createError);
        return new Response(JSON.stringify({ 
          error: 'Erreur lors de la création du compte' 
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      user = newUser;
      isNewUser = true;
      console.log('[VERIFY-CODE] Nouvel utilisateur créé:', user.email);

      // Marquer comme converti si création de compte complet
      await otpService.markAsConverted(email, 'Compte créé via OTP');
    } else {
      console.log('[VERIFY-CODE] Utilisateur existant trouvé:', user.email);
    }

    // Construire le nom complet pour l'affichage
    const fullName = user.prenom && user.nom 
      ? `${user.prenom} ${user.nom}`.trim()
      : user.prenom || user.nom || user.email.split('@')[0];

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: fullName,
        verified: true,
        auth_method: 'otp'
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Préparer les données de réponse avec informations de conversion
    const responseData = {
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: fullName,
        prenom: user.prenom,
        nom: user.nom,
        verified: true,
        auth_method: 'otp',
        isNewUser
      },
      // Informations pour le workflow de conversion
      conversionInfo: conversionAnalysis ? {
        shouldPromptForAccount: conversionAnalysis.shouldPromptForAccount,
        loginCount: conversionAnalysis.loginCount,
        daysSinceFirstLogin: conversionAnalysis.daysSinceFirstLogin,
        conversionStatus: conversionAnalysis.conversionStatus,
        // Messages personnalisés selon le statut
        welcomeMessage: isNewUser 
          ? 'Bienvenue ! Votre compte temporaire a été créé.'
          : conversionAnalysis.shouldPromptForAccount
            ? `Bon retour ! Vous avez utilisé DAZ Node ${conversionAnalysis.loginCount} fois. Voulez-vous créer un compte permanent pour sauvegarder vos données ?`
            : `Bon retour ! Connexion ${conversionAnalysis.loginCount}.`,
        // Suggestions d'actions
        suggestedActions: conversionAnalysis.shouldPromptForAccount 
          ? ['create_full_account', 'setup_password', 'enable_notifications']
          : isNewUser 
            ? ['explore_features', 'setup_preferences']
            : ['continue_session']
      } : null
    };

    console.log('[VERIFY-CODE] Connexion réussie avec analytics:', {
      email: user.email,
      isNewUser,
      conversionStatus: conversionAnalysis?.conversionStatus,
      shouldPrompt: conversionAnalysis?.shouldPromptForAccount
    });

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('[VERIFY-CODE] Erreur:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la vérification',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
} 