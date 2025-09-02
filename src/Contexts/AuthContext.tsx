import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode} from 'react';


// PASO 1: Definir qué información queremos compartir
type AuthContextType = {
  // Estados que queremos compartir entre componentes
  isLoggedIn: boolean;        // ¿Está el usuario loggeado?
  userName: string | null;   // Email del usuario (null si no está loggeado)
  
  // Funciones que queremos usar desde cualquier componente
  login: (userName: string) => void;     // Para marcar como loggeado
  logout: () => void;                 // Para cerrar sesión
};

// PASO 2: Crear el Context (inicialmente undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PASO 3: Crear el Provider (el que "provee" la información a los componentes hijos)
type AuthProviderProps = {
  children: ReactNode; // Los componentes que estarán dentro del Provider
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Estados internos del Context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  
  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedEmail = localStorage.getItem('userName');
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (savedEmail && savedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
      setUserName(savedEmail);
      console.log(`🔄 Sesión restaurada: ${savedEmail}`);
    }
  }, []);
  
  // Funciones que modifican el estado
  const login = (userName: string) => {
    setIsLoggedIn(true);
    setUserName(userName);
    // Guardar en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    console.log(`✅ Usuario loggeado: ${userName}`);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    // Limpiar localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    console.log('👋 Usuario desloggeado');
  };
  
  // Objeto que se compartirá con todos los componentes hijos
  const value = {
    isLoggedIn,
    userName,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PASO 4: Hook personalizado para usar el Context fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Verificar que se está usando dentro del Provider
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
}