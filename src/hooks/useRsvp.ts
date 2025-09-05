import { Event, RsvpRequest, ApiResponse } from "@/types";

import { useState } from "react";

import axios from "axios";

export const useRsvp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rsvpToEvent = async (
    eventId: string,
    userId: string,
    action: "rsvp" | "cancel"
  ): Promise<Event | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put<ApiResponse<Event>>(
        `/api/events/${eventId}/rsvp`,
        {
          eventId,
          userId,
          action,
        } as RsvpRequest
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to process RSVP");
      }

      return result.data;
    } catch (err) {
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rsvpToEvent,
    loading,
    error,
    clearError: () => setError(null),
  };
};
