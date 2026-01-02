import React from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Linkedin, Globe, Camera } from 'lucide-react'

const PersonalDetails = ({ personal, handleChange, handleImageChange }) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-slate-800'>Personal Information</h2>
        <p className='text-slate-500 text-sm mt-1'>Get started with your personal information</p>
      </div>

      {/* Profile Image Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-5'>
            <div className='relative group'>
                <div className='w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden'>
                    {personal.photo ? (
                        <img src={personal.photo} alt="Profile" className='w-full h-full object-cover' />
                    ) : (
                        <User className='text-slate-400 size-8' />
                    )}
                </div>
                <label htmlFor="photo-upload" className='absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-full'>
                    <Camera className='text-transparent group-hover:text-white/80 size-6 transition-colors' />
                </label>
                <input 
                    type="file" 
                    id="photo-upload" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className='hidden' 
                />
            </div>
            <div>
                <label htmlFor="photo-upload" className='text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors'>
                    Upload Photo
                </label>
                <p className='text-xs text-slate-400 mt-1'>JPG, PNG or GIF. Max size 2MB</p>
            </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-5'>
        {/* Full Name */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Full Name <span className='text-red-500'>*</span></label>
            <div className='relative group'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="text" 
                    name="fullName" 
                    value={personal.fullName || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. John Doe"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                    required
                />
            </div>
        </div>

        {/* Email Address */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Email Address <span className='text-red-500'>*</span></label>
            <div className='relative group'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="email" 
                    name="email" 
                    value={personal.email || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. john.doe@example.com"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                    required
                />
            </div>
        </div>

        {/* Phone Number */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Phone Number</label>
            <div className='relative group'>
                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="tel" 
                    name="phone" 
                    value={personal.phone || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. +1 (555) 000-0000"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                />
            </div>
        </div>

        {/* Location */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Location</label>
            <div className='relative group'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="text" 
                    name="location" 
                    value={personal.location || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. San Francisco, CA"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                />
            </div>
        </div>

        {/* Profession */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Profession</label>
            <div className='relative group'>
                <Briefcase className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="text" 
                    name="profession" 
                    value={personal.profession || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. Senior Product Designer"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                />
            </div>
        </div>

        {/* LinkedIn */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>LinkedIn Profile</label>
            <div className='relative group'>
                <Linkedin className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="url" 
                    name="linkedin" 
                    value={personal.linkedin || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. linkedin.com/in/johndoe"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                />
            </div>
        </div>

        {/* Personal Website */}
        <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Personal Website</label>
            <div className='relative group'>
                <Globe className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
                <input 
                    type="url" 
                    name="portfolio" 
                    value={personal.portfolio || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. johndoe.design"
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm'
                />
            </div>
        </div>

      </div>
    </div>
  )
}

export default PersonalDetails
