const BASE_URL = 'https://ai-recipe-eight.vercel.app/';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API requests
const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: getAuthHeaders(),
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    
    return { data: await response.json() };
  },

  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    
    return { data: await response.json() };
  }
};

// AI Recipe Generation API
export const aiAPI = {
  generateRecipe: async (preferences) => {
    try {
      const data = await apiRequest('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  }
};

// Recipe Management API
export const recipeAPI = {
  saveRecipe: async (recipeData) => {
    try {
      const data = await apiRequest('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  getRecipes: async () => {
    try {
      const data = await apiRequest('/api/recipes');
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  updateRecipe: async (id, recipeData) => {
    try {
      const data = await apiRequest(`/api/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(recipeData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  deleteRecipe: async (id) => {
    try {
      const data = await apiRequest(`/api/recipes/${id}`, {
        method: 'DELETE'
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  }
};

// Meal Planner API
export const plannerAPI = {
  getMealPlans: async () => {
    try {
      const data = await apiRequest('/api/planner');
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  addMealPlan: async (planData) => {
    try {
      const data = await apiRequest('/api/planner', {
        method: 'POST',
        body: JSON.stringify(planData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  updateMealPlan: async (id, planData) => {
    try {
      const data = await apiRequest(`/api/planner/${id}`, {
        method: 'PUT',
        body: JSON.stringify(planData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  deleteMealPlan: async (id) => {
    try {
      const data = await apiRequest(`/api/planner/${id}`, {
        method: 'DELETE'
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  }
};

// Shopping List API
export const shoppingAPI = {
  getShoppingList: async () => {
    try {
      const data = await apiRequest('/api/shopping');
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  addItem: async (itemData) => {
    try {
      const data = await apiRequest('/api/shopping', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const data = await apiRequest(`/api/shopping/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  },


toggleItemDone: async (id) => {
  try {
    const data = await apiRequest(`/api/shopping/${id}/toggle`, { 
      method: 'PATCH'
    });
    return { data };
  } catch (error) {
    throw { response: { data: { message: error.message } } };
  }
},

  deleteItem: async (id) => {
    try {
      const data = await apiRequest(`/api/shopping/${id}`, {
        method: 'DELETE'
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  }
};

// Pantry API (if needed for future features)
export const pantryAPI = {
  updatePantry: async (pantryData) => {
    try {
      const data = await apiRequest('/api/pantry', {
        method: 'POST',
        body: JSON.stringify(pantryData)
      });
      return { data };
    } catch (error) {
      throw { response: { data: { message: error.message } } };
    }
  }
};
