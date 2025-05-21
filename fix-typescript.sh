#!/bin/bash

# fix-typescript.sh

# 1. Correction du type de retour manquant dans LightningPayment.tsx
echo "Correction des types dans LightningPayment.tsx..."
sed -i '' '174,176c\
  const _handlePayment = useCallback((): void => {\
    try {\
      onSuccess?.();\
    } catch (error) {\
      logger.error("Payment error:", error);\
      onError?.(error);\
    }\
  }, [onSuccess, onError]);' components/shared/ui/LightningPayment.tsx

# 2. Correction des dépendances dans useEffect
echo "Correction des dépendances useEffect..."
sed -i '' '176,180c\
  useEffect(() => {\
    const handler = (): void => setShowProtonModal(true);\
    window.addEventListener("openProtonPay", handler);\
    return () => window.removeEventListener("openProtonPay", handler);\
  }, [setShowProtonModal]);' components/shared/ui/LightningPayment.tsx

# 3. Correction du type ProtonSession dans ProtonPayments.tsx
echo "Correction des types dans ProtonPayments.tsx..."
sed -i '' '14,18c\
interface ProtonSession {\
  auth: { actor: string };\
  transact: (args: TransactionArgs, opts: TransactionOptions) => Promise<TransactionResult>;\
}\
\
interface TransactionArgs {\
  actions: Array<{\
    account: string;\
    name: string;\
    data: {\
      from: string;\
      to: string;\
      quantity: string;\
      memo: string;\
    };\
    authorization: Array<{ actor: string }>;\
  }>;\
}\
\
interface TransactionOptions {\
  broadcast: boolean;\
}\
\
interface TransactionResult {\
  processed: boolean;\
  transaction_id: string;\
}' components/shared/ui/ProtonPayments.tsx

# 4. Correction des assertions non-nulles
echo "Correction des assertions non-nulles..."
sed -i '' 's/!\.//g' components/shared/ui/LightningPayment.tsx
sed -i '' 's/!\.//g' components/shared/ui/ProtonPayments.tsx

# 5. Ajout des vérifications explicites
echo "Ajout des vérifications explicites..."
sed -i '' '120,125c\
  const processPayment = async (): Promise<void> => {\
    if (!session) {\
      await login();\
      return;\
    }\
\
    if (!session.auth?.actor) {\
      setError("Session invalide");\
      return;\
    }' components/shared/ui/ProtonPayments.tsx

echo "Corrections terminées !"