import React from 'react'
import { MapPin, Phone, Mail, Linkedin, Globe } from 'lucide-react'

const Template1 = ({ data }) => {
  const { personal, experience, education, projects, skills, Professional_summary, accent_color } = data

  return (
    <div className="w-full bg-white min-h-[1000px] p-8 shadow-sm text-slate-800 font-serif">
      {/* Header */}
      <div className="border-b-2 pb-6 mb-6 text-center" style={{ borderColor: accent_color }}>
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personal?.fullName}</h1>
        <p className="text-lg mb-4" style={{ color: accent_color }}>{personal?.profession}</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          {personal?.phone && <div className="flex items-center gap-1"><Phone size={14} /> {personal.phone}</div>}
          {personal?.email && <div className="flex items-center gap-1"><Mail size={14} /> {personal.email}</div>}
          {personal?.location && <div className="flex items-center gap-1"><MapPin size={14} /> {personal.location}</div>}
          {personal?.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /> LinkedIn</div>}
          {personal?.portfolio && <div className="flex items-center gap-1"><Globe size={14} /> Portfolio</div>}
        </div>
      </div>

      {/* Summary */}
      {Professional_summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accent_color }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed text-slate-700">{Professional_summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1" style={{ color: accent_color }}>Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-md" style={{ color: accent_color }}>{exp.role}</h3>
                  <span className="text-sm text-slate-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-2">{exp.company}</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1" style={{ color: accent_color }}>Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-md">{edu.institution}</h3>
                  <span className="text-sm text-slate-500">{edu.endYear}</span>
                </div>
                <p className="text-sm text-slate-700">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                {edu.score && <p className="text-xs text-slate-500 mt-1">GPA/Score: {edu.score}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1" style={{ color: accent_color }}>Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-md" style={{ color: accent_color }}>{project.title}</h3>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">(Link)</a>}
                  </div>
                  <span className="text-sm text-slate-500">{project.startDate} {project.startDate && project.endDate && '-'} {project.endDate}</span>
                </div>
                {project.technologies && (
                  <p className="text-sm text-slate-700 italic mb-1"><span className="font-semibold">Tech Stack:</span> {project.technologies}</p>
                )}
                <p className="text-sm text-slate-600 whitespace-pre-line">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (skills.length > 0 || typeof skills === 'string') && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accent_color }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
             {Array.isArray(skills) ? skills.map((skill, index) => (
                <span key={index} className="text-sm bg-slate-100 px-2 py-1 rounded">{skill}</span>
             )) : <p className="text-sm">{skills}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Template1