import React, { useState } from 'react'
import { Briefcase, Calendar, MapPin, Trash2 } from 'lucide-react'
import AIEnhanceButton from './AIEnhanceButton'
import api from '../configs/api'
import { toast } from 'react-toastify'

const Experience = ({ experience, onChange, onAdd, onRemove, onSave }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const handleEnhance = async (index) => {
    const currentDescription = experience[index].description;

    if (!currentDescription) {
      toast.error("Please enter a description to enhance");
      return;
    }

    setLoadingStates(prev => ({ ...prev, [index]: true }));
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/api/ai/enhance-job-desc', { userContent: currentDescription }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onChange({ target: { name: 'description', value: data.enhancedcontent } }, index);
      toast.success("Description enhanced successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to enhance description");
    } finally {
      setLoadingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-slate-800'>Work Experience</h2>
      </div>
      <p className='text-slate-500 text-sm mb-6'>Add your previous job experience.</p>

      {experience.map((exp, index) => (
        <div key={exp.id} className='space-y-4 border p-4 rounded-lg border-slate-200 bg-slate-50/50 mb-4 relative group'>
          <button onClick={() => {
            if (window.confirm("Are you sure you want to delete this experience entry?")) {
              onRemove(index);
            }
          }} className='absolute -top-2 -right-2 size-7 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center transition-all'>
            <Trash2 className='size-4'/>
          </button>
          <div className='grid grid-cols-2 gap-4'>
              <div>
                  <label className='text-sm font-medium text-slate-700'>Job Title</label>
                  <input type="text" name="role" value={exp.role} onChange={(e) => onChange(e, index)} placeholder="e.g. Frontend Developer" className='w-full mt-1 p-2 border rounded-md' />
              </div>
              <div>
                  <label className='text-sm font-medium text-slate-700'>Company</label>
                  <input type="text" name="company" value={exp.company} onChange={(e) => onChange(e, index)} placeholder="e.g. Google" className='w-full mt-1 p-2 border rounded-md' />
              </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
              <div>
                  <label className='text-sm font-medium text-slate-700'>Start Date</label>
                  <input type="text" name="startDate" value={exp.startDate} onChange={(e) => onChange(e, index)} placeholder='e.g. Jan 2022' className='w-full mt-1 p-2 border rounded-md' />
              </div>
              <div>
                  <label className='text-sm font-medium text-slate-700'>End Date</label>
                  <input type="text" name="endDate" value={exp.endDate} onChange={(e) => onChange(e, index)} placeholder='e.g. Present' className='w-full mt-1 p-2 border rounded-md' />
              </div>
          </div>
          <div>
                <div className="flex justify-between items-center mb-1">
                    <label className='text-sm font-medium text-slate-700'>Description</label>
                    <AIEnhanceButton onClick={() => handleEnhance(index)} loading={loadingStates[index]} />
                </div>
               <textarea name="description" value={exp.description} onChange={(e) => onChange(e, index)} placeholder="Describe your responsibilities..." className='w-full mt-1 p-2 border rounded-md h-24 min-h-[100px]'></textarea>
          </div>
        </div>
      ))}
      
      <button onClick={onAdd} className='mt-4 text-blue-600 text-sm font-medium hover:underline'>+ Add another position</button>

      <div className='mt-8 flex justify-end'>
        <button onClick={onSave} className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm'>Save Changes</button>
      </div>
    </div>
  )
}

export default Experience