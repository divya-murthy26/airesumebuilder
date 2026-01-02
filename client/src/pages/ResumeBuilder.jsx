import React, { useEffect, useState, useRef } from 'react'
import {Link, useParams, useNavigate } from 'react-router-dom'  
import { ArrowLeftIcon, ChevronRight, ChevronLeft, LayoutTemplate, Palette, Lock, Globe, Share2, Download, Loader2, Save, Wand2, Upload } from 'lucide-react'
import PersonalDetails from '../components/PersonalDetails'
import ProfessionalSummary from '../components/ProfessionalSummary'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Template1 from './Template1'
import Template2 from './Template2'
import Template3 from './Template3'
import Template4 from './Template4'
import ColorPicker from '../components/ColorPicker'
import Projects from '../components/Projects'
import TemplateSelector from '../components/TemplateSelector'
import ShareResume from '../components/ShareResume'
import api from '../configs/api'
import { toast } from 'react-toastify'

const ResumeBuilder = () => {

  const {resumeId} = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState('Template1')
  const [showTemplateSelect, setShowTemplateSelect] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isBgRemoved, setIsBgRemoved] = useState(false);
  const fileInputRef = useRef(null);

   const [resumeData, setResumeData] = useState({
    _id:'',
    title:"",
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    photo: "",
    photoPath: "", // Store the raw ImageKit path for transformations
    linkedin: "",
    portfolio: "",
  },

  Professional_summary: "",

  skills:[] ,

  experience: [],

  projects: [],

  education: [],

  template : "Template1",
  accent_color:"#3B82F6",
  public:false,
})

const loadResume = async () => {
    try {
        const token = localStorage.getItem('token');
        const { data } = await api.get(`/api/resumes/${resumeId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Map backend data to frontend state structure
        setResumeData({
            ...data,
            personal: {
                fullName: data.personal?.fullName || "",
                email: data.personal?.email || "",
                phone: data.personal?.phone || "",
                location: data.personal?.location || "",
                profession: data.personal?.profession || "",
                photo: data.personal?.photo || "",
                photoPath: data.personal?.photoPath || "", // Load photoPath
                linkedin: data.personal?.linkedin || "",
                portfolio: data.personal?.portfolio || "",
            },
            Professional_summary: data.professional_summary || "", // Map casing
            public: data.isPublic // Map casing
        });
        
        // Detect if background is removed based on URL
        if (data.personal?.photo && data.personal.photo.includes('e-remove-bg')) {
            setIsBgRemoved(true);
        }

        setSelectedTemplate(data.template || 'Template1');
        document.title = data.title;
    } catch (error) {
        console.error("Failed to load resume", error);
        toast.error("Failed to load resume");
        if (error.response && error.response.status === 401) {
            navigate('/login');
        }
    } finally {
        setLoading(false);
    }
}

const steps = [
    { label: "Personal Information", component: PersonalDetails, key: "personal" },
    { label: "Professional Summary", component: ProfessionalSummary, key: "summary" },
    { label: "Skills", component: Skills, key: "skills" },
    { label: "Experience", component: Experience, key: "experience" },
    { label: "Education", component: Education, key: "education" },
    { label: "Projects", component: Projects, key: "projects" },
];

const handlePersonalChange = (e) => {
    const {name, value} = e.target;
    setResumeData(prev => ({
        ...prev,
        personal: {
            ...prev.personal,
            [name]: value
        }
    }))
}

const handleSummaryChange = (e) => {
    const { value } = e.target;
    setResumeData(prev => ({ ...prev, Professional_summary: value }));
}

// Helper to generate ImageKit URL with transformations
const generateImageUrl = (path, removeBg, color) => {
    if (!path) return "";

    // The base endpoint from ImageKit config. We derive it from an existing URL.
    let urlEndpoint = "";
    if (resumeData.personal.photo) {
        const pathIndex = resumeData.personal.photo.indexOf(path);
        if (pathIndex !== -1) {
            const urlBeforePath = resumeData.personal.photo.substring(0, pathIndex);
            urlEndpoint = urlBeforePath.split('/tr:')[0];
            if (urlEndpoint.endsWith('/')) {
                urlEndpoint = urlEndpoint.slice(0, -1);
            }
        }
    }

    if (!urlEndpoint) {
        console.error("Could not determine ImageKit endpoint.");
        return resumeData.personal.photo; // Fallback
    }

    const transformations = [];
    
    // 1. Auto focus face and resize
    transformations.push("fo-auto,h-200,w-200,c-fill,g-face");

    // 2. Background Removal & Accent Color
    if (removeBg) {
        transformations.push("e-remove-bg"); // Correct parameter for background removal
        // ImageKit expects hex without hash
        const cleanColor = color.replace('#', '');
        transformations.push(`bg-${cleanColor}`);
    }

    const trString = `tr:${transformations.join(',')}`;
    
    // Construct final URL, ensuring path doesn't have a leading slash if endpoint doesn't have a trailing one.
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${urlEndpoint}/${trString}${cleanPath}`;
};

const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show a local preview immediately for better UX
    const reader = new FileReader();
    reader.onloadend = () => {
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, photo: reader.result } }));
    };
    reader.readAsDataURL(file);

    // Start the actual upload process
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file); // Key must be 'image' to match backend

    try {
        const token = localStorage.getItem('token');
        const { data } = await api.post(`/api/resumes/${resumeId}/image`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // On success, update state with the persistent, transformed URL from the backend
        setResumeData(prev => ({
            ...prev,
            personal: { 
                ...prev.personal, 
                photo: data.imageUrl,
                photoPath: data.filePath // Save the path for future toggles
            }
        }));
        setIsBgRemoved(false); // Reset toggle on new upload
        toast.success("Profile image updated!");

    } catch (error) {
        console.error("Image upload failed", error);
        toast.error(error.response?.data?.message || "Image upload failed.");
        loadResume(); // Revert to the last saved state if upload fails
    } finally {
        setIsUploadingImage(false);
    }
};

const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
        const token = localStorage.getItem('token');
        const { data } = await api.post(`/api/resumes/${resumeId}/upload`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Update state with parsed data immediately
        setResumeData(prev => ({
            ...prev,
            ...data, // Spread the returned resume object to update all fields
            // Explicitly map fields that might have casing differences or need specific handling
            Professional_summary: data.professional_summary || "", 
            public: data.isPublic,
            skills: data.skills || [],
            experience: data.experience || [],
            education: data.education || [],
            projects: data.projects || [],
            personal: { 
                ...prev.personal, 
                ...data.personal,
                // Preserve photo if the parsed data doesn't have one (usually doesn't)
                photo: prev.personal.photo || data.personal?.photo 
            }
        }));
        
        toast.success("Resume uploaded and parsed successfully!");
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload and parse resume");
    } finally {
        setIsUploadingFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
}

const handleColorChange = (newColor) => {
    setResumeData(prev => {
        let newPhotoUrl = prev.personal.photo;
        
        // If background is removed, update the background color of the image dynamically
        if (isBgRemoved && prev.personal.photoPath) {
            newPhotoUrl = generateImageUrl(prev.personal.photoPath, true, newColor);
        }

        return { 
            ...prev, 
            accent_color: newColor,
            personal: { ...prev.personal, photo: newPhotoUrl }
        };
    });
}

const handleBgToggle = () => {
    const newBgState = !isBgRemoved;
    setIsBgRemoved(newBgState);
    
    if (resumeData.personal.photoPath) {
        const newUrl = generateImageUrl(resumeData.personal.photoPath, newBgState, resumeData.accent_color);
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, photo: newUrl }
        }));
    }
}

const handleSkillsChange = (newSkills) => {
    setResumeData(prev => ({ ...prev, skills: newSkills }));
}

// Experience Handlers
const addExperience = () => {
    setResumeData(prev => ({
        ...prev,
        experience: [
            ...prev.experience,
            {
                role: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
                isCurrent: false,
            }
        ]
    }));
}

const handleExperienceChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const list = [...resumeData.experience];
    list[index][name] = type === 'checkbox' ? checked : value;
    setResumeData(prev => ({ ...prev, experience: list }));
}

const removeExperience = (index) => {
    const list = [...resumeData.experience];
    list.splice(index, 1);
    setResumeData(prev => ({ ...prev, experience: list }));
}

// Education Handlers
const addEducation = () => {
    setResumeData(prev => ({ ...prev, education: [ ...prev.education, { institution: "", degree: "", field: "", endYear: "", score: "" } ] }));
}

const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...resumeData.education];
    list[index][name] = value;
    setResumeData(prev => ({ ...prev, education: list }));
}

const removeEducation = (index) => {
    const list = [...resumeData.education];
    list.splice(index, 1);
    setResumeData(prev => ({ ...prev, education: list }));
}

// Projects Handlers
const addProject = () => {
    setResumeData(prev => ({
        ...prev,
        projects: [
            ...prev.projects,
            { title: '', link: '', startDate: '', endDate: '', technologies: '', description: '' }
        ]
    }));
};

const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...resumeData.projects];
    list[index][name] = value;
    setResumeData(prev => ({ ...prev, projects: list }));
};

const removeProject = (index) => {
    const list = [...resumeData.projects];
    list.splice(index, 1);
    setResumeData(prev => ({ ...prev, projects: list }));
};

const handleEnhanceProject = async (index) => {
    const project = resumeData.projects[index];
    if (!project.description) {
        toast.warning("Please enter a description first");
        return;
    }

    setIsEnhancing(true);
    try {
        const token = localStorage.getItem('token');
        // Send a more specific prompt instruction via the API if possible, or rely on the backend controller update
        const { data } = await api.post('/api/resumes/enhance-text', { text: project.description }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const list = [...resumeData.projects];
        list[index].description = data.enhancedText;
        setResumeData(prev => ({ ...prev, projects: list }));
        toast.success("Description enhanced with AI!");
    } catch (error) {
        console.error("Enhancement failed", error);
        toast.error("Failed to enhance description");
    } finally {
        setIsEnhancing(false);
    }
};

const handleEnhanceExperience = async (index) => {
    const exp = resumeData.experience[index];
    if (!exp.description) {
        toast.warning("Please enter a description first");
        return;
    }

    setIsEnhancing(true);
    try {
        const token = localStorage.getItem('token');
        const { data } = await api.post('/api/resumes/enhance-text', { text: exp.description }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const list = [...resumeData.experience];
        list[index].description = data.enhancedText;
        setResumeData(prev => ({ ...prev, experience: list }));
        toast.success("Experience enhanced with AI!");
    } catch (error) {
        console.error("Enhancement failed", error);
        toast.error("Failed to enhance experience");
    } finally {
        setIsEnhancing(false);
    }
};

const handleEnhanceSummary = async () => {
    if (!resumeData.Professional_summary) {
        toast.warning("Please enter a summary first");
        return;
    }

    setIsEnhancing(true);
    try {
        const token = localStorage.getItem('token');
        const { data } = await api.post('/api/resumes/enhance-text', { text: resumeData.Professional_summary }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setResumeData(prev => ({ ...prev, Professional_summary: data.enhancedText }));
        toast.success("Summary enhanced with AI!");
    } catch (error) {
        console.error("Enhancement failed", error);
        toast.error("Failed to enhance summary");
    } finally {
        setIsEnhancing(false);
    }
};

const handleSave = async (e) => {
    const isAutoSave = e === true;

    // Validate data before saving to prevent 400 errors (e.g. missing title or not loaded)
    if (!resumeData._id || !resumeData.title) {
        return;
    }

    setIsSaving(true);
    try {
        // Remove system fields that shouldn't be sent in update
        const { _id, userId, createdAt, updatedAt, __v, Professional_summary, ...rest } = resumeData;

        // Helper to clean array items (remove empty _id)
        const cleanArray = (arr) => {
            if (!Array.isArray(arr)) return [];
            // Filter out non-objects and nested arrays to prevent CastErrors
            return arr.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item)).map(item => {
                if (item._id === "" || item._id === null) {
                    const { _id, ...itemRest } = item;
                    return itemRest;
                }
                return item;
            });
        };

        const payload = {
            ...rest,
            professional_summary: resumeData.Professional_summary, // Map back to backend casing
            isPublic: resumeData.public,
            template: selectedTemplate,
            projects: cleanArray(resumeData.projects),
            experience: cleanArray(resumeData.experience),
            education: cleanArray(resumeData.education)
        };
        const token = localStorage.getItem('token');
        await api.put(`/api/resumes/${resumeId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!isAutoSave) {
            toast.success("Resume saved successfully!");
        }
    } catch (error) {
        console.error("Save failed", error);
        if (!isAutoSave) {
            toast.error(error.response?.data?.message || "Failed to save resume");
        }
    } finally {
        setIsSaving(false);
    }
};

useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
        handleSave(true);
    }, 3000);
    return () => clearTimeout(timer);
}, [resumeData, selectedTemplate]);

const handleShare = async () => {
    await handleSave();
    setShowShareModal(true);
};

const handleDownload = () => {
    window.print();
};

const handleNext = async () => {
    if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
    } else {
        await handleSave(true); // Pass true to suppress the default "Saved" toast
        toast.success("Resume completed!");
        navigate('/app');
    }
}

const handlePrevious = () => {
    if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
    }
}

const renderStepComponent = () => {
    const step = steps[currentStep];
    switch (step.key) {
        case 'personal':
            return (
                <div className="flex flex-col gap-4">
                    <PersonalDetails personal={resumeData.personal} handleChange={handlePersonalChange} handleImageChange={handleImageChange} onSave={handleSave} isUploading={isUploadingImage} />
                    
                    {/* Image Controls */}
                    {resumeData.personal.photoPath && (
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Wand2 className="size-4 text-purple-600" />
                                <span className="font-medium">AI Background Removal</span>
                            </div>
                            <button 
                                onClick={handleBgToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isBgRemoved ? 'bg-purple-600' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBgRemoved ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Save className="size-4" /> Save Changes
                        </button>
                    </div>
                </div>
            );
        case 'summary':
            return <ProfessionalSummary summary={resumeData.Professional_summary} handleChange={handleSummaryChange} onSave={handleSave} onEnhance={handleEnhanceSummary} />;
        case 'skills':
            return <Skills skills={resumeData.skills} handleChange={handleSkillsChange} onSave={handleSave} />;
        case 'experience':
            return <Experience experience={resumeData.experience} onAdd={addExperience} onChange={handleExperienceChange} onRemove={removeExperience} onSave={handleSave} onEnhance={handleEnhanceExperience} />;
        case 'education':
            return <Education education={resumeData.education} onAdd={addEducation} onChange={handleEducationChange} onRemove={removeEducation} onSave={handleSave} />;
        case 'projects':
            return <Projects projects={resumeData.projects} onAdd={addProject} onChange={handleProjectChange} onRemove={removeProject} onSave={handleSave} onEnhance={handleEnhanceProject} />;
        default:
            return null;
    }
}

const renderTemplate = () => {
    switch (selectedTemplate) {
        case 'Template1':
            return <Template1 data={resumeData} />;
        case 'Template2':
            return <Template2 data={resumeData} />;
        case 'Template3':
            return <Template3 data={resumeData} />;
        case 'Template4':
            return <Template4 data={resumeData} />;
        default:
            return <Template1 data={resumeData} />;
    }
}

   useEffect(() => {
    loadResume()
   }, [])


   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin size-10 text-blue-600"/></div>

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
     <style>
        {`
            @media print {
                @page { margin: 0; size: auto; }
                body { visibility: hidden; }
                #resume-preview {
                    visibility: visible;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    background: white;
                    border: none;
                    box-shadow: none;
                    z-index: 9999;
                }
                #resume-preview * { visibility: visible; }
                .break-inside-avoid {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
            }
        `}
     </style>
     <div className='flex justify-between items-center mb-6'>
        <Link to={'/app'} className='flex items-center gap-2 text-slate-500 hover:text-slate-800 cursor-pointer'>
            <ArrowLeftIcon className='size-4'/>Back to dashboard
        </Link>
        
        <div className='flex items-center gap-3'>
            {isSaving && <span className="text-sm text-slate-400 flex items-center gap-1"><Loader2 className="animate-spin size-3"/> Saving...</span>}
            {isEnhancing && <span className="text-sm text-purple-600 flex items-center gap-1"><Wand2 className="animate-spin size-3"/> Enhancing...</span>}
            {/* Private/Public Toggle */}
            <button 
                onClick={() => setResumeData(prev => ({...prev, public: !prev.public}))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    resumeData.public 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
            >
                {resumeData.public ? <Globe className='size-4'/> : <Lock className='size-4'/>}
                {resumeData.public ? 'Public' : 'Private'}
            </button>

            {/* Share Button (Only visible when public) */}
            {resumeData.public && (
                <button onClick={handleShare} className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all'>
                    <Share2 className='size-4'/> Share
                </button>
            )}

            {/* Import Resume Button */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.docx,.doc" 
                onChange={handleResumeUpload} 
            />
            <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isUploadingFile}
                className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all'
            >
                {isUploadingFile ? <Loader2 className='animate-spin size-4'/> : <Upload className='size-4'/>}
                Import Resume
            </button>

            {/* Download Button */}
            <button onClick={handleDownload} className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 shadow-sm transition-all'>
                <Download className='size-4'/> Download PDF
            </button>
        </div>
     </div>

     <div className='max-w-7xl mx-auto px-4 pb-8'>
      <div className='grid lg:grid-cols-12 gap-8'>
        {/* left panel - form*/} 
        <div className='lg:col-span-5 flex flex-col gap-4'>

            {/* Action Buttons */}
            <div className='flex gap-4 mb-2'>
                <button 
                    onClick={() => { setShowTemplateSelect(!showTemplateSelect); setShowColorPicker(false); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${showTemplateSelect ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                    <LayoutTemplate className='size-4'/>
                    Template
                </button>
                <button 
                    onClick={() => { setShowColorPicker(!showColorPicker); setShowTemplateSelect(false); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${showColorPicker ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                >
                    <Palette className='size-4'/>
                    Accent
                </button>
            </div>

            {/* Selectors */}
            {showTemplateSelect && (
                <div className='mb-4'>
                    <TemplateSelector selectedTemplate={selectedTemplate} onChange={(t) => { setSelectedTemplate(t); setShowTemplateSelect(false); }} />
                </div>
            )}

            {showColorPicker && (
                <div className='mb-4'>
                    <ColorPicker color={resumeData.accent_color} onChange={handleColorChange} />
                </div>
            )}
            
            {/* Step Indicator */}
            <div className='bg-white rounded-lg p-4 shadow-sm border border-slate-200'>
                <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs font-semibold text-blue-600 uppercase tracking-wider'>Step {currentStep + 1} of {steps.length}</span>
                    <span className='text-xs text-slate-400'>{Math.round(((currentStep + 1) / steps.length) * 100)}% Completed</span>
                </div>
                <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden'>
                    <div className='bg-blue-600 h-full transition-all duration-500 ease-out' style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
                </div>
            </div>

            {/* Form Component */}
            {renderStepComponent()}

            {/* Navigation Buttons */}
            <div className='flex justify-between mt-4'>
                <button onClick={handlePrevious} disabled={currentStep === 0} className='flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                    <ChevronLeft className='size-4' /> Previous
                </button>
                <button onClick={handleNext} className='flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200'>
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className='size-4' />
                </button>
            </div>
         </div>

         {/* Right panel - preview*/} 
         <div className='lg:col-span-7'>
            <div className='sticky top-6 space-y-4'>
                {/* Live Preview */}
                <div id="resume-preview" className='bg-slate-50 shadow-2xl rounded-lg overflow-hidden border border-slate-200 min-h-[800px]'>
                    {renderTemplate()}
                </div>
            </div>
         </div>
        
      </div>
     </div>

     {/* Share Modal */}
     <ShareResume 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        resumeId={resumeData._id || resumeId} 
     />

    </div>
  )
}

export default ResumeBuilder
