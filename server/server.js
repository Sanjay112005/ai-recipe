// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const shoppingRoutes = require("./routes/shoppingRoutes");
const plannerRoutes = require('./routes/plannerRoutes');

// Import database connection
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


app.use('/api/users', authRoutes);        
app.use('/api/pantry', pantryRoutes);     
app.use('/api/recipes', recipeRoutes);     
app.use('/api/ai', aiRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use('/api/planner', plannerRoutes);
// app.use('/api/recipes/generate', aiRoutes);

// Optional: Global error handler
// const { errorHandler } = require('./middleware/errorHandler');
// app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
