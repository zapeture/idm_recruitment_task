document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu functionality
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const closeMenu = document.getElementById('closeMenu');

  if (menuToggle && mobileMenu && closeMenu && mobileMenuOverlay) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus the close menu button for better keyboard navigation
      closeMenu.focus();
    });

    closeMenu.addEventListener('click', function () {
      closeMobileMenu();
    });

    mobileMenuOverlay.addEventListener('click', function () {
      closeMobileMenu();
    });

    // Close menu with Escape key
    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Return focus to menu toggle
      menuToggle.focus();
    }
  }

  // Product popup functionality
  const productItems = document.querySelectorAll('.product-item');
  const productPopup = document.getElementById('productPopup');
  const closePopup = document.getElementById('closePopup');
  const popupImage = document.getElementById('popupImage');

  if (productItems && productPopup && closePopup && popupImage) {
    let lastFocusedElement;

    // Polyfill for dialog if needed
    if (!('showModal' in productPopup)) {
      // If browser doesn't support dialog, we'll use our custom implementation
      productPopup.setAttribute('role', 'dialog');
    }

    productItems.forEach(item => {
      item.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const productImg = this.querySelector('img').src;
        const productAlt = this.querySelector('img').alt;

        // Update popup content
        document.querySelector('.product-popup-id').textContent = `ID:${productId}`;
        popupImage.src = productImg;
        popupImage.alt = productAlt;

        // Save the element that had focus before opening the popup
        lastFocusedElement = document.activeElement;

        // Show popup using the dialog API
        if (typeof productPopup.showModal === 'function') {
          productPopup.showModal();
        } else {
          // Fallback for browsers that don't support <dialog>
          productPopup.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        // Focus the close button
        setTimeout(() => {
          closePopup.focus();
        }, 100);
      });
    });

    closePopup.addEventListener('click', function () {
      closeProductPopup();
    });

    // Close popup when clicking backdrop (for native dialog)
    productPopup.addEventListener('click', function (e) {
      if (e.target === productPopup) {
        closeProductPopup();
      }
    });

    // Close popup with Escape key
    productPopup.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeProductPopup();
      }
    });

    function closeProductPopup() {
      if (typeof productPopup.close === 'function') {
        productPopup.close();
      } else {
        // Fallback for browsers that don't support <dialog>
        productPopup.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Return focus to the element that had focus before opening the popup
      if (lastFocusedElement) {
        setTimeout(() => {
          lastFocusedElement.focus();
        }, 100);
      }
    }
  }

  // Favorite button functionality
  const favoriteButtons = document.querySelectorAll('.favorite-btn');

  if (favoriteButtons) {
    favoriteButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const img = this.querySelector('img');
        if (img.src.includes('Icon_favorite.svg')) {
          img.src = './assets/icons/Icon_favorite_filled.svg';
          this.setAttribute('aria-label', `Remove ${this.closest('.product-card').querySelector('.product-title').textContent} from favorites`);
        } else {
          img.src = './assets/icons/Icon_favorite.svg';
          this.setAttribute('aria-label', `Add ${this.closest('.product-card').querySelector('.product-title').textContent} to favorites`);
        }
      });
    });
  }

  // Dropdown functionality
  const dropdown = document.querySelector('.dropdown');

  if (dropdown) {
    dropdown.addEventListener('click', function () {
      alert('Dropdown functionality would be implemented here');
    });

    // Add keyboard support for dropdown
    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alert('Dropdown functionality would be implemented here');
      }
    });
  }

  // Slider functionality for featured products
  const slider = document.getElementById('featuredProducts');
  const sliderNav = document.getElementById('sliderNav');
  const featuredSection = document.querySelector('.featured-section');

  // Function to update scroll indicator
  function updateScrollIndicator() {
    if (slider && featuredSection) {
      const scrollPercentage = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
      const maxWidth = Math.min(scrollPercentage * 100, 100);

      // Set the width of the scroll indicator using CSS variable
      featuredSection.style.setProperty('--scroll-width', `${maxWidth}%`);

      // Add class to ensure visibility instead of direct style manipulation
      const scrollIndicator = featuredSection.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.classList.add('visible');
      }
    }
  }

  if (slider && sliderNav) {
    // Initialize scroll indicator immediately
    updateScrollIndicator();

    // Also run it after a small delay to ensure proper initialization
    setTimeout(updateScrollIndicator, 100);

    // Update after window is fully loaded with all resources
    window.addEventListener('load', updateScrollIndicator);

    // Update scroll indicator when scrolling
    slider.addEventListener('scroll', updateScrollIndicator);

    sliderNav.addEventListener('click', function () {
      scrollRight();
    });

    // Add keyboard support for slider navigation
    sliderNav.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollRight();
      }
    });

    function scrollRight() {
      // Calculate the scroll distance (one card width + gap)
      const cardWidth = slider.querySelector('.product-card').offsetWidth;
      const gap = 16; // Same as the gap in CSS
      const scrollDistance = cardWidth + gap;

      // Scroll to the right
      slider.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });

      // Check if we reached the end, if so, scroll back to the beginning
      setTimeout(() => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
          slider.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }

        // Update scroll indicator after scrolling
        updateScrollIndicator();
      }, 500);
    }

    // Allow mouse drag scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      slider.scrollLeft = scrollLeft - walk;

      // Update scroll indicator during drag
      updateScrollIndicator();
    });

    // Touch events for mobile devices
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (startX - x); // Scroll speed
      slider.scrollLeft = scrollLeft + walk;

      // Update scroll indicator during touch
      updateScrollIndicator();
    }, { passive: true });

    // Update scroll indicator on window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateScrollIndicator();
      }, 250);
    });
  }
});