import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  personal: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    profession: String,
    photo: String,
    photoPath: String,
    linkedin: String,
    portfolio: String,
  },
  professional_summary: String,
  skills: [String],
  experience: [{
    role: String,
    company: String,
    startDate: String,
    endDate: String,
    description: String,
    isCurrent: Boolean,
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    endYear: String,
    score: String,
  }],
  projects: [{
    title: String,
    link: String,
    startDate: String,
    endDate: String,
    technologies: String,
    description: String,
  }],
  resumeFile: {
    url: String,
    fileName: String,
    fileType: String
  },
  template: { type: String, default: 'Template1' },
  accent_color: { type: String, default: '#3B82F6' },
  isPublic: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
