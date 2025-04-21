export type MoodType = 'scattered' | 'sluggish' | 'wavering' | 'focused' | 'still';

export interface Mood {
  id: string;
  user_id: string;
  mood: MoodType;
  created_at: string;
}