'use client'

import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

export default function CommunicationsPage(): JSX.Element {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (): Promise<void> => {
    try {
      const [emailResult, contactResult] = await Promise.all([
        supabaseAdmin
          .from('email_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        
        supabaseAdmin
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
      ])

      if (emailResult.data) setEmailLogs(emailResult.data)
      if (contactResult.data) setContacts(contactResult.data)
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Communications</h1>
      
      {/* Logs des emails */}
      <div className="bg-white rounded-lg shadow">
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
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.status === 'sent' ? 'bg-green-100 text-green-800' :
                      log.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {log.sent_at ? new Date(log.sent_at).toLocaleString('fr-FR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Messages de contact */}
      <div className="bg-white rounded-lg shadow">
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
                    <span className={`px-2 py-1 rounded text-xs ${
                      contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'processed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(contact.created_at).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 