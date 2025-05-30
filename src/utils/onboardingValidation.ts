
export const validateOnboardingStep = (step: number, data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (step) {
    case 1: // Basic Info
      if (!data.name?.trim()) errors.push('Nome é obrigatório');
      if (!data.age || data.age < 16 || data.age > 60) errors.push('Idade deve estar entre 16 e 60 anos');
      if (!data.phone?.trim()) errors.push('Telefone é obrigatório');
      else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) errors.push('Formato de telefone inválido');
      break;

    case 2: // Player Info
      if (!data.position) errors.push('Posição principal é obrigatória');
      if (!data.preferredFoot) errors.push('Pé preferido é obrigatório');
      break;

    case 3: // Avatar & Bio
      // Avatar e bio são opcionais
      break;

    case 4: // Emergency Contact
      if (!data.emergencyContact?.name?.trim()) errors.push('Nome do contato é obrigatório');
      if (!data.emergencyContact?.phone?.trim()) errors.push('Telefone do contato é obrigatório');
      else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.emergencyContact.phone)) errors.push('Formato de telefone do contato inválido');
      if (!data.emergencyContact?.relationship) errors.push('Relação é obrigatória');
      break;

    default:
      errors.push('Step inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const sanitizeOnboardingData = (data: any) => {
  return {
    ...data,
    name: data.name?.trim(),
    phone: data.phone?.trim(),
    bio: data.bio?.trim(),
    emergencyContact: {
      ...data.emergencyContact,
      name: data.emergencyContact?.name?.trim(),
      phone: data.emergencyContact?.phone?.trim(),
      relationship: data.emergencyContact?.relationship?.trim()
    }
  };
};
