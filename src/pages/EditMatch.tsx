
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminContext } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { CreateMatchData } from '@/types/admin';
import Header from '@/components/Header';
import { ArrowLeft, Save } from 'lucide-react';

const EditMatch = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { scheduledMatches, updateMatch } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);

  const match = scheduledMatches.find(m => m.id === matchId);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateMatchData>();

  useEffect(() => {
    if (match) {
      setValue('title', match.title);
      setValue('date', match.date);
      setValue('time', match.time);
      setValue('location', match.location);
      setValue('maxPlayers', match.maxPlayers);
      setValue('description', match.description || '');
    }
  }, [match, setValue]);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Partida não encontrada</h2>
              <Button onClick={() => navigate('/admin/gerenciar-partidas')}>
                Voltar para Gerenciar Partidas
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const onSubmit = async (data: CreateMatchData) => {
    setIsLoading(true);
    try {
      await updateMatch(matchId!, data);
      navigate('/admin/gerenciar-partidas');
    } catch (error) {
      console.error('Erro ao atualizar partida:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/gerenciar-partidas')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">✏️ Editar Partida</h1>
            <p className="text-gray-600">Modifique os detalhes da partida</p>
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Partida</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Partida</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Título é obrigatório' })}
                    placeholder="Ex: Pelada Domingo"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    {...register('location', { required: 'Local é obrigatório' })}
                    placeholder="Ex: Quadra Central"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date', { required: 'Data é obrigatória' })}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time', { required: 'Horário é obrigatório' })}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Máximo de Jogadores</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="10"
                    max="22"
                    {...register('maxPlayers', { 
                      required: 'Número máximo é obrigatório',
                      min: { value: 10, message: 'Mínimo 10 jogadores' },
                      max: { value: 22, message: 'Máximo 22 jogadores' }
                    })}
                  />
                  {errors.maxPlayers && (
                    <p className="text-sm text-red-600">{errors.maxPlayers.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Adicione detalhes sobre a partida..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  <Save size={16} className="mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/gerenciar-partidas')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações dos Jogadores */}
        <Card>
          <CardHeader>
            <CardTitle>Jogadores da Partida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-green-700">
                  Confirmados ({match.confirmedPlayers.length})
                </h3>
                <div className="space-y-2">
                  {match.confirmedPlayers.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum jogador confirmado</p>
                  ) : (
                    match.confirmedPlayers.map((playerId, index) => (
                      <div key={playerId} className="text-sm bg-green-50 p-2 rounded">
                        Jogador {index + 1}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-yellow-700">
                  Lista de Espera ({match.waitingList.length})
                </h3>
                <div className="space-y-2">
                  {match.waitingList.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum jogador na lista de espera</p>
                  ) : (
                    match.waitingList.map((playerId, index) => (
                      <div key={playerId} className="text-sm bg-yellow-50 p-2 rounded">
                        Jogador {index + 1}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditMatch;
