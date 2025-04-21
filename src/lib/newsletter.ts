import { supabase } from './supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  status: 'active' | 'unsubscribed';
  gdpr_consent: boolean;
  gdpr_consent_at: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email,
      gdpr_consent: true,
      gdpr_consent_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('This email is already subscribed to our newsletter.');
    }
    throw error;
  }

  return data;
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) throw error;
}