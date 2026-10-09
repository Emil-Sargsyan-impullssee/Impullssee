import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiLayout, FiZap } from 'react-icons/fi';
import {
  FaReact,
  FaBootstrap,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaFigma,
  FaPython,
} from 'react-icons/fa';
import { SiFastapi } from 'react-icons/si';

const filters = ['All', 'Frontend', 'Backend', 'Databases', 'Tools'];

const skills = [
  {
    category: 'Frontend',
    name: 'Responsive Design',
    description: 'Layouts for mobile, tablet, and desktop.',
    level: 'Advanced',
    icon: <FiLayout />,
    iconClass: 'responsive-icon',
  },
  {
    category: 'Frontend',
    name: 'UI/UX Design',
    description: 'Intuitive, user-friendly interfaces.',
    level: 'Intermediate',
    icon: <FaFigma />,
    iconClass: 'uiux-icon',
  },
  {
    category: 'Tools',
    name: 'Performance Optimization',
    description: 'Efficient code, assets, and load times.',
    level: 'Advanced',
    icon: <FiZap />,
    iconClass: 'perf-icon',
  },
  {
    category: 'Frontend',
    name: 'HTML',
    description: 'Semantic markup, accessibility, and SEO.',
    level: 'Advanced',
    icon: <FaHtml5 />,
    iconClass: 'html-icon',
  },
  {
    category: 'Frontend',
    name: 'CSS',
    description: 'Modern CSS, Flexbox, and Grid.',
    level: 'Advanced',
    icon: <FaCss3Alt />,
    iconClass: 'css-icon',
  },
  {
    category: 'Frontend',
    name: 'Bootstrap',
    description: 'Responsive layouts and rapid UI development.',
    level: 'Advanced',
    icon: <FaBootstrap />,
    iconClass: 'bootstrap-icon',
  },
  {
    category: 'Frontend',
    name: 'JavaScript',
    description: 'ES6+, async code, and interactions.',
    level: 'Advanced',
    icon: <FaJs />,
    iconClass: 'js-icon',
  },
  {
    category: 'Frontend',
    name: 'React',
    description: 'Components, hooks, and state management.',
    level: 'Intermediate',
    icon: <FaReact />,
    iconClass: 'react-icon',
    active: true,
  },
  {
    category: 'Backend',
    name: 'Python',
    description: 'Backend logic and API development.',
    level: 'Intermediate',
    icon: <FaPython />,
    iconClass: 'node-icon',
  },
  {
    category: 'Backend',
    name: 'FastAPI',
    description: 'REST API endpoints and backend services.',
    level: 'Project experience',
    icon: <SiFastapi />,
    iconClass: 'node-icon',
  },
  {
    category: 'Databases',
    name: 'PostgreSQL',
    description: 'Relational database for application data.',
    level: 'Project experience',
    icon: 'DB',
    iconClass: 'perf-icon',
  },
  {
    category: 'Tools',
    name: 'REST APIs',
    description: 'Connect application features to services.',
    level: 'Project experience',
    icon: 'API',
    iconClass: 'js-icon',
  },
];

function SkillCard({ skill, order = 0, className = '', ariaHidden = false }) {
  return (
    <article
      className={`skill-card${skill.active ? ' active-skill' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden={ariaHidden || undefined}
      style={{ '--skill-order': order }}
    >
      <div className="skill-top">
        <div className={`skill-icon ${skill.iconClass}`} aria-hidden="true">{skill.icon}</div>
        <div className="skill-copy">
          <span className="skill-category">{skill.category}</span>
          <h3>{skill.name}</h3>
          <p>{skill.description}</p>
        </div>
      </div>
      <div className="skill-footer">
        <span className="level">{skill.level}</span>
        <span className="status-dot green-dot" aria-hidden="true"></span>
      </div>
    </article>
  );
}

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const touchStartRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(() => typeof IntersectionObserver === 'undefined');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 575.98px)').matches
  ));
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const visibleSkills = activeFilter === 'All'
    ? skills
    : skills.filter((skill) => skill.category === activeFilter);
  const activeSkill = visibleSkills[currentIndex];
  const outgoingSkill = outgoingIndex === null ? null : visibleSkills[outgoingIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const smallScreenQuery = window.matchMedia('(max-width: 575.98px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateSmallScreen = (event) => setIsSmallScreen(event.matches);
    const updateMotionPreference = (event) => setReducedMotion(event.matches);

    smallScreenQuery.addEventListener?.('change', updateSmallScreen);
    motionQuery.addEventListener?.('change', updateMotionPreference);
    return () => {
      smallScreenQuery.removeEventListener?.('change', updateSmallScreen);
      motionQuery.removeEventListener?.('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isSmallScreen || !hasEntered || autoplayPaused || reducedMotion || visibleSkills.length < 2) return undefined;

    const autoplayTimer = window.setTimeout(() => {
      const nextIndex = (currentIndex + 1) % visibleSkills.length;
      setSlideDirection(1);
      setOutgoingIndex(currentIndex);
      setCurrentIndex(nextIndex);
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = window.setTimeout(() => setOutgoingIndex(null), 760);
    }, 4800);

    return () => window.clearTimeout(autoplayTimer);
  }, [autoplayPaused, currentIndex, hasEntered, isSmallScreen, reducedMotion, visibleSkills.length]);

  const goToSlide = (nextIndex, direction = 1) => {
    setAutoplayPaused(true);
    if (nextIndex === currentIndex) return;

    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    if (reducedMotion) {
      setOutgoingIndex(null);
      setCurrentIndex(nextIndex);
      return;
    }

    setSlideDirection(direction);
    setOutgoingIndex(currentIndex);
    setCurrentIndex(nextIndex);
    transitionTimerRef.current = window.setTimeout(() => setOutgoingIndex(null), 760);
  };

  const selectFilter = (filter) => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    setActiveFilter(filter);
    setCurrentIndex(0);
    setOutgoingIndex(null);
    setAutoplayPaused(true);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setAutoplayPaused(true);
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = deltaX < 0 ? 1 : -1;
      const nextIndex = (currentIndex + direction + visibleSkills.length) % visibleSkills.length;
      goToSlide(nextIndex, direction);
    }
  };

  return (
    <section className="skills-section reveal-block" id="skills" aria-labelledby="skills-heading" ref={sectionRef}>
      <div className="section-header">
        <span className="section-tag">// SKILLS &amp; TECHNOLOGIES</span>
        <h2 id="skills-heading">
          Tools. Frameworks. Craft.{' '}
          <span className="text-muted">Technologies I use to build high-performance web solutions.</span>
        </h2>
      </div>

      <div className="skills-filters" role="group" aria-label="Filter skills by category">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`skills-filter${activeFilter === filter ? ' is-active' : ''}`}
            aria-pressed={activeFilter === filter}
            onClick={() => selectFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={`skills-grid${hasEntered ? ' has-entered' : ''}`} aria-live="polite">
        {visibleSkills.map((skill, index) => <SkillCard key={skill.name} skill={skill} order={index} />)}
      </div>

      <div
        className="skills-slideshow"
        role="region"
        aria-label="Technology skills slideshow"
        onPointerEnter={() => setAutoplayPaused(true)}
        onFocusCapture={() => setAutoplayPaused(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStartRef.current = null; }}
      >
        <div className="skills-slide-stage" aria-live="off">
          {outgoingSkill && (
            <SkillCard
              key={`outgoing-${outgoingSkill.name}`}
              skill={outgoingSkill}
              className={`skills-slide-card skills-slide-exit-${slideDirection > 0 ? 'next' : 'previous'}`}
              ariaHidden
            />
          )}
          {activeSkill && (
            <SkillCard
              key={`active-${activeSkill.name}`}
              skill={activeSkill}
              order={currentIndex}
              className={`skills-slide-card${outgoingSkill ? ` skills-slide-enter-${slideDirection > 0 ? 'next' : 'previous'}` : ' skills-slide-card-active'}`}
            />
          )}
        </div>

        <div className="skills-slide-navigation">
          <button
            type="button"
            className="skills-slide-arrow"
            aria-label="Previous technology"
            onClick={() => goToSlide((currentIndex - 1 + visibleSkills.length) % visibleSkills.length, -1)}
            disabled={visibleSkills.length < 2}
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
          <div className="skills-slide-pagination" aria-label={`Slide ${currentIndex + 1} of ${visibleSkills.length}`}>
            <span className="skills-slide-count" aria-hidden="true">
              {String(currentIndex + 1).padStart(2, '0')} / {String(visibleSkills.length).padStart(2, '0')}
            </span>
            <div className="skills-slide-dots" aria-hidden="true">
              {visibleSkills.map((skill, index) => (
                <span key={skill.name} className={index === currentIndex ? 'is-active' : ''} />
              ))}
            </div>
          </div>
          <button
            type="button"
            className="skills-slide-arrow"
            aria-label="Next technology"
            onClick={() => goToSlide((currentIndex + 1) % visibleSkills.length, 1)}
            disabled={visibleSkills.length < 2}
          >
            <FiChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
