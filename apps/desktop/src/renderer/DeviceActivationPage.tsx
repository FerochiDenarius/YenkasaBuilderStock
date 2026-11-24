import { useEffect, useMemo, useState } from 'react';
import { Clipboard, Monitor, Plus, Search, ShieldCheck } from 'lucide-react';
import type { Branch } from '@yenkasa/contracts';
import { branchApi, deviceApi, type DeviceRecord } from './api';

const blank = {
  branchId: '',
  deviceName: '',
  deviceType: 'Windows PC',
  validity: 'Permanent',
};
export function DeviceActivationPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [form, setForm] = useState(blank);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [code, setCode] = useState('');
  const load = async () => {
    try {
      const [branchList, deviceList] = await Promise.all([
        branchApi.list(),
        deviceApi.list(),
      ]);
      setBranches(branchList);
      setDevices(deviceList);
      if (!form.branchId && branchList[0])
        setForm((current) => ({ ...current, branchId: branchList[0].id }));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to load devices.',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const create = async () => {
    if (!form.branchId || !form.deviceName.trim()) {
      setError('Select a branch and enter a device name.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await deviceApi.create(form);
      setDevices((current) => [created, ...current]);
      setCode(created.activationCode);
      setForm((current) => ({ ...current, deviceName: '' }));
      setStatus('Activation code generated and saved to SQLite');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to generate activation code.',
      );
    } finally {
      setSaving(false);
    }
  };
  const toggle = async (device: DeviceRecord) => {
    try {
      const updated = await deviceApi.update(device.id, !device.active);
      setDevices((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setStatus(updated.active ? 'Device reactivated' : 'Device revoked');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to update device.',
      );
    }
  };
  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    setStatus('Activation code copied');
  };
  const filtered = useMemo(
    () =>
      devices.filter((device) =>
        `${device.deviceName} ${device.branchName} ${device.deviceType} ${device.activationCode}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [devices, query],
  );
  const active = devices.filter((device) => device.active).length;
  return (
    <div className="setup-page device-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Device Activation</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Monitor size={31} />
        </div>
        <div>
          <h2>Device Activation</h2>
          <p>
            Authorize computers that can run YenkasaBuildersStock for your
            company and branches.
          </p>
        </div>
      </section>
      <div className="device-stats">
        <Summary
          label="Total Devices"
          value={String(devices.length)}
          tone="blue"
        />
        <Summary label="Active Devices" value={String(active)} tone="teal" />
        <Summary
          label="Revoked / Inactive"
          value={String(devices.length - active)}
          tone="orange"
        />
      </div>
      <div className="device-grid">
        <section className="panel device-form">
          <div className="panel-heading">
            <div>
              <h2>
                <Plus size={19} /> Activate New Device
              </h2>
              <p>Generate a secure activation code for a branch computer.</p>
            </div>
          </div>
          <div className="setup-fields one-column">
            <label>
              Select Branch <em>*</em>
              <select
                data-testid="device-branch"
                value={form.branchId}
                onChange={(event) =>
                  setForm({ ...form, branchId: event.target.value })
                }
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Device Name <em>*</em>
              <input
                data-testid="device-name"
                value={form.deviceName}
                onChange={(event) =>
                  setForm({ ...form, deviceName: event.target.value })
                }
                placeholder="Oyarifa-PC-02"
              />
            </label>
            <label>
              Device Type
              <select
                data-testid="device-type"
                value={form.deviceType}
                onChange={(event) =>
                  setForm({ ...form, deviceType: event.target.value })
                }
              >
                <option>Windows PC</option>
                <option>macOS</option>
                <option>Linux</option>
                <option>Tablet</option>
              </select>
            </label>
            <label>
              Activation Validity
              <select
                value={form.validity}
                onChange={(event) =>
                  setForm({ ...form, validity: event.target.value })
                }
              >
                <option>Permanent</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </label>
          </div>
          {code && (
            <div className="activation-code">
              <span>
                Activation Code<strong>{code}</strong>
              </span>
              <button type="button" className="outline" onClick={copyCode}>
                <Clipboard size={15} />
                Copy
              </button>
            </div>
          )}
          <button
            className="primary-button full-button"
            type="button"
            data-testid="device-generate"
            disabled={saving || loading}
            onClick={create}
          >
            <ShieldCheck size={16} />
            {saving ? 'Generating…' : 'Generate Activation Code'}
          </button>
          {status && (
            <small className="save-status device-message" role="status">
              {status}
            </small>
          )}
          {error && (
            <small className="save-error device-message" role="alert">
              {error}
            </small>
          )}
        </section>
        <section className="panel device-list">
          <div className="panel-heading">
            <div>
              <h2>Registered Devices</h2>
              <p>Devices linked to your company and branch.</p>
            </div>
            <div className="search-box">
              <Search size={15} />
              <input
                data-testid="device-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search devices..."
              />
            </div>
          </div>
          {loading ? (
            <div className="page-loading">Loading devices…</div>
          ) : filtered.length ? (
            <div className="device-table">
              <div className="device-row device-head">
                <span>#</span>
                <span>Device Name</span>
                <span>Branch</span>
                <span>Code</span>
                <span>Type</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {filtered.map((device, index) => (
                <div className="device-row device-data-row" key={device.id}>
                  <span>{index + 1}</span>
                  <strong>{device.deviceName}</strong>
                  <span>{device.branchName}</span>
                  <span>{device.activationCode || '—'}</span>
                  <span>{device.deviceType}</span>
                  <span
                    className={`status ${device.active ? 'in-stock' : 'out-of-stock'}`}
                  >
                    {device.active ? 'Active' : 'Revoked'}
                  </span>
                  <button
                    type="button"
                    className="outline small-button"
                    onClick={() => toggle(device)}
                  >
                    {device.active ? 'Revoke' : 'Reactivate'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="page-loading">
              No registered devices match this search.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
function Summary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="summary-card">
      <div className={`summary-icon ${tone}`}>
        <Monitor size={21} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
