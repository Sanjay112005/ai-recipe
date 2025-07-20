// In server/controllers/aiController.js
require("dotenv").config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fetchRecipeImage = require("../utils/fetchImage");

const generateRecipeFromAI = async (req, res) => {
  const { ingredients, dietary, cuisine, cookingTime, servings } = req.body;

  if (!ingredients) {
    return res.status(400).json({ message: "Ingredients are required." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // --- FIX: Enable JSON Mode and use the correct model name ---
    const model = genAI.getGenerativeModel({
    
model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const preferences = [
      dietary && `Dietary: ${dietary}`,
      cuisine && `Cuisine: ${cuisine}`,
      cookingTime && `Cooking Time: around ${cookingTime} minutes`,
      servings && `Servings: ${servings} people`
    ].filter(Boolean).join(", ");

    const prompt = `Create a detailed recipe using these ingredients: ${ingredients}.
Preferences: ${preferences || "none"}.
Return a JSON object with this exact structure:
{
  "title": "string",
  "description": "string (50-70 words)",
  "cookingTime": "string (e.g., '30 minutes')",
  "servings": "string (e.g., '4 servings')",
  "ingredients": ["string"],
  "instructions": ["string"],
  "nutritionInfo": {
    "calories": "string",
    "protein": "string",
    "carbs": "string",
    "fat": "string"
  }
}
`;

   const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedRecipe = JSON.parse(text);

    // Fetch the image and provide a fallback if none is found
    const imageUrl = await fetchRecipeImage(parsedRecipe.title);
    const image = imageUrl || null; // Ensure image is null if not found

    return res.status(200).json({ ...parsedRecipe, image });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      message: "An error occurred while generating the recipe.",
      error: error.message,
    });
  }
};

module.exports = { generateRecipeFromAI };