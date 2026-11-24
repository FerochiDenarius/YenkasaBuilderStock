import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw, Save, Wifi } from 'lucide-react';
import type { AuthSession, SyncStatus } from '@yenkasa/contracts';
import { syncApi } from './api';

const emptyStatus: SyncStatus = {
  branchId: '',
  deviceId: 'local-device',
  onlineEnabled: true,
  autoSyncEnabled: true,
  intervalMinutes: 15,
  syncState: 'NEVER_SYNCED',
  lastSyncAt: '',
  lastAttemptAt: '',
  lastError: '',
  pendingCount: 0,
  updatedAt: '',
};

export function SyncSettingsPage({ session }: { session: AuthSession }) {
  const [value, setValue] = useState<SyncStatus>(emptyStatus);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    syncApi
      .status(session.branchId, session.userId)
      .then(setValue)
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load synchronization settings.',
        ),
      );
  };

  useEffect(load, [session.branchId, session.userId]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      setValue(
        await syncApi.saveSettings(session.branchId, session.userId, {
          onlineEnabled: value.onlineEnabled,
          autoSyncEnabled: value.autoSyncEnabled,
          intervalMinutes: value.intervalMinutes,
        }),
      );
      setMessage('Synchronization settings saved locally.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const run = async () => {
    setSyncing(true);
    setMessage('');
    setError('');
    try {
      const result = await syncApi.run(session.branchId, session.userId);
      setValue(result);
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to start synchronization.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="sync-settings-page">
      <section className="reference-card sync-settings-heading">
        <div className="owner-section-icon">
          <Cloud size={28} />
        </div>
        <div>
          <h2>Database Synchronization</h2>
          <p>
            Control this branch device&apos;s online synchronization policy. Local
            SQLite operations remain available when offline.
          </p>
        </div>
      </section>

      <section className="reference-card sync-status-card">
        <div className="sync-status-topline">
          <div>
            <span className="sync-label">Current status</span>
            <strong data-testid="sync-state">{value.syncState.replaceAll('_', ' ')}</strong>
          </div>
          <span className={`sync-state-pill sync-${value.syncState.toLowerCase()}`}>
            {value.onlineEnabled ? <Wifi size={14} /> : <CloudOff size={14} />}
            {value.onlineEnabled ? 'Online mode enabled' : 'Offline mode enforced'}
          </span>
        </div>
        <div className="sync-stat-grid">
          <div><small>Pending local records</small><strong>{value.pendingCount}</strong></div>
          <div><small>Last successful sync</small><strong>{formatSyncDate(value.lastSyncAt)}</strong></div>
          <div><small>Last attempt</small><strong>{formatSyncDate(value.lastAttemptAt)}</strong></div>
          <div><small>Device</small><strong>{value.deviceId}</strong></div>
        </div>
        {value.lastError && <p className="sync-warning" role="status">{value.lastError}</p>}
      </section>

      <section className="reference-card sync-settings-card">
        <h3>Branch Manager Controls</h3>
        <label className="sync-toggle-row">
          <span><strong>Allow online synchronization</strong><small>Turn this off to keep the device in controlled offline mode.</small></span>
          <input
            data-testid="sync-online-toggle"
            type="checkbox"
            checked={value.onlineEnabled}
            onChange={(event) => setValue((current) => ({ ...current, onlineEnabled: event.target.checked }))}
          />
        </label>
        <label className="sync-toggle-row">
          <span><strong>Automatic sync when available</strong><small>Manual Sync Now remains available to the Branch Manager.</small></span>
          <input
            data-testid="sync-auto-toggle"
            type="checkbox"
            checked={value.autoSyncEnabled}
            onChange={(event) => setValue((current) => ({ ...current, autoSyncEnabled: event.target.checked }))}
          />
        </label>
        <label className="sync-interval-field">
          Sync interval (minutes)
          <input
            data-testid="sync-interval"
            type="number"
            min={5}
            max={1440}
            step={5}
            value={value.intervalMinutes}
            onChange={(event) => setValue((current) => ({ ...current, intervalMinutes: Number(event.target.value) }))}
          />
        </label>
        <div className="sync-actions">
          <button className="outline" type="button" data-testid="sync-now" disabled={syncing} onClick={run}>
            <RefreshCw size={15} />
            {syncing ? 'Checking…' : 'Sync Now'}
          </button>
          <button className="primary-button" type="button" data-testid="sync-save" disabled={saving} onClick={save}>
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
        {message && <small className="save-status" role="status">{message}</small>}
        {error && <small className="save-error" role="alert">{error}</small>}
      </section>
    </div>
  );
}

function formatSyncDate(value: string) {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}
