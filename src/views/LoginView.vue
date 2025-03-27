<template>
  <div class="login-container flex items-center justify-center">
    <div class="max-w-md w-full bg-[#2C2C2E] p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-white">
          Sign in to FlippyBot
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Access your scanners and marketplace listings
        </p>
      </div>
      
      <div v-if="error" class="mt-6 bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-md">
        {{ error }}
      </div>
      
      <form class="mt-8" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Email or Username</label>
            <input 
              id="username" 
              v-model="credentials.username" 
              name="username" 
              type="text" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] placeholder-gray-500 text-[#F3F4F6] rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Email or Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input 
              id="password" 
              v-model="credentials.password" 
              name="password" 
              type="password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 bg-[#1C1C1E] border border-[#3F3F46] placeholder-gray-500 text-[#F3F4F6] rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="mt-6">
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>
              Sign in
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, getUserProfile } from '@/services/api';

const router = useRouter();
const credentials = ref({
  username: '',
  password: ''
});
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Step 1: Login and get token
    const loginResult = await loginUser(credentials.value.username, credentials.value.password);
    console.log('Login successful, token received');
    
    // Store username directly in case profile fetch fails
    localStorage.setItem('user_name', credentials.value.username);
    
    try {
      // Step 2: Get user profile
      const userProfile = await getUserProfile();
      console.log('User profile retrieved:', userProfile);
      
      // Update username if we got a profile
      if (userProfile && userProfile.username) {
        localStorage.setItem('user_name', userProfile.username);
      }
    } catch (profileError) {
      console.error('Failed to get user profile, but continuing login:', profileError);
      // Login continues even if profile fetch fails
    }
    
    // Notify App component about successful login
    window.dispatchEvent(new CustomEvent('auth-event', { 
      detail: { action: 'login' } 
    }));
    
    // Redirect to scanners page
    router.push('/scanners');
  } catch (err: any) {
    console.error('Login error:', err);
    
    if (err.response) {
      // Handle specific API error responses
      if (err.response.status === 401) {
        error.value = 'Invalid credentials. Please check your username and password.';
      } else if (err.response.data) {
        // Extract error message from response if available
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // If error is an object with specific field errors
          const errorMessages = Object.values(errorData)
            .map(msgs => Array.isArray(msgs) ? msgs.join('. ') : msgs)
            .join('. ');
          error.value = errorMessages || 'Authentication failed';
        } else {
          error.value = String(errorData);
        }
      } else {
        error.value = `Authentication failed (${err.response.status})`;
      }
    } else if (err.request) {
      // Network error
      error.value = 'Network error. Please check your connection.';
    } else {
      // Default error
      error.value = err.message || 'Failed to login';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 64px; /* Height of the header */
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transform: translateY(-20px); /* Slight upward shift */
}
</style> 