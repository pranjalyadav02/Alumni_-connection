import AlumniCards from "../components/AlumniCards";
import { useState, useEffect } from "react";

export default function AlumniDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for animations
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className={`transform transition-all duration-700 ${isLoading ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  Alumni Dashboard
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                  Post mentorships and job opportunities, interact with students, 
                  and share important announcements with our vibrant community.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Active Mentorships</p>
                    <p className="text-2xl font-bold text-white">24</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Job Postings</p>
                    <p className="text-2xl font-bold text-white">18</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Announcements</p>
                    <p className="text-2xl font-bold text-white">7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Alumni Section */}
        <div className={`transform transition-all duration-700 delay-300 ${isLoading ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-gray-700/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    Featured Alumni
                    <span className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      New
                    </span>
                  </h2>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  View All
                </button>
              </div>
              <p className="text-gray-400 mt-2">Connect with our most active and influential alumni members</p>
            </div>
            
            {/* Alumni Cards Container */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                <AlumniCards />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 group">
        <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}