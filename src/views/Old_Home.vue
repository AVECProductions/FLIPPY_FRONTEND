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
  <div class="min-h-screen bg-gradient-to-br from-[#0F1114] to-[#1A1D22]">
    <!-- Minimal Hero Section -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div class="lg:grid lg:grid-cols-12 lg:gap-12">
        <div class="lg:col-span-7">
          <h1>
            <span class="block text-sm font-medium uppercase tracking-wide text-blue-400 mb-3">
              Deal Finding Assistant
            </span>
            <span class="block text-4xl tracking-tight font-bold sm:text-5xl text-white">
              FlippyBot
            </span>
          </h1>
          <p class="mt-6 text-base text-gray-500 sm:text-lg max-w-lg">
            FlippyBot helps you discover and track items across online marketplaces based on your custom search criteria.
          </p>
          <div class="mt-10 flex gap-4">
            <router-link 
              to="/scanners" 
              class="px-5 py-3 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Setup Scanner
            </router-link>
            <router-link 
              to="/listings" 
              class="px-5 py-3 rounded-md shadow bg-transparent border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Browse Listings
            </router-link>
          </div>
        </div>
        <div class="hidden md:flex mt-12 lg:mt-0 lg:col-span-5 items-center justify-center">
          <!-- Simple illustration -->
          <div class="relative w-full max-w-md">
            <!-- Darker background and better glow effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-lg blur opacity-80"></div>
            <!-- Added padding and darker background for the image itself -->
            <div class="relative bg-[#0F1114] p-4 rounded-lg border border-gray-800">
              <img 
                class="w-full rounded-lg opacity-90 mx-auto" 
                src="/landing_image.png" 
                alt="FlippyBot Interface"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#111318] md:bg-transparent rounded-lg border border-gray-800/50 md:border-0">
      <div class="text-center mb-12 md:mobile-animate">
        <h2 class="text-2xl font-bold text-white">
          Features
        </h2>
        <div class="mt-1 h-1 w-12 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <!-- Feature 1 -->
        <div class="group mobile-animate">
          <div class="flex flex-col items-center">
            <div class="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
              <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">Multi-Location Scanning</h3>
            <p class="text-gray-500 text-center text-sm">
              Search across different locations and categories simultaneously.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="group mobile-animate">
          <div class="flex flex-col items-center">
            <div class="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
              <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">Keyword Filtering</h3>
            <p class="text-gray-500 text-center text-sm">
              Use keywords to find relevant items and filter out unwanted results.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="group mobile-animate">
          <div class="flex flex-col items-center">
            <div class="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
              <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">Notifications</h3>
            <p class="text-gray-500 text-center text-sm">
              Get notified when new items matching your criteria are found.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-white">
          How It Works
        </h2>
        <div class="mt-1 h-1 w-12 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div class="bg-[#1A1D22] p-5 rounded-lg mobile-animate">
          <div class="flex items-center mb-3">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-900/40 text-blue-400 font-normal text-sm mr-3">
              1
            </div>
            <h3 class="text-lg font-medium text-white">Create a Scanner</h3>
          </div>
          <p class="text-gray-500 text-sm">
            Set up your search parameters including location and category.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="bg-[#1A1D22] p-5 rounded-lg mobile-animate">
          <div class="flex items-center mb-3">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-900/40 text-blue-400 font-normal text-sm mr-3">
              2
            </div>
            <h3 class="text-lg font-medium text-white">Add Keywords</h3>
          </div>
          <p class="text-gray-500 text-sm">
            Refine your search with specific keywords and filters.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="bg-[#1A1D22] p-5 rounded-lg mobile-animate">
          <div class="flex items-center mb-3">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-900/40 text-blue-400 font-normal text-sm mr-3">
              3
            </div>
            <h3 class="text-lg font-medium text-white">View Results</h3>
          </div>
          <p class="text-gray-500 text-sm">
            Browse matching items in your personalized listings page.
          </p>
        </div>
      </div>
    </div>

    <!-- Simple CTA Section -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-6">
      <div class="bg-[#1A1D22] border-t border-gray-800 rounded-lg p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-4 md:mb-0">
            <h2 class="text-xl font-medium text-white">
              Ready to try it out?
            </h2>
            <p class="text-gray-500 mt-1">
              Setup your first scanner to get started.
            </p>
          </div>
          <router-link
            to="/scanners"
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Setup Scanner
          </router-link>
        </div>
      </div>
    </div>

    <!-- Simple Footer -->
    <footer class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <p class="text-center md:text-left text-sm text-gray-600">
          &copy; {{ new Date().getFullYear() }} FlippyBot. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
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

  /* Add delay for consecutive items */
  .group:nth-child(2) {
    transition-delay: 0.2s;
  }

  .group:nth-child(3) {
    transition-delay: 0.4s;
  }

  .grid > div:nth-child(2) {
    transition-delay: 0.2s;
  }

  .grid > div:nth-child(3) {
    transition-delay: 0.4s;
  }
}
</style>
