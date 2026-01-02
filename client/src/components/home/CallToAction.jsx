import React from 'react'
import { Link } from 'react-router-dom'
import Title from './Title'

const CallToAction = () => {
    return (
        <div id='cta' className='flex flex-col items-center my-10 scroll-mt-12'>
            <Title
                title="Ready to build your resume?"
                description="Join thousands of job seekers who have landed their dream jobs with our AI-powered resume builder."
            />
            <Link to='/app' className="bg-green-500 hover:bg-green-600 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center transition-colors mt-8">
                Get started
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right ml-1 size-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
        </div>
    )
}

export default CallToAction
