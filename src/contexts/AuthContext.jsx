import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const savedUser = localStorage.getItem('biolab-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, username) => {
    try {
      // Verificar se usuário já existe
      const users = JSON.parse(localStorage.getItem('biolab-users') || '[]');
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return { error: { message: 'Email já cadastrado' } };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        email,
        username,
        createdAt: new Date().toISOString(),
      };

      // Salvar senha separadamente (em produção use hash!)
      const passwords = JSON.parse(localStorage.getItem('biolab-passwords') || '{}');
      passwords[email] = password;
      localStorage.setItem('biolab-passwords', JSON.stringify(passwords));

      // Adicionar aos usuários
      users.push(newUser);
      localStorage.setItem('biolab-users', JSON.stringify(users));

      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('biolab-users') || '[]');
      const passwords = JSON.parse(localStorage.getItem('biolab-passwords') || '{}');
      
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return { error: { message: 'Usuário não encontrado' } };
      }

      if (passwords[email] !== password) {
        return { error: { message: 'Senha incorreta' } };
      }

      // Login bem-sucedido
      setUser(user);
      localStorage.setItem('biolab-user', JSON.stringify(user));
      
      return { data: { user }, error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('biolab-user');
    return { error: null };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}