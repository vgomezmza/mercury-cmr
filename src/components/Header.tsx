"use client";

import React from "react";
import { Search } from "lucide-react";
import { User } from "../types/crm";

interface HeaderProps {
  onOpenNewLead?: () => void;
  onOpenUsers?: () => void;
  onOpenSocialSimulator?: () => void;
  onGoHome?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  leadsCount: number;
  totalPipelineUsd: number;
  mrrTotalUsd: number;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  searchQuery,
  setSearchQuery,
  currentUser,
  onLogout,
}) => {
  const shortName = currentUser?.nombre ? currentUser.nombre.split(" ")[0] : "";

  return (
    <header className="sticky top-0 z-30 bg-[#040B2A] border-b border-[#2F4FE0] px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* Minimalist MERCURY Wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          aria-label="Mercury Creation & Design"
          className="text-xl sm:text-2xl font-light tracking-[0.22em] text-[#D7DDF5] hover:text-white transition-colors font-poppins uppercase cursor-pointer shrink-0"
        >
          MERCURY
        </button>

        {/* Global White Search Bar */}
        <div className="order-3 md:order-2 w-full md:flex-1 md:max-w-md md:mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#0B1226] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por cliente, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-transparent focus:border-[#375EFB] focus:ring-2 focus:ring-[#375EFB]/35 rounded-lg pl-10 pr-4 py-2 text-sm text-[#0B1226] placeholder-[#4B5563] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* User Avatar, First Name & Logout Button */}
        {currentUser && (
          <div className="order-2 md:order-3 flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3C5EFF] bg-[#DCE0EC] shrink-0 flex items-center justify-center"
                title={`${currentUser.nombre} (${currentUser.rol})`}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#06113D]">
                    {shortName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-normal text-[#E2E8F0] hidden sm:inline">
                {shortName}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#315BFB] hover:bg-[#466DFF] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                title="Cerrar sesión o cambiar de usuario"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
