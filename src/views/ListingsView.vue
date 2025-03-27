<template>
  <div class="w-full relative">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-[#F3F4F6]">Latest Listings</h2>
      <div class="flex space-x-2">
        <button 
          @click="toggleWatchlistFilter" 
          class="px-4 py-2 rounded bg-[#3F3F46] text-[#F3F4F6] hover:bg-opacity-90 flex items-center"
          :class="{ 'bg-[#3B82F6]': filters.watchlist }"
        >
          <span class="mr-1 text-white">★</span> {{ filters.watchlist ? 'All Listings' : 'Watchlist Only' }}
        </button>
        <button 
          @click="toggleFiltersVisible" 
          class="px-4 py-2 rounded bg-[#3F3F46] text-[#F3F4F6] hover:bg-opacity-90 flex items-center"
          :class="{ 'bg-[#3B82F6]': filtersVisible }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>
    </div>
    
    <!-- Filters Sidebar -->
    <div 
      v-if="filtersVisible" 
      class="fixed inset-y-0 right-0 w-80 bg-[#2C2C2E] shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
      :class="{ 'translate-x-0': filtersVisible, 'translate-x-full': !filtersVisible }"
    >
      <!-- Filters Header -->
      <div class="p-4 border-b border-[#3F3F46] flex justify-between items-center">
        <h3 class="text-lg font-semibold text-[#F3F4F6]">Filters</h3>
        <button @click="toggleFiltersVisible" class="text-[#F3F4F6] hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Scrollable Filters Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Query Filter -->
        <div>
          <label for="queryFilter" class="block text-sm font-medium text-[#F3F4F6] mb-2">Query</label>
          <select 
            id="queryFilter" 
            v-model="tempFilters.query" 
            class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Queries</option>
            <option v-for="query in filterOptions.queries" :key="query" :value="query">{{ query }}</option>
          </select>
        </div>
        
        <!-- Category Filter -->
        <div>
          <label for="categoryFilter" class="block text-sm font-medium text-[#F3F4F6] mb-2">Category</label>
          <select 
            id="categoryFilter" 
            v-model="tempFilters.category" 
            class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option v-for="category in filterOptions.categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        
        <!-- Scanner Location Filter -->
        <div>
          <label for="scannerLocationFilter" class="block text-sm font-medium text-[#F3F4F6] mb-2">Scanner Location</label>
          <select 
            id="scannerLocationFilter" 
            v-model="tempFilters.scanner_location" 
            class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option v-for="location in filterOptions.scanner_locations" :key="location" :value="location">{{ location }}</option>
          </select>
        </div>
        
        <!-- Price Range Filter -->
        <div>
          <label class="block text-sm font-medium text-[#F3F4F6] mb-2">Price Range</label>
          <div class="flex space-x-2">
            <div class="w-1/2">
              <input 
                v-model.number="tempFilters.min_price" 
                type="number" 
                placeholder="Min"
                class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div class="w-1/2">
              <input 
                v-model.number="tempFilters.max_price" 
                type="number" 
                placeholder="Max"
                class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Max Distance Filter -->
        <div>
          <label for="distanceFilter" class="block text-sm font-medium text-[#F3F4F6] mb-2">Max Distance (miles)</label>
          <input 
            id="distanceFilter"
            v-model.number="tempFilters.max_distance" 
            type="number" 
            placeholder="Enter maximum distance"
            class="w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <!-- Watchlist Filter -->
        <div>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="tempFilters.watchlist" 
              class="form-checkbox h-5 w-5 text-blue-500 rounded bg-[#1C1C1E] border-[#3F3F46] focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-[#F3F4F6]">Show Watchlist Only</span>
          </label>
        </div>
      </div>
      
      <!-- Filter Actions -->
      <div class="p-4 border-t border-[#3F3F46] flex justify-between">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 rounded bg-[#3F3F46] text-[#F3F4F6] hover:bg-opacity-90"
        >
          Reset
        </button>
        <button 
          @click="applyFilters" 
          class="px-4 py-2 rounded bg-[#3B82F6] text-white hover:bg-opacity-90"
        >
          Apply Filters
        </button>
      </div>
    </div>
    
    <!-- Modal Backdrop -->
    <div 
      v-if="filtersVisible" 
      @click="toggleFiltersVisible"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>
    
    <!-- Status Messages -->
    <div v-if="successMessage" class="bg-green-500 bg-opacity-10 text-green-500 p-4 rounded-md mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="error" class="bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-md mb-4">
      {{ error }}
    </div>
    
    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-4">
      <span class="text-[#9CA3AF]">Active Filters:</span>
      <div 
        v-if="filters.query" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Query: {{ filters.query }}
        <button @click="removeFilter('query')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.category" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Category: {{ filters.category }}
        <button @click="removeFilter('category')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.scanner_location" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Scanner Location: {{ filters.scanner_location }}
        <button @click="removeFilter('scanner_location')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.min_price !== null && filters.min_price !== undefined" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Min Price: ${{ filters.min_price }}
        <button @click="removeFilter('min_price')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.max_price !== null && filters.max_price !== undefined" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Max Price: ${{ filters.max_price }}
        <button @click="removeFilter('max_price')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.watchlist" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Watchlist Only
        <button @click="removeFilter('watchlist')" class="ml-1 font-bold">×</button>
      </div>
      <div 
        v-if="filters.max_distance !== null && filters.max_distance !== undefined" 
        class="px-2 py-1 bg-[#3B82F6] bg-opacity-20 text-blue-400 rounded-full text-xs flex items-center"
      >
        Max Distance: {{ filters.max_distance }} miles
        <button @click="removeFilter('max_distance')" class="ml-1 font-bold">×</button>
      </div>
      <button 
        @click="resetFilters" 
        class="px-2 py-1 bg-[#3F3F46] text-[#F3F4F6] rounded-full text-xs"
      >
        Clear All
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading listings...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="listings.length === 0" class="text-center py-8 text-[#9CA3AF]">
      No listings found.
    </div>
    
    <!-- Listings Grid -->
    <div v-else class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
      <a 
        v-for="listing in listings" 
        :key="listing.listing_idx"
        :href="listing.url"
        target="_blank"
        class="bg-[#2C2C2E] rounded-lg overflow-hidden shadow-lg flex flex-col hover:bg-[#3A3A3C] transition-colors duration-200 cursor-pointer"
      >
        <!-- Image Container -->
        <div class="relative w-full aspect-square overflow-hidden">
          <img 
            :src="listing.img || 'https://via.placeholder.com/300x200?text=No+Image'" 
            :alt="listing.title"
            class="w-full h-full object-cover transition-opacity duration-200 ease-in-out opacity-0"
            @error="handleImageError($event, listing)"
            @load="onImageLoad($event)"
          />
          <button 
            @click.stop="toggleListingWatchlist(listing)" 
            class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black bg-opacity-50 flex items-center justify-center z-10 hover:bg-opacity-70"
          >
            <span class="text-sm" :class="listing.watchlist ? 'text-yellow-400' : 'text-white'">★</span>
          </button>
        </div>
        
        <!-- Content Container -->
        <div class="p-2 flex-1 flex flex-col">
          <!-- Price -->
          <div class="text-base font-bold text-[#F3F4F6]">{{ listing.price }}</div>
          
          <!-- Title - Updated to show 2 lines -->
          <h3 class="font-medium text-[#F3F4F6] text-sm line-clamp-2 min-h-[2.5rem]">{{ listing.title }}</h3>
          
          <!-- Location with mileage and distance -->
          <div class="flex flex-col mt-1">
            <!-- Location and Distance Row -->
            <div class="flex justify-between items-center">
              <p class="text-xs text-[#9CA3AF] truncate mr-2">{{ listing.location }}</p>
              <p v-if="listing.distance !== null && listing.distance !== undefined" class="text-xs text-[#9CA3AF] whitespace-nowrap">
                {{ formatDistance(listing.distance) }}
              </p>
            </div>
            
            <!-- Optional mileage data - shown if available -->
            <p v-if="listing.description && listing.description.includes('mile')" class="text-xs text-[#9CA3AF]">
              {{ extractMiles(listing.description) }}
            </p>
          </div>
        </div>
      </a>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6 space-x-2">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded bg-[#3F3F46] text-[#F3F4F6] disabled:opacity-50"
      >
        Previous
      </button>
      
      <span class="px-3 py-1 text-[#F3F4F6]">{{ currentPage }} / {{ totalPages }}</span>
      
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded bg-[#3F3F46] text-[#F3F4F6] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { getListings, toggleWatchlist, getFilterOptions } from '@/services/api';
import type { Listing } from '@/types';
import type { ListingFilters } from '@/services/api';

const listings = ref<Listing[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(20);
const filtersVisible = ref(false);

// Filter options from API
const filterOptions = ref({
  queries: [] as string[],
  categories: [] as string[],
  scanner_locations: [] as string[]  // Updated to scanner_locations
});

// Active filters (applied to the backend)
const filters = ref<ListingFilters>({});

// Temporary filters (for the filter form)
const tempFilters = ref<ListingFilters>({});

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => 
    value !== undefined && value !== null && value !== ''
  );
});

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const fetchListings = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await getListings(currentPage.value, itemsPerPage.value, filters.value);
    listings.value = data.results || [];
    totalItems.value = data.count || 0;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch listings';
  } finally {
    loading.value = false;
  }
};

const fetchFilterOptions = async () => {
  try {
    // Fetch filter options from API
    console.log('Fetching filter options...');
    const options = await getFilterOptions();
    console.log('Received filter options:', options);
    filterOptions.value = options;
    
    // Initialize the filters after options are loaded
    initializeFilters();
  } catch (err: any) {
    console.error('Error fetching filter options:', err);
    error.value = err.message || 'Failed to fetch filter options';
  }
};

const toggleListingWatchlist = async (listing: Listing, event?: Event) => {
  // Prevent the parent link click if an event is passed
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  try {
    const updated = await toggleWatchlist(listing.listing_idx, listing.watchlist);
    if (updated) {
      // Update the listing in our local state
      const index = listings.value.findIndex(l => l.listing_idx === listing.listing_idx);
      if (index !== -1) {
        listings.value[index].watchlist = !listings.value[index].watchlist;
      }
      
      successMessage.value = `Listing ${updated.watchlist ? 'added to' : 'removed from'} watchlist`;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update watchlist';
  }
};

const toggleWatchlistFilter = () => {
  if (filters.value.watchlist) {
    // If watchlist filter is on, turn it off
    const { watchlist, ...rest } = filters.value;
    filters.value = rest;
  } else {
    // If watchlist filter is off, turn it on
    filters.value = { ...filters.value, watchlist: true };
  }
  
  // Update temp filters as well
  tempFilters.value = { ...filters.value };
  
  // Reset to the first page
  currentPage.value = 1;
  
  // Fetch listings with the updated filters
  fetchListings();
};

const toggleFiltersVisible = () => {
  filtersVisible.value = !filtersVisible.value;
  
  // When showing filters, initialize temp filters with current values
  if (filtersVisible.value) {
    tempFilters.value = { ...filters.value };
  }
};

const resetFilters = () => {
  filters.value = {};
  tempFilters.value = {};
  currentPage.value = 1;
  fetchListings();
};

const applyFilters = () => {
  console.log('Applying filters:', tempFilters.value);
  // Copy temp filters to active filters
  filters.value = { ...tempFilters.value };
  
  // Reset to the first page
  currentPage.value = 1;
  
  // Fetch listings with the new filters
  fetchListings();
  
  // Hide the filters panel
  filtersVisible.value = false;
};

const removeFilter = (key: keyof ListingFilters) => {
  // Create a new object without the specified filter
  const { [key]: _, ...rest } = filters.value;
  filters.value = rest;
  
  // Update temp filters as well
  tempFilters.value = { ...filters.value };
  
  // Reset to the first page
  currentPage.value = 1;
  
  // Fetch listings with the updated filters
  fetchListings();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatDistance = (distance: number): string => {
  if (distance === 0) return 'Local';
  return `${distance.toFixed(1)} miles`;
};

// Clear success message after 3 seconds
const clearSuccessMessage = () => {
  if (successMessage.value) {
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
};

// Watch for success message changes
watch(successMessage, () => {
  clearSuccessMessage();
});

// Watch for page changes
watch(currentPage, () => {
  fetchListings();
});

// Initialize the filters with default values
const initializeFilters = () => {
  // Set temp filters to initial state (all options)
  tempFilters.value = {
    query: '',        // All Queries
    category: '',     // All Categories
    scanner_location: '', // All Locations
    min_price: null,
    max_price: null,
    max_distance: null,
    watchlist: false
  };
  
  // Apply these defaults to the active filters as well
  filters.value = { ...tempFilters.value };
};

// Add keydown event to close filter panel with Escape key
onMounted(() => {
  // Fetch filter options first
  fetchFilterOptions();
  
  // Then fetch listings
  fetchListings();
  
  // Add event listener for Escape key
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filtersVisible.value) {
      toggleFiltersVisible();
    }
  });
});

// Clean up event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filtersVisible.value) {
      toggleFiltersVisible();
    }
  });
});

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  
  if (img) {
    // Add fade-in effect for smoother loading
    img.style.opacity = '1';
    
    // For very wide or very tall images, adjust the object-fit
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Very wide or very tall images might need contain instead of cover
      if (aspectRatio > 3 || aspectRatio < 0.3) {
        img.classList.add('object-contain', 'p-1');
        img.classList.remove('object-cover');
      }
    }
  }
};

const handleImageError = (event: Event, listing: Listing) => {
  // Replace broken image with placeholder
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'https://via.placeholder.com/300x200?text=No+Image';
  imgElement.classList.add('object-contain', 'p-2');
  imgElement.classList.remove('object-cover');
  
  // Optionally log the error
  console.warn(`Failed to load image for listing: ${listing.title}`);
};

const extractMiles = (description: string): string => {
  // Look for patterns like "123K miles" or "12345 miles" in the description
  const milesMatch = description.match(/(\d+\.?\d*[Kk]?\s*miles)/i);
  if (milesMatch) {
    return milesMatch[0];
  }
  
  // If no match found, return empty string
  return '';
};
</script>

<style scoped>
/* Add transition for the sidebar */
.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Image transitions */
img {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

/* Optional hover effect for cards */
.bg-[#2C2C2E]:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
</style> 