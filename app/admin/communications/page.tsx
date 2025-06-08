'use client'

import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

interface EmailLog {
  id: string
  type: string
  recipient: string
  status: string
  sent_at: string
  order_id?: string
  contact_id?: string
}

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  status: string
  created_at: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: string
  is_active: boolean
  variables: Record<string, string>
  created_at: string
}

interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  segment_ids: string[]
  scheduled_at?: string
  sent_at?: string
  stats: {
    sent_count?: number
    delivered_count?: number
    opened_count?: number
    clicked_count?: number
    bounced_count?: number
  }
  created_at: string
}

interface EmailStats {
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  open_rate: number
  click_rate: number
  bounce_rate: number
}

export default function CommunicationsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'templates' | 'logs'>('dashboard')
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [showNewTemplate, setShowNewTemplate] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true)
      
      if (activeTab === 'dashboard' || activeTab === 'logs') {
        await Promise.all([
          loadEmailLogs(),
          loadContacts(),
          loadEmailStats()
        ])
      }
      
      if (activeTab === 'campaigns') {
        await loadCampaigns()
      }
      
      if (activeTab === 'templates') {
        await loadTemplates()
      }
      
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEmailLogs = async () => {
    try {
      // Pour le moment, utiliser la table existante ou créer une simulation
      const { data, error } = await supabaseAdmin!
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) {
        console.log('Table email_logs non trouvée, utilisation de données simulées')
        // Données simulées pour la démo
        setEmailLogs([
          {
            id: '1',
            type: 'welcome',
            recipient: 'user@example.com',
            status: 'sent',
            sent_at: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'newsletter',
            recipient: 'user2@example.com',
            status: 'delivered',
            sent_at: new Date(Date.now() - 3600000).toISOString(),
          }
        ])
      } else {
        setEmailLogs(data || [])
      }
    } catch (error) {
      console.error('Erreur chargement logs:', error)
      setEmailLogs([])
    }
  }

  const loadContacts = async () => {
    try {
      const { data, error } = await supabaseAdmin!
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) {
        console.log('Table contacts non trouvée')
        setContacts([])
      } else {
        setContacts(data || [])
      }
    } catch (error) {
      console.error('Erreur chargement contacts:', error)
      setContacts([])
    }
  }

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabaseAdmin!
        .from('crm_email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.log('Table crm_email_campaigns non trouvée, utilisation de données simulées')
        setCampaigns([
          {
            id: '1',
            name: 'Onboarding Lightning Network',
            subject: 'Bienvenue dans l\'écosystème Lightning !',
            content: '<p>Découvrez comment connecter votre nœud...</p>',
            status: 'sent',
            segment_ids: ['new-users'],
            sent_at: new Date().toISOString(),
            stats: {
              sent_count: 150,
              delivered_count: 148,
              opened_count: 89,
              clicked_count: 23
            },
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      } else {
        setCampaigns(data || [])
      }
    } catch (error) {
      console.error('Erreur chargement campagnes:', error)
      setCampaigns([])
    }
  }

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabaseAdmin!
        .from('crm_email_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.log('Table crm_email_templates non trouvée, utilisation de données simulées')
        setTemplates([
          {
            id: '1',
            name: 'Welcome Email',
            subject: 'Bienvenue sur DazNode !',
            content: '<html><body><h1>Bonjour {{prenom}},</h1><p>Bienvenue sur DazNode...</p></body></html>',
            category: 'onboarding',
            is_active: true,
            variables: { prenom: 'Prénom du client', nom: 'Nom du client' },
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Newsletter Monthly',
            subject: 'Actualités Lightning - {{mois}}',
            content: '<html><body><h1>Newsletter {{mois}}</h1><p>Découvrez les nouveautés...</p></body></html>',
            category: 'newsletter',
            is_active: true,
            variables: { mois: 'Mois courant' },
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      } else {
        setTemplates(data || [])
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error)
      setTemplates([])
    }
  }

  const loadEmailStats = async () => {
    try {
      // Calculer les stats à partir des campagnes
      const totalSent = campaigns.reduce((sum, c) => sum + (c.stats.sent_count || 0), 0)
      const totalDelivered = campaigns.reduce((sum, c) => sum + (c.stats.delivered_count || 0), 0)
      const totalOpened = campaigns.reduce((sum, c) => sum + (c.stats.opened_count || 0), 0)
      const totalClicked = campaigns.reduce((sum, c) => sum + (c.stats.clicked_count || 0), 0)
      
      const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
      const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
      const bounceRate = totalSent > 0 ? ((totalSent - totalDelivered) / totalSent) * 100 : 0
      
      setEmailStats({
        total_sent: totalSent,
        total_delivered: totalDelivered,
        total_opened: totalOpened,
        total_clicked: totalClicked,
        open_rate: openRate,
        click_rate: clickRate,
        bounce_rate: bounceRate
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
      // Stats par défaut pour la démo
      setEmailStats({
        total_sent: 150,
        total_delivered: 148,
        total_opened: 89,
        total_clicked: 23,
        open_rate: 59.3,
        click_rate: 25.8,
        bounce_rate: 1.3
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      sent: 'bg-green-100 text-green-800',
      delivered: 'bg-blue-100 text-blue-800',
      opened: 'bg-purple-100 text-purple-800',
      failed: 'bg-red-100 text-red-800',
      bounced: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-orange-100 text-orange-800',
      sending: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600">Gestion des campagnes email et communications</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href="/admin/crm"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🎯 CRM Avancé
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'campaigns', label: 'Campagnes', icon: '📧' },
            { id: 'templates', label: 'Templates', icon: '📝' },
            { id: 'logs', label: 'Logs', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && emailStats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-600">Emails Envoyés</div>
              <div className="text-2xl font-bold text-blue-600">{emailStats.total_sent.toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-600">Taux d'Ouverture</div>
              <div className="text-2xl font-bold text-green-600">{emailStats.open_rate.toFixed(1)}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-600">Taux de Clic</div>
              <div className="text-2xl font-bold text-purple-600">{emailStats.click_rate.toFixed(1)}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-600">Taux de Rebond</div>
              <div className="text-2xl font-bold text-red-600">{emailStats.bounce_rate.toFixed(1)}%</div>
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setActiveTab('campaigns')
                setShowNewCampaign(true)
              }}
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold">Nouvelle Campagne</div>
              <div className="text-sm opacity-90">Créer une campagne email</div>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('templates')
                setShowNewTemplate(true)
              }}
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold">Nouveau Template</div>
              <div className="text-sm opacity-90">Créer un template email</div>
            </button>
            
            <Link
              href="/admin/users"
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center block"
            >
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold">Gérer Contacts</div>
              <div className="text-sm opacity-90">Voir la base clients</div>
            </Link>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Campagnes Email</h2>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Nouvelle Campagne
            </button>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Envoyés</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ouvertures</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.stats.sent_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.stats.opened_count || 0}
                      {campaign.stats.sent_count && campaign.stats.opened_count && (
                        <span className="text-gray-500 ml-1">
                          ({((campaign.stats.opened_count / campaign.stats.sent_count) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.stats.clicked_count || 0}
                      {campaign.stats.opened_count && campaign.stats.clicked_count && (
                        <span className="text-gray-500 ml-1">
                          ({((campaign.stats.clicked_count / campaign.stats.opened_count) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(campaign.sent_at || campaign.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        Voir
                      </button>
                      {campaign.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-900">
                          Envoyer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Templates Email</h2>
            <button
              onClick={() => setShowNewTemplate(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nouveau Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Sujet:</p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(template.variables).map((variable) => (
                      <span key={variable} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                    Modifier
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Utiliser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Logs des emails */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Logs des emails</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Destinataire</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Envoyé le</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="px-4 py-2">{log.type}</td>
                      <td className="px-4 py-2">{log.recipient}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {log.sent_at ? formatDate(log.sent_at) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Messages de contact */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages de contact</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Sujet</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Reçu le</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-t">
                      <td className="px-4 py-2">
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="px-4 py-2">{contact.email}</td>
                      <td className="px-4 py-2">{contact.subject}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(contact.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals (simplifiés pour la démo) */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nouvelle Campagne</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Utilisez le CRM avancé pour créer des campagnes complètes.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowNewCampaign(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Fermer
              </button>
              <Link
                href="/admin/crm"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Aller au CRM
              </Link>
            </div>
          </div>
        </div>
      )}

      {showNewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nouveau Template</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Utilisez le CRM avancé pour créer des templates complets.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowNewTemplate(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Fermer
              </button>
              <Link
                href="/admin/crm"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                Aller au CRM
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 