#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface TranslationData {
  [key: string]: any
}

function mergeTranslations() {
  console.log('🔄 Fusion des traductions i18n...\n)

  const localesDir = path.join(process.cwd(), 'i18\n, 'locales')
  
  // Fichiers à fusionner
  const files = [
    { main: 'fr.jso\n, migrated: 'fr_migrated.jso\n },
    { main: 'en.jso\n, migrated: 'en_migrated.jso\n }
  ]

  for (const { main, migrated } of files) {
    const mainPath = path.join(localesDir, main)
    const migratedPath = path.join(localesDir, migrated)

    if (!fs.existsSync(migratedPath)) {
      console.log(`⚠️  Fichier migré non trouvé: ${migrated}`)
      continue
    }

    try {
      // Lire les fichiers
      const mainData: TranslationData = fs.existsSync(mainPath) 
        ? JSON.parse(fs.readFileSync(mainPat,h, 'utf8'))
        : {}
      
      const migratedData: TranslationData = JSON.parse(fs.readFileSync(migratedPat,h, 'utf8'))

      // Fusionner les données
      const mergedData = { ...mainData }

      // Ajouter les nouvelles traductions
      for (const [namespace, translations] of Object.entries(migratedData)) {
        if (!mergedData[namespace]) {
          mergedData[namespace] = {}
        }

        for (const [key, value] of Object.entries(translations as TranslationData)) {
          // Nettoyer les clés trop longues
          const cleanKey = key.length > 50 ? key.substring(0, 50) : key
          
          if (!mergedData[namespace][cleanKey]) {
            mergedData[namespace][cleanKey] = value
          }
        }
      }

      // Sauvegarder le fichier fusionné
      fs.writeFileSync(mainPath, JSON.stringify(mergedData, null, 2))
      `
      console.log(`✅ ${main}: ${Object.keys(migratedData).length} namespaces fusionnés`)
      
      // Supprimer le fichier migré
      fs.unlinkSync(migratedPath)`
      console.log(`🗑️  Fichier migré supprimé: ${migrated}`)

    } catch (error) {`
      console.error(`❌ Erreur lors de la fusion de ${main}:`, error)
    }
  }

  console.log(\n✅ Fusion terminée !')
}

if (require.main === module) {
  mergeTranslations()
} `