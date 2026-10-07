import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiPlus, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import { apiRequest } from './api';
import { useAdminAuth } from './auth';

const STAT_CARDS = [
  ['total_messages', 'Total messages'], ['new_messages', 'New messages'],
  ['contacted_messages', 'Contacted'], ['in_progress_messages', 'In progress'],
  ['completed_messages', 'Completed'], ['total_projects', 'Projects'], ['active_services', 'Active services'],
];
const STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const formatDate = (date) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
const displayStatus = (value) => value.replaceAll('_', ' ');

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="admin-page-heading"><div><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function LoadError({ error, reload }) {
  return error ? <div className="admin-alert" role="alert">{error} <button type="button" onClick={reload}>Try again</button></div> : null;
}

export function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(email.trim(), password); navigate('/admin/dashboard', { replace: true }); }
    catch (err) { setError(err.status === 401 ? 'Email or password is incorrect.' : err.message); }
    finally { setBusy(false); }
  };

  return (
    <main className="admin-login-page">
      <a className="admin-login-back" href="/">← Back to portfolio</a>
      <section className="admin-login-card">
        <a className="admin-brand" href="/">&lt;/&gt; <span>Impullssee</span></a>
        <span className="admin-eyebrow">ADMIN WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p className="admin-muted">Sign in to manage your portfolio.</p>
        <form className="admin-form" onSubmit={submit}>
          <label>Email<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={128} /></label>
          {error && <div className="admin-alert" role="alert">{error}</div>}
          <button className="admin-primary-button" disabled={busy}>{busy ? 'SIGNING IN…' : 'SIGN IN'} <FiArrowUpRight /></button>
        </form>
        <small className="admin-login-note">Authorized administrators only</small>
      </section>
    </main>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  const reload = useCallback(() => apiRequest('/api/messages/stats').then(setStats).catch((err) => setError(err.message)), []);
  useEffect(() => { reload(); }, [reload]);
  return <>
    <PageHeading eyebrow="OVERVIEW" title="Dashboard" description="A quick look at your inquiries and portfolio content." action={<button className="admin-quiet-button" onClick={() => { setError(''); reload(); }}><FiRefreshCw /> Refresh</button>} />
    <LoadError error={error} reload={() => { setError(''); reload(); }} />
    <div className="admin-stat-grid">{STAT_CARDS.map(([key, label]) => <article className="admin-stat-card" key={key}><span>{label}</span><strong>{stats?.[key] ?? '—'}</strong><i /></article>)}</div>
    <section className="admin-panel-card"><div className="admin-card-heading"><div><h2>Recent messages</h2><p>Latest requests from your contact form.</p></div><a className="admin-text-link" href="/admin/messages">View all →</a></div>
      {!stats ? <p className="admin-empty">Loading messages…</p> : stats.recent_messages.length === 0 ? <p className="admin-empty">No messages yet.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Sender</th><th>Project</th><th>Status</th><th>Received</th></tr></thead><tbody>{stats.recent_messages.map((message) => <tr key={message.id}><td><strong>{message.name}</strong><small>{message.email}</small></td><td>{message.project_type}</td><td><span className={`status-pill status-${message.status.toLowerCase()}`}>{displayStatus(message.status)}</span></td><td>{formatDate(message.created_at)}</td></tr>)}</tbody></table></div>}
    </section>
  </>;
}

export function AdminMessages() {
  const [messages, setMessages] = useState([]); const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(''); const [error, setError] = useState('');
  const reload = useCallback(() => apiRequest(`/api/messages${filter ? `?status=${filter}` : ''}`).then(setMessages).catch((err) => setError(err.message)), [filter]);
  useEffect(() => { reload(); }, [reload]);
  const changeStatus = async (id, status) => { try { await apiRequest(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); await reload(); if (selected?.id === id) setSelected(await apiRequest(`/api/messages/${id}`)); } catch (err) { setError(err.message); } };
  const remove = async (id) => { if (!window.confirm('Delete this message permanently?')) return; try { await apiRequest(`/api/messages/${id}`, { method: 'DELETE' }); setSelected(null); await reload(); } catch (err) { setError(err.message); } };
  return <>
    <PageHeading eyebrow="INBOX" title="Messages" description="Review and manage project requests." action={<select aria-label="Filter messages by status" className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{displayStatus(s)}</option>)}</select>} />
    <LoadError error={error} reload={() => { setError(''); reload(); }} />
    <section className="admin-panel-card">{messages.length === 0 ? <p className="admin-empty">No messages found.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Sender</th><th>Project type</th><th>Budget</th><th>Status</th><th>Date</th><th /></tr></thead><tbody>{messages.map((item) => <tr key={item.id} className="admin-click-row" onClick={() => setSelected(item)}><td><strong>{item.name}</strong><small>{item.email}</small></td><td>{item.project_type}</td><td>{item.budget}</td><td><span className={`status-pill status-${item.status.toLowerCase()}`}>{displayStatus(item.status)}</span></td><td>{formatDate(item.created_at)}</td><td><button className="admin-icon-button" aria-label={`Delete message from ${item.name}`} onClick={(e) => { e.stopPropagation(); remove(item.id); }}><FiTrash2 /></button></td></tr>)}</tbody></table></div>}</section>
    {selected && <div className="admin-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="message-title"><button className="admin-modal-close" aria-label="Close" onClick={() => setSelected(null)}><FiX /></button><span className="admin-eyebrow">MESSAGE #{selected.id}</span><h2 id="message-title">{selected.name}</h2><a href={`mailto:${selected.email}`}>{selected.email}</a><dl className="admin-message-details"><div><dt>Project type</dt><dd>{selected.project_type}</dd></div><div><dt>Budget</dt><dd>{selected.budget}</dd></div><div><dt>Received</dt><dd>{formatDate(selected.created_at)}</dd></div></dl><div className="admin-message-body">{selected.message}</div><div className="admin-modal-actions"><label>Status<select className="admin-select" value={selected.status} onChange={(e) => changeStatus(selected.id, e.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{displayStatus(s)}</option>)}</select></label><button className="admin-danger-button" onClick={() => remove(selected.id)}><FiTrash2 /> Delete message</button></div></section></div>}
  </>;
}

const EMPTY_PROJECT = { title: '', description: '', technologies: '', image_url: '', live_url: '', github_url: '', featured: false };
export function AdminProjects() {
  const [items, setItems] = useState([]); const [error, setError] = useState(''); const [editing, setEditing] = useState(null); const [form, setForm] = useState(EMPTY_PROJECT); const [busy, setBusy] = useState(false);
  const reload = useCallback(() => apiRequest('/api/projects').then(setItems).catch((err) => setError(err.message)), []);
  useEffect(() => { reload(); }, [reload]);
  const startCreate = () => { setEditing('new'); setForm(EMPTY_PROJECT); };
  const startEdit = (item) => { setEditing(item.id); setForm({ ...item, technologies: item.technologies.join(', ') }); };
  const save = async (event) => { event.preventDefault(); setBusy(true); setError(''); const payload = { ...form, technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean), image_url: form.image_url || null, live_url: form.live_url || null, github_url: form.github_url || null }; try { await apiRequest(editing === 'new' ? '/api/projects' : `/api/projects/${editing}`, { method: editing === 'new' ? 'POST' : 'PUT', body: JSON.stringify(payload) }); setEditing(null); await reload(); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  const remove = async (item) => { if (!window.confirm(`Delete “${item.title}”?`)) return; try { await apiRequest(`/api/projects/${item.id}`, { method: 'DELETE' }); await reload(); } catch (err) { setError(err.message); } };
  return <>
    <PageHeading eyebrow="PORTFOLIO CONTENT" title="Projects" description="Manage portfolio entries for future public use." action={<button className="admin-primary-button admin-heading-button" onClick={startCreate}><FiPlus /> New project</button>} />
    <LoadError error={error} reload={() => { setError(''); reload(); }} />
    <section className="admin-panel-card">{items.length === 0 ? <p className="admin-empty">No projects yet. Add one to get started.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Project</th><th>Technologies</th><th>Featured</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small>{item.description}</small></td><td>{item.technologies.join(', ') || '—'}</td><td><span className={`status-pill ${item.featured ? 'status-completed' : 'status-cancelled'}`}>{item.featured ? 'Featured' : 'Not featured'}</span></td><td className="admin-actions-cell"><button className="admin-quiet-button" onClick={() => startEdit(item)}>Edit</button><button className="admin-icon-button" aria-label={`Delete ${item.title}`} onClick={() => remove(item)}><FiTrash2 /></button></td></tr>)}</tbody></table></div>}</section>
    {editing !== null && <div className="admin-modal-backdrop"><section className="admin-modal admin-edit-modal" role="dialog" aria-modal="true" aria-labelledby="project-form-title"><button className="admin-modal-close" aria-label="Close" onClick={() => setEditing(null)}><FiX /></button><span className="admin-eyebrow">PROJECT EDITOR</span><h2 id="project-form-title">{editing === 'new' ? 'Add a project' : 'Edit project'}</h2><form className="admin-form" onSubmit={save}><label>Title<input required minLength="2" maxLength="160" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label>Description<textarea required maxLength="5000" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Technologies, comma separated<input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} /></label><label>Image URL<input type="url" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></label><div className="admin-form-row"><label>Live URL<input type="url" value={form.live_url || ''} onChange={(e) => setForm({ ...form, live_url: e.target.value })} /></label><label>GitHub URL<input type="url" value={form.github_url || ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></label></div><label className="admin-checkbox-label"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured project</label><button className="admin-primary-button" disabled={busy}>{busy ? 'SAVING…' : 'SAVE PROJECT'}</button></form></section></div>}
  </>;
}

const EMPTY_SERVICE = { name: '', description: '', price: '0', active: true };
export function AdminServices() {
  const [items, setItems] = useState([]); const [error, setError] = useState(''); const [editing, setEditing] = useState(null); const [form, setForm] = useState(EMPTY_SERVICE); const [busy, setBusy] = useState(false);
  const reload = useCallback(() => apiRequest('/api/services').then(setItems).catch((err) => setError(err.message)), []);
  useEffect(() => { reload(); }, [reload]);
  const save = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await apiRequest(editing === 'new' ? '/api/services' : `/api/services/${editing}`, { method: editing === 'new' ? 'POST' : 'PUT', body: JSON.stringify({ ...form, price: Number(form.price) }) }); setEditing(null); await reload(); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  const remove = async (item) => { if (!window.confirm(`Delete “${item.name}”?`)) return; try { await apiRequest(`/api/services/${item.id}`, { method: 'DELETE' }); await reload(); } catch (err) { setError(err.message); } };
  const open = (item) => { setEditing(item?.id ?? 'new'); setForm(item ? { ...item, price: String(item.price) } : EMPTY_SERVICE); };
  return <>
    <PageHeading eyebrow="OFFERINGS" title="Services" description="Manage service descriptions, pricing, and visibility." action={<button className="admin-primary-button admin-heading-button" onClick={() => open()}><FiPlus /> New service</button>} />
    <LoadError error={error} reload={() => { setError(''); reload(); }} />
    <section className="admin-panel-card">{items.length === 0 ? <p className="admin-empty">No services yet.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Service</th><th>Price</th><th>Visibility</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.description}</small></td><td>${Number(item.price).toFixed(2)}</td><td><button className={`admin-toggle ${item.active ? 'on' : ''}`} onClick={() => apiRequest(`/api/services/${item.id}`, { method: 'PUT', body: JSON.stringify({ ...item, active: !item.active }) }).then(reload).catch((err) => setError(err.message))}>{item.active ? 'Active' : 'Inactive'}</button></td><td className="admin-actions-cell"><button className="admin-quiet-button" onClick={() => open(item)}>Edit</button><button className="admin-icon-button" aria-label={`Delete ${item.name}`} onClick={() => remove(item)}><FiTrash2 /></button></td></tr>)}</tbody></table></div>}</section>
    {editing !== null && <div className="admin-modal-backdrop"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="service-form-title"><button className="admin-modal-close" aria-label="Close" onClick={() => setEditing(null)}><FiX /></button><span className="admin-eyebrow">SERVICE EDITOR</span><h2 id="service-form-title">{editing === 'new' ? 'Add a service' : 'Edit service'}</h2><form className="admin-form" onSubmit={save}><label>Name<input required minLength="2" maxLength="120" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Description<textarea required maxLength="2000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Price<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label><label className="admin-checkbox-label"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label><button className="admin-primary-button" disabled={busy}>{busy ? 'SAVING…' : 'SAVE SERVICE'}</button></form></section></div>}
  </>;
}

export function AdminSettings() {
  const { admin } = useAdminAuth();
  return <><PageHeading eyebrow="ACCOUNT" title="Settings" description="Administrator account and system configuration." /><section className="admin-panel-card admin-settings-card"><span className="admin-eyebrow">SIGNED IN AS</span><h2>{admin?.email}</h2><p>Your account is protected with a hashed password and short-lived signed access tokens. API and database secrets are managed through backend environment variables.</p><div className="admin-settings-row"><span>Session security</span><strong>JWT bearer token · session scoped</strong></div><div className="admin-settings-row"><span>Database</span><strong>PostgreSQL</strong></div><div className="admin-settings-row"><span>Email notifications</span><strong>Configured by backend environment</strong></div></section></>;
}

