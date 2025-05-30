
import { useMemo } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { User } from '@/types';

export const checkProfileCompletion = (user: User): boolean => {
  const requiredFields = [
    user.name,
    user.age,
    user.phone,
    user.position,
    user.preferredFoot,
    user.emergencyContact?.name,
    user.emergencyContact?.phone,
    user.emergencyContact?.relationship
  ];
  
  return requiredFields.every(field => 
    field !== null && 
    field !== undefined && 
    field !== '' &&
    (typeof field === 'number' ? field > 0 : true)
  );
};

export const useOnboarding = () => {
  const { user } = useUserContext();
  
  const shouldShowOnboarding = useMemo(() => {
    return user && !user.isProfileComplete && !checkProfileCompletion(user);
  }, [user]);
  
  const isProfileComplete = useMemo(() => {
    return user ? checkProfileCompletion(user) : false;
  }, [user]);
  
  return { 
    shouldShowOnboarding, 
    isProfileComplete 
  };
};
