import { FiTarget, FiEdit3, FiTrendingUp } from 'react-icons/fi';
import { BiBulb } from 'react-icons/bi';
import { BsRocket } from 'react-icons/bs';

export default function Process() {
  return (
    <section className="process-section reveal-block" id="process" aria-labelledby="process-heading">
      <div className="process-intro">
        <span className="section-tag">// MY PROCESS</span>
        <h2 id="process-heading">A structured approach to every project.</h2>
        <p>From understanding your goals to launching a complete web solution, each step stays focused on your needs.</p>
      </div>

      <div className="process-steps">
        <div className="step-item reveal-block">
          <div className="step-icon-wrapper target" aria-hidden="true"><FiTarget /></div>
          <div className="step-copy"><span className="step-num">01</span>
            <h4>DISCOVER</h4>
            <p>Understanding goals, audience, and requirements.</p></div>
        </div>

        <div className="step-item reveal-block">
          <div className="step-icon-wrapper bulb" aria-hidden="true"><BiBulb /></div>
          <div className="step-copy"><span className="step-num">02</span>
            <h4>PLAN</h4>
            <p>Research, strategy, and technical planning.</p></div>
        </div>

        <div className="step-item reveal-block">
          <div className="step-icon-wrapper pencil" aria-hidden="true"><FiEdit3 /></div>
          <div className="step-copy"><span className="step-num">03</span>
            <h4>BUILD</h4>
            <p>Building responsive interfaces, APIs, and connected features.</p></div>
        </div>

        <div className="step-item reveal-block">
          <div className="step-icon-wrapper rocket" aria-hidden="true"><BsRocket /></div>
          <div className="step-copy"><span className="step-num">04</span>
            <h4>TEST & LAUNCH</h4>
            <p>Testing, optimization, and smooth deployment.</p></div>
        </div>

        <div className="step-item reveal-block">
          <div className="step-icon-wrapper growth" aria-hidden="true"><FiTrendingUp /></div>
          <div className="step-copy"><span className="step-num">05</span>
            <h4>GROW</h4>
            <p>Monitoring, iteration, and continuous improvement.</p></div>
        </div>
      </div>
    </section>
  );
}
