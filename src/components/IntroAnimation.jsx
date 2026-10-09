import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './IntroAnimation.css';

export default function IntroAnimation() {
  const location = useLocation();
  const [initialPath] = useState(location.pathname);
  const shouldPlay = initialPath === '/';
  const [visible, setVisible] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!shouldPlay || !visible) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const leaveDelay = prefersReducedMotion ? 50 : 900;
    const finishDelay = prefersReducedMotion ? 180 : 1360;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    const leaveTimer = window.setTimeout(() => setLeaving(true), leaveDelay);
    const finishTimer = window.setTimeout(() => setVisible(false), finishDelay);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldPlay, visible]);

  if (!visible) return null;

  return (
    <div className={`intro-screen${leaving ? ' intro-screen--leaving' : ''}`} aria-hidden="true">
      <div className="intro-screen__content">
        <div className="intro-screen__wordmark">
          <span className="intro-screen__mark">&lt;/&gt;</span>
          <span>IMPULLSSEE</span>
        </div>
        <span className="intro-screen__caption">FULL-STACK DEVELOPER</span>
        <span className="intro-screen__accent" />
      </div>
    </div>
  );
}
