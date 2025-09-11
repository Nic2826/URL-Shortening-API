import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// PASO 1: Definir el tipo de información del usuario
type UserInfo = {
  email: string;
  username: string;
  id?: string | number;
  createdAt?: string;
  linksCount?: number;
};

// PASO 2: Definir qué información queremos compartir
type AuthContextType = {
  // Estados que queremos compartir entre componentes
  isLoggedIn: boolean;
  userInfo: UserInfo | null;   // Información completa del usuario
  
  // Funciones que queremos usar desde cualquier componente
  login: (userInfo: UserInfo) => void;     // Para marcar como loggeado con info completa
  logout: () => void;                      // Para cerrar sesión
  updateUserInfo: (updates: Partial<UserInfo>) => void; // Para actualizar info
};

// PASO 3: Crear el Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PASO 4: Crear el Provider
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Estados internos del Context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (savedUserInfo && savedIsLoggedIn === 'true') {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(parsedUserInfo);
        console.log('🔄 Sesión restaurada:', parsedUserInfo);
      } catch (error) {
        console.error('❌ Error al parsear la información del usuario:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);
  
  // Función para iniciar sesión con información completa
  const login = (userInfo: UserInfo) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);
    // Guardar en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log('✅ Usuario loggeado:', userInfo);
  };
  
  // Función para actualizar información del usuario
  const updateUserInfo = (updates: Partial<UserInfo>) => {
    if (userInfo) {
      const updatedUserInfo = { ...userInfo, ...updates };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      console.log('🔄 Información de usuario actualizada:', updatedUserInfo);
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    // Limpiar localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    // También limpiar el userName viejo si existe
    localStorage.removeItem('userName');
    console.log('👋 Usuario desloggeado');
  };
  
  // Objeto que se compartirá con todos los componentes hijos
  const value = {
    isLoggedIn,
    userInfo,
    login,
    logout,
    updateUserInfo
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PASO 5: Hook personalizado para usar el Context fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Verificar que se está usando dentro del Provider
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
}

// Exportar el tipo UserInfo para usar en otros componentes
export type { UserInfo };