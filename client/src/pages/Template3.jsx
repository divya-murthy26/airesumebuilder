import React from 'react'

const Template3 = ({ data }) => {
  const { personal, experience, education, projects, skills, Professional_summary, accent_color } = data

  return (
    <div className="w-full bg-white min-h-[1000px] p-10 shadow-sm text-slate-900 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light mb-2" style={{ color: accent_color }}>{personal?.fullName}</h1>
        <p className="text-xl text-slate-500 font-light mb-6">{personal?.profession}</p>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-light">
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>{personal.phone}</span>}
          {personal?.location && <span>{personal.location}</span>}
          {personal?.portfolio && <a href={personal.portfolio} className="underline decoration-slate-300 underline-offset-4">Portfolio</a>}
        </div>
      </div>

      {/* Summary */}
      {Professional_summary && (
        <div className="mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent_color }}>About</h2>
          </div>
          <div className="col-span-9">
            <p className="text-sm leading-7 text-slate-700">{Professional_summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent_color }}>Experience</h2>
          </div>
          <div className="col-span-9 space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <h3 className="font-medium text-lg">{exp.role}</h3>
                <p className="text-sm text-slate-500 mb-3">{exp.company} &middot; {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</p>
                <p className="text-sm leading-6 text-slate-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent_color }}>Education</h2>
          </div>
          <div className="col-span-9 space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="break-inside-avoid">
                <h3 className="font-medium">{edu.institution}</h3>
                <p className="text-sm text-slate-600">{edu.degree}, {edu.field}</p>
                <p className="text-xs text-slate-400">{edu.endYear}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent_color }}>Projects</h2>
          </div>
          <div className="col-span-9 space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-lg">{project.title} {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline ml-1">(Link)</a>}</h3>
                    <p className="text-sm text-slate-500">{project.startDate} {project.startDate && project.endDate && '—'} {project.endDate}</p>
                </div>
                {project.technologies && <p className="text-sm text-slate-500 italic mb-2">Tech: {project.technologies}</p>}
                <p className="text-sm leading-6 text-slate-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

       {/* Skills */}
       {skills && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent_color }}>Skills</h2>
          </div>
          <div className="col-span-9">
             <p className="text-sm leading-6 text-slate-700">
                {Array.isArray(skills) ? skills.join("  •  ") : skills}
             </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Template3