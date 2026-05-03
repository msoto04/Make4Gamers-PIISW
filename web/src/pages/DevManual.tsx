import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, X, ChevronDown, Copy, Check,
  Info, AlertTriangle, CheckCircle2, XCircle, Lightbulb,
  BookOpen,
} from 'lucide-react';
import { MANUAL_SECTIONS, type ContentBlock, type ManualSection } from '../features/developer/data/manual.data';

// ─── Code block with copy ────────────────────────────────────────────────────

function CodeBlock({ language, filename, content }: { language: string; filename?: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/60" />
            <span className="h-3 w-3 rounded-full bg-amber-500/60" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
          </div>
          {filename && (
            <span className="ml-2 font-mono text-xs text-slate-400">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-500">
            {language}
          </span>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-200">
        <code>{content}</code>
      </pre>
    </div>
  );
}

// ─── Callout ─────────────────────────────────────────────────────────────────

const CALLOUT_STYLES = {
  info:    { bg: 'bg-blue-500/10  border-blue-500/30',  icon: Info,          iconCls: 'text-blue-400',    titleCls: 'text-blue-300'    },
  warning: { bg: 'bg-amber-500/10 border-amber-500/30', icon: AlertTriangle, iconCls: 'text-amber-400',   titleCls: 'text-amber-300'   },
  success: { bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2, iconCls: 'text-emerald-400', titleCls: 'text-emerald-300' },
  danger:  { bg: 'bg-rose-500/10  border-rose-500/30',  icon: XCircle,       iconCls: 'text-rose-400',    titleCls: 'text-rose-300'    },
  tip:     { bg: 'bg-violet-500/10 border-violet-500/30', icon: Lightbulb,   iconCls: 'text-violet-400',  titleCls: 'text-violet-300'  },
};

function Callout({ variant, title, content }: { variant: keyof typeof CALLOUT_STYLES; title?: string; content: string }) {
  const { bg, icon: Icon, iconCls, titleCls } = CALLOUT_STYLES[variant];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${bg}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconCls}`} />
      <div>
        {title && <p className={`mb-1 text-sm font-semibold ${titleCls}`}>{title}</p>}
        <p className="text-sm leading-relaxed text-slate-300">{content}</p>
      </div>
    </div>
  );
}

// ─── Content block renderer ───────────────────────────────────────────────────

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="leading-relaxed text-slate-300">{block.content}</p>;

    case 'heading':
      return block.level === 3
        ? <h3 className="text-base font-semibold text-white">{block.content}</h3>
        : <h4 className="text-sm font-semibold text-slate-200">{block.content}</h4>;

    case 'code':
      return <CodeBlock language={block.language} filename={block.filename} content={block.content} />;

    case 'callout':
      return <Callout variant={block.variant} title={block.title} content={block.content} />;

    case 'list':
      return block.ordered ? (
        <ol className="ml-4 list-decimal space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1 leading-relaxed text-slate-300">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="ml-4 list-disc space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1 leading-relaxed text-slate-300">{item}</li>
          ))}
        </ul>
      );

    case 'divider':
      return <hr className="border-slate-800" />;

    default:
      return null;
  }
}

// ─── Section accordion ────────────────────────────────────────────────────────

function SectionItem({ section, index }: { section: ManualSection; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        open
          ? 'border-violet-500/30 bg-slate-900/80'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
      }`}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-start gap-4 px-5 py-5 text-left"
      >
        {/* Number */}
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            open ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold leading-snug ${open ? 'text-white' : 'text-slate-200'}`}>
            {section.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {section.description}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-violet-400' : ''}`}
        />
      </button>

      {/* Expandable content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden" ref={contentRef}>
          <div className="space-y-5 border-t border-slate-800/80 px-5 pb-6 pt-5">
            {section.content.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevManual() {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MANUAL_SECTIONS.filter(
        s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()),
      )
    : MANUAL_SECTIONS;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Page hero */}
      <div className="relative border-b border-slate-800/60 bg-gradient-to-b from-violet-950/30 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Back link */}
          <Link
            to="/developer"
            className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            <ArrowLeft size={16} />
            Volver al panel
          </Link>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3">
              <BookOpen size={28} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Manual de Desarrollador</h1>
              <p className="mt-1 text-slate-400">
                Documentación técnica oficial de M4G para desarrolladores verificados.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar en el manual…"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Search size={36} className="mx-auto text-slate-700" />
            <p className="mt-4 text-slate-400">No hay secciones que coincidan con tu búsqueda.</p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-3 text-sm text-violet-400 hover:text-violet-300"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Result count when searching */}
            {query && (
              <p className="mb-4 text-sm text-slate-500">
                {filtered.length} sección{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''} para &ldquo;{query}&rdquo;
              </p>
            )}
            {filtered.map((section, i) => (
              <SectionItem key={section.id} section={section} index={MANUAL_SECTIONS.indexOf(section)} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-12 text-center text-xs text-slate-600">
          Manual de Desarrollador M4G · Última actualización: mayo 2026 ·{' '}
          <Link to="/contacto" className="text-violet-700 hover:text-violet-500">
            ¿Algo desactualizado? Cuéntanos
          </Link>
        </p>
      </div>
    </div>
  );
}
