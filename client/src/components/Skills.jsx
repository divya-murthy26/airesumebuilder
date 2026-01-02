import React, { useState } from 'react'
import { Code, Plus, X } from 'lucide-react'
import AIEnhanceButton from './AIEnhanceButton'

const Skills = ({ skills, handleChange, onSave }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !skills.includes(trimmedInput)) {
      handleChange([...skills, trimmedInput]);
      setInputValue('');
    } else if (skills.includes(trimmedInput)) {
      setInputValue(''); // Clear duplicate input
    }
  };

  const removeSkill = (skillToRemove) => {
    handleChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-slate-800'>Skills</h2>
        <AIEnhanceButton />
      </div>
      <p className='text-slate-500 text-sm mb-6'>Add your skills</p>

      <div>
            <div className='flex gap-2 mb-4'>
                <div className='relative flex-1'>
                    <Code className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a skill (e.g. React, Leadership)" 
                        className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                    />
                </div>
                <button 
                    onClick={addSkill}
                    className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium'
                >
                    <Plus className='size-4' /> Add
                </button>
            </div>

            <div className='flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50/50 rounded-lg border border-slate-100'>
                {skills.length === 0 && (
                    <p className='text-slate-400 text-sm italic w-full text-center py-4'>No skills added yet.</p>
                )}
                {skills.map((skill, index) => (
                    <div key={index} className='group flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all'>
                        <span>{skill}</span>
                        <button 
                            onClick={() => removeSkill(skill)}
                            className='text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50'
                        >
                            <X className='size-3.5' />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className='mt-8 flex justify-end'>
            <button onClick={onSave} className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm'>Save Changes</button>
        </div>
      </div>
  )
}

export default Skills