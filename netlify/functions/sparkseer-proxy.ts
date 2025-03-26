export const handler = async (event: any) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Récupérer le chemin de la requête
  const path = event.path.replace('/.netlify/functions/sparkseer-proxy', '')
  
  try {
    // Faire la requête vers l'API Sparkseer
    const response = await fetch(`https://api.sparkseer.space${path}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    // Retourner la réponse avec les en-têtes CORS appropriés
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
} 