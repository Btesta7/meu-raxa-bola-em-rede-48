
import { ImportedStats, PlayerPosition } from '@/types';

// Improved parser for PDF text
export const parseStatsFromText = (text: string): ImportedStats[] => {
  const stats: ImportedStats[] = [];
  
  // Split by "Meio-campista" which seems to be a common marker in the data
  const segments = text.split('Meio-campista');
  
  // Process each segment
  for (let i = 0; i < segments.length; i++) {
    // Clean up segment
    const segment = segments[i].trim();
    if (!segment) continue;
    
    // Try to extract player name - looking for word characters
    const nameMatch = segment.match(/([A-Za-zÀ-ÿ\s]{2,})/);
    const name = nameMatch ? nameMatch[0].trim() : `Jogador ${i+1}`;
    
    // Look for numbers that might be stats
    const numberMatches = segment.match(/\d+/g);
    const numbers = numberMatches ? numberMatches.map(n => parseInt(n, 10)) : [];
    
    // Create player stats
    const playerStats: ImportedStats = {
      name,
      position: "Meio-campista", // Default position from the marker
      goals: numbers[0] || 0,
      assists: numbers[1] || 0,
      matches: numbers[2] || 0,
      wins: numbers[3] || 0,
      attendance: numbers[4] || 0,
      yellowCards: numbers[5] || 0,
      redCards: numbers[6] || 0
    };
    
    // Only add if we have a name
    if (name && name.length > 2 && name !== `Jogador ${i+1}`) {
      stats.push(playerStats);
    }
  }
  
  return stats;
};

// Function to detect position from text
export const detectPosition = (text: string): PlayerPosition => {
  const posLower = text.toLowerCase();
  if (posLower.includes('gol') || posLower.includes('goleiro')) return 'Goleiro';
  if (posLower.includes('def') || posLower.includes('zagueiro')) return 'Defensor';
  if (posLower.includes('mei') || posLower.includes('meio')) return 'Meio-campista';
  if (posLower.includes('ata') || posLower.includes('atacante')) return 'Atacante';
  return 'Meio-campista'; // default
};
