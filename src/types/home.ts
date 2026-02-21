export interface ConcertViewModel {
  title?: string;
  city?: string;
  venue?: string;
  address?: string;
  dates?: string[]; // ISO date strings from API, use Date if you parse them
  additionalInfo?: string;
}

export interface HomePageViewModel {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  concert?: ConcertViewModel;
}