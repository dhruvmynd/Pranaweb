export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  notification_time: string | null;
  created_at: string;
  updated_at: string;
}