import React from 'react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#3b6084] text-white min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 py-3 border-b border-white/10">
          <img
           src="/Logo.png"
           alt="Logo Anzaldo"
           className='h-15 w-auto object-contain'
           />
          <div className="leading-tight">
          </div>
        </div>

        <nav className="space-y-1.5 text-sm font-medium">
          /* <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
            <span>📊</span><span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
            <span>🚗</span><span>Vehículos y Flotillas</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
            <span>📋</span><span>Órdenes de Servicio</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-[#a61c30] text-white font-bold shadow-md">
            <span>➕</span><span>Nueva Orden</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
            <span>👥</span><span>Clientes</span>
          </a>
        </nav>
      </div>

      <div className="text-xs text-slate-300 text-center py-2 border-t border-white/10">
        Sistema Anzaldo v2.0
      </div>
    </aside>
  )
}