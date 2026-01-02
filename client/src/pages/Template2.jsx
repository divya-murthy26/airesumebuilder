import React from 'react'
import { MapPin, Phone, Mail, Linkedin, Globe, ExternalLink } from 'lucide-react'

const Template2 = ({ data }) => {
  const { personal, experience, education, projects, skills, Professional_summary, accent_color } = data

  return (
    <div className="w-full bg-white min-h-[1000px] shadow-sm flex">
      {/* Sidebar */}
      <div className="w-1/3 text-white p-6 flex flex-col gap-6" style={{ backgroundColor: accent_color }}>
        <div className="text-center">
            {personal?.photo && (
                <img src={personal.photo} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-slate-700" />
            )}
            <h1 className="text-xl font-bold leading-tight mb-2">{personal?.fullName}</h1>
            <p className="text-sm text-slate-400">{personal?.profession}</p>
        </div>

        <div className="space-y-3 text-sm text-white/80">
            {personal?.email && <div className="flex items-center gap-2 break-all"><Mail size={14} /> {personal.email}</div>}
            {personal?.phone && <div className="flex items-center gap-2"><Phone size={14} /> {personal.phone}</div>}
            {personal?.location && <div className="flex items-center gap-2"><MapPin size={14} /> {personal.location}</div>}
            {personal?.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} /> <a href={personal.linkedin} className="hover:text-white">LinkedIn</a></div>}
            {personal?.portfolio && <div className="flex items-center gap-2"><Globe size={14} /> <a href={personal.portfolio} className="hover:text-white">Portfolio</a></div>}
        </div>

        {/* Education Sidebar */}
        {education?.length > 0 && (
            <div>
                <h3 className="text-md font-bold uppercase border-b border-white/30 pb-2 mb-3 text-white">Education</h3>
                <div className="space-y-4">
                    {education.map((edu, index) => (
                        <div key={index} className="break-inside-avoid">
                            <p className="font-bold text-sm">{edu.degree}</p>
                            <p className="text-xs text-slate-400">{edu.institution}</p>
                            <p className="text-xs text-slate-500">{edu.endYear}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Skills Sidebar */}
        {skills && (
            <div>
                <h3 className="text-md font-bold uppercase border-b border-white/30 pb-2 mb-3 text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(skills) ? skills.map((skill, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>{skill}</span>
                    )) : <p className="text-xs text-slate-400">{skills}</p>}
                </div>
            </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 bg-white text-slate-800">
        {Professional_summary && (
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: accent_color }}>Profile</h2>
                <p className="text-sm leading-relaxed text-slate-600">{Professional_summary}</p>
            </div>
        )}

        {experience?.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: accent_color }}>Work Experience</h2>
                <div className="space-y-6 border-l-2 border-slate-200 pl-4 ml-1">
                    {experience.map((exp, index) => (
                        <div key={index} className="relative break-inside-avoid">
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: accent_color }}></div>
                            <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                            <p className="text-sm font-medium mb-2" style={{ color: accent_color }}>{exp.company} | {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                            <p className="text-sm text-slate-600">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {projects?.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: accent_color }}>Projects</h2>
                <div className="space-y-6 border-l-2 border-slate-200 pl-4 ml-1">
                    {projects.map((project, index) => (
                        <div key={index} className="relative break-inside-avoid">
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: accent_color }}></div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">(Link)</a>}
                            </div>
                            <p className="text-sm font-medium mb-1" style={{ color: accent_color }}>{project.startDate} {project.startDate && project.endDate && '-'} {project.endDate}</p>
                            {project.technologies && <p className="text-sm text-slate-600 italic mb-2">Tech: {project.technologies}</p>}
                            <p className="text-sm text-slate-600">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Template2