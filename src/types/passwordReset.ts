
export interface PasswordResetRequest {
  id: string;
  email: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  attempts: number;
}

export interface PasswordResetData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}
