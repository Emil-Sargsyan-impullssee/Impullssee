import { useState, useEffect } from 'react';
import { BsArrowUpRight } from 'react-icons/bs';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ activeSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const navLinks = [
    { href: '#home', label: 'HOME', id: 'home' },
    { href: '#about', label: 'ABOUT', id: 'about' },
    { href: '#skills', label: 'SKILLS', id: 'skills' },
    { href: '#process', label: 'PROCESS', id: 'process' },
    { href: '#pricing', label: 'PRICING', id: 'pricing' },
    { href: '#contact', label: 'CONTACT', id: 'contact' },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-logo">
        <a href="#home" className="logo-link">
          <span className="logo-tag">&lt;/&gt;</span> Impullssee
        </a>
      </div>

      {/* Desktop Nav Links */}
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className={activeSection === link.id ? 'active' : ''}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <a href="#contact" className="nav-btn nav-btn-desktop">
          LET'S BUILD <BsArrowUpRight className="icon-sm" />
        </a>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="nav-toggle-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={activeSection === link.id ? 'active' : ''}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mobile-nav-btn-wrapper">
              <a
                href="#contact"
                className="nav-btn mobile-nav-btn"
                onClick={() => setMobileOpen(false)}
              >
                LET'S BUILD <BsArrowUpRight className="icon-sm" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
