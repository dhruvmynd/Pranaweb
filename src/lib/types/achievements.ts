export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'minutes' | 'streak' | 'heart_rate' | 'hrv' | 'signup';
    value: number;
  };
  unlockedAt?: string;
  progress?: number;
  initialHeartRate?: number;
  currentHeartRate?: number;
  badgeUnlocked?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Begin your mindful breathing journey',
    icon: '/gettingstarted.webp',
    requirement: {
      type: 'signup',
      value: 1
    }
  },
  {
    id: 'beginner',
    name: 'First Steps',
    description: 'Complete 60 minutes of practice',
    icon: '/60mins.webp',
    requirement: {
      type: 'minutes',
      value: 60
    }
  },
  {
    id: 'dedicated',
    name: 'Dedicated Practitioner',
    description: 'Complete 500 minutes of practice',
    icon: '/500mins.webp',
    requirement: {
      type: 'minutes',
      value: 500
    }
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '/7day.webp',
    requirement: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'hrv_improver',
    name: 'HRV Master',
    description: 'Improve your HRV by 20%',
    icon: '/hrv.webp',
    requirement: {
      type: 'hrv',
      value: 20
    }
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Complete 1000 minutes of practice',
    icon: '/1000mins.webp',
    requirement: {
      type: 'minutes',
      value: 1000
    }
  },
  {
    id: 'heart_rate_master',
    name: 'Heart Rate Master',
    description: 'Decrease average heart rate by 10%',
    icon: '/hr.webp',
    requirement: {
      type: 'heart_rate',
      value: 10
    }
  }
];