import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Falha ao fazer login com Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950 p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl mb-4">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-400">Entre na sua conta para continuar sua pesquisa</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors text-white"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <Link 
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 hover:scale-[1.02]'
            }`}
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="px-4 text-sm text-gray-500">ou continue com</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-white/5 border border-gray-700 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Não tem uma conta?{' '}
            <Link 
              to="/register" 
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Criar conta
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Seus dados estão protegidos e criptografados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;