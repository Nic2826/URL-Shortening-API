import { useState, useEffect } from "react";
import Results from "./Results";
import Popup from "./Popup";
import Login from "./Login"; // Importar Login
import { useAuth } from "../Contexts/AuthContext";

export default function Shortener() {
  const { isLoggedIn } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [listUrl, setListUrl] = useState<
    { originalUrl: string; shortUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [iswrong, setIsWrong] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false); // Nuevo estado

  // Resetear popup cuando usuario se desloggea
  useEffect(() => {
    if (!isLoggedIn && listUrl.length >= 3) {
      setIsPopupVisible(false);
      setIsLoginVisible(false); // También resetear login
    }
  }, [isLoggedIn]);

  // Cerrar login
  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    
    const cleanUrl = inputValue.trim();

    if (!cleanUrl && isLoggedIn) {
      setErrorMessage("Please fill out the field");
      setLoading(false);
      return;
    }

    // Verificar si ya se acortó esta URL
    const alreadyShortened = listUrl.some(
      (item) => item.originalUrl === cleanUrl
    );

    if (alreadyShortened) {
      setErrorMessage("This URL has already been shortened");
      setLoading(false);
      return;
    }

    // LÓGICA CORREGIDA: Verificar autenticación PRIMERO
    if (!isLoggedIn && listUrl.length >= 3) {
      setIsPopupVisible(true);
      setLoading(false);
      return;
    }

    // Si llegamos aquí, el usuario SÍ está loggeado
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
          { originalUrl: cleanUrl, shortUrl: data.result_url },
          ...listUrl
        ];
        setListUrl(newList);
        setHighlightedIndex(0);

        setTimeout(() => {
          setHighlightedIndex(null);
        }, 2000);

        localStorage.setItem("listUrl", JSON.stringify(newList));
        setInputValue("");
      } else {
        console.error("Error:", data.errorMessage);
        setErrorMessage(
          data.errorMessage || "Server Error, please try again later."
        );
      }
    } catch (errorMessage) {
      setErrorMessage("Error connecting to the service");
    } finally {
      setLoading(false);
    }
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
        {/* Popup principal */}
        {isPopupVisible && !isLoggedIn && (
          <Popup
            onClose={() => setIsPopupVisible(false)}
          />
        )}

        {/* Login popup */}
        {isLoginVisible && (
          <Login onClose={handleCloseLogin} />
        )}
        
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
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsWrong(false);
            setErrorMessage("");
          }}
        />
        <div
          className="shortener__close-button"
          onClick={() => {
            setInputValue("");
            setIsWrong(false);
            setErrorMessage("");
          }}
        >
          {" "}
        </div>

        <button className="shortener__button" type="submit">
          {loading ? "loading..." : "Shorten It!"}
        </button>

        <span className="shortener__error">{errorMessage}</span>
      </form>

      <Results
        listUrl={listUrl}
        onDelete={(index) => {
          const updatedList = listUrl.filter((_, i) => i !== index);
          setListUrl(updatedList);
          localStorage.setItem("listUrl", JSON.stringify(updatedList));
        }}
        highlightedIndex={highlightedIndex}
      />
    </div>
  );
}