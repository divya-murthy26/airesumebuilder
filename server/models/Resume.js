import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      default: "Untitled Resume"
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    template: {
      type: String,
      default: "classic"
    },
    accentColor: {
      type: String,
      default: "#3B82F6"
    },
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
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
