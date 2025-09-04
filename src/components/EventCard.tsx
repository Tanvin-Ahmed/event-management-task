import { Event } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export default function EventCard({
  event,
  showActions = false,
  onEdit,
  onDelete,
}: EventCardProps) {
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

      <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
        {event.description}
      </p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
        <div className="flex items-center text-gray-500 text-sm">
          📅&nbsp;{formatDate(event.date)}
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          📍&nbsp;{event.location}
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 mt-4">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(event.id);
            }}
            className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(event.id);
            }}
            className="flex-1 min-w-0"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );

  if (showActions) {
    return (
      <div className="h-full">
        <CardContent />
      </div>
    );
  }

  return (
    <Link href={`/events/${event.id}`} className="h-full">
      <CardContent />
    </Link>
  );
}
