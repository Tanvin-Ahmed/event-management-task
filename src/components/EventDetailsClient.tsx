"use client";

import { Event } from "@/types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { useState } from "react";
import { User, Calendar, MapPin, ArrowLeft } from "lucide-react";
import RsvpButton from "@/components/RsvpButton";

interface EventDetailsClientProps {
  initialEvent: Event;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Conference":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Workshop":
      return "bg-green-50 text-green-700 border-green-200";
    case "Meetup":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function EventDetailsClient({
  initialEvent,
}: EventDetailsClientProps) {
  const [event, setEvent] = useState<Event>(initialEvent);

  const handleRsvpUpdate = (updatedEvent: Event) => {
    setEvent(updatedEvent);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-500 h-5 w-5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-green-500 h-5 w-5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-purple-500 h-5 w-5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Attendees
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {event.attendeeCount}
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </p>
                    {event.maxAttendees &&
                      event.attendeeCount >= event.maxAttendees && (
                        <span className="text-xs text-red-500 font-medium">
                          Full
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About This Event
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Join This Event
                  </h4>
                  <p className="text-sm text-gray-600">
                    Reserve your spot and connect with other attendees
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <RsvpButton
                    event={event}
                    onRsvpUpdate={handleRsvpUpdate}
                    className="min-w-[140px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
