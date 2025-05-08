
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { ImportedStats, PlayerPosition } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseStatsFromText } from '@/services/importService';

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
      // Use FileReader para ler o arquivo como texto
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          
          console.log("Raw text from file:", text.substring(0, 100) + "..."); // Log para debug
          
          // Usar o parser melhorado para extrair estatísticas
          const stats = parseStatsFromText(text);
          
          if (stats.length > 0) {
            setParsedData(stats);
            toast.success(`Dados extraídos de ${file.name}`);
          } else {
            toast.error("Não foi possível encontrar estatísticas no arquivo");
          }
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast.error('Não foi possível processar o arquivo');
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
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500 mb-2">
              Para importar estatísticas, o arquivo deve estar em formato CSV ou TXT com os dados no seguinte formato:
              <br />
              <code>Nome do Jogador, Posição, Gols, Assistências, Jogos, Vitórias, Presença, CA, CV</code>
            </p>
            
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
