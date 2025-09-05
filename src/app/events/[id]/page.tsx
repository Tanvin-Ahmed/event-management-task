import { Event } from "@/types";
import axios from "axios";
import { notFound } from "next/navigation";
import EventDetailsClient from "@/components/EventDetailsClient";

interface EventDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const response = await axios.get(`${baseUrl}/api/events/${id}`);

    if (response.data.success) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
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
