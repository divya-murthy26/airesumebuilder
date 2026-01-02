import React, { useState } from 'react';
import { X, Copy, Check, Mail, MessageCircle, Linkedin } from 'lucide-react';

const ShareResume = ({ isOpen, onClose, resumeId }) => {
    const [copied, setCopied] = useState(false);
    
    // Generate link based on current origin and resume ID
    const shareUrl = `${window.location.origin}/preview/${resumeId}`;

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleSocialShare = (platform) => {
        const text = "Check out my resume!";
        const url = encodeURIComponent(shareUrl);
        const subject = encodeURIComponent("Check out my resume");
        const body = encodeURIComponent(`Hi,\n\nI wanted to share my resume with you: ${shareUrl}`);

        let link = '';
        switch (platform) {
            case 'gmail':
                link = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
                break;
            case 'outlook':
                // Opens Outlook Web Compose
                link = `https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`;
                break;
            case 'whatsapp':
                link = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`;
                break;
            case 'linkedin':
                link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            default:
                return;
        }
        
        // Open in new popup window
        window.open(link, '_blank', 'width=600,height=600');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Share Resume</h2>
                        <p className="text-sm text-slate-500">Share your resume with the world</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="size-5 text-slate-500" />
                    </button>
                </div>

                {/* Link Copy Section */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Public Link</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            readOnly 
                            value={shareUrl} 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
                            onClick={(e) => e.target.select()}
                        />
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                copied
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Social Share Options */}
                <div>
                    <p className="text-sm font-medium text-slate-700 mb-4">Share via</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleSocialShare('gmail')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                            <div className="size-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
                                <Mail className="size-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Gmail</span>
                        </button>

                        <button onClick={() => handleSocialShare('outlook')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                            <div className="size-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                                <Mail className="size-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Outlook</span>
                        </button>

                        <button onClick={() => handleSocialShare('whatsapp')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                            <div className="size-8 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors">
                                <MessageCircle className="size-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">WhatsApp</span>
                        </button>

                        <button onClick={() => handleSocialShare('linkedin')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                            <div className="size-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-700 transition-colors">
                                <Linkedin className="size-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareResume;