
export default function Marquee({ text, className = '' }) {
  return (
    <section className={`statement-marquee ${className}`.trim()}>
      <div className="statement-track">
        <div className="statement-item">
          <span>{text}</span>
        </div>

        <div className="statement-item" aria-hidden="true">
          <span>{text}</span>
        </div>

        <div className="statement-item" aria-hidden="true">
          <span>{text}</span>
        </div>
      </div>
    </section>
  );
}
