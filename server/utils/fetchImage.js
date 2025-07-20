const axios = require("axios");

const fetchRecipeImage = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.small; // or .regular for higher res
    } else {
      return null; // no image found
    }
  } catch (error) {
    console.error("Image Fetch Error:", error.message);
    return null;
  }
};

module.exports = fetchRecipeImage;
