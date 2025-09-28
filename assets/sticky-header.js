(function() {
  function initStickyHeader() {
    const header = document.querySelector('.header__row.header__row--top');
    if (!header) {
      console.log('❌ Header not found, retrying...');
      return false;
    }

    // Fix header to top with custom width
    header.style.position = 'fixed';
    header.style.top = '30'; // or '30px' if you want space
    header.style.left = '50%';
    header.style.transform = 'translateX(-50%)';
    header.style.width = '88.88%';
    header.style.zIndex = '9999';
    header.style.transition = 'transform 0.3s ease';

    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 50) {
        header.style.transform = 'translate(-50%, -150%)'; // hide
      } else {
        header.style.transform = 'translate(-50%, 0)'; // show
      }

      lastScroll = currentScroll;
    });

    console.log('✅ Sticky header: 88.88% width, hides on scroll down, shows on scroll up');
    return true;
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!initStickyHeader()) {
      setTimeout(initStickyHeader, 1000);
    }
  });
})();