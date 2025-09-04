import { Event } from "@/types";
import { formatDate } from "@/utils/formatDate";

import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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

  return (
    <Link href={`/events/${event.id}`} className="h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 cursor-pointer h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
              event.category
            )} flex-shrink-0`}
          >
            {event.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
          <div className="flex items-center text-gray-500 text-sm">
            📅&nbsp;{formatDate(event.date)}
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            📍&nbsp;{event.location}
          </div>
        </div>
      </div>
    </Link>
  );
}
