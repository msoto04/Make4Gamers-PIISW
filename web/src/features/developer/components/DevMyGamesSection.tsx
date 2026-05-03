import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Play, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../../supabase';
import type { Game } from '../../games/services/getGames';

function getStatusStyle(status: string) {
  const s = status?.toLowerCase();
  if (s === 'activo') return { label: 'Activo', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  if (s === 'revision' || s === 'en revisión' || s === 'en revision') return { label: 'En revisión', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
  if (s === 'rechazado') return { label: 'Rechazado', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
  if (s === 'inactivo') return { label: 'Inactivo', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
  return { label: status ?? 'Desconocido', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
}

export default function DevMyGamesSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('games')
        .select('*')
        .eq('developer_id', user.id)
        .order('created_at', { ascending: false });

      setGames((data ?? []) as Game[]);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0,1,2,3].map(i => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-800/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Mis juegos</h2>
        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-400">
          {games.length} juego{games.length !== 1 ? 's' : ''}
        </span>
      </div>

      {!games.length ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-700 py-20 text-center">
          <AlertCircle size={40} className="text-slate-600" />
          <div>
            <p className="font-medium text-slate-300">No has subido ningún juego todavía</p>
            <p className="mt-1 text-sm text-slate-500">Contacta con el equipo de M4G para publicar tu primer juego.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => {
            const { label, cls } = getStatusStyle(game.status);
            return (
              <div
                key={game.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/10"
              >
                {/* Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                  {game.thumbnail_url ? (
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Gamepad2 size={40} className="text-slate-600" />
                    </div>
                  )}
                  <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${cls}`}>
                    {label}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="font-semibold text-white">{game.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                      {game.description ?? 'Sin descripción'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {game.genre && (
                      <span className="rounded-md bg-slate-800 px-2 py-0.5">{game.genre}</span>
                    )}
                    {game.version && (
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono">v{game.version}</span>
                    )}
                    {game.available_modes?.map(mode => (
                      <span key={mode} className="rounded-md bg-slate-800 px-2 py-0.5">{mode}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Link
                      to={`/game/${game.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/20 hover:text-violet-200"
                    >
                      <Play size={12} />
                      Jugar
                    </Link>
                    <Link
                      to={`/juegos/${game.id}/reglas`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                    >
                      <ExternalLink size={12} />
                      Ver ficha
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
