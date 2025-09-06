import { Event } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Edit, Trash2, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RsvpButton from "./RsvpButton";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  showRsvp?: boolean;
  showDetails?: boolean;
  userId?: string;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onRsvpUpdate?: (updatedEvent: Event) => void;
}

export default function EventCard({
  event,
  showActions = false,
  showRsvp = false,
  showDetails = false,
  userId = "current-user",
  onEdit,
  onDelete,
  onRsvpUpdate,
}: EventCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };
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
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 h-full flex flex-col">
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
        <div className="flex items-center text-gray-500 text-sm">
          📅&nbsp;{formatDate(event.date)}
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          📍&nbsp;{event.location}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>
            {event.attendeeCount} attending
            {event.maxAttendees && ` / ${event.maxAttendees}`}
          </span>
        </div>
        {event.maxAttendees && event.attendeeCount >= event.maxAttendees && (
          <span className="text-red-500 font-medium text-xs">Full</span>
        )}
      </div>

      {showRsvp && !showActions && (
        <div className="mt-3 flex gap-2">
          <div className="flex-1">
            <RsvpButton
              event={event}
              userId={userId}
              onRsvpUpdate={onRsvpUpdate}
              size="sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>
        </div>
      )}

      {showActions && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 mt-4">
          <Button
            size="sm"
            onClick={() => {
              onEdit?.(event.id);
            }}
            className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(event.id);
            }}
            className="flex-1 min-w-0"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          {showDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex-1 min-w-0"
            >
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full">
      <CardContent />
    </div>
  );
}
