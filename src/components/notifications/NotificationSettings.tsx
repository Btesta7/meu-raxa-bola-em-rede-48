
import React from 'react';
import { ArrowLeft, Bell, Clock, Mail } from 'lucide-react';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/notifications';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationSettingsProps {
  onBack: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const { settings, updateSettings, requestPushPermission } = useNotificationContext();

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPushPermission();
      if (!granted) return;
    }
    updateSettings({ enablePush: enabled });
  };

  const handleTypeToggle = (type: NotificationType, enabled: boolean) => {
    updateSettings({
      types: {
        ...settings.types,
        [type]: enabled,
      },
    });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    updateSettings({
      quietHours: {
        ...settings.quietHours,
        enabled,
      },
    });
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    updateSettings({
      quietHours: {
        ...settings.quietHours,
        [field]: value,
      },
    });
  };

  const getTypeLabel = (type: NotificationType): string => {
    const labels: Record<NotificationType, string> = {
      [NotificationType.MATCH_CREATED]: 'Nova partida criada',
      [NotificationType.MATCH_CANCELED]: 'Partida cancelada',
      [NotificationType.MATCH_UPDATED]: 'Partida atualizada',
      [NotificationType.TEAMS_DRAWN]: 'Times sorteados',
      [NotificationType.MATCH_REMINDER]: 'Lembrete de partida',
      [NotificationType.NEW_PLAYER]: 'Novo jogador',
      [NotificationType.CHAT_MESSAGE]: 'Mensagem do chat',
      [NotificationType.PROFILE_UPDATED]: 'Perfil atualizado',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'Anúncio do sistema',
    };
    return labels[type] || type;
  };

  return (
    <div className="w-80 p-0">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <h3 className="font-semibold">Configurações de Notificação</h3>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Push Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <CardTitle className="text-sm">Notificações Push</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Receba notificações em tempo real no navegador
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-sm">
                Habilitar notificações push
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.enablePush}
                onCheckedChange={handlePushToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <CardTitle className="text-sm">Notificações por Email</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Resumo diário por email (em breve)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">
                Habilitar emails
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.enableEmail}
                onCheckedChange={(checked) => updateSettings({ enableEmail: checked })}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <CardTitle className="text-sm">Horário Silencioso</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Não receber notificações em horários específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours" className="text-sm">
                Habilitar horário silencioso
              </Label>
              <Switch
                id="quiet-hours"
                checked={settings.quietHours.enabled}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>
            
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Início</Label>
                  <Input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Fim</Label>
                  <Input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tipos de Notificação</CardTitle>
            <CardDescription className="text-xs">
              Escolha quais tipos de notificação deseja receber
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {Object.values(NotificationType).map((type) => (
              <div key={type} className="flex items-center justify-between">
                <Label htmlFor={type} className="text-sm">
                  {getTypeLabel(type)}
                </Label>
                <Switch
                  id={type}
                  checked={settings.types[type]}
                  onCheckedChange={(checked) => handleTypeToggle(type, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
