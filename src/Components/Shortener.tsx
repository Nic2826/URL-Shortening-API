import  { useState } from 'react';
import Results from './Results';
export default function Shortener() {
  const [inputValue, setInputValue] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Aquí puedes manejar el envío del formulario, como llamar a una API para acortar la URL
    console.log("Enviando URL:", inputValue);
    const cleanUrl = inputValue.trim();

       if (!cleanUrl) {
    setError("Please fill out the field");
    setLoading(false);
    return;
  }
  
  try {
  const response = await fetch('http://localhost:3001/api/shorten', {
    method: 'POST',
   headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({ url: cleanUrl })
  });

  const data = await response.json();
 if (data.success && data.result_url) {
  setShortenedUrl(data.result_url);
  setError(""); // Limpiar errores
} else {
  setError(data.error || "Error shortening the URL");
}
} catch (error) {
  setError("Error connecting to the service");
} finally {
  setLoading(false); // Siempre apagar el loading
}
 
  };
  console.log(loading)



  return (
    <div>
      <form className="shortener" onSubmit={handleSubmit} noValidate >
        <input 
          className="shortener__input" 
          placeholder="Shorten a link here..."
          type="text"
          name="url"
          id="url"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        
        <button 
          className="shortener__button"
          type="submit" 
        >
          {loading ? "loading..." : "Shorten It!"}
        </button>
        <span className="shortener__error">{error}</span>
      </form>
      <Results 
      originalUrl={inputValue}
      shortUrl={shortenedUrl}/>
    </div>
  )
}