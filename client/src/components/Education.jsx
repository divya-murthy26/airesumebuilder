import React from 'react'
import { GraduationCap, Trash2 } from 'lucide-react'

const Education = ({ education, onChange, onAdd, onRemove, onSave }) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <h2 className='text-xl font-bold text-slate-800 mb-4'>Education</h2>
      <p className='text-slate-500 text-sm mb-6'>Add your educational background.</p>

      {education.map((edu, index) => (
        <div key={edu.id} className='space-y-4 border p-4 rounded-lg border-slate-200 bg-slate-50/50 mb-4 relative group'>
          <button onClick={() => onRemove(index)} className='absolute -top-2 -right-2 size-7 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center transition-all'>
            <Trash2 className='size-4'/>
          </button>
          <div>
              <label className='text-sm font-medium text-slate-700'>School / University</label>
              <input type="text" name="institution" value={edu.institution} onChange={(e) => onChange(e, index)} placeholder="e.g. Stanford University" className='w-full mt-1 p-2 border rounded-md' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
              <div>
                  <label className='text-sm font-medium text-slate-700'>Degree</label>
                  <input type="text" name="degree" value={edu.degree} onChange={(e) => onChange(e, index)} placeholder="e.g. Bachelor's" className='w-full mt-1 p-2 border rounded-md' />
              </div>
              <div>
                  <label className='text-sm font-medium text-slate-700'>Field of Study</label>
                  <input type="text" name="field" value={edu.field} onChange={(e) => onChange(e, index)} placeholder="e.g. Computer Science" className='w-full mt-1 p-2 border rounded-md' />
              </div>
          </div>
        </div>
      ))}

      <button onClick={onAdd} className='mt-4 text-blue-600 text-sm font-medium hover:underline'>+ Add another education</button>

      <div className='mt-8 flex justify-end'>
        <button onClick={onSave} className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm'>Save Changes</button>
      </div>
    </div>
  )
}

export default Education
