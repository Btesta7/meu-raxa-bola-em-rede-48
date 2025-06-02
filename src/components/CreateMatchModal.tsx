
import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateMatchData } from '@/types/admin';
import { useMatchContext } from '@/contexts/MatchContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface CreateMatchModalProps {
  open: boolean;
  onClose: () => void;
}

type FormData = {
  title: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
};

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ open, onClose }) => {
  const { createMatch } = useMatchContext();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '19:00',
      location: '',
      maxPlayers: 10
    }
  });

  const onSubmit = async (data: FormData) => {
    const matchData: CreateMatchData = {
      title: data.title,
      date: data.date,
      time: data.time,
      location: data.location,
      maxPlayers: data.maxPlayers
    };
    
    await createMatch(matchData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Partida</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              type="text" 
              placeholder="Ex: Pelada Domingo"
              {...register('title', { required: 'Título é obrigatório' })} 
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input 
              id="date" 
              type="date" 
              {...register('date', { required: 'Data é obrigatória' })} 
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input 
              id="time" 
              type="time" 
              {...register('time', { required: 'Horário é obrigatório' })} 
            />
            {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input 
              id="location" 
              type="text" 
              placeholder="Quadra do bairro" 
              {...register('location', { required: 'Local é obrigatório' })} 
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Limite de jogadores</Label>
            <Input 
              id="maxPlayers" 
              type="number" 
              min={4} 
              max={22} 
              {...register('maxPlayers', { 
                required: 'Número de jogadores é obrigatório',
                min: { value: 4, message: 'Mínimo de 4 jogadores' },
                max: { value: 22, message: 'Máximo de 22 jogadores' }
              })} 
            />
            {errors.maxPlayers && <p className="text-xs text-red-500">{errors.maxPlayers.message}</p>}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Criar Partida</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMatchModal;
