<script setup lang="ts">
import { onMounted, ref } from 'vue';

// No special logic needed for this landing page

// Flag to check if we're on mobile
const isMobile = ref(window.innerWidth < 768);

// Update mobile status when window resizes
onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });

  // Initialize animations when component is mounted
  if (window.innerWidth < 768) {
    initScrollAnimations();
  }
});

// Function to initialize scroll animations
function initScrollAnimations() {
  // Use Intersection Observer to detect when elements come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Target elements with the mobile-animate class
  document.querySelectorAll('.mobile-animate').forEach(el => {
    observer.observe(el);
  });
}
</script>

<template>
  <div class="landing-container bg-black flex flex-col items-center justify-center">
    <div class="text-center px-4">
      <h1 class="text-4xl sm:text-5xl font-bold uppercase tracking-wide text-blue-400 mb-2">
        FLIPPYBOT
      </h1>
      
      <p class="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        Stop scrolling, find deals.
      </p>
      
      <div class="flex justify-center">
        <router-link 
          to="/listings" 
          class="px-10 py-4 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 font-medium text-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          ACCESS
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* Animation styles - only apply at mobile sizes */
@media (max-width: 767px) {
  .mobile-animate {
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .animate-in {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
