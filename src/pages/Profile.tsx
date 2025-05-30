
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import Header from '@/components/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, isLoading, isNewUser } = useUserContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(isNewUser);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
    // Auto-enable editing mode for new users
    if (isNewUser) {
      setIsEditing(true);
    }
  }, [user, isLoading, navigate, isNewUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          {!isNewUser && (
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao Dashboard
            </Button>
          )}

          {isNewUser && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Bem-vindo ao Meu Raxa! 🎉
              </h2>
              <p className="text-blue-700">
                Complete seu perfil para ter a melhor experiência. Adicione suas informações pessoais, 
                foto e preferências de jogo.
              </p>
            </div>
          )}
          
          <ProfileHeader
            user={user}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
          />
        </div>

        <ProfileTabs
          user={user}
          isEditing={isEditing}
          onEditComplete={() => setIsEditing(false)}
        />
      </div>
    </div>
  );
};

export default Profile;
