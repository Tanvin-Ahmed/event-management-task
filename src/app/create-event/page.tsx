"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Event, ApiResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Save, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function CreateEventContent() {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "" as "Conference" | "Workshop" | "Meetup" | "",
    maxAttendees: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const userId = user?.id;

  const loadEventForEdit = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get<ApiResponse<Event>>(
          `/api/events/${id}`
        );
        const result = response.data;

        if (result.success) {
          const eventToEdit = result.data;
          if (eventToEdit && eventToEdit.userId === userId) {
            setFormData({
              title: eventToEdit.title,
              description: eventToEdit.description,
              location: eventToEdit.location,
              category: eventToEdit.category,
              maxAttendees: eventToEdit.maxAttendees?.toString() || "",
            });
            setDate(new Date(eventToEdit.date));
          } else {
            toast.error(
              "Event not found or you don't have permission to edit it"
            );
            router.push("/my-events");
          }
        } else {
          toast.error(result.message);
          router.push("/my-events");
        }
      } catch (error) {
        console.error("Error loading event for edit:", error);
        toast.error("Failed to load event data");
        router.push("/my-events");
      }
    },
    [router, userId]
  );

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditMode(true);
      setEventId(editId);
      loadEventForEdit(editId);
    }
  }, [searchParams, loadEventForEdit]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter the event title";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter the event description";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!date) {
      newErrors.date = "Please select the event date";
    } else if (date < new Date()) {
      newErrors.date = "Event date cannot be in the past";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please enter the event location";
    } else if (formData.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters long";
    } else if (formData.location.length > 100) {
      newErrors.location = "Location cannot exceed 100 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select the event category";
    }

    if (!formData.maxAttendees) {
      newErrors.maxAttendees = "Please enter the maximum number of attendees";
    } else if (Number(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = "Maximum attendees must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to create or edit events");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && eventId) {
        const response = await axios.get<ApiResponse<Event>>(
          `/api/events/${eventId}`
        );
        const result = response.data;

        if (!result.success) {
          toast.error("Failed to get event data");
          return;
        }

        const existingEvent = result.data;
        const updatedEvent: Event = {
          id: eventId,
          title: formData.title,
          description: formData.description,
          date: date!.toISOString().split("T")[0],
          location: formData.location,
          category: formData.category as "Conference" | "Workshop" | "Meetup",
          userId: userId,
          attendeeCount: existingEvent?.attendeeCount || 0,
          maxAttendees: Number(formData.maxAttendees),
          attendees: existingEvent?.attendees || [],
          createdAt: existingEvent?.createdAt || new Date().toISOString(),
        };

        const updateResponse = await axios.put<ApiResponse<Event>>(
          `/api/events/${eventId}`,
          updatedEvent
        );
        const updateResult = updateResponse.data;

        if (updateResult.success) {
          toast.success("Event updated successfully!");
        } else {
          toast.error(updateResult.message);
          return;
        }
      } else {
        const newEvent: Event = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: formData.title,
          description: formData.description,
          date: date!.toISOString().split("T")[0],
          location: formData.location,
          category: formData.category as "Conference" | "Workshop" | "Meetup",
          userId: userId,
          attendeeCount: 0,
          maxAttendees: Number(formData.maxAttendees),
          attendees: [],
          createdAt: new Date().toISOString(),
        };

        const createResponse = await axios.post<ApiResponse<Event>>(
          "/api/events",
          newEvent
        );
        const createResult = createResponse.data;

        if (createResult.success) {
          toast.success("Event created successfully!");
        } else {
          toast.error(createResult.message);
          return;
        }
      }

      router.push("/my-events");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/my-events");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="mb-6 cursor-pointer flex items-center text-blue-600 hover:text-blue-800 transition-colors w-fit"
        >
          <span className="mr-2">←</span>
          Back to Events
        </Link>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? "Update your event details"
                : "Fill in the details to create a new event"}
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`rounded-md ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`rounded-md resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  {errors.description && (
                    <span className="text-red-600">{errors.description}</span>
                  )}
                  <span className="ml-auto">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`rounded-md ${
                    errors.location ? "border-red-500" : ""
                  }`}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={`w-full rounded-md ${
                      errors.category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  placeholder="Enter maximum number of attendees"
                  value={formData.maxAttendees}
                  onChange={(e) =>
                    handleInputChange("maxAttendees", e.target.value)
                  }
                  className={`rounded-md ${
                    errors.maxAttendees ? "border-red-500" : ""
                  }`}
                />
                {errors.maxAttendees && (
                  <p className="text-sm text-red-600">{errors.maxAttendees}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Event"
                    : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <CreateEventContent />
      </Suspense>
    </ProtectedRoute>
  );
}
