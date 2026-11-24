import { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn, MapPin, Store } from 'lucide-react';
import type { AuthSession, Branch } from '@yenkasa/contracts';
import { authApi, branchApi } from './api';

const roleLabels = {
  BRANCH_MANAGER: 'Branch Manager',
  SALES_OFFICER: 'Sales Officer',
  CASHIER: 'Cashier',
  STOCK_MANAGER: 'Stock Manager / Storekeeper',
  // Legacy accounts remain selectable until the manager replaces them.
  SALES_CASHIER: 'Sales + Cashier (Combined)',
} as const;

export function BranchLoginPage({
  onAuthenticated,
}: {
  onAuthenticated: (session: AuthSession) => void;
}) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [branchId, setBranchId] = useState('');
  const [role, setRole] = useState<keyof typeof roleLabels>('BRANCH_MANAGER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    branchApi
      .activatedList()
      .then((list) => {
        setBranches(list);
        if (list[0]) setBranchId(list[0].id);
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load activated branch.',
        ),
      )
      .finally(() => setLoaded(true));
  }, []);
  const branch = branches.find((item) => item.id === branchId);
  const login = async () => {
    setError('');
    setStatus('');
    if (!branchId || !username.trim() || !password) {
      setError(
        'Select an activated branch and enter your username or email and password.',
      );
      return;
    }
    try {
      const result = await authApi.login({
        branchId,
        username,
        password,
        loginRole: role,
      });
      sessionStorage.setItem('yenkasa-session', JSON.stringify(result));
      if (remember) localStorage.setItem('yenkasa-remembered-user', username);
      setStatus('Signed in securely');
      onAuthenticated(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    }
  };
  return (
    <div className="branch-login-content">
      <section className="branch-login-card">
        <Store className="branch-login-icon" size={50} />
        <h2>Branch Login</h2>
        <p>Sign in to access the branch system</p>
        {branch ? (
          <label className="branch-login-branch">
            <MapPin size={29} />
            <span>
              <strong>{branch.name}</strong>
              <small>Yenkasa Builders Supplies Ltd</small>
            </span>
          </label>
        ) : loaded ? (
          <div className="branch-login-unavailable" role="alert">
            No activated branch is available on this installation. Activate this
            device for a branch before signing in.
          </div>
        ) : (
          <p className="login-muted">Loading activated branch…</p>
        )}
        <label className="login-field">
          Login As
          <select
            data-testid="login-role"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as keyof typeof roleLabels)
            }
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="login-field">
          Username or Email
          <input
            data-testid="login-username"
            value={username}
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username or email"
          />
        </label>
        <label className="login-field">
          Password
          <div className="password-control">
            <LockKeyhole size={19} />
            <input
              data-testid="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </label>
        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />{' '}
            Remember me
          </label>
          <button
            type="button"
            onClick={() =>
              setStatus(
                'Password resets are handled by the Branch Manager or company owner.',
              )
            }
          >
            Forgot password?
          </button>
        </div>
        <button
          className="login-submit"
          type="button"
          data-testid="branch-login-submit"
          disabled={!branch}
          onClick={login}
        >
          <LogIn size={22} />
          Log In
        </button>
        {status && (
          <small className="login-status" role="status">
            {status}
          </small>
        )}
        {error && (
          <small className="login-error" role="alert">
            {error}
          </small>
        )}
        <p className="offline-login-note">
          Offline login uses the securely provisioned local account for this
          activated company, branch and device.
        </p>
      </section>
    </div>
  );
}

export function BranchHome({ session }: { session: AuthSession }) {
  const modules = session.permissions;
  return (
    <div className="branch-home">
      <section className="role-welcome">
        <div className="role-welcome-icon">
          <Store size={29} />
        </div>
        <div>
          <h1>{session.branchName} workspace</h1>
          <p>
            Signed in as {session.fullName} · {roleLabels[session.role]}. Only
            authorized branch modules are shown.
          </p>
        </div>
      </section>
      <div className="authorized-modules">
        {modules.map((module) => (
          <div className="authorized-module" key={module}>
            <strong>{module.replaceAll('_', ' ')}</strong>
            <small>Authorized offline and online</small>
          </div>
        ))}
      </div>
      {(session.role === 'SALES_OFFICER' ||
        session.role === 'SALES_CASHIER') && (
        <p className="role-boundary">
          Sales access prepares invoices and quotations. Payment collection and
          material release are handled by separately authorized staff.
        </p>
      )}
      {session.role === 'CASHIER' && (
        <p className="role-boundary">
          Cashier access is limited to invoice payment collection, payment
          verification and receipt actions.
        </p>
      )}
      {session.role === 'STOCK_MANAGER' && (
        <p className="role-boundary">
          Stock Manager access covers stock control, purchasing and authorized
          material release; payment approval is not permitted.
        </p>
      )}
    </div>
  );
}
