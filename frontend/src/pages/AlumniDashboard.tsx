import AlumniCards from "../components/AlumniCards";

export default function AlumniDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Alumni Dashboard</h1>
        <p className="text-gray-600">
          Post mentorships/jobs, interact with students, share announcements.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Featured Alumni</h2>
        <AlumniCards />
      </div>
    </div>
  );
}
