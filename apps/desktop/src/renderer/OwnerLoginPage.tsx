import { useState } from 'react';
import { Crown, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { ownerApi } from './api';
import type { OwnerSession } from '@yenkasa/contracts';

export function OwnerLoginPage({
  onAuthenticated,
}: {
  onAuthenticated: (session: OwnerSession) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const login = async () => {
    if (!username.trim() || !password) {
      setError('Enter the owner username or email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const session = await ownerApi.login(username, password);
      sessionStorage.setItem('yenkasa-owner-session', session.token);
      sessionStorage.setItem('yenkasa-owner-session-data', JSON.stringify(session));
      window.dispatchEvent(new Event('yenkasa-owner-session-changed'));
      onAuthenticated(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Owner login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="owner-login-page" aria-labelledby="owner-login-title">
      <div className="owner-login-card">
        <div className="owner-login-icon"><Crown size={30} /></div>
        <h2 id="owner-login-title">Owner Login</h2>
        <p>Authenticate to reopen Company Setup and owner-only controls.</p>
        <label className="login-field">
          Username or Email
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label className="login-field">
          Password
          <span className="owner-password-field">
            <LockKeyhole size={17} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" onKeyDown={(event) => { if (event.key === 'Enter') void login(); }} />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((current) => !current)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="primary-button owner-login-submit" type="button" disabled={busy} onClick={() => void login()}>
          <Crown size={17} />
          {busy ? 'Signing in…' : 'Unlock Company Setup'}
        </button>
      </div>
    </section>
  );
}
