// server/services/aiService.js
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * מנתח טקסט של משרה באמצעות LLM.
 * @param {string} jobDescription - טקסט המשרה שנסרק.
 * @returns {Promise<object|null>} - אובייקט עם המידע המנותח.
 */
async function analyzeJobDescription(jobDescription) {
  if (!jobDescription || jobDescription.length < 100) return null;
  console.log('🧠 Analyzing job description with OpenAI...');

  // ההנחיה (Prompt) המשופרת
  const prompt = `
    Analyze the job description text provided below.
    Extract the official and most relevant Job Title and all key information.
    Summarize the role using a maximum of 3 sentences.
    Return the result in a strict JSON format matching the schema exactly.

    Text to analyze:
    ---
    ${jobDescription}
    ---

    Required JSON Output Schema:
    1. positionTitle: The official title of the job (e.g., "Junior Software Engineer").
    2. aiSummaryRole: A short summary (max 3 sentences) of the core responsibilities and team focus.
    3. aiSummaryTech: A short summary (max 2 sentences) of the main required technologies and stack.
    4. aiLevel: The required experience level. Choose one from: "Junior", "Mid", "Senior", "Lead", "Manager". If not clear, default to "Mid".
    5. aiJobType: The primary function type. Choose one from: "Backend", "Full-stack", "Data", "DevOps", "Mobile", "QA".
    6. aiTags: An array of up to 10 key technologies, programming languages, and frameworks mentioned as MUST or REQUIRED skills. Example: ["Python", "FastAPI", "MongoDB", "SQL", "TypeScript"].

    The output MUST be only the raw JSON object, without any surrounding text or markdown.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // מודל מומלץ לדיוק בחילוץ JSON
      messages: [
        { 
          role: "system", 
          content: "You are an expert HR assistant. Your task is to analyze job postings and output only a raw JSON object based on the required schema." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, 
      response_format: { type: "json_object" } 
    });

    const jsonText = response.choices[0].message.content.trim();
    const cleanJson = jsonText.replace(/```json\s*|```/g, '').trim();

    const result = JSON.parse(cleanJson);
    
    // מוודאים שטקסט המקור המלא נשמר
    result.description = jobDescription;

    console.log('✅ AI Analysis successful. Extracted keys:', Object.keys(result));
    return result;

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    return null; 
  }
}

module.exports = {
  analyzeJobDescription,
};