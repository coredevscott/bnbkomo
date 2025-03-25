class ImageGrid {
  constructor() {
    // Get required DOM elements
    this.container = document.getElementById('imageGrid');
    if (!this.container) {
      console.error('Image grid container not found');
      return;
    }

    this.modal = document.getElementById('imageModal');
    this.modalImage = document.getElementById('modalImage');
    this.closeButton = document.getElementById('closeModal');

    if (!this.modal || !this.modalImage || !this.closeButton) {
      console.error('Modal elements not found');
      return;
    }
    
    // Image used for letters
    const letterImage = 'asserts/img/i3.png';
    
    // Array of other random images
    const randomImages = [
      'asserts/img/x/1.png',
      'asserts/img/x/2.png',
      'asserts/img/x/3.png',
      'asserts/img/x/4.png',
      'asserts/img/x/5.png',
      'asserts/img/x/6.png',
      'asserts/img/x/7.png',
      'asserts/img/x/8.png',
      'asserts/img/x/9.png',
      'asserts/img/x/10.png',
      'asserts/img/x/11.png',
      'asserts/img/x/12.png',
      'asserts/img/x/13.png',
      'asserts/img/x/14.png',
      'asserts/img/x/15.png',
      'asserts/img/x/16.png',
      'asserts/img/x/17.png',
      'asserts/img/x/18.png',
      'asserts/img/x/19.png',
      'asserts/img/x/20.png',
      'asserts/img/x/21.png',
      'asserts/img/x/22.png',
      'asserts/img/x/23.png',
      'asserts/img/x/24.png',
      'asserts/img/x/25.png',
      'asserts/img/x/26.png',
      'asserts/img/x/x1.png',
      'asserts/img/x/x2.png',
      'asserts/img/x/x3.png',
      'asserts/img/x/x4.png',
      'asserts/img/x/x5.png',
      'asserts/img/x/x6.png',
      'asserts/img/x/x7.png',
      'asserts/img/x/x8.png',
      'asserts/img/x/x9.png',
      'asserts/img/x/x10.png',
      'asserts/img/x/x11.png',
      'asserts/img/x/x12.png',
      'asserts/img/x/x13.png',
      'asserts/img/x/x14.png',
      'asserts/img/x/x15.png',
      'asserts/img/x/x16.png',
      'asserts/img/x/x17.png',
      'asserts/img/x/x18.png'
    ];

    // Create array for 360 positions (9×40)
    this.images = new Array(360).fill('');
    
    // KOMO pattern positions
    this.komoPositions = [
      // K
      42,                          // Vertical line start
      82,                          // Vertical line
      122,                         // Vertical line
      162,                         // Vertical line
      202,                         // Vertical line
      242,                         // Vertical line
      282,                         // Vertical line end
      
      124, 125,                  // Middle diagonal start
      163, 164,                    // Middle diagonal
      204,205,                   // Middle diagonal
      
      85,86,                      // Upper diagonal
      46,47,                     // Upper diagonal end
      
      245,246,                    // Lower diagonal
      286,287,                    // Lower diagonal end
      
      // O (First O)
      52, 53, 54, 55, 56, 57,
      92, 97,
      132, 137,
      172, 177,
      212, 217,
      252, 257,
      292, 293, 294, 295, 296, 297,
      
      // M
      62, 63, 64, 65, 66, 67,     // Top horizontal line
      102, 104, 105, 107,         // Second row edges
      142, 144, 145, 147,         // Third row
      182, 184, 185, 187,         // Fourth row
      222, 224, 225, 227,         // Fifth row
      262, 264, 265, 267,         // Sixth row
      302, 307,                   // Bottom edges
      
      // O (Second O)
      72, 73, 74, 75, 76, 77,
      112, 117,
      152, 157,
      192, 197,
      232, 237,
      272, 277,
      312, 313, 314, 315, 316, 317
    ];

    // Place KOMO pattern first
    this.komoPositions.forEach(pos => {
      const row = Math.floor(pos / 40);
      if (row >= 1 && row <= 7) {
        this.images[pos] = letterImage;
      }
    });

    // Fill remaining positions
    this.images = this.images.map((img, index) => {
      const col = index % 40;
      if (!img && col >= 2 && col <= 38) {
        return randomImages[Math.floor(Math.random() * randomImages.length)];
      }
      return img || randomImages[Math.floor(Math.random() * randomImages.length)];
    });
    
    this.init();
  }

  init() {
    try {
      this.container.innerHTML = '';
      this.container.className = 'flex flex-wrap overflow-hidden';
      
      const wrapper = document.createElement('div');
      wrapper.className = 'w-full flex flex-col gap-0.5';
      
      // Modify animation keyframes and add hover animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes autoFlip {
          0% { transform: rotateY(0); }
          5%, 5.5% { transform: rotateY(180deg); }
          6%, 100% { transform: rotateY(0); }
        }
        
        @keyframes hoverFlip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(180deg); }
        }
      `;
      document.head.appendChild(style);
      
      // Calculate number of non-KOMO cells
      const nonKomoCount = 360 - this.komoPositions.length;
      // Single cell flip duration (seconds)
      const singleFlipTime = 0.2;
      // Total animation cycle = non-KOMO cells count * single cell flip time
      const totalCycleDuration = nonKomoCount * singleFlipTime;
      
      let flipIndex = 0;
      
      for (let row = 0; row < 9; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex w-full gap-0.5';
        
        for (let col = 0; col < 40; col++) {
          const index = row * 40 + col;
          const div = document.createElement('div');
          div.className = 'relative group w-[2.5%] pb-[2.5%]';
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'absolute inset-0';
          
          const img = document.createElement('img');
          img.src = this.images[index];
          
          const isKOMO = this.komoPositions.includes(index);
          
          if (isKOMO) {
            img.className = 'w-full h-full object-cover rounded-sm transition-all duration-300 cursor-pointer hover:brightness-110 hover:scale-105';
            contentDiv.appendChild(img);
          } else {
            // Create two separate card layers
            const autoFlipCard = document.createElement('div');
            autoFlipCard.className = 'absolute inset-0 [perspective:1000px]';
            
            const hoverCard = document.createElement('div');
            hoverCard.className = 'absolute inset-0 [perspective:1000px] opacity-0 hover:opacity-100';
            
            // Auto-flip layer
            const autoInner = document.createElement('div');
            autoInner.className = 'relative w-full h-full transition-transform duration-300 [transform-style:preserve-3d]';
            
            const delay = flipIndex * singleFlipTime;
            flipIndex++;
            
            autoInner.style.animation = `autoFlip ${totalCycleDuration}s linear infinite`;
            autoInner.style.animationDelay = `${delay}s`;
            
            // Hover layer
            const hoverInner = document.createElement('div');
            hoverInner.className = 'relative w-full h-full transition-transform duration-[50ms] [transform-style:preserve-3d]';
            
            // Create images and black masks for both layers
            for (const inner of [autoInner, hoverInner]) {
              const innerImg = img.cloneNode(true);
              innerImg.className = 'absolute w-full h-full object-cover rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)]';
              
              const blackCover = document.createElement('div');
              blackCover.className = 'absolute w-full h-full bg-black rounded-sm [backface-visibility:hidden]';
              
              inner.appendChild(blackCover);
              inner.appendChild(innerImg);
            }
            
            autoFlipCard.appendChild(autoInner);
            hoverCard.appendChild(hoverInner);
            
            // Implement hover effect using animation
            div.addEventListener('mouseenter', () => {
              hoverInner.style.animation = 'hoverFlip 50ms linear forwards';
            });
            
            div.addEventListener('mouseleave', () => {
              hoverInner.style.animation = 'hoverFlip 50ms linear reverse forwards';
            });
            
            contentDiv.appendChild(autoFlipCard);
            contentDiv.appendChild(hoverCard);
          }
          
          div.appendChild(contentDiv);
          
          // Keep zoom effect on click
          div.addEventListener('click', () => this.showImage(img.src));
          rowDiv.appendChild(div);
        }
        
        wrapper.appendChild(rowDiv);
      }
      
      this.container.appendChild(wrapper);

      // Bind modal close events
      this.closeButton.addEventListener('click', () => this.hideModal());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.hideModal();
      });

      // Bind keyboard events
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.hideModal();
      });

      // Set parent container style
      const parentContainer = this.container.parentElement;
      if (parentContainer) {
        parentContainer.style.overflow = 'hidden';
      }

    } catch (error) {
      console.error('Error initializing image grid:', error);
    }
  }

  showImage(src) {
    this.modalImage.src = src;
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Initialize when page loads
window.addEventListener('load', () => {
  new ImageGrid();
}); 