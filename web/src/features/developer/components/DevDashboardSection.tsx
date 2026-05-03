import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Gamepad2, CheckCircle2, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

import { supabase } from '../../../supabase';
import type { Game } from '../../games/services/getGames';

type Profile = {
  username: string | null;
  first_name: string | null;
};

type GameSummary = {
  total: number;
  activo: number;
  revision: number;
  otros: number;
  games: Game[];
};

function getStatusStyle(status: string) {
  const s = status?.toLowerCase();
  if (s === 'activo') return { label: 'Activo', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  if (s === 'revision' || s === 'en revisión' || s === 'en revision') return { label: 'En revisión', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
  if (s === 'rechazado') return { label: 'Rechazado', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
  return { label: status, cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
}

export default function DevDashboardSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profileData }, { data: gamesData }] = await Promise.all([
        supabase.from('profiles').select('username, first_name').eq('id', user.id).maybeSingle(),
        supabase.from('games').select('*').eq('developer_id', user.id).order('created_at', { ascending: false }),
      ]);

      setProfile(profileData);

      const games = (gamesData ?? []) as Game[];
      setSummary({
        total: games.length,
        activo: games.filter(g => g.status?.toLowerCase() === 'activo').length,
        revision: games.filter(g => ['revision', 'en revisión', 'en revision'].includes(g.status?.toLowerCase() ?? '')).length,
        otros: games.filter(g => !['activo', 'revision', 'en revisión', 'en revision'].includes(g.status?.toLowerCase() ?? '')).length,
        games: games.slice(0, 4),
      });

      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-44 rounded-2xl bg-slate-800/60" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="h-24 rounded-xl bg-slate-800/60" />)}
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name ?? profile?.username ?? 'Desarrollador';

  return (
    <div className="space-y-7">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-slate-900 to-indigo-950/40 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Desarrollador Verificado
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Bienvenido al equipo de{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                M4G
              </span>
              ,<br />
              <span className="text-slate-200">{displayName}</span>
            </h2>
            <p className="max-w-md text-sm text-slate-400">
              Desde aquí puedes gestionar tus juegos, seguir su evolución y consultar la documentación oficial.
            </p>
          </div>

          <Link
            to="/dev-manual"
            className="group flex shrink-0 items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3.5 text-sm font-medium text-violet-200 transition-all hover:border-violet-400/50 hover:bg-violet-500/20 hover:text-white"
          >
            <BookOpen size={18} className="text-violet-400 transition-transform group-hover:scale-110" />
            <span>Manual de Desarrollador</span>
            <ArrowRight size={14} className="text-violet-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-violet-500/10 p-2">
              <Gamepad2 size={18} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total juegos</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.total ?? 0}</p>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Activos</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.activo ?? 0}</p>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock size={18} className="text-amber-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">En revisión</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.revision ?? 0}</p>
        </div>
      </div>

      {/* Recent games */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Mis juegos recientes</h3>

        {!summary?.games.length ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 py-12 text-center">
            <AlertCircle size={32} className="text-slate-600" />
            <p className="text-slate-400">Aún no has subido ningún juego.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary.games.map((game) => {
              const { label, cls } = getStatusStyle(game.status);
              return (
                <Link
                  key={game.id}
                  to={`/dev-game/${game.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 transition-colors hover:border-violet-500/30 hover:bg-violet-500/5"
                >
                  <div className="flex items-center gap-3">
                    {game.thumbnail_url ? (
                      <img src={game.thumbnail_url} alt={game.title} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                        <Gamepad2 size={18} className="text-slate-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{game.title}</p>
                      <p className="text-xs text-slate-500">{game.genre ?? 'Sin género'}{game.version ? ` · v${game.version}` : ''}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
