import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const dashboardCards = [
    {
      title: "Posts",
      description: "Explore",
      path: "/posts",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9l4-4m-4 0l4 4" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      title: "Alumni",
      description: "Community",
      path: "/alumni",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Panel",
      description: "Admin",
      path: "/admin",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header Section */}
        <div className={`transform transition-all duration-700 ${isLoading ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                    user 
                      ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                      : 'bg-red-500/20 border-red-500/30 text-red-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        user ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm font-medium">
                        {user ? "Signed In" : "Not Signed In"}
                      </span>
                    </div>
                  </div>
                  {user && (
                    <p className="text-gray-300 text-lg">
                      Welcome back, <span className="font-semibold text-white">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* User Avatar */}
              {user && (
                <div className="hidden md:flex">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                    <span className="text-white font-bold text-lg">
                      {(user.displayName || user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Sessions</p>
                    <p className="text-2xl font-bold text-white">{user ? '1' : '0'}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Features</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Access Level</p>
                    <p className="text-2xl font-bold text-white">{user ? 'Full' : 'Guest'}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className={`transform transition-all duration-700 delay-300 ${isLoading ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <Link
                key={card.title}
                to={card.path}
                className="block group relative"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`
                  relative p-6 rounded-2xl border-2 backdrop-blur-xl transition-all duration-500 transform
                  ${activeCard === index ? 'scale-105 shadow-2xl' : 'scale-100 shadow-xl'}
                  bg-gradient-to-br ${card.bgGradient} ${card.borderColor}
                  group-hover:shadow-2xl group-hover:border-opacity-60
                  overflow-hidden
                `}>
                  {/* Animated Background Gradient */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-gradient-to-br ${card.gradient}
                  `}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`
                      w-14 h-14 rounded-xl mb-4 flex items-center justify-center transition-all duration-300
                      bg-gray-800/50 group-hover:bg-white/10 backdrop-blur-sm
                      ${activeCard === index ? 'scale-110' : 'scale-100'}
                    `}>
                      <div className={`text-transparent bg-gradient-to-r ${card.gradient} bg-clip-text`}>
                        {card.icon}
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 mb-1">
                      {card.description}
                    </div>
                    <div className={`
                      text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent
                      transition-all duration-300
                      ${activeCard === index ? 'tracking-wide' : 'tracking-normal'}
                    `}>
                      {card.title}
                    </div>
                    
                    {/* Animated Arrow */}
                    <div className={`
                      absolute bottom-6 right-6 transform transition-all duration-300
                      ${activeCard === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}
                    `}>
                      <svg className={`w-6 h-6 bg-gradient-to-r ${card.gradient} text-transparent bg-clip-text`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className={`transform transition-all duration-700 delay-500 ${isLoading ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Profile", icon: "👤", path: "/profile" },
                { name: "Settings", icon: "⚙️", path: "/settings" },
                { name: "Messages", icon: "💬", path: "/messages" },
                { name: "Help", icon: "❓", path: "/help" }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="text-gray-300 group-hover:text-white font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}