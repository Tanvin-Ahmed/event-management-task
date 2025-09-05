export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: "Conference" | "Workshop" | "Meetup";
  userId?: string;
  attendeeCount: number;
  maxAttendees?: number;
  attendees: string[];
  createdAt: string;
}

export interface RsvpRequest {
  eventId: string;
  userId: string;
  action: "rsvp" | "cancel";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}
