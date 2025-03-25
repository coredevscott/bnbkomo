document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('bgVideo');
  const audioIcon = document.getElementById('audioIcon');
  const audioStatus = document.getElementById('audioStatus');
  
  // Try to play video
  video.play().then(() => {
    // Set initial audio status after video starts playing
    video.muted = true;
    audioIcon.classList.add('fa-volume-mute');
    audioStatus.textContent = 'MUTED';
  }).catch(error => {
    console.log("Video autoplay failed:", error);
  });
  
  window.toggleAudio = function() {
    if (video.muted) {
      video.muted = false;
      audioIcon.classList.remove('fa-volume-mute');
      audioIcon.classList.add('fa-volume-up');
      audioStatus.textContent = 'PLAYING';
    } else {
      video.muted = true;
      audioIcon.classList.remove('fa-volume-up');
      audioIcon.classList.add('fa-volume-mute');
      audioStatus.textContent = 'MUTED';
    }
  }

  // Image slider control
  const slider = document.getElementById('imageSlider');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;

  // Update dot indicators status
  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.remove('bg-[#ffca18]');
        dot.classList.add('bg-[#ffca18]');
        dot.style.opacity = '1';
      } else {
        dot.classList.remove('bg-[#ffca18]');
        dot.classList.add('bg-[#ffca18]');
        dot.style.opacity = '0.5';
      }
    });
  }

  // Listen for scroll events to update dots
  slider.addEventListener('scroll', () => {
    const scrollPosition = slider.scrollLeft;
    const slideWidth = slider.clientWidth * 0.22; // Width of one image
    currentSlide = Math.round(scrollPosition / slideWidth);
    updateDots();
  });

  window.slideImages = function(direction) {
    const scrollAmount = slider.clientWidth * 0.22;
    if (direction === 'left') {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      currentSlide = Math.max(0, currentSlide - 1);
    } else {
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      currentSlide = Math.min(dots.length - 1, currentSlide + 1);
    }
    updateDots();
  }

  // Click dots to jump to corresponding position
  window.jumpToSlide = function(index) {
    const scrollAmount = slider.clientWidth * 0.22 * index;
    slider.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    currentSlide = index;
    updateDots();
  }

  // Initialize dot indicators status
  updateDots();

  // Add touch swipe support
  let touchStartX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > 50) { // Minimum swipe distance
      if (difference > 0) {
        slideImages('right');
      } else {
        slideImages('left');
      }
    }
  });
}); 