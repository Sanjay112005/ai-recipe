import React from 'react';
import { 
  ChefHat, 
  Sparkles, 
  Calendar, 
  ShoppingCart, 
  Brain, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Check
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const HomePage = ({ onGetStarted, onLogin }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI Recipe Generation',
      description: 'Generate personalized recipes using advanced AI based on your ingredients and preferences.'
    },
    {
      icon: Calendar,
      title: 'Visual Meal Planning',
      description: 'Plan your meals with an intuitive calendar interface for better organization.'
    },
    {
      icon: ShoppingCart,
      title: 'Smart Shopping Lists',
      description: 'Auto-generate grocery lists from your meal plans and recipes.'
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Reduce meal planning time from hours to minutes with intelligent automation.'
    },
    {
      icon: Users,
      title: 'Family-Friendly',
      description: 'Plan meals for any family size with customizable serving portions.'
    },
    {
      icon: Star,
      title: 'Recipe Management',
      description: 'Save, organize, and manage your favorite recipes in one place.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Input Your Preferences',
      description: 'Tell us about your dietary preferences, available ingredients, and cooking time.'
    },
    {
      step: '02',
      title: 'AI Generates Recipes',
      description: 'Our AI creates personalized recipes tailored to your specific needs and tastes.'
    },
    {
      step: '03',
      title: 'Plan Your Meals',
      description: 'Use our visual calendar to plan meals for the week or month ahead.'
    },
    {
      step: '04',
      title: 'Auto-Generate Lists',
      description: 'Get smart shopping lists automatically created from your meal plans.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Busy Mom of 3',
      content: 'SmartMeal has transformed our family dinners. The AI suggestions are spot-on and save me hours of planning!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Professional Chef',
      content: 'Even as a chef, I use SmartMeal for home cooking. The recipe variations and meal planning features are incredible.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Health Enthusiast',
      content: 'Perfect for maintaining my dietary goals. The AI understands my restrictions and creates amazing healthy recipes.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar onGetStarted={onGetStarted} onLogin={onLogin} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-700/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-indigo-600/20 p-4 rounded-full">
                <ChefHat className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AI-Powered Meal Planning
              <br />
              <span className="text-indigo-400">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Transform your cooking experience with intelligent recipe generation, visual meal planning, 
              and automated grocery lists. Let AI handle the planning while you enjoy the cooking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Start Planning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-slate-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for
              <span className="text-indigo-400"> Smart Meal Planning</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover powerful features designed to make meal planning effortless and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="bg-indigo-600/20 p-3 rounded-lg w-fit mb-6">
                    <Icon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-indigo-400">Works</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get started with SmartMeal in just four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-indigo-400">Users Say</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their meal planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-800 p-8 rounded-xl border border-slate-700"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple <span className="text-indigo-400">Pricing</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the plan that works best for your meal planning needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Free</h3>
              <div className="text-3xl font-bold mb-6">
                $0<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>5 AI recipes per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Basic meal planning</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Shopping list creation</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full border border-slate-600 hover:border-slate-500 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 p-8 rounded-xl border border-indigo-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <div className="text-3xl font-bold mb-6">
                $9.99<span className="text-lg text-indigo-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-white mr-3" />
                  <span>Unlimited AI recipes</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-white mr-3" />
                  <span>Advanced meal planning</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-white mr-3" />
                  <span>Smart shopping lists</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-white mr-3" />
                  <span>Nutritional analysis</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-white text-indigo-600 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
              >
                Start Free Trial
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Premium</h3>
              <div className="text-3xl font-bold mb-6">
                $19.99<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Family meal planning</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Pantry management</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full border border-slate-600 hover:border-slate-500 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Meal Planning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have already revolutionized their cooking experience with AI-powered meal planning.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;