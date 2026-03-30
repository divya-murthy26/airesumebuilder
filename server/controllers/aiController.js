// controller for enhancing a resumes professional summary 

import genAI from "../configs/ai.js";
import Resume from "../models/resumeModel.js";

// Simple error handler
const handleAIError = (error, res) => {
    console.error("Gemini Error:", error);
    return res.status(500).json({ 
        message: error.message || "AI service error"
    });
};


// ✅ enhance professional summary
export const enhanceProSummary = async (req, res) => {  
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL,
        });

        const prompt = `
You are an expert resume writer and career coach.

Rewrite and enhance the professional summary while preserving meaning.

Rules:
- Improve clarity and impact
- ATS-friendly
- No fake info
- 2–4 sentences
- Third person only
- Return only final text

Professional Summary:
${userContent}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedcontent = response.text();

        if (!enhancedcontent) {
            return res.status(500).json({ message: "AI returned empty response" });
        }

        return res.status(200).json({ enhancedcontent });

    } catch (error) {
        return handleAIError(error, res);
    }
};


// ✅ enhance job description
export const enhancejobdescription = async (req, res) => {  
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL,
        });

        const prompt = `
Enhance this resume job description into 1-2 strong, impactful sentences.

Use:
- Action verbs
- Measurable impact
- ATS-friendly tone

Return only final text.

Job Description:
${userContent}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedcontent = response.text();

        if (!enhancedcontent) {
            return res.status(500).json({ message: "AI returned empty response" });
        }

        return res.status(200).json({ enhancedcontent });

    } catch (error) {
        return handleAIError(error, res);
    }
};


// ✅ upload resume + AI parsing
export const uploadResume = async (req, res) => {  
    try {
        const { resumeText, title } = req.body;
        const userId = req.user._id;

        if (!resumeText) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL,
        });

        const prompt = `
Extract structured data from this resume:

${resumeText}

Return ONLY valid JSON. No explanations. No markdown.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            return res.status(500).json({ message: "AI returned empty JSON" });
        }

        // Safe parsing
        const parseAI = (text) => {
            try {
                let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(clean);
            } catch {
                return null;
            }
        };

        const parsedData = parseAI(text);

        if (!parsedData) {
            throw new Error("AI failed to generate valid JSON");
        }

        const newResume = await Resume.create({
            userId,
            title: title || "AI Imported Resume",
            ...parsedData
        });

        res.json({ resumeId: newResume._id });

    } catch (error) {
        return handleAIError(error, res);
    }
};