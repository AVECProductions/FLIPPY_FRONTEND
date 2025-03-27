<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header section with responsive layout -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold uppercase tracking-wide text-white">Scanners</h2>
      <button 
        @click="openAddScannerModal" 
        class="px-3 sm:px-4 py-2 rounded border border-gray-600 text-gray-200 font-medium bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center flex-shrink-0"
      >
        <span class="mr-1">+</span>
        <span class="inline">Add Scanner</span>
      </button>
    </div>
    
    <!-- Status Messages -->
    <div v-if="successMessage" class="bg-green-500 bg-opacity-10 text-green-500 p-4 rounded-md mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="error" class="bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-md mb-4">
      {{ error }}
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading scanners...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="scanners.length === 0" class="text-center py-8 text-[#9CA3AF]">
      No scanners found.
    </div>
    
    <!-- Scanners grouped by town with category headers -->
    <div v-else class="space-y-12">
      <div v-for="(townGroup, town) in groupedScanners" :key="town" class="space-y-4">
        <!-- Town Header - More prominent -->
        <div class="bg-blue-900 bg-opacity-20 border-l-4 border-blue-500 pl-4 py-3 rounded-r-md">
          <h3 class="text-lg font-bold text-white">{{ town }}</h3>
        </div>
        
        <!-- Single table per town with category headers -->
        <div class="bg-[#121212] rounded-lg overflow-hidden shadow-lg border border-gray-800 ml-2">
          <table class="w-full table-fixed">
            <tbody>
              <!-- Loop through categories -->
              <template v-for="(categoryGroup, category) in townGroup" :key="category">
                <!-- Category Header Row -->
                <tr class="bg-[#1A1A1A] border-t border-gray-800">
                  <td colspan="2" class="px-4 py-3 text-gray-300 font-medium uppercase tracking-wide">{{ category }}</td>
                </tr>
                
                <!-- Scanner Rows for this category -->
                <tr 
                  v-for="scanner in categoryGroup" 
                  :key="scanner.id"
                  class="border-t border-gray-800 hover:bg-[#2C2C2E] cursor-pointer transition-colors duration-200 bg-[#232323]"
                  @click="openScannerModal(scanner)"
                >
                  <td class="px-4 py-3 pl-8 text-[#F3F4F6] truncate w-[70%]">{{ scanner.query }}</td>
                  <td class="px-4 py-3 w-[30%] text-right pr-6">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="scanner.status === 'running' ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-gray-500 bg-opacity-20 text-gray-500'"
                    >
                      {{ scanner.status }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Add Scanner Modal -->
    <div v-if="showAddScannerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-black p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-800">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold text-[#F3F4F6]">Add New Scanner</h3>
          <button @click="closeAddScannerModal" class="text-[#9CA3AF] hover:text-white">
            &times;
          </button>
        </div>
        
        <!-- Simple form instead of using ScannerForm component to resolve type issues -->
        <div class="space-y-4">
          <div>
            <label for="query" class="block text-sm font-medium text-[#F3F4F6] mb-1">Query</label>
            <input 
              id="query" 
              v-model="newScanner.query" 
              type="text" 
              class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Enter search query"
            />
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-[#F3F4F6] mb-1">Category</label>
            <input 
              id="category" 
              v-model="newScanner.category" 
              type="text" 
              class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Enter category"
            />
          </div>
          
          <div>
            <label for="town" class="block text-sm font-medium text-[#F3F4F6] mb-1">Town</label>
            <input 
              id="town" 
              v-model="newScanner.town" 
              type="text" 
              class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Enter town"
            />
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-[#F3F4F6] mb-1">Status</label>
            <select 
              id="status" 
              v-model="newScanner.status" 
              class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#F3F4F6] mb-1">Keywords</label>
            <div class="space-y-2">
              <div v-for="(keyword, index) in newScannerKeywords" :key="`new-keyword-${index}`" class="flex items-center">
                <input 
                  v-model="newScannerKeywords[index]" 
                  type="text" 
                  class="flex-grow px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter keyword"
                />
                <button 
                  @click="newScannerKeywords.splice(index, 1)" 
                  class="ml-2 px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <button 
                @click="newScannerKeywords.push('')" 
                class="w-full px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              >
                + Add Keyword
              </button>
            </div>
            <p class="text-xs text-[#9CA3AF] mt-2">
              Keywords are used to filter search results. If any of these keywords are found in a listing title, it will be flagged.
            </p>
          </div>
          
          <div class="flex justify-end space-x-2 mt-6">
            <button 
              @click="closeAddScannerModal" 
              class="px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              @click="createNewScanner" 
              class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              :disabled="isCreating"
            >
              {{ isCreating ? 'Creating...' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scanner Management Modal -->
    <div v-if="showScannerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-black p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-800">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold text-[#F3F4F6]">Manage Scanner</h3>
          <button @click="closeScannerModal" class="text-[#9CA3AF] hover:text-white">
            &times;
          </button>
        </div>
        
        <div v-if="selectedScanner" class="mb-6">
          <!-- Scanner Details Section -->
          <div class="mb-4 pb-4 border-b border-gray-800">
            <p class="text-[#F3F4F6] mb-2"><span class="font-medium">Query:</span> {{ selectedScanner.query }}</p>
            <p class="text-[#F3F4F6] mb-2"><span class="font-medium">Category:</span> {{ selectedScanner.category }}</p>
            <p class="text-[#F3F4F6] mb-2"><span class="font-medium">Town:</span> {{ selectedScanner.town }}</p>
            <p class="text-[#F3F4F6]">
              <span class="font-medium">Status:</span> 
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium ml-2"
                :class="selectedScanner.status === 'running' ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-gray-500 bg-opacity-20 text-gray-500'"
              >
                {{ selectedScanner.status }}
              </span>
            </p>
          </div>
          
          <!-- Keywords Section -->
          <div class="mb-4 pb-4 border-b border-gray-800">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-md font-semibold text-[#F3F4F6]">Keywords</h4>
              <button 
                @click="isEditingKeywords = !isEditingKeywords" 
                class="text-xs text-blue-400 hover:text-blue-300"
              >
                {{ isEditingKeywords ? 'Cancel' : 'Edit Keywords' }}
              </button>
            </div>
            
            <!-- Keywords editing view -->
            <div v-if="isEditingKeywords" class="mb-2">
              <div class="space-y-2">
                <div v-for="(keyword, index) in keywords" :key="`keyword-${index}`" class="flex items-center">
                  <input 
                    v-model="keywords[index]" 
                    type="text" 
                    class="flex-grow px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                    placeholder="Enter keyword"
                  />
                  <button 
                    @click="removeKeyword(index)" 
                    class="ml-2 px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
                <button 
                  @click="addKeyword" 
                  class="w-full px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  + Add Keyword
                </button>
                <div class="flex justify-end space-x-2 mt-4">
                  <button 
                    @click="isEditingKeywords = false" 
                    class="px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="saveKeywords" 
                    class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                    :disabled="isSavingKeywords"
                  >
                    {{ isSavingKeywords ? 'Saving...' : 'Save Keywords' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Keywords display view -->
            <div v-else>
              <div v-if="keywords.length === 0" class="text-[#9CA3AF] italic">
                No keywords set. Scanner will match all listings.
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <span 
                  v-for="(keyword, index) in keywords" 
                  :key="index" 
                  class="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-xs"
                >
                  {{ keyword }}
                </span>
              </div>
              <p class="text-xs text-[#9CA3AF] mt-2">
                These keywords are used to filter search results. If any of these keywords are found in a listing title, it will be flagged.
              </p>
            </div>
          </div>
          
          <!-- Edit Form Section -->
          <div v-if="isEditing" class="mb-4">
            <div class="space-y-4">
              <div>
                <label for="edit-query" class="block text-sm font-medium text-[#F3F4F6] mb-1">Query</label>
                <input 
                  id="edit-query" 
                  v-model="editForm.query" 
                  type="text" 
                  class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter search query"
                />
              </div>
              
              <div>
                <label for="edit-category" class="block text-sm font-medium text-[#F3F4F6] mb-1">Category</label>
                <input 
                  id="edit-category" 
                  v-model="editForm.category" 
                  type="text" 
                  class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter category"
                />
              </div>
              
              <div>
                <label for="edit-town" class="block text-sm font-medium text-[#F3F4F6] mb-1">Town</label>
                <input 
                  id="edit-town" 
                  v-model="editForm.town" 
                  type="text" 
                  class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter town"
                />
              </div>
              
              <div>
                <label for="edit-status" class="block text-sm font-medium text-[#F3F4F6] mb-1">Status</label>
                <select 
                  id="edit-status" 
                  v-model="editForm.status" 
                  class="w-full px-3 py-2 bg-[#1C1C1E] border border-gray-800 rounded-md text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                </select>
              </div>
              
              <div class="flex justify-end space-x-2 mt-6">
                <button 
                  @click="isEditing = false" 
                  class="px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  @click="saveEditForm" 
                  class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                  :disabled="isUpdating"
                >
                  {{ isUpdating ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Actions Section -->
          <div v-else class="flex flex-col space-y-3">
            <button 
              @click="isEditing = true" 
              class="w-full px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 transition-colors duration-200"
            >
              Edit Scanner
            </button>
            
            <button 
              @click="handleToggleStatus" 
              class="w-full px-4 py-2 rounded"
              :class="selectedScanner.status === 'running' ? 'border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10' : 'border border-green-500 text-green-500 hover:bg-green-500 hover:bg-opacity-10'"
            >
              {{ selectedScanner.status === 'running' ? 'Stop Scanner' : 'Start Scanner' }}
            </button>
            
            <button 
              @click="handleDeleteConfirm" 
              class="w-full px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-200"
            >
              Delete Scanner
            </button>
          </div>
          
          <!-- Delete Confirmation Section -->
          <div v-if="showDeleteConfirm" class="mt-4 p-4 bg-red-500 bg-opacity-10 rounded-lg">
            <p class="text-[#F3F4F6] mb-4">Are you sure you want to delete this scanner?</p>
            <div class="flex justify-end space-x-2">
              <button 
                @click="showDeleteConfirm = false" 
                class="px-4 py-2 rounded border border-gray-600 text-gray-200 bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                @click="handleDelete" 
                class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                :disabled="isDeleting"
              >
                {{ isDeleting ? 'Deleting...' : 'Confirm Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { 
  getScanners, 
  createScanner, 
  updateScanner, 
  deleteScanner, 
  toggleScannerStatus,
  getKeywordsByScanner,
  updateKeywords
} from '@/services/api';
import type { Scanner } from '@/types';
import ScannerForm from '@/components/scanners/ScannerForm.vue';

const scanners = ref<Scanner[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Add scanner modal state
const showAddScannerModal = ref(false);
const newScanner = ref({
  query: '',
  category: '',
  town: '',
  status: 'stopped' as 'running' | 'stopped'
});
const isCreating = ref(false);

// Manage scanner modal state
const showScannerModal = ref(false);
const selectedScanner = ref<Scanner | null>(null);
const isEditing = ref(false);

// Delete state
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

// Edit form state
const editForm = ref({
  query: '',
  category: '',
  town: '',
  status: '' as 'running' | 'stopped'
});
const isUpdating = ref(false);

// Keywords state
const keywords = ref<string[]>([]);
const isEditingKeywords = ref(false);
const isSavingKeywords = ref(false);

// Add scanner form state
const newScannerKeywords = ref<string[]>([]);

// Group scanners by town and then by category
const groupedScanners = computed(() => {
  const grouped: Record<string, Record<string, Scanner[]>> = {};
  
  scanners.value.forEach(scanner => {
    const town = scanner.town || 'Uncategorized';
    const category = scanner.category || 'Uncategorized';
    
    // Initialize town group if it doesn't exist
    if (!grouped[town]) {
      grouped[town] = {};
    }
    
    // Initialize category group if it doesn't exist
    if (!grouped[town][category]) {
      grouped[town][category] = [];
    }
    
    // Add scanner to its category group
    grouped[town][category].push(scanner);
  });
  
  return grouped;
});

const fetchScanners = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    scanners.value = await getScanners();
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch scanners';
  } finally {
    loading.value = false;
  }
};

const openAddScannerModal = () => {
  // Reset form fields
  newScanner.value = {
    query: '',
    category: '',
    town: '',
    status: 'stopped'
  };
  newScannerKeywords.value = [];
  showAddScannerModal.value = true;
};

const closeAddScannerModal = () => {
  showAddScannerModal.value = false;
};

const createNewScanner = async () => {
  isCreating.value = true;
  
  try {
    // Create the scanner first
    const created = await createScanner(newScanner.value);
    if (created) {
      // If scanner created successfully, add any keywords
      const filteredKeywords = newScannerKeywords.value.filter(k => k.trim() !== '');
      if (filteredKeywords.length > 0) {
        await updateKeywords(created.id, filteredKeywords);
      }
      
      successMessage.value = 'Scanner created successfully';
      await fetchScanners();
      closeAddScannerModal();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save scanner';
  } finally {
    isCreating.value = false;
  }
};

const handleEditFormSubmit = async (formData: Partial<Scanner>) => {
  if (!selectedScanner.value) return;
  
  try {
    const updated = await updateScanner(selectedScanner.value.id, formData);
    if (updated) {
      successMessage.value = 'Scanner updated successfully';
      await fetchScanners();
      
      // Update the selectedScanner with the new data
      const updatedScanner = scanners.value.find(s => s.id === selectedScanner.value?.id);
      if (updatedScanner) {
        selectedScanner.value = updatedScanner;
      }
      
      isEditing.value = false;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update scanner';
  }
};

const handleToggleStatus = async () => {
  if (!selectedScanner.value) return;
  
  try {
    const updated = await toggleScannerStatus(selectedScanner.value.id, selectedScanner.value.status);
    if (updated) {
      successMessage.value = `Scanner ${updated.status === 'running' ? 'started' : 'stopped'} successfully`;
      await fetchScanners();
      
      // Update the selectedScanner with the new status
      const updatedScanner = scanners.value.find(s => s.id === selectedScanner.value?.id);
      if (updatedScanner) {
        selectedScanner.value = updatedScanner;
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to toggle scanner status';
  }
};

const handleDeleteConfirm = () => {
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!selectedScanner.value) return;
  
  isDeleting.value = true;
  
  try {
    const success = await deleteScanner(selectedScanner.value.id);
    if (success) {
      successMessage.value = 'Scanner deleted successfully';
      await fetchScanners();
      closeScannerModal();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to delete scanner';
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const openScannerModal = async (scanner: Scanner) => {
  selectedScanner.value = scanner;
  showScannerModal.value = true;
  isEditing.value = false;
  showDeleteConfirm.value = false;
  isEditingKeywords.value = false;
  
  // Load keywords for this scanner
  try {
    keywords.value = await getKeywordsByScanner(scanner.id);
  } catch (err: any) {
    error.value = err.message || 'Failed to load keywords';
  }
};

const closeScannerModal = () => {
  showScannerModal.value = false;
  selectedScanner.value = null;
  isEditing.value = false;
  showDeleteConfirm.value = false;
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

onMounted(() => {
  fetchScanners();
});

onUnmounted(() => {
  // Remove the window resize event listener cleanup
});

watch(isEditing, (newValue) => {
  if (newValue && selectedScanner.value) {
    // Initialize edit form with current scanner values
    editForm.value = {
      query: selectedScanner.value.query,
      category: selectedScanner.value.category,
      town: selectedScanner.value.town,
      status: selectedScanner.value.status as 'running' | 'stopped'
    };
  }
});

const saveEditForm = async () => {
  if (!selectedScanner.value) return;
  
  isUpdating.value = true;
  
  try {
    const updated = await updateScanner(selectedScanner.value.id, editForm.value);
    if (updated) {
      successMessage.value = 'Scanner updated successfully';
      await fetchScanners();
      
      // Update the selectedScanner with the new data
      const updatedScanner = scanners.value.find(s => s.id === selectedScanner.value?.id);
      if (updatedScanner) {
        selectedScanner.value = updatedScanner;
      }
      
      isEditing.value = false;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update scanner';
  } finally {
    isUpdating.value = false;
  }
};

const addKeyword = () => {
  keywords.value.push('');
};

const removeKeyword = (index: number) => {
  keywords.value.splice(index, 1);
};

const saveKeywords = async () => {
  if (!selectedScanner.value) return;
  
  isSavingKeywords.value = true;
  
  try {
    // Filter out empty keywords
    const filteredKeywords = keywords.value.filter(k => k.trim() !== '');
    await updateKeywords(selectedScanner.value.id, filteredKeywords);
    successMessage.value = 'Keywords updated successfully';
    isEditingKeywords.value = false;
  } catch (err: any) {
    error.value = err.message || 'Failed to update keywords';
  } finally {
    isSavingKeywords.value = false;
  }
};
</script>

<style scoped>
/* Add this to match the home background color */
:deep(body), :deep(html) {
  background-color: black;
}
</style> 