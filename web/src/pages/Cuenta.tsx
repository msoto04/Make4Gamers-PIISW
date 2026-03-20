import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Calendar, Activity } from 'lucide-react';
import { supabase } from '../supabase';
import FriendManager from '../features/social/components/FriendManager';

export default function Cuenta() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        //Obtiene el usuario autenticado actual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          //Buscamos sus datos publicos en la tabla profiles
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        }
      } catch (error) {
        console.error("Error cargando el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <UserIcon size={48} className="mb-4 opacity-50" />
        <p>No se pudo cargar el perfil. Asegúrate de haber iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del perfil */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-indigo-400" />
              )}
            </div>
            
            {/* Inf del usuario */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username || 'Usuario Sin Nombre'}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                {profile.email && (
                  <span className="flex items-center gap-1.5"><Mail size={16} /> {profile.email}</span>
                )}
                <span className="flex items-center gap-1.5"><Activity size={16} /> Estado: <span className="text-green-400">{profile.status}</span></span>
                <span className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase text-xs font-bold tracking-wider">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seccion de gestion de amigos */}
        <div className="animate-fade-in">
          <FriendManager />
        </div>

      </div>
    </div>
  );
}