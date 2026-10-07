import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiMail, FiLayers, FiSettings, FiLogOut, FiBriefcase } from 'react-icons/fi';
import { useAdminAuth } from './auth';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/projects', label: 'Projects', icon: FiLayers },
  { to: '/admin/services', label: 'Services', icon: FiBriefcase },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-frame">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">&lt;/&gt; <span>Impullssee</span></a>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-user-email">{admin?.email}</span>
          <button className="admin-logout" type="button" aria-label="Sign out" onClick={handleLogout}><FiLogOut /> Sign out</button>
          <a className="admin-back-link" href="/">← Back to portfolio</a>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-eyebrow">IMPULLSSEE / ADMIN</span><span className="admin-online"><i /> Secure workspace</span></div>
          <span className="admin-top-email">{admin?.email}</span>
        </header>
        <div className="admin-content"><Outlet /></div>
      </main>
    </div>
  );
}

