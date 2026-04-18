const genai = require("@google/genai");

const askPrompt = async (req, res) => {
    try {
        const { prompt } = req.body;
        const finalPrompt = `
You are an expense categorization assistant.

Given an expense description, classify it into ONE of the following categories ONLY:
Food, Travel, Shopping, Entertainment, Bills, Health, Education, Rent, Groceries, Other.

Expense description: "${prompt}"

Respond with ONLY the category name. No explanation.
  `;
        // The client gets the API key from the environment variable `GEMINI_API_KEY`.
        const ai = new genai.GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: finalPrompt,
        });
        res.status(200).send({ message: "Category is fetched successfully", suggest_category:response.text })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

module.exports = { askPrompt };