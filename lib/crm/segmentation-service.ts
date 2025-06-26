import { SegmentCriteria } from '@/app/types/crm';
import { getSupabaseAdminClient } from '@/lib/supabase';

export class SegmentationService {
  
  /**
   * Construit une requête SQL à partir des critères de segmentation
   */
  async buildSegmentQuery(criteria: SegmentCriteria): Promise<string> {
    let query = `
      SELECT DISTINCT p.id, p.email, p.nom, p.prenom, p.created_at, p.email_verified, p.pubkey
      FROM profiles p
    `;
    
    const joins: string[] = [];
    const conditions: string[] = [];

    // Critères sur les abonnements
    if (criteria.subscription) {
      joins.push('LEFT JOIN subscriptions s ON p.id = s.user_id');
      
      if (criteria.subscription.plan?.length) {
        const planList = criteria.subscription.plan.map(p => `'${p}'`).join(',');
        conditions.push(`s.plan_id IN (${planList})`);
      }
      
      if (criteria.subscription.status?.length) {
        const statusList = criteria.subscription.status.map(s => `'${s}'`).join(',');
        conditions.push(`s.status IN (${statusList})`);
      }
      
      if (criteria.subscription.duration_months) {
        const { min, max } = criteria.subscription.duration_months;
        if (min !== undefined) {
          conditions.push(`EXTRACT(EPOCH FROM (NOW() - s.start_date))/2592000 >= ${min}`);
        }
        if (max !== undefined) {
          conditions.push(`EXTRACT(EPOCH FROM (NOW() - s.start_date))/2592000 <= ${max}`);
        }
      }
    }

    // Critères sur les commandes
    if (criteria.orders) {
      joins.push('LEFT JOIN orders o ON p.id = o.user_id');
      
      if (criteria.orders.total_amount) {
        const { min, max } = criteria.orders.total_amount;
        if (min !== undefined) {
          conditions.push(`(
            SELECT SUM(amount) FROM orders WHERE user_id = p.id
          ) >= ${min}`);
        }
        if (max !== undefined) {
          conditions.push(`(
            SELECT SUM(amount) FROM orders WHERE user_id = p.id
          ) <= ${max}`);
        }
      }
      
      if (criteria.orders.count) {
        const { min, max } = criteria.orders.count;
        if (min !== undefined) {
          conditions.push(`(
            SELECT COUNT(*) FROM orders WHERE user_id = p.id
          ) >= ${min}`);
        }
        if (max !== undefined) {
          conditions.push(`(
            SELECT COUNT(*) FROM orders WHERE user_id = p.id
          ) <= ${max}`);
        }
      }
      
      if (criteria.orders.last_order_days !== undefined) {
        conditions.push(`(
          SELECT MAX(created_at) FROM orders WHERE user_id = p.id
        ) >= NOW() - INTERVAL '${criteria.orders.last_order_days} days'`);
      }
    }

    // Critères sur le profil
    if (criteria.profile) {
      if (criteria.profile.created_days_ago) {
        const { min, max } = criteria.profile.created_days_ago;
        if (min !== undefined) {
          conditions.push(`p.created_at <= NOW() - INTERVAL '${min} days'`);
        }
        if (max !== undefined) {
          conditions.push(`p.created_at >= NOW() - INTERVAL '${max} days'`);
        }
      }
      
      if (criteria.profile.email_verified !== undefined) {
        conditions.push(`p.email_verified = ${criteria.profile.email_verified}`);
      }
      
      if (criteria.profile.has_pubkey !== undefined) {
        if (criteria.profile.has_pubkey) {
          conditions.push(`p.pubkey IS NOT NULL AND p.pubkey != ''`);
        } else {
          conditions.push(`(p.pubkey IS NULL OR p.pubkey = '')`);
        }
      }
    }

    // Critères sur l'activité
    if (criteria.activity) {
      // Note: Ces critères nécessitent une table de logs d'activité
      // Pour l'instant, on utilise created_at comme proxy
      
      if (criteria.activity.last_login_days !== undefined) {
        // Assumons qu'on a une colonne last_login_at ou qu'on utilise updated_at
        conditions.push(`p.updated_at >= NOW() - INTERVAL '${criteria.activity.last_login_days} days'`);
      }
      
      if (criteria.activity.login_count) {
        // Pour l'instant, on ne peut pas implémenter sans table de logs
        console.warn('Login count criteria requires activity logging table');
      }
    }

    // Assemblage de la requête
    if (joins.length > 0) {
      query += ' ' + joins.join(' ');
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    return query;
  }

  /**
   * Met à jour les membres d'un segment selon ses critères
   */
  async updateSegmentMembers(segmentId: string, criteria: SegmentCriteria): Promise<void> {
    try {
      // Génère la requête SQL
      const sqlQuery = await this.buildSegmentQuery(criteria);
      
      // Supprime les anciens membres du segment
      await getSupabaseAdminClient()
        .from('crm_customer_segment_members')
        .delete()
        .eq('segment_id', segmentId);

      // Exécute la requête pour obtenir les nouveaux membres
      const { data: customers, error } = await getSupabaseAdminClient().rpc('execute_raw_sql', { 
        query: sqlQuery 
      });

      if (error) {
        console.error('Erreur lors de l\'exécution de la requête:', error);
        throw error;
      }

      if (customers && customers.length > 0) {
        // Prépare les données pour l'insertion
        const members = customers.map((customer: any) => ({
          segment_id: segmentId,
          customer_id: customer.id,
          added_at: new Date().toISOString()
        }));

        // Insère les nouveaux membres
        const { error: insertError } = await getSupabaseAdminClient()
          .from('crm_customer_segment_members')
          .insert(members);

        if (insertError) {
          console.error('Erreur lors de l\'insertion des membres:', insertError);
          throw insertError;
        }

        console.log(`Segment ${segmentId} mis à jour avec ${customers.length} membres`);
      } else {
        console.log(`Aucun membre trouvé pour le segment ${segmentId}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du segment:', error);
      throw error;
    }
  }

  /**
   * Met à jour automatiquement tous les segments avec auto_update = true
   */
  async updateAutoSegments(): Promise<void> {
    try {
      // Récupère tous les segments avec auto_update activé
      const { data: segments, error } = await getSupabaseAdminClient()
        .from('crm_customer_segments')
        .select('id, criteria')
        .eq('auto_update', true);

      if (error) {
        console.error('Erreur lors de la récupération des segments:', error);
        throw error;
      }

      if (segments) {
        // Met à jour chaque segment
        for (const segment of segments) {
          try {
            await this.updateSegmentMembers(segment.id, segment.criteria);
          } catch (error) {
            console.error(`Erreur lors de la mise à jour du segment ${segment.id}:`, error);
            // Continue avec les autres segments
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour automatique des segments:', error);
      throw error;
    }
  }

  /**
   * Obtient les membres d'un segment avec leurs informations détaillées
   */
  async getSegmentMembers(segmentId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const { data, error } = await getSupabaseAdminClient()
      .from('crm_customer_segment_members')
      .select(`
        customer_id,
        added_at,
        profiles!inner (
          id,
          email,
          nom,
          prenom,
          email_verified,
          pubkey,
          created_at,
          t4g_tokens
        )
      `)
      .eq('segment_id', segmentId)
      .range(offset, offset + limit - 1)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      throw error;
    }

    return data?.map(member => ({
      ...member.profiles,
      added_to_segment_at: member.added_at
    })) || [];
  }

  /**
   * Obtient le nombre total de membres d'un segment
   */
  async getSegmentMemberCount(segmentId: string): Promise<number> {
    const { count, error } = await getSupabaseAdminClient()
      .from('crm_customer_segment_members')
      .select('*', { count: 'exact', head: true })
      .eq('segment_id', segmentId);

    if (error) {
      console.error('Erreur lors du comptage des membres:', error);
      throw error;
    }

    return count || 0;
  }

  /**
   * Teste les critères d'un segment avant de le sauvegarder
   */
  async testSegmentCriteria(criteria: SegmentCriteria): Promise<{ count: number; preview: any[] }> {
    try {
      const sqlQuery = await this.buildSegmentQuery(criteria);
      
      // Exécute la requête avec une limite pour l'aperçu
      const previewQuery = sqlQuery + ' LIMIT 10';
      
      const { data: preview, error } = await getSupabaseAdminClient().rpc('execute_raw_sql', { 
        query: previewQuery 
      });

      if (error) {
        console.error('Erreur lors du test des critères:', error);
        throw error;
      }

      // Compte le nombre total
      const countQuery = sqlQuery.replace(
        'SELECT DISTINCT p.id, p.email, p.nom, p.prenom, p.created_at, p.email_verified, p.pubkey',
        'SELECT COUNT(DISTINCT p.id) as count'
      );
      const { data: countResult, error: countError } = await getSupabaseAdminClient().rpc('execute_raw_sql', { 
        query: countQuery 
      });

      if (countError) {
        console.error('Erreur lors du comptage:', countError);
        throw countError;
      }

      const count = countResult?.[0]?.count || 0;

      return {
        count,
        preview: preview || []
      };
    } catch (error) {
      console.error('Erreur lors du test des critères:', error);
      throw error;
    }
  }
}
