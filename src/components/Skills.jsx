import { FiLayout, FiZap } from 'react-icons/fi';
import {
  FaReact,
  FaBootstrap,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaFigma
} from 'react-icons/fa';
import { SiNodedotjs } from 'react-icons/si';

export default function Skills() {
  return (
    <section className="skills-section reveal-block" id="skills" aria-labelledby="skills-heading">
      <div className="section-header">
        <span className="section-tag">// SKILLS & TECHNOLOGIES</span>
        <h2 id="skills-heading">
          Tools. Frameworks. Craft.{' '}
          <span className="text-muted">Technologies I use to build high-performance web solutions.</span>
        </h2>
      </div>

      <div className="skills-grid">
        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon responsive-icon"><FiLayout /></div>
            <div>
              <h3>Responsive Design</h3>
              <p>Ensuring flawless layouts across mobile, tablet, and desktop screens.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon uiux-icon"><FaFigma /></div>
            <div>
              <h3>UI/UX Design</h3>
              <p>Creating intuitive, user-friendly interfaces and engaging experiences.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Intermediate</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon perf-icon"><FiZap /></div>
            <div>
              <h3>Performance Optimization</h3>
              <p>Speeding up load times, optimizing assets, and code efficiency.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon html-icon"><FaHtml5 /></div>
            <div>
              <h3>HTML</h3>
              <p>Semantic markup, accessibility, and SEO best practices.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon css-icon"><FaCss3Alt /></div>
            <div>
              <h3>CSS</h3>
              <p>Modern CSS, Flexbox, Grid, and custom design systems.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon bootstrap-icon"><FaBootstrap /></div>
            <div>
              <h3>BOOTSTRAP</h3>
              <p>Rapid UI development with responsive grid system.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon js-icon"><FaJs /></div>
            <div>
              <h3>JAVASCRIPT</h3>
              <p>ES6+, async programming, and interactive experiences.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Advanced</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card active-skill">
          <div className="skill-top">
            <div className="skill-icon react-icon"><FaReact /></div>
            <div>
              <h3>REACT.JS</h3>
              <p>Component architecture, hooks, and state management.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Intermediate</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>

        <div className="skill-card">
          <div className="skill-top">
            <div className="skill-icon node-icon"><SiNodedotjs /></div>
            <div>
              <h3>NODE.JS</h3>
              <p>Backend APIs, RESTful services, and server-side logic.</p>
            </div>
          </div>
          <div className="skill-footer">
            <span className="level">Intermediate</span>
            <span className="status-dot green-dot"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
