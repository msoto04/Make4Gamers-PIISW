import React from 'react';

type TimelineButton = {
  text: string;
  onClick: () => void;
};

type TimelineItemProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  button?: TimelineButton;
  isLast?: boolean;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ title, imageSrc, imageAlt, button, isLast = false }) => (
  <li className="relative flex w-full max-w-[280px] flex-col items-center pb-56 sm:mb-0 sm:flex-1 sm:max-w-none sm:basis-0 sm:pb-60">
    <div className="flex w-full items-center">
      {/* Punto */}
      <div className="z-10 h-8 w-8 shrink-0 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.45)]" />

      {/* Línea */}
      {!isLast && (
        <div className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-violet-400/90 via-violet-500/80 to-violet-400/60" />
      )}
    </div>

    <div className="mt-3 w-full text-center sm:absolute sm:left-5 sm:top-14 sm:mt-0 sm:w-[180px] sm:-translate-x-1/2">
      <h3 className="mb-3 text-sm font-extrabold text-lime-200">{title}</h3>

      <img
        src={imageSrc}
        alt={imageAlt ?? title}
        className="mx-auto mb-3 h-28 w-full object-contain"
        style={{
          filter:
            'drop-shadow(0 10px 16px rgba(0,0,0,0.45)) drop-shadow(0 0 12px rgba(167,139,250,0.30))',
        }}
        loading="lazy"
      />

      {button && (
        <button
          onClick={button.onClick}
          type="button"
          className="mx-auto block rounded-lg bg-violet-600/30 px-4 py-2 text-xs font-medium text-violet-100 shadow-[0_8px_18px_rgba(139,92,246,0.32)] transition-colors hover:bg-violet-600/45 focus:outline-none focus:ring-2 focus:ring-violet-400/45"
        >
          {button.text}
        </button>
      )}
    </div>
  </li>
);

type TimelineEvent = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  button?: TimelineButton;
};

type TimelineProps = {
  events: TimelineEvent[];
};

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <ol className="mx-auto flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
        {events.map((event, index) => (
          <TimelineItem
            key={`${event.title}-${index}`}
            title={event.title}
            imageSrc={event.imageSrc}
            imageAlt={event.imageAlt}
            button={event.button}
            isLast={index === events.length - 1}
          />
        ))}
      </ol>
    </section>
  )
};

export default Timeline;