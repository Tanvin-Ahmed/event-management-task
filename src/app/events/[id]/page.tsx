import EventDetailsClient from "@/components/EventDetailsClient";
import { Event, ApiResponse } from "@/types";
import { notFound } from "next/navigation";
import axios from "axios";

interface EventDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await axios.get<ApiResponse<Event>>(
      `${baseUrl}/api/events/${id}`
    );
    const result = response.data;

    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;

  const event = await fetchEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailsClient initialEvent={event} />;
}
