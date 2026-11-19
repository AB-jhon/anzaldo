import React, { useState, useEffect } from 'react';
import { Car, FileText, Plus, Users, Menu, X, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Obtener el correo del usuario logueado en Supabase
  useEffect(() => {
    async function obtenerUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    }
    obtenerUsuario();
  }, []);

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* 1. BARRA SUPERIOR MÓVIL (Visible solo en celulares/tablets pequeñas: md:hidden) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#3b6084] text-white w-full sticky top-0 z-50 shadow-md">
        <span className="font-bold text-sm">Sistema Anzaldo</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-lg bg-white/10 text-white focus:outline-none cursor-pointer"
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
        {/* PARTE SUPERIOR: Logo y Navegación */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-white/10">
            <img
              src="/Logo.png"
              alt="Logo Anzaldo"
              className='h-15 w-auto object-contain'
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

        {/* PARTE INFERIOR: Perfil del Usuario y Botón de Salir */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {/* Correo o identificador del usuario activo */}
          <div className="flex items-center space-x-2 px-2 text-xs text-slate-300 truncate" title={userEmail}>
            <User size={14} className="shrink-0 text-slate-300" />
            <span className="font-semibold text-white truncate">{userEmail || 'Admin'}</span>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleCerrarSesion}
            className="w-full flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 border border-red-500/30 text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>

          <div className="text-[10px] text-slate-400 text-center pt-1">
            Sistema Anzaldo v1.0
          </div>
        </div>
      </aside>
    </>
  );
}