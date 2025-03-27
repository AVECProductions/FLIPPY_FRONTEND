import axios from 'axios';
import type { Scanner } from '@/types';

// Environment-based configuration
const getApiUrl = () => {
  // Check if we're in production by looking at the current URL
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // Return production API URL (use your actual domain)
    return 'https://flippy-production-9afd.up.railway.app/api'; // Relative URL for same-domain deployment
    // Or return absolute URL if API is on a different domain:
    // return 'https://api.yourapp.com/api';
  } else {
    // Return development API URL
    return 'http://localhost:8000/api';
  }
};

const getAuthUrl = () => {
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    return 'https://flippy-production-9afd.up.railway.app/auth'; // Relative URL for same-domain deployment
    // Or return absolute URL if API is on a different domain:
    // return 'https://api.yourapp.com/auth';
  } else {
    return 'http://localhost:8000/auth';
  }
};

// Set dynamic API URLs
const API_URL = getApiUrl();
const AUTH_URL = getAuthUrl();

// Create an axios instance with dynamic baseURL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create auth client instance with dynamic baseURL
const authClient = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include the token in all API requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add request interceptor for authClient too
authClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication functions
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await authClient.post('/jwt/create/', { username, password });
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return { success: true, token: access };
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Try a different approach for the problematic endpoint
    const response = await axios.get(`${AUTH_URL}/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Try Bearer format instead of JWT
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Try alternative format if first attempt fails
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${AUTH_URL}/users/me/`, {
        headers: {
          'Authorization': `JWT ${token}`, // Try JWT format as fallback
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (secondError) {
      console.error('Second attempt failed:', secondError);
      // Don't throw the error - just return an empty profile instead
      return { username: localStorage.getItem('user_name') || 'User' };
    }
  }
};

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    
    if (!refresh) {
      throw new Error('No refresh token found');
    }
    
    const response = await authClient.post('/jwt/refresh/', { refresh });
    const { access } = response.data;
    
    // Store new access token
    localStorage.setItem('access_token', access);
    
    return { success: true, token: access };
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_name');
  
  // Dispatch event to notify App.vue about logout
  window.dispatchEvent(new CustomEvent('auth-event', { 
    detail: { action: 'logout' } 
  }));
  
  return { success: true };
};

// Scanner API functions
export const getScanners = async (): Promise<Scanner[]> => {
  try {
    console.log('Fetching scanners from:', `${API_URL}/scanners/`);
    const response = await apiClient.get('/scanners/');
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching scanners:', error);
    return [];
  }
};

export const createScanner = async (scanner: Omit<Scanner, 'id'>): Promise<Scanner | null> => {
  try {
    const response = await apiClient.post('/scanners/', scanner);
    return response.data;
  } catch (error) {
    console.error('Error creating scanner:', error);
    return null;
  }
};

export const updateScanner = async (id: number, scanner: Partial<Scanner>): Promise<Scanner | null> => {
  try {
    const response = await apiClient.patch(`/scanners/${id}/`, scanner);
    return response.data;
  } catch (error) {
    console.error(`Error updating scanner ${id}:`, error);
    return null;
  }
};

export const deleteScanner = async (id: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/scanners/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting scanner ${id}:`, error);
    return false;
  }
};

export const toggleScannerStatus = async (id: number, currentStatus: string): Promise<Scanner | null> => {
  const newStatus = currentStatus === 'running' ? 'stopped' : 'running';
  return updateScanner(id, { status: newStatus });
};

/**
 * Fetches keywords associated with a specific scanner
 * @param scannerId The ID of the scanner to fetch keywords for
 * @returns Array of keyword strings or empty array on error
 */
export const getKeywordsByScanner = async (scannerId: number): Promise<string[]> => {
  try {
    const response = await apiClient.get('/keywords/by-scanner/', {
      params: { scannerId }
    });
    
    // Extract just the keyword text from each keyword object
    if (Array.isArray(response.data)) {
      return response.data.map(item => 
        typeof item === 'object' && item !== null ? (item.keyword || '') : item
      );
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching keywords for scanner ${scannerId}:`, error);
    return [];
  }
};

/**
 * Updates keywords in bulk for a specific scanner
 * @param scannerId The ID of the scanner to update keywords for
 * @param keywords Array of keyword strings
 * @returns Updated keywords array or empty array on error
 */
export const updateKeywords = async (scannerId: number, keywords: string[]): Promise<any[]> => {
  try {
    const response = await apiClient.post('/keywords/bulk-update/', {
      scannerId,
      keywords
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating keywords for scanner ${scannerId}:`, error);
    return [];
  }
};

// Listing API functions
export interface ListingFilters {
  query?: string;
  category?: string;
  scanner_location?: string;
  min_price?: number | null;
  max_price?: number | null;
  watchlist?: boolean;
  max_distance?: number | null;
  page?: number;
  limit?: number;
}

export const getListings = async (page = 1, limit = 20, filters: ListingFilters = {}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters.query) params.append('query', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.scanner_location) params.append('scanner_location', filters.scanner_location);
    if (filters.min_price !== null && filters.min_price !== undefined) 
      params.append('min_price', filters.min_price.toString());
    if (filters.max_price !== null && filters.max_price !== undefined) 
      params.append('max_price', filters.max_price.toString());
    if (filters.max_distance !== null && filters.max_distance !== undefined)
      params.append('max_distance', filters.max_distance.toString());
    if (filters.watchlist) params.append('watchlist', 'true');
    
    console.log('Applying filters:', params.toString());
    
    const response = await apiClient.get('/listings/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

/**
 * Gets filter options for listings
 * @returns Available filter options including queries, categories, and scanner locations
 */
export const getFilterOptions = async (): Promise<{
  queries: string[];
  categories: string[];
  scanner_locations: string[];
}> => {
  try {
    const response = await apiClient.get('/listings/filter_options/');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { queries: [], categories: [], scanner_locations: [] };
  }
};

/**
 * Toggles a listing's watchlist status
 * @param listingId The ID of the listing to toggle
 * @param currentStatus The current watchlist status
 * @returns Updated listing data or null on error
 */
export const toggleWatchlist = async (listingId: string | number, currentStatus: boolean): Promise<any> => {
  try {
    const response = await apiClient.patch(`/listings/${listingId}/`, {
      watchlist: !currentStatus
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling watchlist for listing ${listingId}:`, error);
    return null;
  }
};