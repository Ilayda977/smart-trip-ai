export interface Activity {
  time: string;
  place: string;
  description: string;
  emoji: string;
  visited: boolean;
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface TripPlan {
  city: string;
  days: DayPlan[];
}

export type TravelMode = 
  | "Local & Hidden Gems"
  | "Tech & Future"
  | "Art & Aesthetic"
  | "Night & Energy";