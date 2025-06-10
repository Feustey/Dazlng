"use client";

import React, { useState } from 'react';
import { Key, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface DecodedInvoice {
  type: 'bolt11';
  network: 'mainnet' | 'testnet' | 'regtest';
  amount_msat?: number;
  amount_btc?: number;
  timestamp: number;
  expiry: number;
  description?: string;
  description_hash?: string;
  payment_hash: string;
  destination: string;
  min_final_cltv_expiry: number;
  routes?: any[];
  features?: Record<string, any>;
  created_at: string;
  expires_at: string;
}

interface DecodedLNURL {
  type: 'lnurl';
  subtype: 'pay' | 'withdraw' | 'channel' | 'auth';
  url: string;
  domain: string;
  metadata?: any;
  callback?: string;
  maxSendable?: number;
  minSendable?: number;
  tag?: string;
}

interface DecodedLightningAddress {
  type: 'lightning_address';
  username: string;
  domain: string;
  lnurl?: string;
  metadata?: any;
}

type DecodedResult = DecodedInvoice | DecodedLNURL | DecodedLightningAddress;

export function LightningDecoder() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');

  const examples = [
    {
      type: 'BOLT11',
      value: 'lnbc1500n1pw5kjjvpp5...',
      description: 'Invoice Lightning standard'
    },
    {
      type: 'LNURL',
      value: 'LNURL1DP68GURN8GHJ7...',
      description: 'LNURL encodée'
    },
    {
      type: 'Lightning Address',
      value: 'satoshi@bitcoin.org',
      description: 'Adresse Lightning lisible'
    },
    {
      type: 'LNURL décodée',
      value: 'https://example.com/.well-known/lnurlp/user',
      description: 'LNURL sous forme d\'URL'
    }
  ];

  const decode = async () => {
    if (!input.trim()) {
      setError('Veuillez entrer une valeur à décoder');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/lightning/decoder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: input.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error?.message || 'Erreur lors du décodage');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const formatAmount = (amountMsat?: number) => {
    if (!amountMsat) return 'N/A';
    
    const sats = amountMsat / 1000;
    const btc = amountMsat / 100000000000;
    
    if (sats >= 100000000) {
      return `${btc.toFixed(8)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}K sats`;
    } else {
      return `${sats} sats`;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('fr-FR');
  };

  const getNetworkBadge = (network: string) => {
    const colors = {
      mainnet: 'bg-green-100 text-green-800',
      testnet: 'bg-yellow-100 text-yellow-800',
      regtest: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[network as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {network}
      </span>
    );
  };

  const CopyButton = ({ text, copyKey }: { text: string; copyKey: string }) => (
    <button
      onClick={() => copyToClipboard(text, copyKey)}
      className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
      title="Copier"
    >
      {copied === copyKey ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Key className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Décodeur Lightning</h2>
      </div>

      {/* Formulaire de saisie */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entrez votre BOLT11, LNURL ou Lightning Address
          </label>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Collez ici votre invoice, LNURL ou adresse Lightning..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={decode}
          disabled={loading || !input.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Décodage...
            </div>
          ) : (
            'Décoder'
          )}
        </button>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Résultat du décodage */}
      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Résultat du décodage</h3>
          
          {/* Type et réseau */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Type:</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded uppercase">
              {result.type}
            </span>
            {result.type === 'bolt11' && (
              <div>
                <span className="text-sm font-medium text-gray-600 mr-2">Réseau:</span>
                {getNetworkBadge(result.network)}
              </div>
            )}
          </div>

          {/* Contenu spécifique selon le type */}
          {result.type === 'bolt11' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Montant:</span>
                  <p className="font-mono text-sm mt-1">
                    {formatAmount(result.amount_msat)}
                    <CopyButton text={result.amount_msat?.toString() || ''} copyKey="amount" />
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Expiration:</span>
                  <p className="font-mono text-sm mt-1">
                    {formatDate(result.timestamp + result.expiry)}
                  </p>
                </div>
              </div>

              {result.description && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Description:</span>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {result.description}
                    <CopyButton text={result.description} copyKey="description" />
                  </p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-600">Hash de paiement:</span>
                <p className="font-mono text-xs mt-1 break-all bg-gray-50 p-2 rounded">
                  {result.payment_hash}
                  <CopyButton text={result.payment_hash} copyKey="payment_hash" />
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Destination:</span>
                <p className="font-mono text-xs mt-1 break-all bg-gray-50 p-2 rounded">
                  {result.destination}
                  <CopyButton text={result.destination} copyKey="destination" />
                </p>
              </div>
            </div>
          )}

          {result.type === 'lnurl' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Sous-type:</span>
                  <p className="font-mono text-sm mt-1 uppercase">{result.subtype}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Domaine:</span>
                  <p className="font-mono text-sm mt-1">{result.domain}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">URL de callback:</span>
                <div className="flex items-center mt-1">
                  <p className="font-mono text-xs flex-1 break-all bg-gray-50 p-2 rounded">
                    {result.url}
                  </p>
                  <CopyButton text={result.url} copyKey="lnurl_url" />
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Ouvrir l'URL"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {result.minSendable && result.maxSendable && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Limites d'envoi:</span>
                  <p className="text-sm mt-1">
                    Min: {formatAmount(result.minSendable)} - Max: {formatAmount(result.maxSendable)}
                  </p>
                </div>
              )}
            </div>
          )}

          {result.type === 'lightning_address' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Utilisateur:</span>
                  <p className="font-mono text-sm mt-1">{result.username}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Domaine:</span>
                  <p className="font-mono text-sm mt-1">{result.domain}</p>
                </div>
              </div>

              {result.lnurl && (
                <div>
                  <span className="text-sm font-medium text-gray-600">LNURL correspondante:</span>
                  <div className="flex items-center mt-1">
                    <p className="font-mono text-xs flex-1 break-all bg-gray-50 p-2 rounded">
                      {result.lnurl}
                    </p>
                    <CopyButton text={result.lnurl} copyKey="lightning_lnurl" />
                  </div>
                </div>
              )}

              {result.metadata && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Description:</span>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {result.metadata.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Exemples */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Exemples de formats supportés
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example.value)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-sm text-gray-900">{example.type}</div>
              <div className="text-xs text-gray-500 mt-1">{example.description}</div>
              <div className="font-mono text-xs text-gray-700 mt-2 truncate">
                {example.value}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Formats supportés
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>BOLT11:</strong> Invoices Lightning Network standard</li>
          <li>• <strong>LNURL:</strong> URLs Lightning encodées et décodées</li>
          <li>• <strong>Lightning Address:</strong> Adresses au format email</li>
          <li>• <strong>Réseaux:</strong> Mainnet, Testnet, Regtest</li>
        </ul>
      </div>
    </div>
  );
} 