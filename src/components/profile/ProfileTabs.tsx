
import React, { useState } from 'react';
import { User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from './ProfileForm';
import StatsSection from './StatsSection';
import { User as UserIcon, BarChart3, Settings } from 'lucide-react';

interface ProfileTabsProps {
  user: User;
  isEditing: boolean;
  onEditComplete: () => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  isEditing,
  onEditComplete
}) => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <UserIcon size={16} />
          <span className="hidden sm:inline">Geral</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart3 size={16} />
          <span className="hidden sm:inline">Estatísticas</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings size={16} />
          <span className="hidden sm:inline">Configurações</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <ProfileForm
          user={user}
          isEditing={isEditing}
          onEditComplete={onEditComplete}
        />
      </TabsContent>

      <TabsContent value="stats" className="mt-6">
        <StatsSection user={user} />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Configurações</h3>
          <p className="text-gray-600">
            Esta seção será implementada nas próximas fases com configurações avançadas.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
