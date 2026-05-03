import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Code2, FileText,
  Gamepad2, ImageIcon, Loader2, Tag, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';
import Header from '../shared/layout/Header';
import Footer from '../shared/layout/Footer';

// ─── Constants ────────────────────────────────────────────────────────────────

const GENRES = [
  'Acción', 'Aventura', 'Puzzle', 'Plataformas', 'Arcade',
  'Estrategia', 'Rol (RPG)', 'Simulación', 'Deportes',
  'Multijugador', 'Educativo', 'Otro',
];
const MODES = ['Singleplayer', 'Multijugador', 'Online', 'Cooperativo', 'Competitivo'];

const STEPS = [
  { n: 1, label: 'Información',  icon: Gamepad2  },
  { n: 2, label: 'Técnico',      icon: Code2     },
  { n: 3, label: 'Assets',       icon: ImageIcon },
  { n: 4, label: 'Revisión',     icon: Check     },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 44);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

function fileExt(file: File) { return file.name.split('.').pop() ?? 'bin'; }

function fileSize(file: File) {
  return file.size > 1024 * 1024
    ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
    : `${(file.size / 1024).toFixed(0)} KB`;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors';

function Field({ label, required, hint, counter, children }: {
  label: string; required?: boolean; hint?: string; counter?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}{required && <span className="ml-1 text-rose-400">*</span>}
        </label>
        {counter && <span className="text-xs text-slate-600">{counter}</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

type DropZoneProps = {
  label: string; hint: string; accept: string; icon: React.ElementType;
  file: File | null; onChange: (f: File) => void; onClear: () => void;
};

function FileDropZone({ label, hint, accept, icon: Icon, file, onChange, onClear }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) onChange(f);
  }, [onChange]);

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ''; }} />

        {isImage && file ? (
          <div className="relative">
            <img src={URL.createObjectURL(file)} alt="preview" className="h-44 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white">
                Cambiar
              </button>
            </div>
            <button type="button" onClick={onClear}
              className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1 text-slate-300 hover:text-white">
              <X size={13} />
            </button>
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center justify-center gap-3 px-4 py-8"
            onClick={() => inputRef.current?.click()}>
            {file ? (
              <>
                <Icon size={26} className="text-violet-400" />
                <div className="text-center">
                  <p className="max-w-[220px] truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{fileSize(file)}</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); onClear(); }}
                  className="text-xs text-rose-400 hover:text-rose-300">Quitar archivo</button>
              </>
            ) : (
              <>
                <Icon size={26} className="text-slate-600" />
                <div className="text-center">
                  <p className="text-sm text-slate-400">{hint}</p>
                  <p className="mt-0.5 text-xs text-slate-600">Haz clic o arrastra aquí</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
      {STEPS.map((step, idx) => {
        const done    = step.n < current;
        const active  = step.n === current;
        const Icon    = step.icon;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                done   ? 'border-violet-500 bg-violet-500 text-white' :
                active ? 'border-violet-400 bg-violet-500/20 text-violet-300' :
                         'border-slate-700 bg-slate-900 text-slate-600'
              }`}>
                {done ? <Check size={15} /> : <Icon size={15} />}
              </div>
              <span className={`hidden text-[10px] font-semibold uppercase tracking-wide sm:block ${
                active ? 'text-violet-300' : done ? 'text-violet-500' : 'text-slate-600'
              }`}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mx-2 h-0.5 w-12 shrink-0 transition-colors sm:w-16 ${
                step.n < current ? 'bg-violet-500' : 'bg-slate-800'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Review row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 py-2.5 last:border-0">
      <span className="shrink-0 text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm text-white">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevGameNew() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId]   = useState<string | null>(null);

  // Step 1 — Información
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre]           = useState('');
  const [modes, setModes]           = useState<string[]>([]);

  // Step 2 — Técnico
  const [version, setVersion]       = useState('');
  const [edadMinima, setEdadMinima] = useState('');
  const [price, setPrice]           = useState('');
  const [gameUrl, setGameUrl]       = useState('');
  const [distFile, setDistFile]     = useState<File | null>(null);

  // Step 3 — Assets
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rulesFile, setRulesFile]         = useState<File | null>(null);

  // ── Auth check ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/'); return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'developer' && profile?.role !== 'admin') { navigate('/'); return; }
      setUserId(session.user.id);
    };
    void check();
  }, [navigate]);

  // ── Validation ────────────────────────────────────────────────────────────────

  const validate = (s: number): string | null => {
    if (s === 1) {
      if (!title.trim()) return 'El nombre del juego es obligatorio.';
    }
    if (s === 2) {
      const hasUrl  = gameUrl.trim().length > 0;
      const hasDist = !!distFile;
      if (!hasUrl && !hasDist) return 'Debes indicar una URL o subir un archivo del juego.';
      if (hasUrl && !gameUrl.startsWith('https://')) return 'La URL del juego debe usar HTTPS.';
    }
    if (s === 3) {
      if (!thumbnailFile) return 'La imagen de portada es obligatoria.';
    }
    return null;
  };

  const advance = () => {
    const err = validate(step);
    if (err) { toast.error(err); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Upload helper ─────────────────────────────────────────────────────────────

  const upload = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage
      .from('game-assets')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw new Error(`Storage: ${error.message}`);
    const { data } = supabase.storage.from('game-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!userId || !thumbnailFile) return;
    setSubmitting(true);
    const tid = toast.loading('Subiendo archivos…');

    try {
      const slug = slugify(title);

      // Upload thumbnail (required)
      const thumbnailUrl = await upload(thumbnailFile, `${slug}/thumbnail.${fileExt(thumbnailFile)}`);

      // Upload rules .md (optional)
      let manualUrl: string | null = null;
      if (rulesFile) {
        manualUrl = await upload(rulesFile, `${slug}/rules.md`);
      }

      // Upload dist (optional) — sets game_url if no URL provided
      let finalGameUrl = gameUrl.trim() || null;
      if (distFile) {
        const distUrl = await upload(distFile, `${slug}/dist.${fileExt(distFile)}`);
        if (!finalGameUrl) finalGameUrl = distUrl;
      }

      toast.loading('Creando juego…', { id: tid });

      const { error } = await supabase.from('games').insert({
        developer_id:    userId,
        title:           title.trim(),
        slug,
        description:     description.trim() || null,
        genre:           genre || null,
        available_modes: modes.length ? modes : null,
        version:         version.trim() || null,
        edad_minima:     edadMinima !== '' ? parseInt(edadMinima, 10) : null,
        price:           price !== '' ? parseInt(price, 10) : null,
        game_url:        finalGameUrl,
        thumbnail_url:   thumbnailUrl,
        manual_url:      manualUrl,
        status:          'revision',
        created_at:      new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('¡Juego enviado a revisión!', { id: tid });
      navigate('/developer');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al publicar el juego', { id: tid });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step renders ─────────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      <Field label="Nombre del juego" required counter={`${title.length}/60`}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          maxLength={60} placeholder="Nombre visible en la plataforma" className={inputCls} />
      </Field>

      <Field label="Descripción" counter={`${description.length}/500`}>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          maxLength={500} rows={4} placeholder="Describe tu juego en 50–500 caracteres…"
          className={`${inputCls} resize-none`} />
      </Field>

      <Field label="Género">
        <select value={genre} onChange={e => setGenre(e.target.value)} className={inputCls}>
          <option value="">Sin especificar</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </Field>

      <Field label="Modos de juego">
        <div className="flex flex-wrap gap-2 pt-0.5">
          {MODES.map(m => (
            <button key={m} type="button"
              onClick={() => setModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                modes.includes(m)
                  ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}>
              {m}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Versión" hint="Ej: 1.0.0">
          <input type="text" value={version} onChange={e => setVersion(e.target.value)}
            placeholder="1.0.0" className={`${inputCls} font-mono`} />
        </Field>
        <Field label="Edad mínima" hint="0 = sin restricción">
          <input type="number" value={edadMinima} onChange={e => setEdadMinima(e.target.value)}
            min={0} max={18} placeholder="0" className={inputCls} />
        </Field>
        <Field label="Precio (€)" hint="0 = gratuito">
          <input type="number" value={price} onChange={e => setPrice(e.target.value)}
            min={0} placeholder="0" className={inputCls} />
        </Field>
      </div>

      <Field label="URL del juego" required hint="Debe comenzar por https://. Déjala vacía si subes el dist abajo.">
        <input type="url" value={gameUrl} onChange={e => setGameUrl(e.target.value)}
          placeholder="https://mi-servidor.com/juego" className={inputCls} />
      </Field>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-600">o sube el archivo del juego</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <FileDropZone
        label="Dist del juego"
        hint=".html, .js o .zip — si es HTML se usará como URL del juego"
        accept=".html,.js,.zip"
        icon={Code2}
        file={distFile}
        onChange={setDistFile}
        onClear={() => setDistFile(null)}
      />

      {(gameUrl.trim() || distFile) && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <Check size={14} className="text-emerald-400" />
          <p className="text-xs text-emerald-300">
            {gameUrl.trim() ? 'URL configurada correctamente.' : `Archivo seleccionado: ${distFile?.name}`}
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FileDropZone
        label="Imagen de portada *"
        hint="JPG, PNG o WebP · mínimo 800×600 px · máx. 2 MB"
        accept="image/jpeg,image/png,image/webp"
        icon={ImageIcon}
        file={thumbnailFile}
        onChange={f => {
          if (f.size > 2 * 1024 * 1024) { toast.error('La imagen no puede superar los 2 MB'); return; }
          setThumbnailFile(f);
        }}
        onClear={() => setThumbnailFile(null)}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-600">documento de reglas (opcional)</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <FileDropZone
          label="Reglas del juego"
          hint="Solo formato Markdown (.md)"
          accept=".md"
          icon={FileText}
          file={rulesFile}
          onChange={f => {
            if (!f.name.endsWith('.md')) { toast.error('El documento de reglas debe ser un archivo .md'); return; }
            setRulesFile(f);
          }}
          onClear={() => setRulesFile(null)}
        />

        <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 px-4 py-3">
          <p className="text-xs leading-relaxed text-slate-500">
            El archivo de reglas debe estar en formato{' '}
            <code className="font-mono text-violet-400">Markdown (.md)</code>.
            Puedes incluir texto, listas, tablas e imágenes con sintaxis estándar de Markdown.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const hasUrl  = !!gameUrl.trim();
    const hasDist = !!distFile;

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <p className="text-xs text-violet-300">
            Revisa la información antes de publicar. Tu juego se enviará a revisión y
            el equipo de M4G lo activará en el catálogo cuando supere la verificación.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">

          {/* Info summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Datos del juego</h3>
            <ReviewRow label="Nombre"       value={title} />
            <ReviewRow label="Descripción"  value={
              description
                ? <span className="line-clamp-2 text-left">{description}</span>
                : <span className="text-slate-500 italic">Sin descripción</span>
            } />
            <ReviewRow label="Género"       value={genre || <span className="text-slate-500 italic">Sin especificar</span>} />
            <ReviewRow label="Modos"        value={modes.length ? modes.join(', ') : <span className="text-slate-500 italic">No indicados</span>} />
            <ReviewRow label="Versión"      value={version || <span className="text-slate-500 italic">—</span>} />
            <ReviewRow label="Edad mínima"  value={edadMinima && parseInt(edadMinima) > 0 ? `+${edadMinima}` : 'Para todos'} />
            <ReviewRow label="Precio"       value={price && parseInt(price) > 0 ? `${price} €` : 'Gratuito'} />
            <ReviewRow label="URL / Dist"   value={
              hasUrl ? <span className="max-w-[200px] truncate font-mono text-xs">{gameUrl}</span>
                     : hasDist ? <span className="text-emerald-400">Archivo: {distFile?.name}</span>
                               : <span className="text-slate-500 italic">Sin URL</span>
            } />
            <ReviewRow label="Reglas (.md)" value={rulesFile ? <span className="text-emerald-400">{rulesFile.name}</span> : <span className="text-slate-500 italic">Sin documento</span>} />
          </div>

          {/* Thumbnail preview */}
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {thumbnailFile ? (
                <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail preview"
                  className="h-36 w-full object-cover sm:h-48" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center sm:h-48">
                  <ImageIcon size={36} className="text-slate-700" />
                </div>
              )}
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs leading-relaxed text-amber-200/80">
                Estado inicial: <span className="font-semibold text-amber-300">En revisión</span>.
                El equipo lo revisará en 2–5 días laborables.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Layout ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">

        {/* Back */}
        <Link to="/developer" className="mb-6 inline-flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300">
          <ArrowLeft size={15} />
          Volver al panel
        </Link>

        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">Publicar nuevo juego</h1>
          <p className="mt-1 text-sm text-slate-400">
            Completa cada paso para enviar tu juego al equipo de M4G.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-7">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="flex items-center gap-2 font-semibold text-white">
              {step === 1 && <><Gamepad2 size={16} className="text-violet-400" /> Información básica</>}
              {step === 2 && <><Code2     size={16} className="text-violet-400" /> Detalles técnicos</>}
              {step === 3 && <><ImageIcon size={16} className="text-violet-400" /> Assets del juego</>}
              {step === 4 && <><Tag       size={16} className="text-violet-400" /> Revisión y publicación</>}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Paso {step} de {STEPS.length}
            </p>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={back} disabled={step === 1}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-30">
            <ArrowLeft size={15} />
            Anterior
          </button>

          {step < 4 ? (
            <button type="button" onClick={advance}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
              Siguiente
              <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {submitting ? 'Publicando…' : 'Publicar juego'}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-600">
          {Math.round((step / STEPS.length) * 100)}% completado
        </p>
      </main>

      <Footer />
    </div>
  );
}
