// Cargoline Platform Client Interaction Script
// Handles mobile navigation, pricing recalculation, directory filtering, and form validation.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (mobileToggle && primaryNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('is-open');
    });
  }

  // 2. Integrations Directory Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const integrationCards = document.querySelectorAll('[data-integration-category]');

  if (filterButtons.length > 0 && integrationCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        const selectedCategory = button.getAttribute('data-filter');

        integrationCards.forEach(card => {
          const cardCategory = card.getAttribute('data-integration-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Pricing Billing Cycle Toggle
  const billingToggles = document.querySelectorAll('.toggle-btn[data-billing]');
  const priceElements = document.querySelectorAll('[data-annual-price][data-monthly-price]');
  const periodLabels = document.querySelectorAll('.billing-period-label');

  if (billingToggles.length > 0) {
    billingToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        billingToggles.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        toggle.classList.add('active');
        toggle.setAttribute('aria-pressed', 'true');

        const mode = toggle.getAttribute('data-billing');

        priceElements.forEach(el => {
          const annual = el.getAttribute('data-annual-price');
          const monthly = el.getAttribute('data-monthly-price');
          el.textContent = mode === 'annual' ? `$${annual}` : `$${monthly}`;
        });

        periodLabels.forEach(label => {
          label.textContent = mode === 'annual' ? '/mo (billed annually)' : '/month';
        });
      });
    });
  }

  // 4. Interactive Shipment Telemetry Simulator Tabs
  const telemetryTabs = document.querySelectorAll('[data-telemetry-tab]');
  const telemetryPanels = document.querySelectorAll('[data-telemetry-panel]');

  if (telemetryTabs.length > 0 && telemetryPanels.length > 0) {
    telemetryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        telemetryTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        telemetryPanels.forEach(p => p.style.display = 'none');

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const targetId = tab.getAttribute('data-telemetry-tab');
        const targetPanel = document.querySelector(`[data-telemetry-panel="${targetId}"]`);
        if (targetPanel) {
          targetPanel.style.display = 'block';
        }
      });
    });
  }

  // 5. Demo Booking Form Client Validation
  const demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = demoForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.form-error');
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          if (errorEl) errorEl.style.display = 'block';
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          if (errorEl) errorEl.style.display = 'none';
        }
      });

      if (isValid) {
        const submitBtn = demoForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Scheduling Evaluation...';
        }
        setTimeout(() => {
          window.location.href = '/demo/confirmed';
        }, 300);
      }
    });
  }

  // 6. Contact Sales Form Client Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = contactForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.form-error');
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          if (errorEl) errorEl.style.display = 'block';
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          if (errorEl) errorEl.style.display = 'none';
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const feedback = document.getElementById('contact-feedback');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Transmitting Inquiry...';
        }
        setTimeout(() => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Inquiry Received';
          }
          if (feedback) {
            feedback.style.display = 'block';
          }
        }, 400);
      }
    });
  }
});
