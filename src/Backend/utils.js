import axios from 'axios';

export function chunkText(text, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

// Gemini embedding API
export async function getEmbeddings(text) {
    const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await axios.post(
            `${GEMINI_URL}?key=${apiKey}`,
            {
                model: "models/embedding-001",
                content: {
                    parts: [{ text: text }]
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.embedding.values;
    } catch (error) {
        console.error("Error getting embeddings:", error);
        throw error;
    }
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Generate answer using Gemini
export async function generateAnswer(context, query) {
    const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `Based on the following context, answer the question. If the answer is not in the context, say "I don't have enough information to answer this question."

Context:
${context}

Question: ${query}

Answer:`;

    try {
        const response = await axios.post(
            `${GEMINI_URL}?key=${apiKey}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error generating answer:", error);
        throw error;
    }
}