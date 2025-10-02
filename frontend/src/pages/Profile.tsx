import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { logOut } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data() as any;
      setHeadline(data?.headline || "");
      setBio(data?.bio || "");
      setPhotoURL(data?.photoURL || user.photoURL || "");
      setDisplayName(data?.displayName || user.displayName || "");
    })();
  }, [user]);

  async function save() {
    if (!user) return;
    setIsLoading(true);
    setMessage("");
    try {
      const refDoc = doc(db, "users", user.uid);
      await setDoc(
        refDoc,
        {
          displayName,
          headline,
          bio,
          photoURL,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
      setMessage("Profile saved successfully!");
      
      // Auto-clear success message
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsLoading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
      setMessage("Photo updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage("Failed to upload photo");
    } finally {
      setIsLoading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleLogout() {
    await dispatch(logOut());
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-gray-400">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className={`max-w-6xl mx-auto transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Header */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-gray-400">Manage your account information and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-6">
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile", icon: "👤" },
                  { id: "security", label: "Security", icon: "🔒" },
                  { id: "preferences", label: "Preferences", icon: "⚙️" },
                  { id: "notifications", label: "Notifications", icon: "🔔" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Success Message */}
              {message && (
                <div className={`p-4 border-b ${
                  message.includes("Failed") 
                    ? "bg-red-500/20 border-red-500/30" 
                    : "bg-green-500/20 border-green-500/30"
                }`}>
                  <div className="flex items-center space-x-2">
                    <svg className={`w-5 h-5 ${
                      message.includes("Failed") ? "text-red-400" : "text-green-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        message.includes("Failed") 
                          ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      } />
                    </svg>
                    <span className={message.includes("Failed") ? "text-red-300" : "text-green-300"}>
                      {message}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=6366f1&color=fff&size=150`}
                          className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-600/50 shadow-2xl mx-auto mb-4 hover:scale-105 transition-transform duration-300"
                          alt="Profile"
                        />
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 hover:opacity-30 transition-opacity duration-300"></div>
                        
                        {/* Upload Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUpload}
                      />
                      <button
                        onClick={() => fileInput.current?.click()}
                        disabled={isLoading}
                        className="w-full bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Upload Photo</span>
                          </>
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG or GIF • Max 5MB
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="lg:w-2/3 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Full Name</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Headline</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="e.g., Software Engineer at Google"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Bio</span>
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50 resize-none h-32"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                      />
                      <p className="text-xs text-gray-400">
                        {bio.length}/500 characters
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-700/50">
                      <button
                        onClick={save}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="px-6 py-3 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}