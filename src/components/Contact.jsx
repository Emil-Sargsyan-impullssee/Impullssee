import { useState } from 'react';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { BsRocket, BsArrowRight } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Landing Page',
    budget: '$500 – $1,000',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

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

      <section className="contact-section reveal-block" id="contact">
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
                      <select
                        id="contact-project-type"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                      >
                        <option>Landing Page</option>
                        <option>Business Website</option>
                        <option>Web Application</option>
                        <option>E-commerce</option>
                        <option>React Application</option>
                        <option>Full-Stack Project</option>
                        <option>Other</option>
                      </select>
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
}
