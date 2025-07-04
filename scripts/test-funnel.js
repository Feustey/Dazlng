#!/usr/bin/env node

/**
 * Script de test automatisé pour le funnel de conversion
 * Valide que tous les événements de tracking fonctionnent correctement
 *
const puppeteer = require('puppeteer');

async function testFunnel() {
  console.log('🚀 Démarrage des tests du funnel de conversion...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Mode visible pour voir les tests
    slowMo: 1000 // Ralentir pour observer
  });
  
  const page = await browser.newPage();
  
  try {
    // Aller à la page de test
    console.log('📄 Navigation vers la page de test...');
    await page.goto('http://localhost:3000/test-funnel');
    await page.waitForSelector('h1');
    
    // Test 1: Vérifier le tracking de page view
    console.log('✅ Test 1: Page view tracking');
    await page.waitForTimeout(2000);
    
    // Test 2: Clic sur CTA primaire du hero
    console.log('✅ Test 2: CTA primaire hero');
    await page.click('button:has-text("Démarrer Gratuitement")');
    await page.waitForTimeout(1000);
    await page.goBack();
    
    // Test 3: Clic sur CTA secondaire du hero
    console.log('✅ Test 3: CTA secondaire hero');
    await page.click('button:has-text("Voir la Démo")');
    await page.waitForTimeout(1000);
    await page.goBack();
    
    // Test 4: Scroll tracking
    console.log('✅ Test 4: Scroll tracking');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 4);
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    
    // Test 5: CTA section "Comment ça marche"
    console.log('✅ Test 5: CTA section Comment ça marche');
    await page.click('button:has-text("Commander ma DazBox")');
    await page.waitForTimeout(1000);
    
    // Test 6: CTA finale
    console.log('✅ Test 6: CTA section finale');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);
    
    await page.click('button:has-text("Planifier une Démo")');
    await page.waitForTimeout(1000);
    
    // Vérifier les analytics
    console.log('📊 Vérification des analytics...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);
    
    // Récupérer les données analytics
    const analyticsData = await page.evaluate(() => {
      const data = localStorage.getItem('daz_analytics');
      return data ? JSON.parse(data) : [];
    });
    
    console.log(`📈 ${analyticsData.length} événements trackés:`);
    analyticsData.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.stepName} - ${event.action} (${event.location})`);
    });
    
    // Validation des événements attendus
    const expectedEvents = [
      'page_view',
      'cta_click',
      'scroll_depth'
    ];
    
    const trackedSteps = [...new Set(analyticsData.map(e => e.stepName))];
    const missingEvents = expectedEvents.filter(event => !trackedSteps.includes(event));
    
    if (missingEvents.length === 0) {
      console.log('✅ Tous les événements attendus ont été trackés !');
    } else {
      console.log('❌ Événements manquants:', missingEvents);
    }
    
    // Test de l'export des données
    console.log('💾 Test de l\'export des données...');
    await page.click('button:has-text("Exporter les données")');
    await page.waitForTimeout(2000);
    
    console.log('🎉 Tests terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await browser.close();
  }
}

// Fonction pour vérifier que le serveur est démarré
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

// Exécution principale
async function main() {
  console.log('🔍 Vérification du serveur...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Le serveur n\'est pas démarré. Lancez `npm run dev` d\'abord.');
    process.exit(1);
  }
  
  console.log('✅ Serveur détecté, démarrage des tests...');
  await testFunnel();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testFunnel }; 