import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Cloud, Eye, EyeOff, KeyRound, Save, ShieldCheck, TestTube2 } from 'lucide-react';

type CloudForm = {
  projectUrl: string;
  projectRef: string;
  databaseHost: string;
  databasePort: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
};

const initialForm: CloudForm = {
  projectUrl: '',
  projectRef: '',
  databaseHost: '',
  databasePort: '5432',
  databaseName: 'postgres',
  databaseUser: 'postgres',
  databasePassword: '',
};

function normalizeProjectUrl(value: string): string {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== 'https:') throw new Error('Project URL must begin with https://. Do not paste a PostgreSQL connection string here.');
  return parsed.origin;
}

export function CloudDatabaseSetupPage() {
  const [form, setForm] = useState<CloudForm>(initialForm);
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tested, setTested] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Not tested yet');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cloud = window.desktopBridge?.cloud;
    if (!cloud) {
      setError('Secure cloud configuration is available only inside the installed desktop application.');
      return;
    }
    cloud
      .getConfig()
      .then((config) => {
        setForm({
          projectUrl: config.projectUrl,
          projectRef: config.projectRef,
          databaseHost: config.databaseHost,
          databasePort: String(config.databasePort),
          databaseName: config.databaseName,
          databaseUser: config.databaseUser,
          databasePassword: '',
        });
        setPasswordConfigured(config.passwordConfigured);
      })
      .catch(() => setError('Unable to load the saved cloud configuration.'));
  }, []);

  const update = (key: keyof CloudForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setTested(false);
    setStatus('Not tested yet');
    setMessage('');
    setError('');
  };

  const validate = () => {
    try {
      normalizeProjectUrl(form.projectUrl);
    } catch (error) {
      return error instanceof Error ? error.message : 'Enter the Supabase project URL, for example https://your-project.supabase.co.';
    }
    if (!form.projectRef.trim()) return 'Enter the Supabase project reference, for example xwyblizsmfeulyykufwg.';
    if (!form.databaseHost.trim()) return 'Enter the PostgreSQL host from Supabase Connect.';
    const port = Number(form.databasePort);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return 'Enter a valid database port between 1 and 65535.';
    if (!form.databaseName.trim()) return 'Enter the database name.';
    if (!form.databaseUser.trim()) return 'Enter the database username.';
    if (!form.databasePassword.trim() && !passwordConfigured) return 'Enter the database password.';
    return '';
  };

  const testConnection = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!window.desktopBridge?.cloud) {
      setError('Secure cloud configuration is available only inside the installed desktop application.');
      return;
    }
    setTesting(true);
    setError('');
    setMessage('Testing the Supabase connection securely…');
    try {
      await window.desktopBridge.cloud.testConfig({ ...form, projectUrl: normalizeProjectUrl(form.projectUrl), databasePort: Number(form.databasePort), ownerSession: sessionStorage.getItem('yenkasa-owner-session') ?? undefined });
      setTested(true);
      setStatus('Connection verified');
      setMessage('Supabase is reachable. You can now save this configuration.');
    } catch (reason) {
      setTested(false);
      setStatus('Connection failed');
      setError(reason instanceof Error ? reason.message : 'Supabase connection failed.');
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    if (!tested) {
      setError('Test the Supabase connection successfully before saving.');
      return;
    }
    if (!window.desktopBridge?.cloud) {
      setError('Secure cloud configuration is available only inside the installed desktop application.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await window.desktopBridge.cloud.saveConfig({ ...form, projectUrl: normalizeProjectUrl(form.projectUrl), databasePort: Number(form.databasePort), ownerSession: sessionStorage.getItem('yenkasa-owner-session') ?? undefined });
      setPasswordConfigured(true);
      setForm((current) => ({ ...current, databasePassword: '' }));
      setMessage('Cloud configuration saved securely on this computer.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save cloud configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cloud-setup-page">
      <div className="setup-breadcrumb">⌂ &nbsp;›&nbsp; Installation &nbsp;›&nbsp; <strong>Cloud Database (Supabase)</strong></div>
      <section className="setup-title">
        <div className="setup-title-icon"><Cloud size={31} /></div>
        <div>
          <h2>Connect to Supabase</h2>
          <p>Configure the central PostgreSQL database used for branch synchronization, backups and headquarters reporting.</p>
        </div>
      </section>

      <div className="cloud-setup-grid">
        <section className="reference-card cloud-instructions">
          <h3><BookOpen size={21} /> Setup Instructions</h3>
          <ol>
            <li><strong>Create a Supabase account</strong><span>Go to supabase.com and create or sign in to the authorized deployment account.</span></li>
            <li><strong>Create a project</strong><span>Create the central project for YenkasaBuildersStock and choose the required region.</span></li>
            <li><strong>Copy connection details</strong><span>Open Supabase → Connect → Database and select Session pooler. Copy its exact host, port, database name and user.</span></li>
            <li><strong>Test before continuing</strong><span>Enter the project URL, project reference, host, port, database, user and password, then test the connection.</span></li>
          </ol>
          <div className="cloud-info-callout"><ShieldCheck size={21} /><span>Credentials are kept in the trusted desktop process. Passwords are encrypted with the operating-system credential store and are never returned to the renderer.</span></div>
        </section>

        <section className="reference-card cloud-connection-card">
          <h3><KeyRound size={21} /> Supabase Connection Details</h3>
          <label>Supabase Project URL<input data-testid="cloud-project-url" value={form.projectUrl} onChange={(event) => update('projectUrl', event.target.value)} placeholder="https://xxxxxxxx.supabase.co" /></label>
          <label>Project Reference (Project ID)<input data-testid="cloud-project-ref" value={form.projectRef} onChange={(event) => update('projectRef', event.target.value)} placeholder="abcdefghijklmnop" /></label>
          <div className="cloud-field-grid">
            <label>Database Host<input data-testid="cloud-database-host" value={form.databaseHost} onChange={(event) => update('databaseHost', event.target.value)} placeholder="aws-0-region.pooler.supabase.com" /></label>
            <label>Port<input data-testid="cloud-database-port" type="number" min={1} max={65535} value={form.databasePort} onChange={(event) => update('databasePort', event.target.value)} placeholder="5432" /></label>
            <label>Database Name<input data-testid="cloud-database-name" value={form.databaseName} onChange={(event) => update('databaseName', event.target.value)} placeholder="postgres" /></label>
            <label>Database User<input data-testid="cloud-database-user" value={form.databaseUser} onChange={(event) => update('databaseUser', event.target.value)} placeholder="postgres.project-reference" /></label>
          </div>
          <label>Database Password<div className="cloud-password-field"><input data-testid="cloud-password" type={showPassword ? 'text' : 'password'} value={form.databasePassword} onChange={(event) => update('databasePassword', event.target.value)} placeholder={passwordConfigured ? 'Saved securely — enter only to replace' : 'Enter database password'} /><button type="button" aria-label={showPassword ? 'Hide database password' : 'Show database password'} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          <p className="cloud-connection-note">For Supabase Session Pooler, use the exact host and username shown in Supabase Connect, normally port 5432 and a username like postgres.project-reference. The application constructs the secure SSL connection internally.</p>
          <div className="cloud-test-row"><button className="outline" type="button" data-testid="cloud-test" disabled={testing} onClick={testConnection}><TestTube2 size={16} />{testing ? 'Testing…' : 'Test Connection'}</button><span className={tested ? 'cloud-test-status success' : status === 'Connection failed' ? 'cloud-test-status failed' : 'cloud-test-status'}>{tested ? <CheckCircle2 size={16} /> : <Cloud size={16} />}{status}</span></div>
          <div className="cloud-setup-actions"><button className="primary-button" type="button" data-testid="cloud-save" disabled={!tested || saving} onClick={save}><Save size={16} />{saving ? 'Saving…' : 'Save and Continue'}</button></div>
          {message && <small className="save-status" role="status">{message}</small>}
          {error && <small className="save-error" role="alert">{error}</small>}
        </section>
      </div>
    </div>
  );
}
