import { mockEvents } from "@/data/mockEvents";
import { Event } from "@/types";

export const eventsData: Event[] = [...mockEvents];

export function updateEvent(eventId: string, updatedEvent: Event) {
  const index = eventsData.findIndex((event) => event.id === eventId);
  if (index !== -1) {
    eventsData[index] = updatedEvent;
  }
}

export function getEvents() {
  return eventsData;
}

export function getEventById(id: string) {
  return eventsData.find((event) => event.id === id);
}
