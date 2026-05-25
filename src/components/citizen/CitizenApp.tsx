"use client";

import { useState } from "react";
import { Home, FileText, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import HomeTab from "./HomeTab";
import MyReportsTab from "./MyReportsTab";
import ChatbotTab from "./ChatbotTab";
import ProfileTab from "./ProfileTab";
import ReportForm from "./ReportForm";

const tabs = [
  { id: "home",     icon: Home,          label: "Inicio"   },
  { id: "reports",  icon: FileText,       label: "Reportes" },
  { id: "chatbot",  icon: MessageCircle,  label: "Nagua"    },
  { id: "profile",  icon: User,           label: "Perfil"   },
];

export default function CitizenApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<string | undefined>(undefined);

  const openReport = (category?: string) => {
    setReportCategory(category);
    setReportOpen(true);
  };

  const closeReport = () => {
    setReportOpen(false);
    setReportCategory(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      {/* Phone frame */}
      <div className="w-[375px] h-[780px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col border-4 border-slate-800 relative">

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-white shrink-0">
          <span className="text-[10px] font-semibold text-gray-800">9:41</span>
          <div className="w-20 h-5 bg-slate-900 rounded-full" />
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5 items-end">
              <div className="w-0.5 h-1.5 bg-gray-800 rounded-sm" />
              <div className="w-0.5 h-2 bg-gray-800 rounded-sm" />
              <div className="w-0.5 h-2.5 bg-gray-800 rounded-sm" />
              <div className="w-0.5 h-3 bg-gray-800 rounded-sm" />
            </div>
            <div className="w-4 h-2.5 border border-gray-800 rounded-sm ml-1 relative">
              <div className="absolute inset-0.5 bg-gray-800 rounded-sm w-2/3" />
            </div>
          </div>
        </div>

        {/* Main content — full-screen report form OR normal tabs */}
        {reportOpen ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <ReportForm initialCategory={reportCategory} onClose={closeReport} />
          </div>
        ) : (
          <>
            {/* Content area */}
            <div className="flex-1 overflow-y-auto relative">
              {activeTab === "home"    && <HomeTab onNewReport={openReport} />}
              {activeTab === "reports" && <MyReportsTab onNewReport={openReport} />}
              {activeTab === "chatbot" && <ChatbotTab />}
              {activeTab === "profile" && <ProfileTab />}

              {/* FAB — Nuevo Reporte (visible on home & reports tabs) */}
              {(activeTab === "home" || activeTab === "reports") && (
                <button
                  onClick={() => openReport()}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center transition-all active:scale-95 z-50"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="shrink-0 flex border-t border-gray-100 bg-white px-2 pb-2 pt-1 shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all",
                    activeTab === tab.id ? "text-blue-700" : "text-gray-400"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5 transition-all", activeTab === tab.id && "scale-110")} />
                  <span className="text-[9px] font-semibold">{tab.label}</span>
                  {activeTab === tab.id && <div className="w-1 h-1 rounded-full bg-blue-700" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
