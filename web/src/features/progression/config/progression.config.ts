// 1. Escala por JUEGO INDIVIDUAL 
export type Tier = 'Iniciado' | 'Amateur' | 'Profesional' | 'Veterano' | 'Elite';

// 2. Escala GLOBAL de la cuenta 
export type GlobalTier = 'Hierro' | 'Bronce' | 'Plata' | 'Oro' | 'Obsidiana';

// 3. Umbrales para el Rango Global 

export const globalThresholds: Record<GlobalTier, number> = {
  Hierro: 0,        // Todos empiezan aquí
  Bronce: 50,       // Requiere algunos juegos en Amateur/Profesional
  Plata: 150,       // Jugador habitual
  Oro: 500,         // Jugador muy dedicado
  Obsidiana: 1000   // Élite absoluto (Récord histórico)
};

// 4. Estructura de la configuración
export interface GameTierConfig {
  gameTitle: string; 
  thresholds: Record<Tier, number>; 
  multipliers: Record<Tier, number>; 
}

// 5. Multiplicadores: ¿Cuántos puntos GLOBALES te da cada rango de juego?
const baseMultipliers: Record<Tier, number> = {
  Iniciado: 1,
  Amateur: 5,
  Profesional: 10,
  Veterano: 20,
  Elite: 50
};

// 6. El diccionario de juegos
export const progressionConfig: GameTierConfig[] = [
  {
    gameTitle: 'Pilot Adventure', 
    thresholds: { Iniciado: 100, Amateur: 500, Profesional: 1000, Veterano: 2500, Elite: 5000 },
    multipliers: baseMultipliers
  },
  {
    gameTitle: '3 en Raya', 
    thresholds: { Iniciado: 50, Amateur: 150, Profesional: 300, Veterano: 600, Elite: 1000 },
    multipliers: baseMultipliers
  },
  {
    gameTitle: 'System Override', 
    thresholds: { Iniciado: 100, Amateur: 500, Profesional: 1500, Veterano: 3000, Elite: 5000 },
    multipliers: baseMultipliers
  }
];

export const defaultTierConfig: Omit<GameTierConfig, 'gameTitle'> = {
  thresholds: { Iniciado: 100, Amateur: 500, Profesional: 1000, Veterano: 2500, Elite: 5000 },
  multipliers: baseMultipliers
};