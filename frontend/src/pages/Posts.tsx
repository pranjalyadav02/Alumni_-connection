import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchPosts } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

async function reportPost(postId: string) {
  await addDoc(collection(db, "reports"), {
    postId,
    createdAt: serverTimestamp(),
    reason: "Inappropriate",
    status: "pending",
  });
  alert("Post reported successfully");
}

export default function Posts() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.posts);
  const [filter, setFilter] = useState<string>("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    void dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = items.filter(
    (post) => filter === "all" || post.type === filter
  );

  const getTypeConfig = (type: string) => {
    const config = {
      job: { icon: '💼', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20', text: 'text-blue-300' },
      internship: { icon: '🎓', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20', text: 'text-green-300' },
      mentorship: { icon: '🤝', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20', text: 'text-purple-300' },
      announcement: { icon: '📢', color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/20', text: 'text-orange-300' }
    }
    return config[type as keyof typeof config] || config.announcement;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl max-w-md text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Posts</h3>
          <p className="text-red-300 text-sm">{error}</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9l4-4m-4 0l4 4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Community Posts</h1>
                  <p className="text-gray-400">Discover opportunities and announcements</p>
                </div>
              </div>
              <Link
                to="/posts/create"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Post</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {["all", "job", "internship", "mentorship", "announcement"].map(
              (type) => {
                const config = type === 'all' 
                  ? { icon: '🌐', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-500/20', text: 'text-gray-300' }
                  : getTypeConfig(type);
                
                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-xl backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                      filter === type
                        ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg`
                        : `${config.bg} ${config.text} border-gray-600/30 hover:border-gray-500/50`
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span>
                      {type === "all"
                        ? "All Posts"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9l4-4m-4 0l4 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? "Be the first to share an opportunity with the community!"
                  : `No ${filter} posts found. Try a different filter.`
                }
              </p>
              <Link
                to="/posts/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create First Post</span>
              </Link>
            </div>
          ) : (
            filteredPosts.map((post, index) => {
              const typeConfig = getTypeConfig(post.type);
              const createdAt = Object.prototype.toString.call(post.createdAt) === "[object Date]"
                ? (post.createdAt as unknown as Date).getTime()
                : post.createdAt;

              return (
                <div
                  key={post.id}
                  className={`bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] ${
                    index === 0 ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full ${typeConfig.bg} ${typeConfig.text} border border-current border-opacity-30 text-sm backdrop-blur-sm`}>
                          <span className="mr-1">{typeConfig.icon}</span>
                          {post.type}
                        </span>
                        {post.draft && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-sm backdrop-blur-sm">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-xl font-bold text-white hover:text-purple-300 transition-colors duration-300 block mb-3"
                      >
                        {post.title}
                      </Link>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getTimeAgo(createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.views} views
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div
                        className="text-gray-300 leading-relaxed mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof post.content === "string"
                              ? post.content.substring(0, 200) +
                                (post.content.length > 200 ? "..." : "")
                              : "",
                        }}
                      />

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs border border-gray-600/30 backdrop-blur-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs border border-gray-600/30">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 ml-6">
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="p-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-110"
                        title="Edit Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => reportPost(post.id)}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 transform hover:scale-110"
                        title="Report Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}