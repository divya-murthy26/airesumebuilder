import React, { useState } from 'react'
import AIEnhanceButton from './AIEnhanceButton';
import api from '../configs/api';
import { toast } from 'react-toastify';

const ProfessionalSummary = ({ summary, handleChange, onSave }) => {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!summary) {
      toast.error("Please enter a summary to enhance");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/api/ai/enhance-pro-sum', { userContent: summary }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleChange({ target: { value: data.enhancedcontent } });
      toast.success("Summary enhanced successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to enhance summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-slate-800'>Professional Summary</h2>
        <AIEnhanceButton onClick={handleEnhance} loading={loading} />
      </div>
      <p className='text-slate-500 text-sm mb-4'>Write a short summary of your professional background.</p>
      <textarea
        name="Professional_summary"
        value={summary}
        onChange={handleChange}
        placeholder="e.g. Experienced Software Engineer with 5+ years of experience in..."
        className='w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none'
      />

      <div className='mt-8 flex justify-end'>
        <button onClick={onSave} className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm'>Save Changes</button>
      </div>
    </div>
  )
}

export default ProfessionalSummary