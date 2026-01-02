import React from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';

const Projects = ({ projects, onAdd, onChange, onRemove, onSave, onEnhance }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h2 className='text-xl font-bold text-slate-800'>Projects</h2>
                    <p className='text-slate-500 text-sm mt-1'>Add your projects</p>
                </div>
                <button
                    onClick={onAdd}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors'
                >
                    <Plus className='size-4' />
                    Add Project
                </button>
            </div>

            <div className='space-y-6 mt-6'>
                {projects.map((project, index) => (
                    <div key={index} className='p-4 border rounded-lg bg-slate-50/70'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='font-semibold text-slate-700'>Project #{index + 1}</h3>
                            <button onClick={() => onRemove(index)} className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors'>
                                <Trash2 className='size-4' />
                            </button>
                        </div>
                        <div className='space-y-4'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                                    <input type="text" name="title" value={project.title} onChange={(e) => onChange(e, index)} placeholder="e.g. E-commerce Platform" className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Link</label>
                                    <input type="text" name="link" value={project.link} onChange={(e) => onChange(e, index)} placeholder="e.g. github.com/project" className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                    <input type="text" name="startDate" value={project.startDate} onChange={(e) => onChange(e, index)} placeholder="e.g. Jan 2023" className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                    <input type="text" name="endDate" value={project.endDate} onChange={(e) => onChange(e, index)} placeholder="e.g. Present" className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
                                <input type="text" name="technologies" value={project.technologies} onChange={(e) => onChange(e, index)} placeholder="e.g. React, Node.js, MongoDB" className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea name="description" value={project.description} onChange={(e) => onChange(e, index)} placeholder="Project Description" className='w-full p-2 border rounded-md h-24 min-h-[100px]'></textarea>
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

            <div className='mt-8 flex justify-end'>
                <button onClick={onSave} className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm'>Save Changes</button>
            </div>
        </div>
    );
};

export default Projects;