"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import EventCard from "@/components/EventCard";
import DeleteEventModal from "@/components/DeleteEventModal";
import { useEffect, useState, useCallback } from "react";
import { Event, ApiResponse } from "@/types";
import axios from "axios";
import { toast } from "sonner";

function MyEventsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    event: Event | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    event: null,
    isDeleting: false,
  });

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
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to fetch events");
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
    const eventToDelete = myEvents.find((event) => event.id === eventId);
    if (eventToDelete) {
      setDeleteModal({
        isOpen: true,
        event: eventToDelete,
        isDeleting: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.event) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await axios.delete<ApiResponse<Event>>(
        `/api/events/${deleteModal.event.id}`
      );
      const result = response.data;

      if (result.success) {
        setMyEvents((prev) =>
          prev.filter((event) => event.id !== deleteModal.event!.id)
        );
        toast.success("Event deleted successfully!");
        setDeleteModal({ isOpen: false, event: null, isDeleting: false });
      } else {
        toast.error(result.message);
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch {
      toast.error("Failed to delete event");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, event: null, isDeleting: false });
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
          <Button size="lg" onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" />
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
              <Button size="lg" onClick={handleCreateEvent}>
                <Plus className="mr-2 h-4 w-4" />
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
                showDetails={true}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteEventModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        event={deleteModal.event}
        isDeleting={deleteModal.isDeleting}
      />
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
