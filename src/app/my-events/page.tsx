"use client";

import { Button, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { useEvents } from "@/context/EventsContext";

export default function MyEventsPage() {
  const router = useRouter();
  const { loading, getUserEvents, deleteEvent } = useEvents();

  const userId = "user123";

  const myEvents = getUserEvents(userId);

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

  const handleDeleteEvent = (eventId: string) => {
    try {
      deleteEvent(eventId);
      message.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      message.error("Failed to delete event");
    }
  };

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">
              Manage your created events ({myEvents.length} events)
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateEvent}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            Create New Event
          </Button>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Events Created Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first event to share with others.
              </p>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleCreateEvent}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                Create Your First Event
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    📅&nbsp;{formatDate(event.date)}
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    📍&nbsp;{event.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() =>
                      router.push(`/create-event?edit=${event.id}`)
                    }
                    className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex-1 min-w-0"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
