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

  useEffect(() => {
    void dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = items.filter(
    (post) => filter === "all" || post.type === filter
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          to="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-2">
          {["all", "job", "internship", "mentorship", "announcement"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {type === "all"
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts found.{" "}
            <Link to="/posts/create" className="text-blue-600 hover:underline">
              Create the first one!
            </Link>
          </div>
        ) : (
          filteredPosts.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    to={`/posts/${p.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {p.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {p.type}
                    </span>
                    <span>
                      {Object.prototype.toString.call(p.createdAt) === "[object Date]"
                        ? (p.createdAt as unknown as Date).toLocaleDateString()
                        : new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <span>{p.views} views</span>
                  </div>
                  <div
                    className="mt-3 text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof p.content === "string"
                          ? p.content.substring(0, 200) +
                            (p.content.length > 200 ? "..." : "")
                          : "",
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/posts/${p.id}/edit`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => reportPost(p.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
