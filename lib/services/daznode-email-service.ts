import { Resend } from 'resend';
import { DazNodeSubscription, DazNodeRecommendation } from '@/types/daznode';

const resend = new Resend(process.env.RESEND_API_KEY);

export class DazNodeEmailService {
  async sendSubscriptionConfirmation(subscription: DazNodeSubscription) {
    const { email, pubkey, plan_type, amount, start_date, end_date } = subscription;

    await resend.emails.send({
      from: 'DazNode <noreply@dazno.de>',
      to: email,
      cc: 'admin@dazno.de',
      subject: 'Bienvenue sur DazNode ! 🎉',
      html: `
        <h1>Bienvenue sur DazNode !</h1>
        <p>Votre abonnement a été activé avec succès.</p>
        
        <h2>Détails de votre abonnement :</h2>
        <ul>
          <li>Nœud : ${pubkey}</li>
          <li>Plan : ${plan_type === 'yearly' ? 'Annuel' : 'Mensuel'}</li>
          <li>Montant : ${amount} sats</li>
          <li>Début : ${new Date(start_date).toLocaleDateString()}</li>
          <li>Fin : ${end_date ? new Date(end_date).toLocaleDateString() : 'Non définie'}</li>
        </ul>

        <p>Nos experts vont analyser votre nœud et vous enverront vos premières recommandations personnalisées dans les prochaines 24h.</p>

        <p>En attendant, vous pouvez accéder à votre tableau de bord :</p>
        <a href="https://daznode.com/user/node" style="background-color: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Accéder au tableau de bord
        </a>

        <p>Pour toute question, n'hésitez pas à nous contacter à support@daznode.com</p>
      `
    });
  }

  async sendRecommendations(subscription: DazNodeSubscription, recommendations: DazNodeRecommendation[]) {
    const { email, pubkey } = subscription;

    // Formater les recommandations en HTML
    const recommendationsHtml = recommendations
      .map(rec => `
        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #1F2937; margin-bottom: 10px;">${rec.content.title}</h3>
          
          <p style="color: #4B5563; margin-bottom: 15px;">${rec.content.description}</p>
          
          <div style="margin-bottom: 15px;">
            <span style="background-color: ${
              rec.content.priority === 'high' ? '#FEE2E2' :
              rec.content.priority === 'medium' ? '#FEF3C7' :
              '#E0E7FF'
            }; color: ${
              rec.content.priority === 'high' ? '#991B1B' :
              rec.content.priority === 'medium' ? '#92400E' :
              '#3730A3'
            }; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
              Priorité ${
                rec.content.priority === 'high' ? 'Haute' :
                rec.content.priority === 'medium' ? 'Moyenne' :
                'Basse'
              }
            </span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong>Impact estimé :</strong> ${rec.content.impact}
          </div>

          <div style="margin-bottom: 15px;">
            <strong>Actions recommandées :</strong>
            <ul style="margin-top: 8px;">
              ${rec.content.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>

          <div>
            <strong>Métriques clés :</strong>
            <ul style="margin-top: 8px;">
              ${Object.entries(rec.content.metrics)
                .map(([key, value]) => `<li>${key}: ${value}</li>`)
                .join('')}
            </ul>
          </div>
        </div>
      `)
      .join('');

    await resend.emails.send({
      from: 'DazNode <noreply@dazno.de>',
      to: email,
      subject: '🎯 Vos recommandations DazNode personnalisées',
      html: `
        <h1>Vos recommandations personnalisées</h1>
        <p>Suite à l'analyse approfondie de votre nœud (${pubkey}), voici vos recommandations personnalisées :</p>
        
        ${recommendationsHtml}

        <p>Ces recommandations ont été validées par nos experts et sont basées sur l'analyse de votre nœud et du réseau Lightning.</p>

        <p>Pour mettre en place ces recommandations et suivre vos progrès :</p>
        <a href="https://dazno.de/user/node" style="background-color: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Accéder au tableau de bord
        </a>

        <p>Pour toute question sur ces recommandations, n'hésitez pas à nous contacter à support@dazno.de</p>
      `
    });
  }
}

export const dazNodeEmailService = new DazNodeEmailService(); 