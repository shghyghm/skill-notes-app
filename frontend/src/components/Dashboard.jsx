import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Skills from "./Skills";
import Notes from "./Notes";

export default function Dashboard({ token, onLogout }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skill Notes
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Skills */}
          <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <Skills
                token={token}
                onSelect={(skill) => {
                  setSelectedSkill(skill);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>

          {/* Main Content - Notes */}
          <div className="lg:col-span-3">
            {selectedSkill ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <Notes
                  skill={selectedSkill}
                  token={token}
                  onBack={() => setSelectedSkill(null)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  مهارت خود را انتخاب کنید
                </h3>
                <p className="text-gray-600">
                  یک مهارت از لیست سمت چپ انتخاب کنید تا یادداشت‌های آن را مشاهده کنید
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
