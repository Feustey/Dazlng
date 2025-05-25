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
    
    if (!email || !code) {
      return new Response(JSON.stringify({ 
        error: 'Email et code requis' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
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

    // Vérifier le code OTP
    const otpService = new OTPService();
    const isValidCode = await otpService.verifyOTP(email, code);
    
    if (!isValidCode) {
      console.log('[VERIFY-CODE] Code invalide pour', email);
      return new Response(JSON.stringify({ 
        error: 'Code invalide ou expiré' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[VERIFY-CODE] Code validé et supprimé pour', email);

    // Vérifier/créer l'utilisateur
    let { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      // Générer un nom par défaut si non fourni
      const defaultName = name || email.split('@')[0] || 'Utilisateur';
      
      const { data: newUser, error: createError } = await supabase
        .from('profiles')
        .insert([{ 
          email,
          nom: defaultName,
          prenom: '',
          t4g_tokens: 1,
          pubkey: pubkey || null // Ajouter la pubkey si fournie
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
      console.log('[VERIFY-CODE] Nouvel utilisateur créé:', user.email);
    } else {
      console.log('[VERIFY-CODE] Utilisateur existant trouvé:', user.email);
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.nom || user.email.split('@')[0],
        verified: true
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return NextResponse.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.nom || user.email.split('@')[0],
        verified: true
      } 
    });

  } catch (error) {
    console.error('[VERIFY-CODE] Erreur:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la vérification' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 