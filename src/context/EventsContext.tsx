"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Event } from "@/types";

interface EventsContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  getEventById: (eventId: string) => Event | undefined;
  getUserEvents: (userId: string) => Event[];
  setEvents: (events: Event[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    setError(null);
  };

  const updateEvent = (event: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((existingEvent) =>
        existingEvent.id === event.id ? event : existingEvent
      )
    );
    setError(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
    setError(null);
  };

  const getEventById = (eventId: string): Event | undefined => {
    return events.find((event: Event) => event.id === eventId);
  };

  const getUserEvents = (userId: string): Event[] => {
    return events.filter((event: Event) => event.userId === userId);
  };

  const updateEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    setError(null);
  };

  const value: EventsContextType = {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getUserEvents,
    setEvents: updateEvents,
    setLoading,
    setError,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
