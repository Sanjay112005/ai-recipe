import React, { useState } from 'react';
import { Sparkles, Clock, Users, ChefHat, Save, Loader2 } from 'lucide-react';
import { aiAPI, recipeAPI } from '../utils/api';

const AIRecipeGenerator = () => {
  const [formData, setFormData] = useState({
    ingredients: '',
    dietary: '',
    cuisine: '',
    cookingTime: '',
    servings: ''
  });
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedRecipe(null);

    try {
      const response = await aiAPI.generateRecipe(formData);
      const recipeData = response.data;

      if (recipeData && recipeData.title) {
        setGeneratedRecipe(recipeData);
      } else {
        throw new Error("Received an invalid recipe format from the server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await recipeAPI.saveRecipe(generatedRecipe);
      setSuccess('Recipe saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Sparkles className="w-8 h-8 text-indigo-500 mr-3" />
          AI Recipe Generator
        </h1>
        <p className="text-slate-400">
          Let AI create personalized recipes based on your preferences and available ingredients
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recipe Preferences</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Available Ingredients
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="e.g., chicken, tomatoes, onions, garlic..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dietary Preferences
                </label>
                <select
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                >
                  <option value="">Any</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Low-Carb</option>
                  <option value="dairy-free">Dairy-Free</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cuisine Type
                </label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                >
                  <option value="">Any</option>
                  <option value="italian">Italian</option>
                  <option value="asian">Asian</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="american">American</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cooking Time
                </label>
                <select
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                >
                  <option value="">Any</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Servings
                </label>
                <select
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                >
                  <option value="">Any</option>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="4">4 people</option>
                  <option value="6">6 people</option>
                  <option value="8">8 people</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Recipe
                </>
              )}
            </button>
          </form>

          {(error || success) && (
            <div className="mt-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                  {success}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Generated Recipe */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Generated Recipe</h2>
            {generatedRecipe && (
              <button
                onClick={handleSaveRecipe}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Recipe
              </button>
            )}
          </div>

          {!generatedRecipe ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Fill out the form and generate a recipe to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* --- FIX: ADDED THIS IMAGE TAG TO DISPLAY THE RECIPE IMAGE --- */}
              {generatedRecipe.image && (
                <img
                  src={generatedRecipe.image}
                  alt={generatedRecipe.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{generatedRecipe.title}</h3>
                <p className="text-slate-300">{generatedRecipe.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {generatedRecipe.cookingTime && (
                  <div className="flex items-center text-slate-300">
                    <Clock className="w-4 h-4 mr-1" />
                    {generatedRecipe.cookingTime}
                  </div>
                )}
                {generatedRecipe.servings && (
                  <div className="flex items-center text-slate-300">
                    <Users className="w-4 h-4 mr-1" />
                    {generatedRecipe.servings}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Ingredients</h4>
                <ul className="space-y-2">
                  {generatedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="text-slate-300 flex items-start">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Instructions</h4>
                <ol className="space-y-3">
                  {generatedRecipe.instructions?.map((instruction, index) => (
                    <li key={index} className="text-slate-300 flex">
                      <span className="bg-indigo-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>

              {generatedRecipe.nutritionInfo && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Nutrition Info</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {Object.entries(generatedRecipe.nutritionInfo).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-slate-400 text-sm capitalize">{key}</div>
                          <div className="text-white font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecipeGenerator;
