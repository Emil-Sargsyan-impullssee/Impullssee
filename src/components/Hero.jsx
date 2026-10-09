import { VscJson } from 'react-icons/vsc';
import LiveWaveCanvas from './LiveWaveCanvas';

export default function Hero() {
  return (
    <section className="hero-section" id="home" aria-label="Hero section">
      <div className="hero-content">
        <span className="hero-subtitle">FULL-STACK DEVELOPER</span>
        <h1>
          Complete web apps, <span className="highlight">from UI to API.</span>
        </h1>
        <p className="hero-desc">
          I build modern web applications with responsive interfaces, backend APIs, and database-powered features.
        </p>
      </div>

      <div className="hero-code-box" role="img" aria-label="Code snippet showing developer information">
        <LiveWaveCanvas />
        <div className="code-box-inner-content">
          <div className="code-header" aria-hidden="true">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="code-box-title-icon">
              <VscJson />
            </span>
          </div>
          <pre className="code-content">
            <code>{` 1  const developer = {
 2    name: 'Emil Sargsyan',
 3    role: 'Full-Stack Developer',
 4    focus: 'Frontend, APIs & Databases',
 5    build: 'Complete Web Applications'
 6  };
 7  
 8  export default developer;`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
