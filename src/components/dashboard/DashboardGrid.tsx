
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardWidget, WidgetType } from '@/types/preferences';
import PersonalStatsWidget from './widgets/PersonalStatsWidget';
import UpcomingMatchesWidget from './widgets/UpcomingMatchesWidget';
import NotificationWidget from './widgets/NotificationWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';

interface DashboardGridProps {
  widgets: DashboardWidget[];
  onWidgetUpdate: (widgets: DashboardWidget[]) => void;
  isCustomizing: boolean;
  onToggleCustomization: () => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  onWidgetUpdate,
  isCustomizing,
  onToggleCustomization
}) => {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const renderWidget = (widget: DashboardWidget) => {
    const commonProps = {
      widget,
      isCustomizing,
      onRemove: () => handleRemoveWidget(widget.id),
      onResize: (size: 'small' | 'medium' | 'large') => handleResizeWidget(widget.id, size)
    };

    switch (widget.type) {
      case WidgetType.PERSONAL_STATS:
        return <PersonalStatsWidget {...commonProps} />;
      case WidgetType.UPCOMING_MATCHES:
        return <UpcomingMatchesWidget {...commonProps} />;
      case WidgetType.NOTIFICATIONS:
        return <NotificationWidget {...commonProps} />;
      case WidgetType.QUICK_ACTIONS:
        return <QuickActionsWidget {...commonProps} />;
      default:
        return null;
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    onWidgetUpdate(updatedWidgets);
  };

  const handleResizeWidget = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = widgets.map(w => 
      w.id === widgetId ? { ...w, size } : w
    );
    onWidgetUpdate(updatedWidgets);
  };

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      title: getWidgetTitle(type),
      type,
      size: 'medium',
      position: { row: 0, col: 0 },
      isVisible: true
    };
    onWidgetUpdate([...widgets, newWidget]);
  };

  const getWidgetTitle = (type: WidgetType): string => {
    switch (type) {
      case WidgetType.PERSONAL_STATS: return 'Minhas Estatísticas';
      case WidgetType.UPCOMING_MATCHES: return 'Próximas Partidas';
      case WidgetType.NOTIFICATIONS: return 'Notificações';
      case WidgetType.QUICK_ACTIONS: return 'Ações Rápidas';
      default: return 'Widget';
    }
  };

  const getGridCols = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      default: return 'col-span-2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Acompanhe suas atividades e estatísticas</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isCustomizing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddWidget(WidgetType.PERSONAL_STATS)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Widget
            </Button>
          )}
          
          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={onToggleCustomization}
            className="flex items-center gap-2"
          >
            {isCustomizing ? <Grid3X3 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            {isCustomizing ? 'Finalizar' : 'Personalizar'}
          </Button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
        isCustomizing ? 'min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4' : ''
      }`}>
        {widgets.filter(w => w.isVisible).map((widget, index) => (
          <motion.div
            key={widget.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`${getGridCols(widget.size)} ${
              isCustomizing ? 'ring-2 ring-primary/20 ring-offset-2' : ''
            }`}
            draggable={isCustomizing}
            onDragStart={() => setDraggedWidget(widget.id)}
            onDragEnd={() => setDraggedWidget(null)}
          >
            {renderWidget(widget)}
          </motion.div>
        ))}
        
        {widgets.filter(w => w.isVisible).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Grid3X3 className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum widget adicionado
            </h3>
            <p className="text-gray-500 mb-4">
              Clique em "Personalizar" para adicionar widgets ao seu dashboard
            </p>
            <Button
              onClick={onToggleCustomization}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Personalizar Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Quick Add Widgets (when customizing) */}
      {isCustomizing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-6"
        >
          <h3 className="font-medium text-gray-900 mb-3">Widgets Disponíveis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(WidgetType).map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleAddWidget(type)}
                className="flex items-center gap-2 h-auto p-3 text-left"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-sm">{getWidgetTitle(type)}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardGrid;
