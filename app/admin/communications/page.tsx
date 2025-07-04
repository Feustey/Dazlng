"use client"

import React, { useState, useEffect, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface EmailLog {
  id: string
  type: string
  recipient: string
  status: string
  sent_at: string
  order_id?: string
  contact_id?: string
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  status: string
  created_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: string
  is_active: boolean
  variables: Record<string, any>
  created_at: string
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled"
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

export interface EmailStats {
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  open_rate: number
  click_rate: number
  bounce_rate: number
}

type TabType = "dashboard" | "logs" | "contacts" | "campaigns" | "templates"

export default function CommunicationsPage(): JSX.Element {
  const { t } = useAdvancedTranslation("communications");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [showNewTemplate, setShowNewTemplate] = useState(false)

  const loadEmailStats = async () => {
    try {
      // Calculer les stats à partir des campagnes
      const totalSent = campaigns.reduce((sum: any, c: any) => sum + (c.stats.sent_count || 0), 0)
      const totalDelivered = campaigns.reduce((sum: any, c: any) => sum + (c.stats.delivered_count || 0), 0)
      const totalOpened = campaigns.reduce((sum: any, c: any) => sum + (c.stats.opened_count || 0), 0)
      const totalClicked = campaigns.reduce((sum: any, c: any) => sum + (c.stats.clicked_count || 0), 0)
      
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
      console.error("Erreur chargement stats:", error)
      // Stats par défaut pour la démo
      setEmailStats({
        total_sent: 15.0,
        total_delivered: 14.8,
        total_opened: 8.9,
        total_clicked: 2.3,
        open_rate: 59.3,
        click_rate: 25.8,
        bounce_rate: 1.3
      })
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === "logs") {
        await loadEmailLogs()
      } else if (activeTab === "contacts") {
        await loadContacts()
      } else if (activeTab === "campaigns") {
        await loadCampaigns()
        await loadEmailStats()
      } else if (activeTab === "templates") {
        await loadTemplates()
      }
      
    } catch (error: unknown) {
      console.error("Erreur chargement données:", error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, loadEmailStats]);

  useEffect(() => {
    loadData()
  }, [loadData]);

  const loadEmailLogs = async () => {
    try {
      // Pour le moment, utiliser la table existante ou créer une simulation
      const {data, error} = await getSupabaseBrowserClient()
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (error) {
        console.log("Table email_logs non trouvée, utilisation de données simulées")
        // Données simulées pour la démo
        setEmailLogs([
          {
            id: "1",
            type: "welcome",
            recipient: "user@example.com",
            status: "sent",
            sent_at: new Date().toISOString()
          },
          {
            id: "2",
            type: "newsletter",
            recipient: "user2@example.com",
            status: "delivered",
            sent_at: new Date(Date.now() - 3600000).toISOString()
          }
        ])
      } else {
        setEmailLogs(data || [])
      }
    } catch (error) {
      console.error("Erreur chargement logs:", error)
      setEmailLogs([])
    }
  }

  const loadContacts = async () => {
    try {
      const {data, error} = await getSupabaseBrowserClient()
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (error) {
        console.log("Table contacts non trouvée")
        setContacts([])
      } else {
        setContacts(data || [])
      }
    } catch (error) {
      console.error("Erreur chargement contacts:", error)
      setContacts([])
    }
  }

  const loadCampaigns = async () => {
    try {
      const {data, error} = await getSupabaseBrowserClient()
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (error) {
        console.log("Table email_campaigns non trouvée, utilisation de données simulées")
        // Données simulées pour la démo
        setCampaigns([
          {
            id: "1",
            name: "Newsletter mensuelle",
            subject: "Votre newsletter DazNode - Janvier 2024",
            content: "Contenu de la newsletter...",
            status: "sent",
            segment_ids: ["all"],
            sent_at: new Date().toISOString(),
            stats: {
              sent_count: 150,
              delivered_count: 148,
              opened_count: 89,
              clicked_count: 23,
              bounced_count: 2
            },
            created_at: new Date().toISOString()
          }
        ])
      } else {
        setCampaigns(data || [])
      }
    } catch (error) {
      console.error("Erreur chargement campagnes:", error)
      setCampaigns([])
    }
  }

  const loadTemplates = async () => {
    try {
      const {data, error} = await getSupabaseBrowserClient()
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (error) {
        console.log("Table email_templates non trouvée, utilisation de données simulées")
        // Données simulées pour la démo
        setTemplates([
          {
            id: "1",
            name: "Bienvenue",
            subject: "Bienvenue sur DazNode !",
            content: "Bonjour {{first_name}}, bienvenue sur DazNode...",
            category: "onboarding",
            is_active: true,
            variables: { first_name: "string" },
            created_at: new Date().toISOString()
          }
        ])
      } else {
        setTemplates(data || [])
      }
    } catch (error) {
      console.error("Erreur chargement templates:", error)
      setTemplates([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800"
      case "delivered": return "bg-blue-100 text-blue-800"
      case "opened": return "bg-purple-100 text-purple-800"
      case "clicked": return "bg-indigo-100 text-indigo-800"
      case "bounced": return "bg-red-100 text-red-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats principales */}
      {emailStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails envoyés</p>
                <p className="text-2xl font-semibold text-gray-900">{emailStats.total_sent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux d'ouverture</p>
                <p className="text-2xl font-semibold text-gray-900">{emailStats.open_rate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de clic</p>
                <p className="text-2xl font-semibold text-gray-900">{emailStats.click_rate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
                <p className="text-2xl font-semibold text-gray-900">{emailStats.bounce_rate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowNewCampaign(true)}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle campagne
          </button>
          
          <button
            onClick={() => setShowNewTemplate(true)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Nouveau template
          </button>
          
          <Link
            href="/admin/communications?tab=contacts"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gérer les contacts
          </Link>
        </div>
      </div>

      {/* Derniers logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Derniers emails envoyés</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emailLogs.slice(0, 5).map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.recipient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.sent_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Logs d'emails</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataire</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emailLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.recipient}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.sent_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContacts = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.first_name} {contact.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(contact.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCampaigns = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Campagnes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Envoyés</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.stats.sent_count || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(campaign.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(template.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
        <p className="text-gray-600">Gestion des emails et communications</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", label: "Tableau de bord" },
            { id: "logs", label: "Logs" },
            { id: "contacts", label: "Contacts" },
            { id: "campaigns", label: "Campagnes" },
            { id: "templates", label: "Templates" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "logs" && renderLogs()}
          {activeTab === "contacts" && renderContacts()}
          {activeTab === "campaigns" && renderCampaigns()}
          {activeTab === "templates" && renderTemplates()}
        </>
      )}
    </div>
  )
}
export const dynamic  = "force-dynamic";