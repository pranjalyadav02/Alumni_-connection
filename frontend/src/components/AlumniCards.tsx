import React, { useState, useEffect } from "react";
import { alumniData } from "../lib/alumniData";

export default function AlumniCards() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-blue-500"
    ];
    return gradients[index % gradients.length];
  };

  const getRoleIcon = (role: string) => {
    const roleIcons: { [key: string]: string } = {
      "Software Engineer": "💻",
      "Product Manager": "📊",
      "Data Scientist": "📈",
      "UX Designer": "🎨",
      "DevOps Engineer": "⚙️",
      "Full Stack Developer": "🌐",
      "Frontend Developer": "🎯",
      "Backend Engineer": "🔧",
      "Mobile Developer": "📱",
      "AI Engineer": "🤖"
    };
    return roleIcons[role] || "👤";
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transform transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}>
      {alumniData.map((alumnus, idx) => {
        const gradient = getRandomGradient(idx);
        
        return (
          <div
            key={idx}
            className="group relative"
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Main Card */}
            <div className={`
              relative bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 
              transition-all duration-500 transform overflow-hidden
              ${hoveredCard === idx ? 'scale-105 shadow-2xl border-purple-500/30' : 'scale-100 shadow-xl'}
              hover:shadow-2xl
            `}>
              {/* Animated Background Gradient */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-br ${gradient}
              `}></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar with Gradient Border */}
                <div className="relative mb-4">
                  <div className={`
                    absolute inset-0 rounded-full bg-gradient-to-r ${gradient} blur-md opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500
                  `}></div>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      alumnus.name
                    )}&background=6366f1&color=fff&size=128&bold=true&font-size=0.5`}
                    alt={alumnus.name}
                    className="w-20 h-20 rounded-full border-4 border-gray-700/50 group-hover:border-transparent transition-all duration-300 relative z-10"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors duration-300">
                  {alumnus.name}
                </h3>

                {/* Role with Icon */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getRoleIcon(alumnus.role)}</span>
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white/90 transition-colors duration-300">
                    {alumnus.role}
                  </span>
                </div>

                {/* Company */}
                {alumnus.company && (
                  <div className="text-gray-400 text-sm mb-3 group-hover:text-white/80 transition-colors duration-300">
                    @ {alumnus.company}
                  </div>
                )}

                {/* College */}
                <div className="text-gray-500 text-xs mb-3 group-hover:text-white/70 transition-colors duration-300 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{alumnus.college}</span>
                </div>

                {/* Skills/Tags */}
                {alumnus.skills && (
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {alumnus.skills.slice(0, 3).map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-gray-600/30 group-hover:bg-white/10 group-hover:text-white transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {alumnus.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs border border-gray-600/30">
                        +{alumnus.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-2">
                  {/* LinkedIn Button */}
                  <a
                    href={alumnus.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 hover:text-white transition-all duration-300 transform hover:scale-105 group/linkedin"
                  >
                    <svg className="w-4 h-4 group-hover/linkedin:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="text-sm">Connect</span>
                  </a>

                  {/* Email Button */}
                  <a
                    href={`mailto:${alumnus.email}`}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600/30 hover:bg-gray-600/50 hover:text-white transition-all duration-300 transform hover:scale-105 group/email"
                  >
                    <svg className="w-4 h-4 group-hover/email:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Hover Gradient Glow */}
            <div className={`
              absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 blur-xl 
              group-hover:opacity-20 transition-opacity duration-500 -z-10
            `}></div>
          </div>
        );
      })}
    </div>
  );
}