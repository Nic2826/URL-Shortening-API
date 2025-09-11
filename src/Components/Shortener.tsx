import { useState, useEffect } from "react";
import Results from "./Results";
import Popup from "./Popup";
import Login from "./Login";
import { useAuth } from "../Contexts/AuthContext";

export default function Shortener() {
  const { isLoggedIn, userInfo, updateUserInfo } = useAuth(); // Agregamos updateUserInfo
  const [inputValue, setInputValue] = useState("");
  const [listUrl, setListUrl] = useState<
    { originalUrl: string; shortUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [iswrong, setIsWrong] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  // PASO 1: Función para obtener la clave de localStorage específica del usuario
  const getUserStorageKey = () => {
    if (isLoggedIn && userInfo?.username) {
      return `listUrl_${userInfo.username}`; // Clave única por usuario
    }
    return 'listUrl_guest'; // Para usuarios no loggeados
  };

  // PASO 2: Función para cargar datos del usuario actual
  const loadUserUrls = () => {
    const storageKey = getUserStorageKey();
    const storedList = localStorage.getItem(storageKey);
    if (storedList) {
      const parsedList = JSON.parse(storedList);
      setListUrl(parsedList);
      
      // Sincronizar contador con URLs reales
      if (isLoggedIn && userInfo) {
        updateUserInfo({ 
          linksCount: parsedList.length 
        });
      }
    } else {
      setListUrl([]); // Lista vacía si no hay datos
      
      // Si no hay URLs guardadas, el contador debe ser 0
      if (isLoggedIn && userInfo) {
        updateUserInfo({ 
          linksCount: 0 
        });
      }
    }
  };

  // PASO 3: Función para guardar datos del usuario actual
  const saveUserUrls = (urlList: { originalUrl: string; shortUrl: string }[]) => {
    const storageKey = getUserStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(urlList));
  };

  // PASO 4: Efecto que se ejecuta cuando cambia el estado de login o userInfo
  useEffect(() => {
    loadUserUrls(); // Cargar datos del usuario actual
  }, [isLoggedIn, userInfo?.username]); // Dependencias: cuando cambia login o usuario

  // PASO 5: Limpiar datos cuando usuario se desloggea
  useEffect(() => {
    if (!isLoggedIn && listUrl.length >= 3) {
      setIsPopupVisible(false);
      setIsLoginVisible(false);
    }
  }, [isLoggedIn]);

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    
    const cleanUrl = inputValue.trim();

    if (!cleanUrl) {
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

    // Verificar autenticación PRIMERO
    if (!isLoggedIn && listUrl.length >= 3) {
      setIsPopupVisible(true);
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
          { originalUrl: cleanUrl, shortUrl: data.result_url },
          ...listUrl
        ];
        setListUrl(newList);
        setHighlightedIndex(0);

        // ACTUALIZAR CONTADOR - Solo si el URL se acortó exitosamente
        if (isLoggedIn && userInfo) {
          updateUserInfo({ 
            linksCount: (userInfo.linksCount || 0) + 1 
          });
        }

        setTimeout(() => {
          setHighlightedIndex(null);
        }, 2000);

        // PASO 6: Usar la nueva función de guardado
        saveUserUrls(newList);
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
          
          // ACTUALIZAR CONTADOR al eliminar
          if (isLoggedIn && userInfo && userInfo.linksCount && userInfo.linksCount > 0) {
            updateUserInfo({ 
              linksCount: userInfo.linksCount - 1 
            });
          }
          
          // PASO 7: Usar la nueva función de guardado para delete también
          saveUserUrls(updatedList);
        }}
        highlightedIndex={highlightedIndex}
      />
    </div>
  );
}