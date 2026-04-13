import { useState, useEffect } from 'react';


import { supabase } from '../supabase';
import { removeFriend } from '../features/chat/services/friend.service';
import { useParams, Link, useNavigate } from 'react-router-dom'; 

import { User as UserIcon, Activity, ArrowLeft, Trophy, Calendar, Gamepad2, Check, AlertCircle, AlertTriangle, Medal } from 'lucide-react';


export default function PerfilUsuario() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const navigate = useNavigate();
  const [highScores, setHighScores] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfileAndActivity = async () => {
      try {
        //Buscar perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }


        if (profileData) {
         
          const { data: activityData, error: activityError } = await supabase
            .from('scores')
            .select(`id, score, created_at, game:games(title)`)
            .eq('user_id', profileData.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!activityError && activityData) {
            setRecentActivity(activityData);
          }

        
          const { data: scoresData, error: scoresError } = await supabase
            .from('scores')
            .select(`id, score, created_at, game:games(title)`)
            .eq('user_id', profileData.id)
            .order('score', { ascending: false }); 

          if (!scoresError && scoresData) {
           
            const bestScores: any[] = [];
            const seenGames = new Set();
            
            scoresData.forEach((item: any) => {
             
              const gameData = item.game;
              const gameTitle = (Array.isArray(gameData) ? gameData[0]?.title : gameData?.title) || 'Desconocido';
              
              if (!seenGames.has(gameTitle)) {
                seenGames.add(gameTitle);
                bestScores.push(item);
              }
            });
            
         
            setHighScores(bestScores.slice(0, 3));
          }
        }

      } catch (error) {
        console.error("Error cargando el perfil público:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileAndActivity();
    }
  }, [username]);

 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <UserIcon size={64} className="opacity-20" />
        <h2 className="text-2xl font-bold text-white">Usuario no encontrado</h2>
        <p>El jugador que buscas no existe o ha cambiado de nombre.</p>
        <Link to="/cuenta" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> Volver a mi cuenta
        </Link>
      </div>
    );
  }


  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

 
  const executeRemoveFriend = async () => {
    if (!currentUserId || !profile?.id) return;
    
    setDeleteErrorMsg('');
    try {
        const success = await removeFriend(currentUserId, profile.id);
        if (success) {
            setShowDeleteModal(false);
            setDeleteSuccessMsg("Amigo eliminado correctamente");
            
           
            setTimeout(() => {
                navigate('/cuenta');
            }, 2000);
        } else {
            setDeleteErrorMsg("Hubo un error al eliminar al amigo");
            setShowDeleteModal(false);
        }
    } catch (error) {
        setDeleteErrorMsg("Error de conexión al eliminar.");
        setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Boton volver */}
        <Link to="/cuenta" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Volver a mis amigos
        </Link>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-indigo-400" />
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
  
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">{profile?.username}</h1>
                </div>

            {deleteSuccessMsg && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center gap-2 animate-pulse w-full">
                    <Check size={18} />
                    {deleteSuccessMsg}
                </div>
            )}
            {deleteErrorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm flex items-center gap-2 w-full">
                    <AlertCircle size={18} />
                    {deleteErrorMsg}
                </div>
            )}

            <div className="flex items-center justify-between">

            
                {currentUserId && profile?.id && currentUserId !== profile.id && (
                    <button 
                        onClick={handleOpenDeleteModal}
                        disabled={!!deleteSuccessMsg} 
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                    >
                        <UserIcon size={18} />
                        Eliminar amigo
                    </button>
                )}
            </div>
            </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity size={16} /> 
                  Estado: <span className="text-green-400">{profile.status || 'Disponible'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> 
                  Miembro desde: {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

     
          {highScores.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Medal className="text-amber-400" size={24} />
                Mejores Récords
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {highScores.map((record) => {
                
                  const gameData = record.game;
                  const gameTitle = (Array.isArray(gameData) ? gameData[0]?.title : gameData?.title) || 'Desconocido';
                  
                  return (
                    <div 
                      key={`record-${record.id}`} 
                      className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/30 rounded-2xl relative overflow-hidden group hover:border-amber-400/50 transition-colors"
                    >
                      {/* Icono gigante de fondo */}
                      <div className="absolute -right-4 -bottom-4 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300">
                        <Medal size={80} className="text-amber-500" />
                      </div>
                      
                      {/* Contenido del récord */}
                      <div className="relative z-10">
                        <p className="text-sm text-amber-200/80 font-medium mb-1 truncate">
                          {gameTitle}
                        </p>
                        <p className="text-4xl font-black text-amber-400 tracking-tight">
                          {record.score}
                        </p>
                        <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest mt-1">
                          Max Puntuación
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        {/* Actividad reciente */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="text-indigo-400" /> Actividad Reciente
          </h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 border border-slate-800 border-dashed rounded-xl bg-slate-800/20">
              <p className="text-slate-500">Este usuario aún no ha jugado ninguna partida.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Jugó a <span className="text-indigo-400">{activity.game?.title || 'Juego Desconocido'}</span>
                      </p>
                      <p className="text-sm text-slate-400">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{activity.score}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Puntos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">¿Eliminar amigo?</h3>
              <p className="text-slate-400 text-sm">
                Estás a punto de eliminar a <span className="text-indigo-400 font-medium">{profile?.username}</span> de tus amigos. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3 w-full pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeRemoveFriend}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}