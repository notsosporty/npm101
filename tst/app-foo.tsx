const axios = require('axios');

async function fetchExternalData(baseUrl, path) {
  const fullUrl = `${baseUrl}/${path}`;
  
  try {
    const response = await axios.get(fullUrl, {
      timeout: 5000, // Basic safeguard, but doesn't stop bad domains
      headers: { 'User-Agent': 'MyApp/1.0' }
    });
    console.log('Data fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
  }
}

// Usage: Plug in something sketchy
const path = '.env'; // Imagine this from a tainted input
fetchExternalData('https://external-api101.com', path);
