import Header from "./Components/Header";
import Main from "./Components/Main";
import Shortener from "./Components/Shortener";
import Statistics from './Components/Statistics';
import Loading from './Components/Loading';
import { useState, useEffect } from "react";
import { AuthProvider } from './Contexts/AuthContext';
export default function App() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  

useEffect(() => {
  const loadInitialData = async () => {
    try {
      const response = await fetch('http://localhost:3001/');
      setIsLoadingApp(false);
      console.log('Connected to server:', response.status);
    } catch (error) {
      console.error('Error connecting to server:', error);
      setIsLoadingApp(false);
    }
  };

  loadInitialData();
}, []);

console.log("🎨Renderizando App, isLoadingApp:", isLoadingApp);
 return (
  <AuthProvider>
  <div>
    {isLoadingApp ? (
      <Loading />
    ) : (
      <>
        <Header />
        <Main />
        {}
        <Shortener />
        <Statistics />
      </>
    )}
  </div>
  </AuthProvider>
);
}
