import { mockEvents } from "@/data/mockEvents";
import { Event } from "@/types";

export const eventsData: Event[] = [...mockEvents];

export function addEvent(event: Event) {
  if (!event.createdAt) {
    event.createdAt = new Date().toISOString();
  }

  eventsData.unshift(event);
  return event;
}

export function updateEvent(eventId: string, updatedEvent: Event) {
  const index = eventsData.findIndex((event) => event.id === eventId);
  if (index !== -1) {
    eventsData[index] = updatedEvent;
    return updatedEvent;
  }
  return null;
}

export function deleteEvent(eventId: string) {
  const index = eventsData.findIndex((event) => event.id === eventId);
  if (index !== -1) {
    const deletedEvent = eventsData[index];
    eventsData.splice(index, 1);
    return deletedEvent;
  }
  return null;
}

export function getEvents() {
  return eventsData;
}

export function getEventById(id: string) {
  return eventsData.find((event) => event.id === id);
}

export function getUserEvents(userId: string) {
  const filtered = eventsData.filter((event) => event.userId === userId);
  return filtered;
}
