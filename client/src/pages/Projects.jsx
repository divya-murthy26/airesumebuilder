import React from 'react';
import { PlusIcon, Trash2, Save, Wand2 } from 'lucide-react';

const Projects = ({ projects, onAdd, onChange, onRemove, onSave, onEnhance }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Projects</h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3 relative">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`project-name-${index}`} className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
                <input
                  type="text"
                  id={`project-name-${index}`}
                  name="name"
                  value={project.name}
                  onChange={(e) => onChange(e, index)}
                  placeholder="e.g., E-commerce Platform"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`project-type-${index}`} className="block text-sm font-medium text-slate-600 mb-1">Project Type</label>
                <input
                  type="text"
                  id={`project-type-${index}`}
                  name="type"
                  value={project.type}
                  onChange={(e) => onChange(e, index)}
                  placeholder="e.g., Personal, Academic"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor={`project-description-${index}`} className="block text-sm font-medium text-slate-600 mb-1">Description</label>
              <div className="relative">
                <textarea
                  id={`project-description-${index}`}
                  name="description"
                  rows="4"
                  value={project.description}
                  onChange={(e) => onChange(e, index)}
                  placeholder="Describe your project, your role, and the technologies used."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
                />
                <button
                  type="button"
                  onClick={() => onEnhance(index)}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 transition-colors"
                >
                  <Wand2 size={12} />
                  AI Enhance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <PlusIcon size={16} /> Add Project
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save size={16} /> Save Projects
        </button>
      </div>
    </div>
  );
};

export default Projects;