const QRCode = require('qrcode');

// Test de génération de QR code pour une facture Lightning
const testQRGeneration = async () => {
  const paymentRequest = 'lnbc15000n1pb6f96ee023pp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhpweetest';
  
  try {
    console.log('🧪 Test génération QR code...');
    
    const qrCodeDataUrl = await QRCode.toDataURL(paymentRequest, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log('✅ QR Code généré avec succès !');
    console.log('📏 Taille data URL:', qrCodeDataUrl.length);
    console.log('🔗 Format:', qrCodeDataUrl.substring(0, 50) + '...');
    
    return qrCodeDataUrl;
    
  } catch (error) {
    console.error('❌ Erreur génération QR code:', error);
    throw error;
  }
};

testQRGeneration()
  .then(() => {
    console.log('🎉 Test terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test échoué:', error);
    process.exit(1);
  }); 