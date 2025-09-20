import React, { useState } from 'react';
import { ArrowLeft, Lock, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LoginFormProps {
  role: 'admin' | 'coach';
  onBack: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ role, onBack, onSuccess }: LoginFormProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password, role);
      if (success) {
        onSuccess();
      } else {
        setError('Giriş bilgileri hatalı!');
      }
    } catch (err) {
      setError('Bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full inline-block mb-4">
              {role === 'admin' ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {role === 'admin' ? 'Admin Paneli' : 'Koç Paneli'}
            </h2>
            <p className="text-gray-600 mt-2">
              Devam etmek için giriş yapınız
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={role === 'admin' ? 'admin@yks.com' : 'koç e-postanız'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={role === 'admin' ? 'admin123' : 'coach123'}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-2">Demo Giriş Bilgileri:</p>
            {role === 'admin' ? (
              <p>E-posta: admin@yks.com<br />Şifre: admin123</p>
            ) : (
              <p>Herhangi bir koçun e-postası<br />Şifre: coach123</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}