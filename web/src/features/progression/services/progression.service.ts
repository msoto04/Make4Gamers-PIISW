
import { progressionConfig, defaultTierConfig, type Tier, type GlobalTier, globalThresholds } from '../config/progression.config';

export function getTierForScore(gameTitle: string, score: number): Tier {
  const config = progressionConfig.find(
    c => c.gameTitle.toLowerCase() === gameTitle.toLowerCase()
  ) || defaultTierConfig;

  const thresholds = config.thresholds;

  if (score >= thresholds.Elite) return 'Elite';
  if (score >= thresholds.Veterano) return 'Veterano';
  if (score >= thresholds.Profesional) return 'Profesional';
  if (score >= thresholds.Amateur) return 'Amateur';
  return 'Iniciado'; 
}

export function getGlobalTier(totalScore: number): GlobalTier {
  if (totalScore >= globalThresholds.Obsidiana) return 'Obsidiana';
  if (totalScore >= globalThresholds.Oro) return 'Oro';
  if (totalScore >= globalThresholds.Plata) return 'Plata';
  if (totalScore >= globalThresholds.Bronce) return 'Bronce';
  return 'Hierro';
}

export function calculateLazyGlobalScore(highScores: {displayTitle: string, score: number}[]): number {
  if (!highScores || highScores.length === 0) return 0;
  
  let totalScore = 0;
  highScores.forEach(record => {
    const tier = getTierForScore(record.displayTitle, record.score);
    const config = progressionConfig.find(c => c.gameTitle.toLowerCase() === record.displayTitle.toLowerCase()) || defaultTierConfig;
    totalScore += config.multipliers[tier];
  });
  
  return totalScore;
}