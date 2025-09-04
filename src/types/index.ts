export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: "Conference" | "Workshop" | "Meetup";
  userId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}
