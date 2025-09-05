"use client";

import { Event } from "@/types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import RsvpButton from "@/components/RsvpButton";

interface EventDetailsClientProps {
  initialEvent: Event;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Conference":
      return "bg-blue-100 text-blue-800";
    case "Workshop":
      return "bg-green-100 text-green-800";
    case "Meetup":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function EventDetailsClient({
  initialEvent,
}: EventDetailsClientProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const userId = "current-user";

  const handleRsvpUpdate = (updatedEvent: Event) => {
    setEvent(updatedEvent);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-6 cursor-pointer flex items-center text-blue-600 hover:text-blue-800 transition-colors w-fit"
        >
          <span className="mr-2">←</span>
          Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(
                  event.category
                )} whitespace-nowrap`}
              >
                {event.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <UserOutlined className="text-2xl mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Attendees</p>
                  <p className="text-lg">
                    {event.attendeeCount}
                    {event.maxAttendees && ` / ${event.maxAttendees}`}
                  </p>
                  {event.maxAttendees &&
                    event.attendeeCount >= event.maxAttendees && (
                      <p className="text-sm text-red-500 font-medium">
                        Event Full
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Interested in attending?
              </h3>
              <RsvpButton
                event={event}
                userId={userId}
                onRsvpUpdate={handleRsvpUpdate}
                size="large"
                className="max-w-sm"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
