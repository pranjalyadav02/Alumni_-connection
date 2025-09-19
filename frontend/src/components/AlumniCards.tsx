import React from "react";
import { alumniData } from "../lib/alumniData";

export default function AlumniCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {alumniData.map((alumnus, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              alumnus.name
            )}&background=0D8ABC&color=fff&size=128`}
            alt={alumnus.name}
            className="w-24 h-24 rounded-full mb-4"
          />
          <div className="text-lg font-semibold">{alumnus.name}</div>
          <div className="text-sm text-gray-500 mb-1">{alumnus.college}</div>
          <div className="text-sm text-gray-600 mb-2">{alumnus.email}</div>
          <a
            href={alumnus.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View LinkedIn
          </a>
        </div>
      ))}
    </div>
  );
}
