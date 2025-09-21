// app/login/page.tsx
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

     try {
        const res = await fetch('/api/auth/login', {
        method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password }),
    });


      // Si la réponse n’est pas JSON valide → renvoyer un message clair
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Réponse invalide du serveur : ${text.slice(0, 100)}`);
      }

      if (!res.ok) {
        setMessage(data.error?.message || 'Erreur inconnue');
        return;
      }

      setMessage(`Connexion réussie ! ID utilisateur: ${data.userId || data.user?.id}`);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erreur réseau');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
