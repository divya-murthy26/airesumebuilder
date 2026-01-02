import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import { Loader2 } from "lucide-react";
import api from "../configs/api";
import { toast } from "react-toastify";

const Preview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await api.get(`/api/resumes/${resumeId}`);
                
                const normalizedData = {
                    ...data,
                    personal: data.personal || {},
                    experience: data.experience || [],
                    education: data.education || [],
                    skills: data.skills || [],
                    Professional_summary: data.professional_summary || "",
                    accent_color: data.accent_color || "#3B82F6",
                    template: data.template || "Template1"
                };

                document.title = data.title ? `${data.title} - Preview` : "Resume Preview";
                setResumeData(normalizedData);
            } catch (error) {
                console.error("Failed to fetch resume", error);
                toast.error("Resume not found or private");
                navigate("/");
            }
            setLoading(false);
        };

        fetchResume();
    }, [resumeId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading resume preview...</p>
                </div>
            </div>
        );
    }

    const renderTemplate = () => {
        if (!resumeData) return null;
        switch (resumeData.template) {
            case 'Template1':
            case 'classic':
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

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                    {renderTemplate()}
                </div>
            </div>
        </div>
    );
};

  export default Preview
