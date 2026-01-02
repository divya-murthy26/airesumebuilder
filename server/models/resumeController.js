import Resume from '../models/Resume.js';

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

    let updateData = { ...req.body };

    // Parse resumeData if it exists (stringified JSON)
    if (req.body.resumeData) {
      try {
        updateData = JSON.parse(req.body.resumeData);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON in resumeData' });
      }
    }

    // Handle Image Upload
    if (req.file) {
      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: `resume-${resume._id}-${Date.now()}`,
        folder: '/resumes/profile-images',
      });

      // Ensure personalInfo exists in updateData
      if (!updateData.personalInfo) {
        updateData.personalInfo = resume.personalInfo ? { ...resume.personalInfo } : {};
      }
      updateData.personalInfo.image = response.url;
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

export {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  togglePublicStatus
};