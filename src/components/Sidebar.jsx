import React, { useState } from 'react';
import { Car, FileText, Plus, Users, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. BARRA SUPERIOR MÓVIL (Visible solo en celulares/tablets pequeñas: md:hidden) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#3b6084] text-white w-full sticky top-0 z-50 shadow-md">
        <span className="font-bold text-sm">Sistema Anzaldo</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-lg bg-white/10 text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. FONDO OSCURO (Aparece cuando el menú móvil está abierto) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* 3. PANEL LATERAL (Sidebar) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-64 bg-[#3b6084] text-white min-h-screen p-4 flex flex-col justify-between shrink-0
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-white/10">
            <img
              src="/Logo.png"
              alt="Logo Anzaldo"
              className='h-12 w-auto object-contain'
            />
          </div>

          <nav className="space-y-1.5 text-sm font-medium" onClick={() => setIsOpen(false)}>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
              <Car size={18} /><span>Vehículos y Flotillas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
              <FileText size={18} /><span>Órdenes de Servicio</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-[#a61c30] text-white font-bold shadow-md">
              <Plus size={18} /><span>Nueva Orden</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded text-slate-200 hover:bg-white/10 transition">
              <Users size={18} /><span>Clientes</span>
            </a>
          </nav>
        </div>

        <div className="text-xs text-slate-300 text-center py-2 border-t border-white/10">
          Sistema Anzaldo v1.0
        </div>
      </aside>
    </>
  );
}