import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const dashboardCards = [
    {
      title: "Jobs & Internships",
      description: "Browse",
      path: "/posts",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Message Alumni",
      description: "Connect",
      path: "/messages",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      title: "Your Profile",
      description: "Manage",
      path: "/profile",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30"
    }
  ];

  const quickActions = [
    {
      title: "Create Post",
      path: "/posts/create",
      icon: "📝",
      description: "Share opportunities"
    },
    {
      title: "Saved Posts",
      path: "/saved",
      icon: "💾",
      description: "Your bookmarks"
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: "🔔",
      description: "Latest updates"
    },
    {
      title: "Resources",
      path: "/resources",
      icon: "📚",
      description: "Learning materials"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className={`max-w-6xl mx-auto space-y-8 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Header Section */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                Welcome back, {user?.displayName ?? "Student"}! 👋
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                Explore job opportunities, connect with alumni mentors, and manage your career journey 
                in one place. Your next big opportunity awaits!
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Applications</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Messages</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Saved Posts</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Cards */}
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
                overflow-hidden h-full
              `}>
                {/* Animated Background Gradient */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  bg-gradient-to-br ${card.gradient}
                `}></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className={`
                    w-14 h-14 rounded-xl mb-4 flex items-center justify-center transition-all duration-300
                    bg-gray-800/50 group-hover:bg-white/10 backdrop-blur-sm
                    ${activeCard === index ? 'scale-110' : 'scale-100'}
                  `}>
                    <div className={`text-transparent bg-gradient-to-r ${card.gradient} bg-clip-text`}>
                      {card.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 mb-1">
                      {card.description}
                    </div>
                    <div className={`
                      text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent
                      transition-all duration-300
                      ${activeCard === index ? 'tracking-wide' : 'tracking-normal'}
                    `}>
                      {card.title}
                    </div>
                  </div>
                  
                  {/* Animated Arrow */}
                  <div className={`
                    mt-4 transform transition-all duration-300
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

        {/* Quick Actions Section */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="border-b border-gray-700/50 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
              Quick Actions
            </h2>
            <p className="text-gray-400 mt-2">Fast access to frequently used features</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group bg-gray-700/30 rounded-xl border border-gray-600/30 p-4 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {[
                { name: "Google Internship", date: "Tomorrow", type: "Internship" },
                { name: "Microsoft Application", date: "In 3 days", type: "Job" },
                { name: "Alumni Mentorship", date: "Next week", type: "Mentorship" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.type}</div>
                  </div>
                  <div className="text-yellow-400 text-sm font-medium">{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Connections */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Recommended Alumni
            </h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Software Engineer @ Meta" },
                { name: "Alex Rodriguez", role: "Product Manager @ Google" },
                { name: "Maya Patel", role: "Data Scientist @ Netflix" }
              ].map((alumni, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {alumni.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{alumni.name}</div>
                    <div className="text-sm text-gray-400">{alumni.role}</div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}