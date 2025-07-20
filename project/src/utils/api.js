// Use an environment variable for the base URL, with a fallback for local development.
// This aligns with the best practice in the Vercel deployment guide.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-recipe-eight.vercel.app';

// Helper function to get auth headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Central helper function to handle all API requests
const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: getAuthHeaders(),
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    // Throw a consistent error object that the components can handle
    throw { response: { data: errorData } };
  }

  // Return the JSON data directly
  return response.json();
};

// --- All APIs now use the central apiRequest helper for consistency ---

// Authentication API
export const authAPI = {
  // FIX: Refactored to use the apiRequest helper.
  // This ensures consistent error handling and header management.
  register: (name, email, password) => apiRequest('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  login: (email, password) => apiRequest('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
};

// AI Recipe Generation API
export const aiAPI = {
  generateRecipe: (preferences) => apiRequest('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify(preferences)
  })
};

// Recipe Management API
export const recipeAPI = {
  saveRecipe: (recipeData) => apiRequest('/api/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData)
  }),
  getRecipes: () => apiRequest('/api/recipes'),
  updateRecipe: (id, recipeData) => apiRequest(`/api/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipeData)
  }),
  deleteRecipe: (id) => apiRequest(`/api/recipes/${id}`, {
    method: 'DELETE'
  })
};

// Meal Planner API
export const plannerAPI = {
  getMealPlans: () => apiRequest('/api/planner'),
  addMealPlan: (planData) => apiRequest('/api/planner', {
    method: 'POST',
    body: JSON.stringify(planData)
  }),
  updateMealPlan: (id, planData) => apiRequest(`/api/planner/${id}`, {
    method: 'PUT',
    body: JSON.stringify(planData)
  }),
  deleteMealPlan: (id) => apiRequest(`/api/planner/${id}`, {
    method: 'DELETE'
  })
};

// Shopping List API
export const shoppingAPI = {
  getShoppingList: () => apiRequest('/api/shopping'),
  addItem: (itemData) => apiRequest('/api/shopping', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),
  updateItem: (id, itemData) => apiRequest(`/api/shopping/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),
  toggleItemDone: (id) => apiRequest(`/api/shopping/${id}/toggle`, {
    method: 'PATCH'
  }),
  deleteItem: (id) => apiRequest(`/api/shopping/${id}`, {
    method: 'DELETE'
  })
};

// Pantry API (if needed for future features)
export const pantryAPI = {
  updatePantry: (pantryData) => apiRequest('/api/pantry', {
    method: 'POST',
    body: JSON.stringify(pantryData)
  })
};
