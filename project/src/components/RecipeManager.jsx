import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Edit, Trash2, Clock, Users, Plus, X, Save } from 'lucide-react';
import { recipeAPI } from '../utils/api';

const RecipeManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: '',
    servings: '',
    cuisine: '',
    dietary: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      // FIX: The API now returns the data array directly.
      const fetchedRecipes = await recipeAPI.getRecipes();
      setRecipes(fetchedRecipes || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    // This function doesn't rely on a return value, so it's okay.
    try {
      await recipeAPI.deleteRecipe(recipeId);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
      if (selectedRecipe?._id === recipeId) setSelectedRecipe(null);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title || '',
      description: recipe.description || '',
      ingredients: recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients : [''],
      instructions: recipe.instructions && recipe.instructions.length > 0 ? recipe.instructions : [''],
      cookingTime: recipe.cookingTime || '',
      servings: recipe.servings || '',
      cuisine: recipe.cuisine || '',
      dietary: recipe.dietary || ''
    });
  };

  const handleSave = async () => {
    try {
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing && ing.trim()),
        instructions: formData.instructions.filter(inst => inst && inst.trim())
      };

      if (editingRecipe) {
        // FIX: The API now returns the updated recipe object directly.
        const updatedRecipe = await recipeAPI.updateRecipe(editingRecipe._id, cleanedData);
        setRecipes(recipes.map(recipe => 
          recipe._id === editingRecipe._id ? updatedRecipe : recipe
        ));
        setSelectedRecipe(updatedRecipe);
      } else {
        // FIX: The API now returns the new recipe object directly.
        const newRecipe = await recipeAPI.saveRecipe(cleanedData);
        setRecipes([...recipes, newRecipe]);
        setSelectedRecipe(newRecipe);
      }

      setEditingRecipe(null);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      ingredients: [''],
      instructions: [''],
      cookingTime: '',
      servings: '',
      cuisine: '',
      dietary: ''
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length <= 1) return;
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BookOpen className="w-8 h-8 text-indigo-500 mr-3" />
            My Recipe Collection
          </h1>
          <p className="text-slate-400">Manage your saved recipes</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedRecipe(null);
            setEditingRecipe(null);
            resetForm();
          }}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Recipe
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            placeholder="Search recipes by title or cuisine..."
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl p-6 max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recipes ({filteredRecipes.length})
            </h2>
            
            {filteredRecipes.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                {searchTerm ? 'No recipes found.' : 'No recipes saved yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                      selectedRecipe?._id === recipe._id
                        ? 'bg-indigo-600/20 border-indigo-500'
                        : 'bg-slate-700 border-transparent hover:bg-slate-600'
                    }`}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setShowAddForm(false);
                      setEditingRecipe(null);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{recipe.title}</h3>
                        {recipe.cuisine && (
                          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                            {recipe.cuisine}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(recipe);
                            setSelectedRecipe(null);
                          }}
                          className="text-slate-400 hover:text-indigo-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(recipe._id);
                          }}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingRecipe || showAddForm ? (
            <RecipeForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={() => {
                setEditingRecipe(null);
                setShowAddForm(false);
                resetForm();
              }}
              isEditing={!!editingRecipe}
              handleArrayChange={handleArrayChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          ) : selectedRecipe ? (
            <RecipeDetails recipe={selectedRecipe} />
          ) : (
            <div className="bg-slate-800 rounded-xl p-6 text-center h-full flex flex-col justify-center">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Select a recipe to view details or add a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RecipeDetails = ({ recipe }) => (
  <div className="bg-slate-800 rounded-xl p-6">
    {recipe.image && (
      <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-6" />
    )}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-2">{recipe.title}</h2>
      {recipe.description && (
        <p className="text-slate-300">{recipe.description}</p>
      )}
    </div>

    <div className="flex flex-wrap gap-4 mb-6 text-sm">
      {recipe.cookingTime && (
        <div className="flex items-center text-slate-300">
          <Clock className="w-4 h-4 mr-1" />
          {recipe.cookingTime} mins
        </div>
      )}
      {recipe.servings && (
        <div className="flex items-center text-slate-300">
          <Users className="w-4 h-4 mr-1" />
          {recipe.servings} servings
        </div>
      )}
      {recipe.cuisine && (
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
          {recipe.cuisine}
        </span>
      )}
      {recipe.dietary && (
        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
          {recipe.dietary}
        </span>
      )}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index} className="text-slate-300 flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
        <ol className="space-y-3">
          {recipe.instructions?.map((instruction, index) => (
            <li key={index} className="text-slate-300 flex">
              <span className="bg-indigo-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);

const RecipeForm = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isEditing,
  handleArrayChange,
  addArrayItem,
  removeArrayItem
}) => (
  <div className="bg-slate-800 rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-white">
        {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
      </h2>
      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>

    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
          placeholder="Recipe Title *"
          required
        />
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
          placeholder="Brief description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Ingredients *</label>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="e.g., 2 cups flour"
              />
              <button type="button" onClick={() => removeArrayItem('ingredients', index)} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('ingredients')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Ingredient
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Instructions *</label>
        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="bg-indigo-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mt-1 flex-shrink-0">{index + 1}</span>
              <textarea
                value={instruction}
                onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                rows={2}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Describe this cooking step..."
              />
              <button type="button" onClick={() => removeArrayItem('instructions', index)} className="text-red-400 hover:text-red-300 mt-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('instructions')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Step
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RecipeManager;
