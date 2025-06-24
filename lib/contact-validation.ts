import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom contient des caractères invalides'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom contient des caractères invalides'),
  
  email: z.string()
    .email('Adresse email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  
  companyName: z.string()
    .max(100, 'Le nom de société ne peut pas dépasser 100 caractères')
    .optional(),
  
  phone: z.string()
    .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  
  subject: z.enum([
    'daznode',
    'dazbox', 
    'dazpay',
    'support',
    'partnership',
    'other'
  ], { errorMap: () => ({ message: 'Veuillez sélectionner un sujet' }) }),
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
  
  consent: z.boolean()
    .refine(val => val === true, 'Vous devez accepter notre politique de confidentialité'),
  
  // Champ honeypot pour anti-spam
  website: z.string().max(0, 'Champ interdit').optional()
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Rate limiting par IP
export async function checkRateLimit(_ip: string): Promise<boolean> {
  // Implémentation du rate limiting
  // Retourne false si trop de requêtes de cette IP
  return true
}
