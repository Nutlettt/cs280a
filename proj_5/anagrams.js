/**
 * Visual Anagrams animator
 * Handles rotation/flip animations and prompt switching
 */

class AnagramAnimator {
  constructor(container) {
    this.container = container;
    this.frame = container.querySelector('.anagram-frame');
    this.prompts = Array.from(container.querySelectorAll('.anagram-prompt'));
    this.transformType = container.dataset.transform || 'rotate-180';
    this.interval = parseInt(container.dataset.interval) || 4000;
    this.currentIndex = 0;
    
    this.init();
  }
  
  init() {
    // Show first prompt
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

// Initialize all anagram items on page load
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.anagram-item');
  items.forEach(item => new AnagramAnimator(item));
});