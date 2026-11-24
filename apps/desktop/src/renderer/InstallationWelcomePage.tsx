import { Building2, CircleHelp, Cloud, Database, Info, LogIn, Plus, ShieldCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { InstallationStatus } from './api';

export function InstallationWelcomePage({
  status,
  onOwnerLogin,
  onStaffLogin,
  onNewCompany,
  onDatabase,
}: {
  status: InstallationStatus;
  onOwnerLogin: () => void;
  onStaffLogin: () => void;
  onNewCompany: () => void;
  onDatabase: () => void;
}) {
  const existingCompany = status.companyFound;
  const databaseReady = status.cloudConnected;
  const statusTitle = databaseReady ? (existingCompany ? 'Existing Company Found' : 'Ready for Company Setup') : 'Cloud PostgreSQL Not Configured';
  return (
    <section className="installation-welcome" aria-labelledby="installation-welcome-title">
      <div className="installation-welcome-header">
        <div className="installation-brand-mark"><Building2 size={32} /></div>
        <div><strong>YenkasaBuildersStock</strong><span>Inventory &amp; Business Management System</span></div>
        <span className="installation-version">v1.0.0</span>
      </div>
      <div className="installation-status-strip">
        <div className="installation-status-item"><Database size={28} /><div><strong>Cloud PostgreSQL</strong><span className={databaseReady ? 'installation-connected' : 'installation-disconnected'}><Cloud size={15} /> {databaseReady ? 'Connected' : 'Configure first'}</span></div></div>
        <div className="installation-status-divider" />
        <div className="installation-status-item installation-company-status"><Building2 size={28} /><div><strong>{statusTitle}</strong><span>{existingCompany ? status.registeredName || 'Company is already registered' : databaseReady ? 'This database is ready for initial setup' : 'Connect a database to continue'}</span></div></div>
        <button className="installation-details" type="button" onClick={onDatabase}><Info size={17} /> Details</button>
      </div>
      <div className="installation-welcome-copy">
        <h1 id="installation-welcome-title">Welcome to YenkasaBuildersStock</h1>
        <p>{!databaseReady ? 'Configure your cloud database before continuing.' : existingCompany ? 'Your database is connected and a company is already registered.' : 'Your database is connected. Choose how you would like to begin.'}</p>
        <p>{databaseReady ? 'Select how you would like to continue.' : 'Click Database Configuration below to get started.'}</p>
      </div>
      <div className="installation-access-grid">
        <AccessCard icon={<ShieldCheck />} title="Owner Login" description="Access company setup, branding, branches, users and full system management." action="Login as Owner" onClick={onOwnerLogin} primary={false} disabled={!databaseReady} />
        <AccessCard icon={<Users />} title="Branch / Staff Login" description="Login as a branch manager, cashier, sales staff or stock manager to perform daily operations." action="Login as Staff" onClick={onStaffLogin} primary disabled={!databaseReady} />
        <AccessCard icon={<Building2 />} title="Set Up New Company" description={existingCompany ? 'A company already exists in this database. Connect to a different database to register another company.' : 'Register a new company, create an owner account and configure the first branch.'} action="Set Up New Company" onClick={onNewCompany} disabled={!databaseReady || existingCompany} />
      </div>
      <div className="installation-notice"><Info size={22} /><span>{!databaseReady ? 'Database configuration is required before owner, staff or company setup access becomes available.' : existingCompany ? 'A company is already registered on this database. Use Owner Login or Branch / Staff Login to continue. To set up a different company, connect to a different database.' : 'Initial company setup becomes protected after the owner account is created.'}</span></div>
      <div className="installation-footer-actions"><button type="button" onClick={onDatabase}><Database size={18} /> {databaseReady ? 'Database Configuration' : 'Configure Database'}</button><button type="button" onClick={onDatabase}><Cloud size={18} /> Change Database</button><button type="button"><CircleHelp size={18} /> Help</button></div>
    </section>
  );
}

function AccessCard({ icon, title, description, action, onClick, primary = false, disabled = false }: { icon: ReactNode; title: string; description: string; action: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return <article className={`installation-access-card ${disabled ? 'disabled' : ''}`}><div className="installation-access-icon">{icon}</div><h2>{title}</h2><p>{description}</p><button type="button" className={primary ? 'installation-primary-action' : 'installation-secondary-action'} disabled={disabled} onClick={onClick}>{title === 'Set Up New Company' ? <Plus size={18} /> : <LogIn size={18} />}{action}</button></article>;
}
