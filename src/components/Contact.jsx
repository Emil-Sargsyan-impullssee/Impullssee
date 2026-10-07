import { useState, useEffect, useRef, forwardRef } from 'react';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { BsRocket, BsArrowRight } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { apiRequest } from '../admin/api';

const PROJECT_TYPES = [
  'Landing Page',
  'Business Website',
  'Web Application',
  'E-commerce',
  'React Application',
  'Full-Stack Project',
  'Other'
];

function ProjectTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(PROJECT_TYPES.indexOf(value), 0));
  const [opensAbove, setOpensAbove] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = Math.max(PROJECT_TYPES.indexOf(value), 0);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = Math.min(240, window.innerHeight * 0.36);
    setOpensAbove(window.innerHeight - rect.bottom < menuHeight + 12 && rect.top > window.innerHeight - rect.bottom);
    optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openMenu = (index = selectedIndex) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const selectOption = (option) => {
    onChange(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowDown' ? selectedIndex : (selectedIndex - 1 + PROJECT_TYPES.length) % PROJECT_TYPES.length);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % PROJECT_TYPES.length;
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + PROJECT_TYPES.length) % PROJECT_TYPES.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = PROJECT_TYPES.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(PROJECT_TYPES[index]);
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    } else if (event.key === 'Tab') {
      setOpen(false);
      return;
    } else return;

    event.preventDefault();
    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="project-type-dropdown" ref={rootRef}>
      <button
        ref={triggerRef}
        id="contact-project-type"
        type="button"
        className="project-type-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="contact-project-type-options"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{value}</span>
        <span className={`project-type-chevron${open ? ' is-open' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id="contact-project-type-options"
          className={`project-type-menu${opensAbove ? ' opens-above' : ''}`}
          role="listbox"
          aria-label="Project Type"
        >
          {PROJECT_TYPES.map((option, index) => (
            <div
              key={option}
              ref={(element) => { optionRefs.current[index] = element; }}
              className={`project-type-option${value === option ? ' is-selected' : ''}`}
              role="option"
              aria-selected={value === option}
              tabIndex={activeIndex === index ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Contact = forwardRef(function Contact({ initialProjectType = 'Landing Page', selectionRevision = 0 }, ref) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: initialProjectType,
    budget: '$500 – $1,000',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Update projectType when prop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, projectType: initialProjectType }));
  }, [initialProjectType, selectionRevision]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest('/api/messages', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Success
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'Landing Page',
        budget: '$500 – $1,000',
        message: ''
      });

      // Hide success message after 3.2 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3200);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitted && (
        <div className="telegram-send-overlay" role="alert" aria-live="polite">
          <div className="telegram-flight-line"></div>
          <div className="telegram-plane">
            <FaTelegramPlane />
          </div>
          <div className="telegram-send-text">
            <span>MESSAGE SENT</span>
            <small>Your message is on its way</small>
          </div>
        </div>
      )}

      <section ref={ref} className="contact-section reveal-block" id="contact">
        <div className="contact-glow-left"></div>
        <div className="contact-glow-right"></div>

        <div className="contact-container">
          <div className="contact-header-content">
            <span className="section-tag">// GET IN TOUCH</span>
            <h2 className="contact-title">
              Have a project in mind? <span className="highlight">Let's build it.</span>
            </h2>
            <p className="contact-desc">
              Have an idea, a new product, or a website that needs to be built? Tell me about it and let's turn your idea into a fast, modern and scalable web experience.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info-col">
              <div className="contact-talk-block">
                <h3>Let's talk</h3>
                <p>I'm currently available for freelance projects, collaborations and new opportunities.</p>
              </div>

              <div className="contact-cards-list">
                <div className="contact-info-card">
                  <div className="contact-card-icon lime-icon"><FiMail size={20} /></div>
                  <div>
                    <span className="card-label">EMAIL</span>
                    <a href="mailto:emilsargsyan43@gmail.com" className="card-value">emilsargsyan43@gmail.com</a>
                  </div>
                </div>

                <div className="contact-info-card telegram-card">
                  <div className="contact-card-icon cyan-icon"><BsRocket size={20} /></div>
                  <div>
                    <span className="card-label">TELEGRAM</span>
                    <a
                      href="https://t.me/impullssee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-value"
                    >
                      @impullssee
                    </a>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon lime-icon"><FiMapPin size={20} /></div>
                  <div>
                    <span className="card-label">LOCATION</span>
                    <span className="card-value">Armenia · Available Worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              <div className="contact-form-card">
                <div className="form-code-badge">&lt;contact /&gt;</div>
                <h3>Tell me about your project</h3>
                <p className="form-subtext">Fill out the form and I'll get back to you as soon as possible.</p>

                <form onSubmit={handleSubmit} className="contact-real-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">YOUR NAME</label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">EMAIL ADDRESS</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-project-type">PROJECT TYPE</label>
                      <ProjectTypeDropdown
                        value={formData.projectType}
                        onChange={(value) => handleChange({ target: { name: 'projectType', value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-budget">ESTIMATED BUDGET</label>
                      <input
                        id="contact-budget"
                        type="text"
                        name="budget"
                        placeholder="e.g. $500 – $1,000 or Custom"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">TELL ME ABOUT YOUR PROJECT</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Tell me about your idea, goals, features and timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="send-msg-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'} {!isSubmitting && <BsArrowRight className="icon-md" />}
                  </button>

                  {error && (
                    <div className="form-error-message">
                      {error}
                    </div>
                  )}
                </form>
              </div>
              <div className="form-status-indicator">
                <span className="status-dot green-dot"></span>
                Currently available for new projects
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export default Contact;
