require('dotenv').config();
console.log("🔑 JWT_SECRET cargado:", !!process.env.JWT_SECRET); // Solo muestra si existe
console.log("🔑 Longitud del JWT_SECRET:", process.env.JWT_SECRET?.length);
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;

// ✅ CONEXIÓN A MONGODB
mongoose.connect('mongodb://localhost:27017/URL-Shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
});

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'POST /api/shorten'
    ]
  });
});

// Endpoint para acortar URLs
app.post('/api/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const urlPattern = /^https?:\/\/.+\..+/;
if (!urlPattern.test(url.trim())) {
  return res.status(400).json({ 
    error: 'invalid URL' 
  });
}


    const urlEncoded = encodeURIComponent(url.trim());
    const response = await fetch('https://cleanuri.com/api/v1/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${urlEncoded}`
    });

    const data = await response.json();
    
   if (data.result_url) {
  res.json({ success: true, result_url: data.result_url });
} else if (data.error) {
  // Traducir errores comunes de CleanURI
  let errorMessage = data.error;
  if (data.error.includes('invalid')) {
    errorMessage = 'Invalid URL';
  } else if (data.error.includes('blocked')) {
    errorMessage = 'URL is blocked by the server.';
  }
  res.status(400).json({ success: false, error: errorMessage });
} else {
  res.status(500).json({ success: false, error: 'Error' });
}

  } catch (error) {
    res.status(500).json({ success: false, error: 'Error' });
  }
});

app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});