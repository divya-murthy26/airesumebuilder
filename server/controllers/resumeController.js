import Resume from '../models/resumeModel.js';
import imagekit from '../configs/imagekit.js';
import mammoth from 'mammoth';
import openai from '../configs/ai.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort('-updatedAt');
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this resume' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this resume' });
    }

    // Remove immutable fields from req.body to prevent validation errors
    const { _id, userId, createdAt, updatedAt, __v, ...updateData } = req.body;

    // Sanitize array fields to prevent CastErrors if malformed data is sent
    const cleanArrayItems = (arr) => {
        if (!Array.isArray(arr)) return [];
        // Filter out non-objects and nested arrays (which are typeof object)
        return arr.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item)).map(item => {
            if (item._id === '' || item._id === null) {
                const { _id, ...rest } = item;
                return rest;
            }
            return item;
        });
    };

    if (updateData.projects) updateData.projects = cleanArrayItems(updateData.projects);
    if (updateData.experience) updateData.experience = cleanArrayItems(updateData.experience);
    if (updateData.education) updateData.education = cleanArrayItems(updateData.education);

    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills.filter(item => typeof item === 'string');
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedResume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle resume public status
// @route   PATCH /api/resumes/:id/toggle-public
// @access  Private
const togglePublicStatus = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    resume.isPublic = !resume.isPublic;
    await resume.save();

    res.json({
      _id: resume._id,
      isPublic: resume.isPublic,
      message: `Resume is now ${resume.isPublic ? 'public' : 'private'}`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Upload resume profile image
// @route   POST /api/resumes/:id/image
// @access  Private
const uploadResumeImage = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload original image to ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `resume-${resume._id}-${Date.now()}`,
      folder: '/resumes/profile-images',
    });

    // Generate a default transformed URL (Auto focus face, 200x200)
    // We do NOT apply background removal by default here, user can toggle it
    const transformedUrl = imagekit.url({
        path: response.filePath,
        transformation: [
            {
                "height": "200",
                "width": "200",
                "crop": "fill",
                "gravity": "face",
                "focus": "auto"
            }
        ]
    });

    // Update resume with the image URL and the raw file path
    if (!resume.personal) resume.personal = {};
    resume.personal.photo = transformedUrl;
    // We store the filePath so we can generate different transformations (like bg removal) later without re-uploading
    resume.personal.photoPath = response.filePath; 
    
    await resume.save();

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: transformedUrl,
      filePath: response.filePath, // Return path for frontend state
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

// @desc    Upload resume document (PDF/DOCX)
// @route   POST /api/resumes/:id/upload
// @access  Private
const uploadResumeFile = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log("Uploading file to ImageKit:", req.file.originalname, req.file.mimetype);
    // Upload to ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/resumes/documents',
      useUniqueFileName: true,
    });
    console.log("ImageKit upload successful:", response);

    // --- Extract Text from File ---
    let extractedText = "";

    try {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        extractedText = data.text;
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.mimetype === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value;
      }
    } catch (parseError) {
      console.error("Text extraction failed:", parseError);
      // Continue execution so the file is still saved even if parsing fails
    }

    // --- Parse Text with AI if text exists ---
    let parsedData = {};
    if (extractedText) {
      try {
        const systemPrompt = "You are an expert AI Agent to extract data from resume text.";
        const userPrompt = `Extract data from this resume text:
        "${extractedText.substring(0, 15000)}" 
        
        Provide data in the following JSON format. Return ONLY valid JSON. Do not include markdown formatting, code blocks, or conversational text.
        {
          "personal": {
            "fullName": String,
            "email": String,
            "phone": String,
            "profession": String,
            "location": String,
            "linkedin": String,
            "portfolio": String
          },
          "professional_summary": String,
          "skills": [String], // Extract all technical skills, programming languages, tools, and frameworks as a flat array.
          "experience": [{ "role": String, "company": String, "startDate": String, "endDate": String, "description": String, "isCurrent": Boolean }],
          "education": [{ "institution": String, "degree": String, "field": String, "endYear": String, "score": String }],
          "projects": [{ "title": String, "link": String, "startDate": String, "endDate": String, "technologies": String, "description": String }]
        }`;

        const aiResponse = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = aiResponse.choices[0].message.content;
        
        // Helper to clean and parse AI response
        const parseAIResponse = (text) => {
            try {
                // Remove markdown code blocks if present
                let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                // Find the first '{' and last '}'
                const jsonStart = cleanText.indexOf('{');
                const jsonEnd = cleanText.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
                }
                return JSON.parse(cleanText);
            } catch (e) {
                console.error("Failed to parse AI response:", e);
                return {};
            }
        };

        parsedData = parseAIResponse(content);
        
        // Merge parsed data into resume
        if (parsedData.personal) resume.personal = { ...resume.personal, ...parsedData.personal };
        if (parsedData.professional_summary) resume.professional_summary = parsedData.professional_summary;
        
        if (parsedData.skills && Array.isArray(parsedData.skills)) {
            resume.skills = parsedData.skills.filter(item => typeof item === 'string');
        }
        if (parsedData.experience && Array.isArray(parsedData.experience)) {
            resume.experience = parsedData.experience.filter(item => typeof item === 'object' && item !== null);
        }
        if (parsedData.education && Array.isArray(parsedData.education)) {
            resume.education = parsedData.education.filter(item => typeof item === 'object' && item !== null);
        }
        if (parsedData.projects && Array.isArray(parsedData.projects)) {
            resume.projects = parsedData.projects.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));
        }

      } catch (aiError) {
        console.error("AI Parsing failed:", aiError);
        // Continue execution even if AI parsing fails, we still want to save the file URL
      }
    }

    resume.resumeFile = {
      url: response.url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype
    };

    const savedResume = await resume.save();

    res.json(savedResume);
  } catch (error) {
    console.error("Upload error details:", error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

// @desc    Enhance text using AI
// @route   POST /api/resumes/enhance-text
// @access  Private
const enhanceText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const systemPrompt = "You are a professional resume writer. Rewrite the following project description to be more professional, impactful, and concise. Use strong action verbs and focus on achievements. Return ONLY the rewritten text. Do not provide multiple options. Do not add conversational filler.";
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const enhancedText = completion.choices[0].message.content;
    res.json({ enhancedText });
  } catch (error) {
    console.error("AI Enhance failed:", error);
    res.status(500).json({ message: 'Failed to enhance text', error: error.message });
  }
};

export {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  togglePublicStatus,
  uploadResumeImage,
  uploadResumeFile,
  enhanceText
};