import { supabase } from '../supabase';

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  gdprConsentRate: number;
  retentionRate: number;
  lastUpdated: string;
  dailyStats: {
    date: string;
    newSubscribers: number;
    unsubscribed: number;
  }[];
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  const { data: analyticsData, error: analyticsError } = await supabase
    .from('newsletter_analytics')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);

  if (analyticsError) throw analyticsError;

  const { data: subscribers, error: subscribersError } = await supabase
    .from('newsletter_subscribers')
    .select('*');

  if (subscribersError) throw subscribersError;

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
  const gdprConsentCount = subscribers.filter(s => s.gdpr_consent).length;
  const gdprConsentRate = totalSubscribers > 0 ? (gdprConsentCount / totalSubscribers) * 100 : 100;
  const retentionRate = totalSubscribers > 0 ? ((totalSubscribers - unsubscribedCount) / totalSubscribers) * 100 : 100;

  return {
    totalSubscribers,
    activeSubscribers,
    unsubscribedCount,
    gdprConsentRate,
    retentionRate,
    lastUpdated: new Date().toISOString(),
    dailyStats: analyticsData.map(stat => ({
      date: stat.date,
      newSubscribers: stat.new_subscribers,
      unsubscribed: stat.unsubscribed
    }))
  };
}