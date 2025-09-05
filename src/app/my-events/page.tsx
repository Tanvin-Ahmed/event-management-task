"use client";

import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import EventCard from "@/components/EventCard";
import { useEffect, useState, useCallback } from "react";
import { Event, ApiResponse } from "@/types";
import axios from "axios";

function MyEventsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const fetchMyEvents = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<Event[]>>(
        `/api/my-events?userId=${userId}`
      );
      const result = response.data;

      if (result.success) {
        setMyEvents(result.data);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching my events:", error);
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMyEvents();
    }
  }, [userId, fetchMyEvents]);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await axios.delete<ApiResponse<Event>>(
        `/api/events/${eventId}`
      );
      const result = response.data;

      if (result.success) {
        setMyEvents((prev) => prev.filter((event) => event.id !== eventId));
        message.success("Event deleted successfully!");
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      message.error("Failed to delete event");
    }
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/create-event?edit=${eventId}`);
  };

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
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
              <EventCard
                key={event.id}
                event={event}
                showActions={true}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyEventsPage() {
  return (
    <ProtectedRoute>
      <MyEventsContent />
    </ProtectedRoute>
  );
}
