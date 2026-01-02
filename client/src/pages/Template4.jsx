import React from 'react'

const Template4 = ({ data }) => {
  const { personal, experience, education, projects, skills, Professional_summary, accent_color } = data

  return (
    <div className="w-full bg-white min-h-[1000px] shadow-sm">
      {/* Header */}
      <div className="text-white p-10" style={{ backgroundColor: accent_color }}>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold mb-2">{personal?.fullName}</h1>
                <p className="text-xl text-blue-100">{personal?.profession}</p>
            </div>
            {personal?.photo && (
                <img src={personal.photo} alt="Profile" className="w-20 h-20 rounded-lg object-cover bg-blue-500" />
            )}
        </div>
        <div className="flex flex-wrap gap-6 mt-6 text-sm text-blue-50 font-medium">
            {personal?.email && <span>{personal.email}</span>}
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.location && <span>{personal.location}</span>}
            {personal?.linkedin && <a href={personal.linkedin} className="hover:text-white underline">LinkedIn</a>}
        </div>
      </div>

      <div className="p-10 grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
            {Professional_summary && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3" style={{ color: accent_color }}>Profile</h2>
                    <p className="text-sm text-slate-700 leading-relaxed">{Professional_summary}</p>
                </div>
            )}

            {experience?.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accent_color }}>Experience</h2>
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <div key={index} className="break-inside-avoid">
                                <h3 className="font-bold text-slate-800">{exp.role}</h3>
                                <p className="text-sm text-slate-500 mb-2">{exp.company} | {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                                <p className="text-sm text-slate-600">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {projects?.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-4" style={{ color: accent_color }}>Projects</h2>
                    <div className="space-y-6">
                        {projects.map((project, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-800">{project.title} {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline ml-1">(Link)</a>}</h3>
                                    <p className="text-sm text-slate-500 mb-1">{project.startDate} {project.startDate && project.endDate && '-'} {project.endDate}</p>
                                </div>
                                {project.technologies && <p className="text-sm text-slate-600 italic mb-2">Tech: {project.technologies}</p>}
                                <p className="text-sm text-slate-600">{project.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
            {skills && (
                <div>
                    <h2 className="text-lg font-bold uppercase mb-3" style={{ color: accent_color }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(skills) ? skills.map((skill, index) => (
                            <span key={index} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">{skill}</span>
                        )) : <p className="text-sm">{skills}</p>}
                    </div>
                </div>
            )}

            {education?.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-blue-600 uppercase mb-3" style={{ color: accent_color }}>Education</h2>
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                            <div key={index} className="break-inside-avoid">
                                <p className="font-bold text-slate-800 text-sm">{edu.institution}</p>
                                <p className="text-xs text-slate-600">{edu.degree}</p>
                                <p className="text-xs text-slate-500">{edu.endYear}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Template4