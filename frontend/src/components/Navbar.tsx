import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">UMCP</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/posts" className="hover:underline">Posts</Link>
          <Link to="/messages" className="hover:underline">Messages</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </nav>
      </div>
    </header>
  )
}
