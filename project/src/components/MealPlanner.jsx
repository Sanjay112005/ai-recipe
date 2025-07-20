import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { plannerAPI, recipeAPI } from '../utils/api';

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    mealType: 'breakfast',
    recipeId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both in parallel for faster loading
    Promise.all([fetchMealPlans(), fetchRecipes()]).then(() => {
      setLoading(false);
    });
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await plannerAPI.getMealPlans();
      // FIX: Expect a direct array from the API
      setMealPlans(response.data || []);
    } catch (error) {
      console.error('Failed to fetch meal plans:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await recipeAPI.getRecipes();
      // FIX: Expect a direct array from the API
      setRecipes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const handleSave = async () => {
    if (editingPlan) {
      await handleUpdateMeal();
    } else {
      await handleAddMeal();
    }
  };

  const handleAddMeal = async () => {
    try {
      const response = await plannerAPI.addMealPlan(formData);
      // FIX: Expect the new meal plan object directly
      setMealPlans([...mealPlans, response.data]);
      closeForm();
    } catch (error) {
      console.error('Failed to add meal plan:', error);
    }
  };

  const handleUpdateMeal = async () => {
    if (!editingPlan) return;
    try {
      const response = await plannerAPI.updateMealPlan(editingPlan._id, formData);
      // FIX: Expect the updated meal plan object directly
      const updatedPlan = response.data;
      setMealPlans(mealPlans.map(plan => 
        plan._id === editingPlan._id ? updatedPlan : plan
      ));
      closeForm();
    } catch (error) {
      console.error('Failed to update meal plan:', error);
    }
  };

  const handleDeleteMeal = async (planId) => {
    // FIX: Removed window.confirm which blocks execution
    try {
      await plannerAPI.deleteMealPlan(planId);
      setMealPlans(mealPlans.filter(plan => plan._id !== planId));
    } catch (error) {
      console.error('Failed to delete meal plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      mealType: 'breakfast',
      recipeId: '',
      notes: ''
    });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingPlan(null);
    resetForm();
  };

  const openAddForm = (date) => {
    resetForm();
    setFormData({
      ...formData,
      date: date ? date.toISOString().split('T')[0] : ''
    });
    setEditingPlan(null);
    setShowAddForm(true);
  };

  const openEditForm = (plan) => {
    setEditingPlan(plan);
    setFormData({
      date: new Date(plan.date).toISOString().split('T')[0],
      mealType: plan.mealType,
      recipeId: plan.recipe?._id || '',
      notes: plan.notes || ''
    });
    setShowAddForm(true);
  };

  // Calendar utilities
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDate = (date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();
  const getMealsForDate = (date) => mealPlans.filter(plan => isSameDay(new Date(plan.date), date));
  const navigateMonth = (direction) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const mealsForDay = getMealsForDate(date);
      const isToday = isSameDay(date, new Date());

      days.push(
        <div
          key={day}
          className={`h-32 border border-slate-700 p-2 cursor-pointer transition-colors ${
            isToday ? 'bg-indigo-600/20 border-indigo-500' : 'hover:bg-slate-700'
          }`}
          onClick={() => openAddForm(date)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${isToday ? 'text-indigo-400' : 'text-white'}`}>
              {day}
            </span>
            <Plus className="w-4 h-4 text-slate-400 hover:text-white" />
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-20">
            {mealsForDay.map((meal) => (
              <div
                key={meal._id}
                className="bg-slate-600 rounded p-1 text-xs cursor-pointer hover:bg-slate-500 transition-colors group"
                onClick={(e) => { e.stopPropagation(); openEditForm(meal); }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white capitalize">
                      {meal.mealType}
                    </div>
                    <div className="text-slate-300 truncate">
                      {meal.recipe?.title || 'Custom meal'}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMeal(meal._id);
                    }}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

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
            <Calendar className="w-8 h-8 text-indigo-500 mr-3" />
            Meal Planner
          </h1>
          <p className="text-slate-400">Plan your meals for each day</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateMonth(-1)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-white">{formatDate(currentDate)}</h2>
          <button onClick={() => navigateMonth(1)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-slate-400 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {(showAddForm || editingPlan) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">{editingPlan ? 'Edit Meal' : 'Add Meal'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meal Type</label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Recipe</label>
                <select
                  value={formData.recipeId}
                  onChange={(e) => setFormData({ ...formData, recipeId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                >
                  <option value="">Select a recipe</option>
                  {recipes.map((recipe) => (
                    <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Add any notes..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                {editingPlan ? 'Update Meal' : 'Add Meal'}
              </button>
              <button onClick={closeForm} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
