import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Login from './components/Login';
import RecepcionVehiculo from './pages/RecepcionVehiculo';

export default function App() {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorAcceso, setErrorAcceso] = useState(null);

  useEffect(() => {
    // Revisar si ya hay una sesión activa al cargar o refrescar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        cargarPerfilPersonal(session.user.id);
      } else {
        setCargando(false);
      }
    });

    // Escuchar cambios de sesión (inicio y cierre)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        cargarPerfilPersonal(session.user.id);
      } else {
        setPerfil(null);
        setCargando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarPerfilPersonal = async (authId) => {
    setCargando(true);
    setErrorAcceso(null);

    const { data, error } = await supabase
      .from('personal')
      .select('id_personal, nombre_completo, rol, estatus')
      .eq('auth_id', authId)
      .single();

    if (error || !data) {
      setErrorAcceso('Tu cuenta no está vinculada en el catálogo de personal.');
      await supabase.auth.signOut();
      setCargando(false);
      return;
    }

    if (data.estatus?.toLowerCase() !== 'activo') {
      setErrorAcceso('Tu cuenta se encuentra inactiva o suspendida.');
      await supabase.auth.signOut();
      setCargando(false);
      return;
    }

    setPerfil(data);
    setCargando(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Verificando credenciales...
      </div>
    );
  }

  if (!session || !perfil) {
    return (
      <div>
        {errorAcceso && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-lg text-sm shadow-lg">
            {errorAcceso}
          </div>
        )}
        <Login />
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-slate-950 text-white">
      <RecepcionVehiculo perfil={perfil} onLogout={handleLogout} />
    </div>
  );
}