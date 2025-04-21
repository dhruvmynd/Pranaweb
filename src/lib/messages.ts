import { supabase } from './supabase';

export async function submitMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { error } = await supabase
    .from('messages')
    .insert([data]);
    
  if (error) throw error;
}