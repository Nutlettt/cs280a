/**
 * Hybrid Images animator
 * Handles zoom in/out animations and prompt switching
 */

class HybridAnimator {
  constructor(container) {
    this.container = container;
    this.frame = container.querySelector('.hybrid-frame');
    this.prompts = Array.from(container.querySelectorAll('.hybrid-prompt'));
    this.transformType = container.dataset.transform || 'zoom-out';
    this.interval = parseInt(container.dataset.interval) || 4000;
    this.currentIndex = 0;
    
    this.init();
  }
  
  init() {
    // Show first prompt (close view)
    this.prompts[0]?.classList.add('active');
    
    // Start animation loop
    this.startAnimation();
  }
  
  startAnimation() {
    setInterval(() => {
      this.toggleView();
    }, this.interval);
  }
  
  toggleView() {
    // Toggle transformation
    this.frame.classList.toggle(this.transformType);
    
    // Switch prompts
    this.prompts[this.currentIndex]?.classList.remove('active');
    this.currentIndex = (this.currentIndex + 1) % this.prompts.length;
    this.prompts[this.currentIndex]?.classList.add('active');
  }
}

// Initialize all hybrid items on page load
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.hybrid-item');
  items.forEach(item => new HybridAnimator(item));
});