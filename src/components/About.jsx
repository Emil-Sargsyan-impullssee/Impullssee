import { FiGithub } from 'react-icons/fi';
import { BsRocket } from 'react-icons/bs';

export default function About() {
  return (
    <section className="about-section reveal-block" id="about" aria-labelledby="about-heading">
      <div className="section-header">
        <span className="section-tag">// ABOUT ME</span>
        <h2 id="about-heading">
          Turning ideas into <span className="highlight">digital reality.</span>
        </h2>
      </div>

      <div className="about-grid">
        <div className="about-text">
          <p className="about-bio-lead">
            Hello! I'm Emil, a passionate Frontend and Web Developer based in Armenia. I specialize in building high-performing, modern websites and applications that deliver exceptional user experiences.
          </p>
          <p className="about-bio-secondary">
           From clean HTML/CSS markup and responsive Bootstrap layouts to interactive React.js applications, I combine technical precision with creative design.
          </p>
          <div className="about-socials">
            <a
              href="https://github.com/Emil-Sargsyan-impullssee"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Visit Emil's GitHub profile"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://t.me/impullssee"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Contact Emil on Telegram"
            >
              <BsRocket size={20} />
            </a>
          </div>
        </div>

        <div className="about-card-highlight">
          <h3>Quick Facts</h3>
          <ul className="about-facts-list">
            <li><span aria-hidden="true">📍</span> <strong>Location:</strong> Armenia (Available Worldwide)</li>
            <li><span aria-hidden="true">💻</span> <strong>Specialty:</strong> Frontend &amp; Web Development</li>
            <li><span aria-hidden="true">⚡</span> <strong>Tech Stack:</strong> React, JavaScript, HTML/CSS, Bootstrap</li>
            <li><span aria-hidden="true">🎓</span> <strong>Status:</strong> College Student &amp; Freelancer</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
