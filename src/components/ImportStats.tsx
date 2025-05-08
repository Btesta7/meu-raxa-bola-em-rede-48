import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { ImportedStats, PlayerPosition } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ImportStats = () => {
  const { importPlayerStats } = useAppContext();
  const [parsedData, setParsedData] = useState<ImportedStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    try {
      // Para uma demo simples, vamos usar FileReader para ler o arquivo como texto
      // Em produção, você usaria uma biblioteca de PDF como pdf.js
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          
          // Simples parser para demonstração - você precisará adaptar conforme seu PDF
          const stats = parseStatsFromText(text);
          setParsedData(stats);
          toast.success(`Dados extraídos de ${file.name}`);
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast.error('Não foi possível processar o arquivo PDF');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo');
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      toast.error('Não foi possível ler o arquivo');
      setIsLoading(false);
    }
  };

  // Esta é uma versão simplificada de um parser
  // Na prática, você precisaria de uma solução mais robusta baseada na estrutura do seu PDF
  const parseStatsFromText = (text: string): ImportedStats[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const stats: ImportedStats[] = [];
    
    // Tenta encontrar linhas que parecem conter dados de jogadores
    // Assumimos que os dados estão formatados como: Nome, Posição, Gols, Assistências, etc.
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Tenta detectar nomes de jogadores seguidos de números (estatísticas)
      if (/[A-Za-zÀ-ÿ\s]+/.test(line) && line.includes(',')) {
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length >= 3) {
          // Tenta detectar posição
          const position = detectPosition(parts[1]);
          
          stats.push({
            name: parts[0],
            position: position,
            goals: extractNumber(parts, 2),
            assists: extractNumber(parts, 3),
            matches: extractNumber(parts, 4),
            wins: extractNumber(parts, 5),
            attendance: extractNumber(parts, 6),
            yellowCards: extractNumber(parts, 7),
            redCards: extractNumber(parts, 8)
          });
        }
      }
    }
    
    return stats;
  };

  // Função auxiliar para detectar a posição do jogador
  const detectPosition = (posText: string): PlayerPosition => {
    const posLower = posText.toLowerCase();
    if (posLower.includes('gol') || posLower.includes('goleiro')) return 'Goleiro';
    if (posLower.includes('def') || posLower.includes('zagueiro')) return 'Defensor';
    if (posLower.includes('mei') || posLower.includes('meio')) return 'Meio-campista';
    if (posLower.includes('ata') || posLower.includes('atacante')) return 'Atacante';
    return 'Meio-campista'; // default
  };

  // Função auxiliar para extrair números com segurança
  const extractNumber = (parts: string[], index: number): number | undefined => {
    if (parts.length > index) {
      const num = parseFloat(parts[index]);
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast.error('Nenhum dado para importar');
      return;
    }

    importPlayerStats(parsedData);
    toast.success('Estatísticas importadas com sucesso!');
    setParsedData([]);
    setFileName('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Importar Estatísticas de Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,.txt,.csv" // Aceita PDF e outros formatos para teste
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
              />
              <Button variant="outline" className="flex items-center gap-2" disabled={isLoading}>
                <FileText size={18} />
                <span>{isLoading ? 'Processando...' : 'Selecionar arquivo'}</span>
              </Button>
            </div>
            {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
          </div>

          {parsedData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados extraídos</h3>
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead>Gols</TableHead>
                      <TableHead>Assists</TableHead>
                      <TableHead>Jogos</TableHead>
                      <TableHead>Vitórias</TableHead>
                      <TableHead>CA</TableHead>
                      <TableHead>CV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.position}</TableCell>
                        <TableCell>{player.goals}</TableCell>
                        <TableCell>{player.assists}</TableCell>
                        <TableCell>{player.matches}</TableCell>
                        <TableCell>{player.wins}</TableCell>
                        <TableCell>{player.yellowCards}</TableCell>
                        <TableCell>{player.redCards}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button onClick={handleImport} className="w-full">
                Importar Dados
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportStats;
