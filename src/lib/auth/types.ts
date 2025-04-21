import { User } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
};