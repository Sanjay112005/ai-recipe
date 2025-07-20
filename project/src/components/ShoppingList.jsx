import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, X, Trash2, Edit } from 'lucide-react';
import { shoppingAPI } from '../utils/api';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      // FIX: The API now returns the data array directly.
      const fetchedItems = await shoppingAPI.getShoppingList();
      setItems(fetchedItems || []);
    } catch (error) {
      console.error('Failed to fetch shopping list:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    try {
      // FIX: The API now returns the new item object directly.
      const newItemData = await shoppingAPI.addItem(newItem);
      setItems([...items, newItemData]);
      setNewItem({ name: '', quantity: '', category: '' });
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleToggleDone = async (itemToToggle) => {
    const newBoughtStatus = !itemToToggle.bought;
    const originalItems = [...items];

    // Optimistic update for a faster UI response
    setItems(items.map(item => 
      item._id === itemToToggle._id ? { ...item, bought: newBoughtStatus } : item
    ));

    try {
      // FIX: The API now returns the updated item object directly.
      const updatedItem = await shoppingAPI.toggleItemDone(itemToToggle._id);
      setItems(items.map(item => 
        item._id === itemToToggle._id ? updatedItem : item
      ));
    } catch (error) {
      console.error('Failed to toggle item:', error);
      setItems(originalItems); // Revert on error
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingAPI.deleteItem(itemId);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({
      _id: item._id,
      name: item.name,
      quantity: item.quantity || '',
      category: item.category || ''
    });
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      // FIX: The API now returns the updated item object directly.
      const updatedItemData = await shoppingAPI.updateItem(editingItem._id, {
        name: editingItem.name,
        quantity: editingItem.quantity,
        category: editingItem.category
      });
      setItems(items.map(item => 
        item._id === editingItem._id ? updatedItemData : item
      ));
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return !item.bought;
    if (filter === 'completed') return item.bought;
    return true;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  const completedCount = items.filter(item => item.bought).length;
  const totalCount = items.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <ShoppingCart className="w-8 h-8 text-indigo-500 mr-3" />
          Shopping List
        </h1>
        <p className="text-slate-400">
          Manage your grocery shopping list
        </p>
        
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{completedCount} of {totalCount} items completed</span>
              <span>{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Form */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Item</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="Item name"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
          </div>
          
          <div>
            <input
              type="text"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
              placeholder="Quantity"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
          </div>
          
          <div>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
            >
              <option value="">Category</option>
              <option value="Produce">Produce</option>
              <option value="Meat & Seafood">Meat & Seafood</option>
              <option value="Dairy">Dairy</option>
              <option value="Pantry">Pantry</option>
              <option value="Frozen">Frozen</option>
              <option value="Bakery">Bakery</option>
              <option value="Beverages">Beverages</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddItem}
          disabled={!newItem.name.trim()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { key: 'all', label: 'All Items', count: totalCount },
          { key: 'pending', label: 'Pending', count: totalCount - completedCount },
          { key: 'completed', label: 'Completed', count: completedCount }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Shopping List */}
      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {filter === 'all' 
                ? 'Your shopping list is empty. Add some items above!'
                : `No ${filter} items found.`
              }
            </p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                {category}
                <span className="ml-2 bg-slate-600 text-slate-300 text-sm px-2 py-1 rounded">
                  {categoryItems.length}
                </span>
              </h3>
              
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item._id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      item.bought 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => handleToggleDone(item)}
                        className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          item.bought
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-500 hover:border-green-500'
                        }`}
                      >
                        {item.bought && <Check className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          item.bought ? 'text-green-400 line-through' : 'text-white'
                        }`}>
                          {item.name}
                        </div>
                        {item.quantity && (
                          <div className="text-sm text-slate-400">{item.quantity}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Edit Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                >
                  <option value="">Select category</option>
                  <option value="Produce">Produce</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateItem}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Update Item
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
