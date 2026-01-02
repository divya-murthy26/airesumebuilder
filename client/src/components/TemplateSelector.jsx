import React from 'react';
import { CheckCircle } from 'lucide-react';

const templates = [
    {
        id: 'Template1',
        name: 'Classic',
        description: 'A traditional and clean layout, perfect for professional fields.',
    },
    {
        id: 'Template2',
        name: 'Modern',
        description: 'A stylish two-column layout that highlights your skills and contact info.',
    },
    {
        id: 'Template3',
        name: 'Minimalist',
        description: 'An elegant and spacious design that focuses on content clarity.',
    },
    {
        id: 'Template4',
        name: 'Professional',
        description: 'A bold and confident design with a standout header section.',
    }
];

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <h2 className='text-xl font-bold text-slate-800'>Choose a Template</h2>
            <p className='text-slate-500 text-sm mt-1 mb-6'>Select a template to start. You can change it anytime.</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                        <div
                            key={template.id}
                            onClick={() => onChange(template.id)}
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {isSelected && (
                                <CheckCircle className='absolute top-2 right-2 size-5 text-white bg-blue-600 rounded-full p-0.5' />
                            )}
                            <div className='h-24 bg-slate-100 rounded-md mb-3 flex items-center justify-center border'>
                                <p className='text-slate-400 text-xs'>Preview: {template.name}</p>
                            </div>
                            <h3 className='font-semibold text-slate-800'>{template.name}</h3>
                            <p className='text-xs text-slate-500 mt-1'>{template.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TemplateSelector;