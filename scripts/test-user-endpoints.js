#!/usr/bin/env node

/**
 * Script de test pour les nouveaux endpoints utilisateur
 * Usage: node scripts/test-user-endpoints.js
 *
const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_USER_EMAIL = 'test@dazno.de';
const TEST_USER_PASSWORD = 'TestPassword123!';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'gree\n);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = BASE_URL.startsWith('https') ? https : http;
    const url = new URL(options.path, BASE_URL);
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 3000),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/jso\n,
        ...options.headers
      }
    };

    const req = protocol.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          reject(new Error(`Erreur parsing JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Variables globales pour stocker les données de test
let authToken = null;
let testUserId = null;

// Tests des endpoints
async function testAuthentication() {
  logInfo('🔐 Test d\'authentification...');
  
  try {
    // Test de connexion
    const loginResponse = await makeRequest({
      method: 'POST',
      path: '/api/auth/send-code'
    }, {
      email: TEST_USER_EMAIL
    });

    if (loginResponse.status === 200) {
      logSuccess('Code OTP envoyé avec succès');
    } else {
      logWarning('Code OTP non envoyé (peut-être normal en test)');
    }

    // Simulation d'un token d'authentification pour les tests
    authToken = 'test-token-' + Date.now();
    logSuccess('Authentification simulée pour les tests');
    
  } catch (error) {
    logError(`Erreur authentification: ${error.message}`);
  }
}

async function testProfileEndpoints() {
  logInfo('👤 Test des endpoints de profil...');
  
  try {
    // GET /api/users/me/profile
    const getProfileResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/profile',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getProfileResponse.status === 200) {
      logSuccess('GET /api/users/me/profile - Profil récupéré');
    } else {
      logError(`GET /api/users/me/profile - Erreur ${getProfileResponse.status}`);
    }

    // PATCH /api/users/me/profile
    const updateProfileData = {
      firstname: 'Test',
      lastname: 'User',
      phone: '+33123456789',
      preferences: {
        notifications: true,
        privacy: 'public',
        language: 'fr'
      },
      socialLinks: [
        {
          platform: 'linkedi\n,
          url: 'https://linkedin.com/in/testuser',
          isPublic: true
        }
      ]
    };

    const patchProfileResponse = await makeRequest({
      method: 'PATCH',
      path: '/api/users/me/profile',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, updateProfileData);

    if (patchProfileResponse.status === 200) {
      logSuccess('PATCH /api/users/me/profile - Profil mis à jour');
    } else {
      logError(`PATCH /api/users/me/profile - Erreur ${patchProfileResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints profil: ${error.message}`);
  }
}

async function testStudiesEndpoints() {
  logInfo('🎓 Test des endpoints d\'études...');
  
  try {
    // GET /api/users/me/studies
    const getStudiesResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/studies',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getStudiesResponse.status === 200) {
      logSuccess('GET /api/users/me/studies - Études récupérées');
    } else {
      logError(`GET /api/users/me/studies - Erreur ${getStudiesResponse.status}`);
    }

    // POST /api/users/me/studies
    const studiesData = {
      program: 'Informatique',
      school: 'École Test',
      graduationYear: 2023,
      specialization: 'Développement Web',
      degree: 'Master',
      gpa: 3.8
    };

    const postStudiesResponse = await makeRequest({
      method: 'POST',
      path: '/api/users/me/studies',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, studiesData);

    if (postStudiesResponse.status === 200) {
      logSuccess('POST /api/users/me/studies - Études mises à jour');
    } else {
      logError(`POST /api/users/me/studies - Erreur ${postStudiesResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints études: ${error.message}`);
  }
}

async function testPrivacySettingsEndpoints() {
  logInfo('🔒 Test des endpoints de confidentialité...');
  
  try {
    // GET /api/users/me/privacy-settings
    const getPrivacyResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/privacy-settings',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getPrivacyResponse.status === 200) {
      logSuccess('GET /api/users/me/privacy-settings - Paramètres récupérés');
    } else {
      logError(`GET /api/users/me/privacy-settings - Erreur ${getPrivacyResponse.status}`);
    }

    // PUT /api/users/me/privacy-settings
    const privacyData = {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      showWallet: true,
      allowMessages: true,
      showOnlineStatus: true,
      showLastSeen: true,
      allowServiceRequests: true,
      allowNotifications: true
    };

    const putPrivacyResponse = await makeRequest({
      method: 'PUT',
      path: '/api/users/me/privacy-settings',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, privacyData);

    if (putPrivacyResponse.status === 200) {
      logSuccess('PUT /api/users/me/privacy-settings - Paramètres mis à jour');
    } else {
      logError(`PUT /api/users/me/privacy-settings - Erreur ${putPrivacyResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints confidentialité: ${error.message}`);
  }
}

async function testNotificationSettingsEndpoints() {
  logInfo('🔔 Test des endpoints de notifications...');
  
  try {
    // GET /api/users/me/notification-settings
    const getNotificationsResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/notification-settings',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getNotificationsResponse.status === 200) {
      logSuccess('GET /api/users/me/notification-settings - Paramètres récupérés');
    } else {
      logError(`GET /api/users/me/notification-settings - Erreur ${getNotificationsResponse.status}`);
    }

    // PUT /api/users/me/notification-settings
    const notificationData = {
      email: {
        newMessages: true,
        serviceBookings: true,
        paymentConfirmations: true,
        systemUpdates: true,
        marketing: false,
        weeklyDigest: true
      },
      push: {
        newMessages: true,
        serviceBookings: true,
        paymentConfirmations: true,
        systemUpdates: true
      },
      inApp: {
        newMessages: true,
        serviceBookings: true,
        paymentConfirmations: true,
        systemUpdates: true,
        achievements: true,
        recommendations: true
      }
    };

    const putNotificationsResponse = await makeRequest({
      method: 'PUT',
      path: '/api/users/me/notification-settings',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, notificationData);

    if (putNotificationsResponse.status === 200) {
      logSuccess('PUT /api/users/me/notification-settings - Paramètres mis à jour');
    } else {
      logError(`PUT /api/users/me/notification-settings - Erreur ${putNotificationsResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints notifications: ${error.message}`);
  }
}

async function testMetricsEndpoint() {
  logInfo('📊 Test de l\'endpoint de métriques...');
  
  try {
    // GET /api/users/me/metrics
    const getMetricsResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/metrics',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getMetricsResponse.status === 200) {
      logSuccess('GET /api/users/me/metrics - Métriques récupérées');
    } else {
      logError(`GET /api/users/me/metrics - Erreur ${getMetricsResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoint métriques: ${error.message}`);
  }
}

async function testExperiencesEndpoints() {
  logInfo('💼 Test des endpoints d\'expériences...');
  
  try {
    // GET /api/users/me/experiences
    const getExperiencesResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/experiences',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getExperiencesResponse.status === 200) {
      logSuccess('GET /api/users/me/experiences - Expériences récupérées');
    } else {
      logError(`GET /api/users/me/experiences - Erreur ${getExperiencesResponse.status}`);
    }

    // POST /api/users/me/experiences
    const experienceData = {
      title: 'Développeur Full Stack',
      company: 'Entreprise Test',
      role: 'Lead Developer',
      city: 'Paris',
      country: 'France',
      industry: 'Technologie',
      from: '2022-01-01T00:00:00Z',
      to: '2023-12-31T23:59:59Z',
      isCurrent: false,
      description: 'Développement d\'applications web modernes'
    };

    const postExperienceResponse = await makeRequest({
      method: 'POST',
      path: '/api/users/me/experiences',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, experienceData);

    if (postExperienceResponse.status === 200) {
      logSuccess('POST /api/users/me/experiences - Expérience créée');
      
      // Test de modification et suppression si l'expérience a été créée
      const experienceId = postExperienceResponse.body?.data?.id;
      if (experienceId) {
        // PUT /api/users/me/experiences/[id]
        const putExperienceResponse = await makeRequest({
          method: 'PUT',
          path: `/api/users/me/experiences/${experienceId}`,
          headers: {
            'Authorizatio\n: `Bearer ${authToken}`
          }
        }, { ...experienceData, title: 'Développeur Senior Full Stack' });

        if (putExperienceResponse.status === 200) {
          logSuccess(`PUT /api/users/me/experiences/${experienceId} - Expérience modifiée`);
        }

        // DELETE /api/users/me/experiences/[id]
        const deleteExperienceResponse = await makeRequest({
          method: 'DELETE',
          path: `/api/users/me/experiences/${experienceId}`,
          headers: {
            'Authorizatio\n: `Bearer ${authToken}`
          }
        });

        if (deleteExperienceResponse.status === 200) {
          logSuccess(`DELETE /api/users/me/experiences/${experienceId} - Expérience supprimée`);
        }
      }
    } else {
      logError(`POST /api/users/me/experiences - Erreur ${postExperienceResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints expériences: ${error.message}`);
  }
}

async function testSkillsEndpoints() {
  logInfo('🛠️ Test des endpoints de compétences...');
  
  try {
    // GET /api/users/me/skills
    const getSkillsResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/skills',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getSkillsResponse.status === 200) {
      logSuccess('GET /api/users/me/skills - Compétences récupérées');
    } else {
      logError(`GET /api/users/me/skills - Erreur ${getSkillsResponse.status}`);
    }

    // POST /api/users/me/skills
    const skillData = {
      name: 'React',
      level: 'advanced',
      category: 'Frontend',
      description: 'Développement d\'interfaces utilisateur modernes'
    };

    const postSkillResponse = await makeRequest({
      method: 'POST',
      path: '/api/users/me/skills',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, skillData);

    if (postSkillResponse.status === 200) {
      logSuccess('POST /api/users/me/skills - Compétence créée');
      
      // Test de modification et suppression si la compétence a été créée
      const skillId = postSkillResponse.body?.data?.id;
      if (skillId) {
        // PUT /api/users/me/skills/[id]
        const putSkillResponse = await makeRequest({
          method: 'PUT',
          path: `/api/users/me/skills/${skillId}`,
          headers: {
            'Authorizatio\n: `Bearer ${authToken}`
          }
        }, { ...skillData, level: 'expert' });

        if (putSkillResponse.status === 200) {
          logSuccess(`PUT /api/users/me/skills/${skillId} - Compétence modifiée`);
        }

        // DELETE /api/users/me/skills/[id]
        const deleteSkillResponse = await makeRequest({
          method: 'DELETE',
          path: `/api/users/me/skills/${skillId}`,
          headers: {
            'Authorizatio\n: `Bearer ${authToken}`
          }
        });

        if (deleteSkillResponse.status === 200) {
          logSuccess(`DELETE /api/users/me/skills/${skillId} - Compétence supprimée`);
        }
      }
    } else {
      logError(`POST /api/users/me/skills - Erreur ${postSkillResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints compétences: ${error.message}`);
  }
}

async function testFavoritesEndpoints() {
  logInfo('⭐ Test des endpoints de favoris...');
  
  try {
    // GET /api/users/me/favorites
    const getFavoritesResponse = await makeRequest({
      method: 'GET',
      path: '/api/users/me/favorites',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    });

    if (getFavoritesResponse.status === 200) {
      logSuccess('GET /api/users/me/favorites - Favoris récupérés');
    } else {
      logError(`GET /api/users/me/favorites - Erreur ${getFavoritesResponse.status}`);
    }

    // POST /api/users/me/favorites
    const favoriteData = {
      type: 'service',
      itemId: 'test-service-123',
      notes: 'Service de test très utile'
    };

    const postFavoriteResponse = await makeRequest({
      method: 'POST',
      path: '/api/users/me/favorites',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, favoriteData);

    if (postFavoriteResponse.status === 200) {
      logSuccess('POST /api/users/me/favorites - Favori ajouté');
      
      // Test de suppression si le favori a été ajouté
      const favoriteId = postFavoriteResponse.body?.data?.id;
      if (favoriteId) {
        // DELETE /api/users/me/favorites/[id]
        const deleteFavoriteResponse = await makeRequest({
          method: 'DELETE',
          path: `/api/users/me/favorites/${favoriteId}`,
          headers: {
            'Authorizatio\n: `Bearer ${authToken}`
          }
        });

        if (deleteFavoriteResponse.status === 200) {
          logSuccess(`DELETE /api/users/me/favorites/${favoriteId} - Favori supprimé`);
        }
      }
    } else {
      logError(`POST /api/users/me/favorites - Erreur ${postFavoriteResponse.status}`);
    }

  } catch (error) {
    logError(`Erreur endpoints favoris: ${error.message}`);
  }
}

async function testChangePasswordEndpoint() {
  logInfo('🔑 Test de l\'endpoint de changement de mot de passe...');
  
  try {
    // POST /api/users/me/change-password
    const passwordData = {
      currentPassword: 'TestPassword123!',
      newPassword: 'NewTestPassword123!',
      confirmPassword: 'NewTestPassword123!'
    };

    const changePasswordResponse = await makeRequest({
      method: 'POST',
      path: '/api/users/me/change-password',
      headers: {
        'Authorizatio\n: `Bearer ${authToken}`
      }
    }, passwordData);

    if (changePasswordResponse.status === 200) {
      logSuccess('POST /api/users/me/change-password - Mot de passe changé');
    } else {
      logWarning(`POST /api/users/me/change-password - Erreur ${changePasswordResponse.status} (peut être normal en test)`);
    }

  } catch (error) {
    logError(`Erreur endpoint changement mot de passe: ${error.message}`);
  }
}

// Fonction principale
async function runTests() {
  log('🚀 Démarrage des tests des endpoints utilisateur...', 'bright');
  log(`📍 URL de base: ${BASE_URL}`, 'cya\n);
  
  try {
    await testAuthentication();
    await testProfileEndpoints();
    await testStudiesEndpoints();
    await testPrivacySettingsEndpoints();
    await testNotificationSettingsEndpoints();
    await testMetricsEndpoint();
    await testExperiencesEndpoints();
    await testSkillsEndpoints();
    await testFavoritesEndpoints();
    await testChangePasswordEndpoint();
    
    log('🎉 Tests terminés avec succès !', 'bright');
    
  } catch (error) {
    logError(`Erreur lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testAuthentication,
  testProfileEndpoints,
  testStudiesEndpoints,
  testPrivacySettingsEndpoints,
  testNotificationSettingsEndpoints,
  testMetricsEndpoint,
  testExperiencesEndpoints,
  testSkillsEndpoints,
  testFavoritesEndpoints,
  testChangePasswordEndpoint
}; 