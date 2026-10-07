import { useState } from "react";
import "./Pricing.css";

function PricingOptions({ onGetStarted }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  const services = [
    {
      id: "responsive",
      title: "Responsive Design",
      description: "Perfect on mobile, tablet & desktop",
      price: 25,
      icon: "fa-mobile-screen-button",
      iconClass: "responsive-icon",
    },
    {
      id: "uiux",
      title: "UI/UX Design",
      description: "Modern interface & user-friendly experience",
      price: 50,
      icon: "fa-pen-ruler",
      iconClass: "uiux-icon",
    },
    {
      id: "seo",
      title: "SEO Optimization",
      description: "Search engine ready structure",
      price: 30,
      icon: "fa-chart-line",
      iconClass: "perf-icon",
    },
    {
      id: "animations",
      title: "Modern Animations",
      description: "Smooth interactions & transitions",
      price: 30,
      icon: "fa-wand-magic-sparkles",
      iconClass: "uiux-icon",
    },
    {
      id: "performance",
      title: "Performance Optimization",
      description: "Fast loading & optimized assets",
      price: 40,
      icon: "fa-gauge-high",
      iconClass: "perf-icon",
    },
    {
      id: "contact",
      title: "Contact Form",
      description: "Functional contact form",
      price: 25,
      icon: "fa-envelope",
      iconClass: "responsive-icon",
    },
    {
      id: "api",
      title: "API Integration",
      description: "Connect external services & APIs",
      price: 60,
      icon: "fa-plug",
      iconClass: "js-icon",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      description: "More accessible user experience",
      price: 35,
      icon: "fa-universal-access",
      iconClass: "accessibility-icon",
    },
    {
      id: "search",
      title: "Advanced Search",
      description: "Fast search with filters & instant results",
      price: 55,
      icon: "fa-magnifying-glass",
      iconClass: "responsive-icon",
    },
  ];

  // Toggle service
  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Extra pages price
  // First page is included in base price
  const pagesPrice = pageCount > 1 ? (pageCount - 1) * 35 : 0;

  // Selected services total
  const servicesPrice = services
    .filter((service) => selectedServices.includes(service.id))
    .reduce((total, service) => total + service.price, 0);

  // Base website price
  const basePrice = 20;

  // Final price
  const totalPrice = basePrice + pagesPrice + servicesPrice;

  // Selected service objects
  const selectedServiceObjects = services.filter((service) =>
    selectedServices.includes(service.id)
  );

  return (
    <section className="pricing-section reveal-block" id="pricing" aria-labelledby="pricing-heading">
      {/* =========================
          HEADER
      ========================= */}
      <div className="pricing-header">
        <span className="section-tag">
          PRICING & OPTIONS
        </span>
        <h2 id="pricing-heading">
          Build your website{" "}
          <span className="text-muted">
            your way.
          </span>
        </h2>
        <p>
          Choose the features you need and get an
          instant project estimate.
        </p>
      </div>

      {/* =========================
          MAIN LAYOUT
      ========================= */}
      <div className="pricing-layout">
        {/* =========================
            LEFT SIDE
        ========================= */}
        <div className="pricing-options">
          {/* =========================
              PAGES
          ========================= */}
          <div className="pricing-option-card">
            <div className="option-heading">
              <div>
                <span className="option-number">
                  01
                </span>
                <h3>
                  Number of pages
                </h3>
                <p>
                  Choose how many pages your
                  website needs.
                </p>
              </div>

              {/* PAGE COUNTER */}
              <div className="page-counter">
                <button
                  type="button"
                  aria-label="Decrease number of pages"
                  onClick={() =>
                    setPageCount((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                >
                  −
                </button>
                <span aria-live="polite">
                  {pageCount}
                </span>
                <button
                  type="button"
                  aria-label="Increase number of pages"
                  onClick={() =>
                    setPageCount((prev) =>
                      Math.min(20, prev + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="page-price-info">
              {pageCount === 1 ? (
                <>
                  <span>
                    1 page included
                  </span>
                  <strong>
                    Included
                  </strong>
                </>
              ) : (
                <>
                  <span>
                    {pageCount} pages
                  </span>
                  <strong>
                    +${pagesPrice}
                  </strong>
                </>
              )}
            </div>
          </div>

          {/* =========================
              SERVICES
          ========================= */}
          <div className="pricing-option-card">
            <div className="option-heading">
              <div>
                <span className="option-number">
                  02
                </span>
                <h3>
                  Additional services
                </h3>
                <p>
                  Select the features you want
                  to add to your website.
                </p>
              </div>
            </div>

            <div className="services-list">
              {services.map((service) => {
                const isSelected =
                  selectedServices.includes(
                    service.id
                  );

                return (
                  <div
                    key={service.id}
                    className={`service-option ${
                      isSelected ? "selected" : ""
                    }`}
                    role="group"
                    aria-label={service.title}
                  >
                    <button
                      type="button"
                      className="service-option-select"
                      aria-pressed={isSelected}
                      onClick={() => toggleService(service.id)}
                    >
                      {/* ICON */}
                      <div className={`service-icon ${service.iconClass}`}>
                        <i className={`fa-solid ${service.icon}`}></i>
                      </div>

                      {/* CONTENT */}
                      <div className="service-content">
                        <strong>{service.title}</strong>
                        <span>{service.description}</span>
                      </div>

                      {/* PRICE */}
                      <div className="service-price">+${service.price}</div>

                      {/* CHECK */}
                      <div className="service-check">
                        {isSelected && <i className="fa-solid fa-check"></i>}
                      </div>
                    </button>

                    {/* GET STARTED BUTTON */}
                    <button
                      type="button"
                      className="service-get-started"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGetStarted(service.title);
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
            PROJECT SUMMARY
        ========================= */}
        <aside className="project-summary">
          {/* SUMMARY HEADER */}
          <div className="summary-header">
            <div>
              <span className="summary-tag">
                PROJECT SUMMARY
              </span>
              <h3>
                Your website
              </h3>
            </div>

            <div className="summary-live">
              <span></span>
              LIVE
            </div>
          </div>

          {/* PRICE */}
          <div className="summary-main-price">
            <span>
              Estimated price
            </span>
            <strong>
              ${totalPrice}
            </strong>
          </div>

          <div className="summary-divider"></div>

          {/* SUMMARY ITEMS */}
          <div className="summary-items">
            {/* BASE WEBSITE */}
            <div className="summary-item">
              <span>
                Website
              </span>
              <strong>
                ${basePrice}
              </strong>
            </div>

            {/* PAGES */}
            <div className="summary-item">
              <span>
                Pages
              </span>
              <strong>
                {pageCount}{" "}
                {pageCount === 1
                  ? "page"
                  : "pages"}
              </strong>
            </div>

            {/* EXTRA PAGES */}
            {pagesPrice > 0 && (
              <div className="summary-item">
                <span>
                  Additional pages
                </span>
                <strong>
                  +${pagesPrice}
                </strong>
              </div>
            )}

            {/* SELECTED SERVICES */}
            {selectedServiceObjects.length > 0 && (
              <div className="summary-services-title">
                Selected services
              </div>
            )}

            {selectedServiceObjects.map(
              (service) => (
                <div
                  className="summary-item selected-summary"
                  key={service.id}
                >
                  <span>
                    <i className="fa-solid fa-check"></i>
                    {service.title}
                  </span>
                  <strong>
                    +${service.price}
                  </strong>
                </div>
              )
            )}
          </div>

          <div className="summary-divider"></div>

          {/* BUTTON */}
          <button
            type="button"
            className="summary-button"
            onClick={() => {
              if (selectedServiceObjects.length > 0) {
                const firstSelectedService = selectedServiceObjects[0];
                onGetStarted(firstSelectedService.title);
              } else {
                onGetStarted('Landing Page');
              }
            }}
          >
            <span>
              Get Started
            </span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          {/* NOTE */}
          <p className="summary-note">
            Final price may vary depending on
            project complexity and requirements.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default PricingOptions;
