//controller for enhancing a resumes professional summary 

import openai from "../configs/ai.js";
import Resume from "../models/resumeModel.js";


//post:/api/ai/enhance-pro-sum
export const enhanceProSummary = async (req, res) => {  
    try {
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({ message: 'Please enter all fields' });
        
        }

        const response = await openai.chat.completions.create({
           
        model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: `You are an expert resume writer and career coach.

Task:
Rewrite and enhance the professional summary below while preserving the original meaning.

Strict Rules:
- Improve sentence structure, clarity, and impact
- Make it ATS-friendly
- Use strong but realistic action verbs
- Do NOT add new skills, tools, companies, or years of experience
- Do NOT exaggerate or invent achievements
- Keep it professional and concise (2–4 sentences)
- Write in third person only (no "I", "me", "my")
- Avoid buzzwords and filler phrases

Output Instructions:
- Return ONLY the enhanced professional summary
- Do NOT include explanations, headings, or bullet points` },
                {
                    role: "user",
                    content: `Professional Summary:\n"""\n${userContent}\n"""`,
                },
            ],
})

      const enhancedcontent = response.choices[0].message.content;
      return res.status(200).json({ enhancedcontent });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// controller for resumes job description
//post : /api/ai/enhance-job-desc

export const enhancejobdescription = async (req, res) => {  
    try {
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({ message: 'Please enter all fields' });
        
        }

        const response = await openai.chat.completions.create({
           
        model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", 
                content: "your are an expert in resume writing . your task is to enhance the job description of a resume .The job description should be 1-2 sentences also highlighting key responsibilities and achievements . Use Action words and quantifiable results where possible. Make it  ATS - friendly and only return text no options or any anything else ." },
                {
                    role: "user",
                    content: userContent,
                },
            ],
})

      const enhancedcontent = response.choices[0].message.content;
      return res.status(200).json({ enhancedcontent });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//controller for uploading a resume to the database
//post :/api/ai/uplaod-resume

export const uploadResume= async (req, res) => {  
    try {
        
        const { resumeText , title} = req.body;
        const userId = req.userId;

        if(!resumeText ){
            return res.status(400).json({message: 'Please enter all fields'});
        }

        const systemPrompt = "you are an expert AI Agent to extract data from resume."
        const userPrompt = `extract data from this resume :${resumeText}
        provide data in the following JSON format with no 
        additional text before or after:
        {
        professionalSummary: {
      type: String
    },
    skills: [String],
    personalInfo: {
      image: String,
      fullName: String,
      profession: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String
    },
    projects: [
      {
        name: String,
        type: String,
        description: String
      }
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduationDate: String,
        gpa: String
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
        isCurrent: Boolean
      }
    ]
  },
        }
        `;
        

        const response = await openai.chat.completions.create({
           
        model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system",
                     content: systemPrompt },
                {
                    role: "user",
                    content:userPrompt,
                },
            ],
            response_format: { type: "json_object" },
})

      const extractedData= response.choices[0].message.content;
      const parsedData = JSON.parse(extractedData);
      const newResume = await Resume.create({
        userId , title , ...parsedData
      });
      res.json({resumeId: newResume._id});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}