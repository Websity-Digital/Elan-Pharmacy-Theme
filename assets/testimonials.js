/* testimonials-carousel.js
   Robust initializer: per-section, guards against missing elements,
   works with multiple testimonial sections and Shopify editor reloads.
*/
(function() {
  function initTestimonialSection(section) {
    // prevent double init
    if (section.dataset.testimonialsInit === 'true') return;

    const wrapper = section.querySelector('.testimonials-carousel-wrapper');
    const carousel = section.querySelector('.testimonials-carousel');
    const nextButton = section.querySelector('.next-button');
    const prevButton = section.querySelector('.prev-button');
    const cards = section.querySelectorAll('.testimonial-card');

    // If there's nothing to show, hide controls and mark initialized
    if (!wrapper || !carousel || cards.length === 0) {
      if (nextButton) nextButton.style.display = 'none';
      if (prevButton) prevButton.style.display = 'none';
      section.dataset.testimonialsInit = 'true';
      return;
    }

    // If all cards fit without scrolling, hide controls
    if (carousel.scrollWidth <= wrapper.clientWidth) {
      if (nextButton) nextButton.style.display = 'none';
      if (prevButton) prevButton.style.display = 'none';
      section.dataset.testimonialsInit = 'true';
      return;
    } else {
      if (nextButton) nextButton.style.display = '';
      if (prevButton) prevButton.style.display = '';
    }

    let scrollPosition = 0;

    function getCardStep() {
      const card = carousel.querySelector('.testimonial-card');
      const style = window.getComputedStyle(card);
      const gap = parseInt(style.marginRight || 20, 10); // fallback gap
      return card ? card.offsetWidth + gap : wrapper.clientWidth;
    }

    function getMaxScroll() {
      return Math.max(0, carousel.scrollWidth - wrapper.clientWidth);
    }

    function updateButtons() {
      if (prevButton) prevButton.disabled = scrollPosition <= 0;
      if (nextButton) nextButton.disabled = scrollPosition >= getMaxScroll();
    }

    function setTransform() {
      // clamp scroll position
      scrollPosition = Math.min(scrollPosition, getMaxScroll());
      scrollPosition = Math.max(scrollPosition, 0);

      carousel.style.transform = `translateX(-${scrollPosition}px)`;
      updateButtons();
    }

    // Next button: advance by one card
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        scrollPosition += getCardStep();
        setTransform();
      });
    }

    // Prev button: go back by one card
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        scrollPosition -= getCardStep();
        setTransform();
      });
    }

    // Keep things in sync on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        scrollPosition = Math.min(scrollPosition, getMaxScroll());
        setTransform();
      }, 120);
    });

    // After full page load (images may change widths), ensure transform is valid
    window.addEventListener('load', function() {
      scrollPosition = Math.min(scrollPosition, getMaxScroll());
      setTransform();
    });

    // Initialize
    setTransform();

    // mark initialized so we don't attach duplicate listeners
    section.dataset.testimonialsInit = 'true';
  }

  function initAll() {
    document.querySelectorAll('.testimonials-section').forEach(initTestimonialSection);
  }

  // init on DOM ready and also on window load (safer for images)
  document.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);

  // Shopify editor can dynamically load/replace sections; re-init safely
  document.addEventListener('shopify:section:load', function() { initAll(); });

})();
