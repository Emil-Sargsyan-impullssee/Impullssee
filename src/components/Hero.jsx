import { VscJson } from 'react-icons/vsc';
import LiveWaveCanvas from './LiveWaveCanvas';

export default function Hero() {
  return (
    <section className="hero-section" id="home" aria-label="Hero section">
      <div className="hero-content">
        <span className="hero-subtitle">FRONTEND & FULL STACK DEVELOPER</span>
        <h1>
          I build <span className="highlight">fast, scalable</span> web experiences.
        </h1>
        <p className="hero-desc">
          Crafting modern web applications with clean code, intuitive design, and seamless performance.
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
 3    role: 'Frontend Developer',
 4    focus: 'Performance & UX',
 5    build: 'Scalable Web Apps'
 6  };
 7  
 8  export default developer;`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
