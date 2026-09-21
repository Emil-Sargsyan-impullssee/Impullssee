import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Process from './components/Process';
import PricingOptions from './components/PricingOptions';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    const hiddenElements = document.querySelectorAll('.reveal-block');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="portfolio-container">
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <Marquee text="Where design creates the first impression, code brings the idea to life, and every detail has a reason to exist." />
        <About />
        <Marquee
          className="statement-marquee-reverse"
          text="We live in a digital world where attention is earned, not given. I create experiences designed to earn it."
        />
        <Skills />
        <Marquee
          className="statement-marquee-process"
          text="Good design gets attention. Good development earns trust. Great digital experiences bring the two together."
        />
        <Process />
        <Marquee
          className="statement-marquee-contact"
          text="Great work starts with a conversation, grows through collaboration, and ends with something worth being proud of."
        />
        <PricingOptions />
        <Contact />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
