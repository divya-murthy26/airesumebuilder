import React, { useEffect, useState } from "react";
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../configs/api";
import { toast } from "react-toastify";


const Dashboard = () => {
    const colors =['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899']
    const [allResumes , setAllResumes] = useState([])
    const [loading, setLoading] = useState(true);
    const [showCreateResume , setShowCreateResume] = useState(false)
    const [showUploadResume , setShowUploadResume] = useState(false)
    const [title , setTitle] = useState('')
    const [resume , setResume] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [editresumeId , setResumeId] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth();

    const loadAllResumes = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get('/api/resumes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllResumes(data);
        } catch (error) {
            console.error("Failed to load resumes", error);
            toast.error("Failed to load resumes");
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }

    const CreateResume = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            if(editresumeId){
                // Update title
                await api.put(`/api/resumes/${editresumeId}`, { title }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllResumes(prev => prev.map(r => r._id === editresumeId ? {...r, title} : r));
                toast.success("Resume updated");
            } else {
                // Create new
                const { data } = await api.post('/api/resumes', { title }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Resume created");
                navigate(`/app/builder/${data._id}`);
            }
            setShowCreateResume(false)
            setTitle('')
            setResumeId(null)
        } catch (error) {
            toast.error("Operation failed");
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file) setResume(file)
    }

    const UploadResume = async (e) => {
        e.preventDefault()
        if(!resume) return toast.error("Please select a file");
        
        setIsUploading(true);
        try {
            const token = localStorage.getItem('token');
            // 1. Create Resume Entry
            const createRes = await api.post('/api/resumes', { title }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newResumeId = createRes.data._id;
            
            // 2. Upload File
            const formData = new FormData();
            formData.append('resumeFile', resume);
            
            const uploadRes = await api.post(`/api/resumes/${newResumeId}/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    // Content-Type is automatically set by axios when using FormData
                }
            });

            // 3. Update State Immediately
            const updatedResume = uploadRes.data;
            setAllResumes(prev => [updatedResume, ...prev]);

            toast.success("Resume uploaded successfully");
            setShowUploadResume(false);
            setResume(null);
            setTitle('');
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    }

    const onDelete = async (e, id) => {
        e.stopPropagation()
        if(window.confirm("Are you sure you want to delete this resume?")){
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/api/resumes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllResumes(prev => prev.filter(r => r._id !== id));
                toast.success("Resume deleted");
            } catch (error) {
                toast.error("Failed to delete resume");
            }
        }
    }

    const onEdit = (e, resume) => {
        e.stopPropagation()
        setResumeId(resume._id)
        setTitle(resume.title)
        setShowCreateResume(true)
    }

useEffect(() => {
    loadAllResumes()
}, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin size-10 text-blue-600"/></div>
    }

    return (
        <div> 
            <div className="max-w-screen-xl mx-auto px-4 py-10">

               <p className="text-2xl font-medium mb-6 
               bg-gradient-to-r from-slate-600
               to-slate-400 bg-clip-text text-transparent 
               sm:hidden">Welcome, {user?.name}</p>

               <div className="flex gap-4">
                <button onClick={() => { setShowCreateResume(true); setResumeId(null); setTitle('') }} className="w-full bg-white sm:max-w-36 h-48 
                flex flex-col items-center justify-center rounded-lg gap-2
                 text-slate-600 border border-dashed border-slate-300 
                 hover:border-indigo-500 hover:shadow-lg transition-all 
                 cursor-pointer">
                    <PlusIcon className="size-11 transition-all-duration-300
                    p-2.5 bg-gradient-to-br from-indigo-300 to-indiogo-500 
                    text-white rounded-full"/>
                    <p className="text-sm group-hover:text-indigo-600 
                    transition-all-duration-300 ">Create resume</p>
                </button>

                <button onClick={()=> setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 
                flex flex-col items-center justify-center rounded-lg gap-2
                 text-slate-600 border border-dashed border-slate-300 
                 hover:border-purple-500 hover:shadow-lg transition-all 
                 cursor-pointer">
                    <UploadCloudIcon className="size-11 transition-all-duration-300
                    p-2.5 bg-gradient-to-br from-indigo-300 to-purple-500 
                    text-white rounded-full"/>
                    <p className="text-sm group-hover:text-purple-600 
                    transition-all-duration-300 ">Upload Existing</p>
                </button>
               </div>
                <hr className="border border-slate-300 
                my-6 sm:w-[305px]" />
                <div className="grid grid-cols-2 sm:flex 
                flex-wrap gap-4">
                        {allResumes.map((resume , index) => {
                            const baseColor=colors[index % colors.length];
                            return (
                                <button key={resume._id} onClick={()=> navigate(`/app/builder/${resume._id }`)} className='relative w-full 
                                sm:max-w-36 h-48 flex flex-col items-center 
                                justify-center rounded-lg gap-2 border group hover:shadow-lg 
                                transition-all duration-300 cursor-pointer' style={{background:`linear-gradient(135deg , ${baseColor}10, ${baseColor}40
                                )` , borderColor:baseColor + '40'}}>
                        <FilePenLineIcon className="size-7  group-hover:scale-105 " style={{color : baseColor}}/>
                                 <p className="text-sm px-2 text-center group-hover:scale-105 transition-all duration-300"
                                 style={{color : baseColor}}>
                                    {resume.title}
                                </p>
                                <p className="absolute bottom-1 text-[11px] font-[400] 
                                group-hover:font-[500] transition-all duration-300 text-center "
                                style={{color : baseColor + "90"}}>
                                    Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                                <div className="absolute top-1 right-1 flex items-center
                                 justify-center 
                                hidden group-hover:flex transition-all duration-300">
                                    <TrashIcon onClick={(e)=> onDelete(e, resume._id)} className="size-7 p-1.5 hover:bg-white/50 
                                    rounded text-slate-700  transition-colors"/>
                                    <PencilIcon onClick={(e)=> onEdit(e, resume)} className="size-7 p-1.5 hover:bg-white/50 
                                    rounded text-slate-700  transition-colors" />
                                </div>

                                </button>
                               
                            )})
                        }
                                
                </div>

                {
                    showCreateResume && (
                        <form onSubmit={CreateResume} onClick={()=>{setShowCreateResume(false); setTitle(''); setResumeId(null)}} className="fixed inset-0 bg-black/70 
                        backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
                            <div  className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
  onClick={(e) => e.stopPropagation()} >
                                <h2 className="text-xl font-bold mb-4">
                                    {editresumeId ? "Edit Resume" : "Create a Resume"}
                                </h2>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter resume title" 
                                className="w-full px-4 py-2 my-4 
                                focus:border-green-600 focus:ring-green-600" required/>
                                <button className="w-full py-2 bg-green-600 
                                text-white rounded hover:bg-green-700 transition-colors">
                                    {editresumeId ? "Update" : "Create Resume"}</button>
                                    <XIcon className="absolute top-4 right-4
                                     text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=>{setShowCreateResume(false); setTitle(''); setResumeId(null)}}/>
                            </div>
                        </form>
                    )
                }

                {
                    showUploadResume && (
                  <form onSubmit={UploadResume} onClick={()=> setShowUploadResume(false)} className="fixed inset-0 bg-black/70 
                        backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
                            <div  className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
  onClick={(e) => e.stopPropagation()} >
                                <h2 className="text-xl font-bold mb-4">
                                    Uplaod a Resume
                                </h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" 
                                className="w-full px-4 py-2 my-4 
                                focus:border-green-600 focus:ring-green-600" required/>
                                <div>
                                    <label htmlFor="resume-input" className="block
                                     text-sm text-slate-700">
                                        select resume file
                                        <div className="flex flex-col items-center justify-center gap-2
                                        border group text-slate-400 border-slate-400 border-dashed
                                        rounded-md p-4 py-10 my-4 hover:border-green-500
                                        hover:text-green-700 cursor-pointer transition-colors">

                                        {resume ? (
                                            <p className="text-green-700">{resume.name}</p>
                                        ) : (
                                            <>
                                            <UploadCloudIcon className="size-14 stroke-1" />
                                            <p>Upload Resume</p>
                                            </>
                                        )}
                                </div>

                                     </label>
                                     <input onChange={handleFileChange} type="file" id="resume-input" className="hidden" accept=".pdf,.doc,.docx" />
                                </div>

                                <button disabled={isUploading} className="w-full py-2 bg-green-600 
                                text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                                   {isUploading && <Loader2 className="animate-spin size-4" />}
                                   {isUploading ? "Uploading..." : "Upload Resume"}
                                </button>
                                    <XIcon className="absolute top-4 right-4
                                     text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=>{setShowUploadResume(false); setTitle('')}}/>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>

    )
  }

  export default Dashboard
