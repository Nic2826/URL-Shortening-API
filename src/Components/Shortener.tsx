import { useState, useEffect } from "react";
import Results from "./Results";

export default function Shortener() {
  const [inputValue, setInputValue] = useState("");
  const [listUrl, setListUrl] = useState<
    { originalUrl: string; shortUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [iswrong, setIsWrong] = useState(false);

useEffect(() => {

  
}, [errorMessage]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Aquí puedes manejar el envío del formulario, como llamar a una API para acortar la URL
    const cleanUrl = inputValue.trim();

    if (!cleanUrl) {
      setErrorMessage("Please fill out the field");
      setLoading(false);
      return;
    }
    // Verifica si ya se acortó esta URL
    const alreadyShortened = listUrl.some(
      (item) => item.originalUrl === cleanUrl
    );

    if (alreadyShortened) {
      setErrorMessage("This URL has already been shortened");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();
      if (data.success && data.result_url) {
        const newList = [
          ...listUrl,
          { originalUrl: cleanUrl, shortUrl: data.result_url },
        ];
        setListUrl(newList);
        localStorage.setItem("listUrl", JSON.stringify(newList));
        setErrorMessage(""); // Limpiar errorMessagees
      } else {
        setErrorMessage(data.errorMessage || "Invalid URL, please try again.");
      }
    } catch (errorMessage) {
      setErrorMessage("error connecting to the service");
    } finally {
      setLoading(false); // Siempre apagar el loading
    }

    console.log("Error:", errorMessage);
  };

  useEffect(() => {
    const storedList = localStorage.getItem("listUrl");
    if (storedList) {
      setListUrl(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    if (errorMessage !== "") {
      setIsWrong(true);
    }
  }, [errorMessage]);

  return (
    <div>
      <form className="shortener" onSubmit={handleSubmit} noValidate>
        <div>
          
        </div>
        <input
          className={
            iswrong
              ? "shortener__input shortener__input-error"
              : "shortener__input"
          }
          placeholder="Shorten a link here..."
          type="text"
          name="url"
          id="url"
          required
          value={inputValue}
          onChange={(e) => {setInputValue(e.target.value); setIsWrong(false); setErrorMessage("")}}
        />
        <div className="shortener__close-button" onClick={() => {setInputValue(""); setIsWrong(false); setErrorMessage("")}}> </div>

        <button className="shortener__button" type="submit">
          {loading ? "loading..." : "Shorten It!"}
        </button>

        <span className="shortener__error">{errorMessage}</span>
      </form>

      <Results listUrl={listUrl} onDelete={(index) => {
  const updatedList = listUrl.filter((_, i) => i !== index);
  setListUrl(updatedList);
  localStorage.setItem("listUrl", JSON.stringify(updatedList));
}} />
    </div>
  );
}
