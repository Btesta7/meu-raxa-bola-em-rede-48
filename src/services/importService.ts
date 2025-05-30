
import { ImportedStats, PlayerPosition } from '@/types';

// Improved parser for PDF text
export const parseStatsFromText = (text: string): ImportedStats[] => {
  const stats: ImportedStats[] = [];
  
  console.log("Texto completo recebido:", text);
  
  // Limpar o texto e dividir em linhas
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  console.log("Linhas encontradas:", lines.length);
  
  // Pular a primeira linha (cabeçalho) e processar as demais
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    console.log(`Processando linha ${i}:`, line);
    
    // Procurar por "Meio-campista" ou outras posições como marcadores
    if (line.includes('Meio-campista') || line.includes('Goleiro') || 
        line.includes('Defensor') || line.includes('Atacante')) {
      
      // Extrair dados antes da posição (que seria o nome)
      const parts = line.split(/\t+|\s{2,}/); // Dividir por tabs ou múltiplos espaços
      console.log("Partes da linha:", parts);
      
      // Tentar identificar o nome (primeira parte não vazia)
      let name = '';
      let position: PlayerPosition = 'Meio-campista';
      let numbers: number[] = [];
      
      for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;
        
        // Se contém posição
        if (trimmedPart.includes('Meio-campista')) position = 'Meio-campista';
        else if (trimmedPart.includes('Goleiro')) position = 'Goleiro';
        else if (trimmedPart.includes('Defensor')) position = 'Defensor';
        else if (trimmedPart.includes('Atacante')) position = 'Atacante';
        
        // Se é um número
        else if (/^\d+$/.test(trimmedPart)) {
          numbers.push(parseInt(trimmedPart, 10));
        }
        
        // Se parece com nome (letras)
        else if (/^[A-Za-zÀ-ÿ\s]+$/.test(trimmedPart) && trimmedPart.length > 1 && !name) {
          name = trimmedPart;
        }
      }
      
      // Se não encontrou nome, tentar extrair do início da linha
      if (!name) {
        const nameMatch = line.match(/^([A-Za-zÀ-ÿ\s]{2,}?)(?=\s|Meio-campista|Goleiro|Defensor|Atacante)/);
        if (nameMatch) {
          name = nameMatch[1].trim();
        }
      }
      
      // Se ainda não tem nome, usar um nome genérico
      if (!name || name.length < 2) {
        name = `Jogador ${i}`;
      }
      
      console.log(`Jogador encontrado: ${name}, Posição: ${position}, Números: ${numbers}`);
      
      // Criar estatísticas do jogador
      const playerStats: ImportedStats = {
        name,
        position,
        goals: numbers[0] || 0,
        assists: numbers[1] || 0,
        matches: numbers[2] || 0,
        wins: numbers[3] || 0,
        attendance: numbers[4] || 0,
        yellowCards: numbers[5] || 0,
        redCards: numbers[6] || 0
      };
      
      // Adicionar apenas se tem um nome válido
      if (name !== `Jogador ${i}` || numbers.length > 0) {
        stats.push(playerStats);
        console.log("Jogador adicionado:", playerStats);
      }
    }
    
    // Também tentar processar linhas que podem conter dados separados por vírgula ou tab
    else if (line.includes(',') || line.includes('\t')) {
      const parts = line.split(/[,\t]+/).map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 3) { // Pelo menos nome, posição e um dado
        const name = parts[0];
        const position = detectPosition(parts[1] || '') as PlayerPosition;
        const numbers = parts.slice(2).map(p => parseInt(p, 10)).filter(n => !isNaN(n));
        
        if (name.length > 1) {
          const playerStats: ImportedStats = {
            name,
            position,
            goals: numbers[0] || 0,
            assists: numbers[1] || 0,
            matches: numbers[2] || 0,
            wins: numbers[3] || 0,
            attendance: numbers[4] || 0,
            yellowCards: numbers[5] || 0,
            redCards: numbers[6] || 0
          };
          
          stats.push(playerStats);
          console.log("Jogador CSV adicionado:", playerStats);
        }
      }
    }
  }
  
  console.log(`Total de jogadores encontrados: ${stats.length}`);
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
