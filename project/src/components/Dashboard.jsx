import React, { useState } from 'react';
import { ChefHat, Sparkles, BookOpen, Calendar, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import AIRecipeGenerator from './AIRecipeGenerator';
import RecipeManager from './RecipeManager';
import MealPlanner from './MealPlanner';
import ShoppingList from './ShoppingList';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('ai-recipes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'ai-recipes', name: 'AI Recipes', icon: Sparkles },
    { id: 'my-recipes', name: 'My Recipes', icon: BookOpen },
    { id: 'meal-planner', name: 'Meal Planner', icon: Calendar },
    { id: 'shopping-list', name: 'Shopping List', icon: ShoppingCart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-recipes':
        return <AIRecipeGenerator />;
      case 'my-recipes':
        return <RecipeManager />;
      case 'meal-planner':
        return <MealPlanner />;
      case 'shopping-list':
        return <ShoppingList />;
      default:
        return <AIRecipeGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-indigo-500 mr-3" />
              <h1 className="text-xl font-bold text-white">SmartMeal</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left
                        ${activeTab === item.id 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-6 border-t border-slate-700">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <ChefHat className="w-6 h-6 text-indigo-500 mr-2" />
              <span className="text-white font-medium">SmartMeal</span>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;