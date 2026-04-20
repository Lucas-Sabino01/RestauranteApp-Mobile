import React, { createContext, useContext, useState, useCallback } from 'react';
import { Usuario } from '../data/mock';

type AuthContextType = {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

const USUARIO_MOCK: Usuario = {
  id: '1',
  nome: 'Lucas',
  email: 'lucas@email.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const login = useCallback(async (email: string, _senha: string): Promise<boolean> => {

    await new Promise(resolve => setTimeout(resolve, 800));

    if (email.includes('@')) {
      setUser({ ...USUARIO_MOCK, email });
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (nome: string, email: string, _senha: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email.includes('@') && nome.length > 0) {
      setUser({ ...USUARIO_MOCK, nome, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
