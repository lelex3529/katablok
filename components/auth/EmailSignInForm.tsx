'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function EmailSignInForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/',
      });
      if (res?.ok) {
        setMessage('Un lien de connexion a été envoyé à votre adresse email.');
      } else {
        setError("Impossible d'envoyer le lien. Vérifiez l'adresse email.");
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-7 w-full max-w-md mx-auto'>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-sora font-semibold text-katalyx-text mb-2'
        >
          Adresse email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary text-base bg-white font-inter transition'
          placeholder='votre@email.com'
          disabled={loading}
        />
      </div>
      <button
        type='submit'
        disabled={loading || !email}
        className='w-full flex justify-center py-3 px-4 bg-gradient-primary text-white rounded-xl shadow-button hover:shadow-button-hover font-sora text-base font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {loading ? 'Envoi en cours...' : 'Recevoir le lien de connexion'}
      </button>
      {message && (
        <div className='bg-katalyx-success/10 text-katalyx-success p-3 rounded-xl border border-katalyx-success/20 text-center font-medium text-sm'>
          {message}
        </div>
      )}
      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-3 rounded-xl border border-katalyx-error/20 text-center font-medium text-sm'>
          {error}
        </div>
      )}
    </form>
  );
}
