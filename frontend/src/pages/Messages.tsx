import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { setRoomMessages, sendMessage } from "../features/chat/chatSlice";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

export default function Messages() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);
  const [roomId] = useState("default-room");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messages = useSelector(
    (s: RootState) => s.chat.messagesByRoom[roomId] || []
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator simulation
  useEffect(() => {
    if (text.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [text]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
      }));
      dispatch(setRoomMessages({ roomId, messages: docs }));
    });
    return () => unsub();
  }, [dispatch, roomId, user]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user) return;

    setIsLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "messages"), {
        roomId,
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err: any) {
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    setError("");

    try {
      const storageRef = ref(
        storage,
        `messages/${user.uid}_${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "messages"), {
        roomId,
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
        text: `[File: ${file.name}]`,
        fileUrl: url,
        fileName: file.name,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError("Failed to upload file");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
          <p className="text-gray-400">Please login to view messages</p>
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

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Group Chat</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{messages.length} messages</span>
                    {isTyping && (
                      <div className="flex items-center space-x-1 text-purple-400">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-150"></div>
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-300"></div>
                        </div>
                        <span>typing...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Messages List */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-800/20 to-gray-900/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                <p className="text-gray-400 max-w-sm">
                  Start the conversation! Send a message to begin chatting with the community.
                </p>
              </div>
            ) : (
              messages.map((m, index) => {
                const msg = m as any;
                const isCurrentUser = msg.senderId === user.uid;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} transform transition-all duration-300 ${
                      index === messages.length - 1 ? 'animate-fade-in' : ''
                    }`}
                  >
                    <div className={`max-w-xs lg:max-w-md rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-lg'
                        : 'bg-gray-700/50 border-gray-600/30 text-white rounded-bl-none shadow'
                    }`}>
                      {/* Sender Info */}
                      <div className={`flex items-center space-x-2 mb-2 ${
                        isCurrentUser ? 'text-purple-100' : 'text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          isCurrentUser ? 'bg-purple-200' : 'bg-green-400'
                        }`}></div>
                        <span className="text-sm font-medium">{msg.senderName}</span>
                        <span className="text-xs opacity-75">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : ''}
                        </span>
                      </div>
                      
                      {/* Message Content */}
                      <div className="break-words">{msg.text}</div>
                      
                      {/* File Attachment */}
                      {msg.fileUrl && (
                        <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{msg.fileName}</p>
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs ${
                                  isCurrentUser ? 'text-purple-200 hover:text-white' : 'text-blue-400 hover:text-blue-300'
                                } transition-colors duration-200`}
                              >
                                Download file
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={onSend} className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
            <div className="flex gap-3">
              {/* File Upload Button */}
              <input
                type="file"
                onChange={onFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
                ref={fileInputRef}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-12 h-12 bg-gray-700/50 border border-gray-600/30 rounded-xl hover:bg-gray-600/50 cursor-pointer transition-all duration-300 hover:scale-105 disabled:opacity-50 group"
              >
                <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </label>

              {/* Message Input */}
              <div className="flex-1 relative">
                <input
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 disabled:opacity-50"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}