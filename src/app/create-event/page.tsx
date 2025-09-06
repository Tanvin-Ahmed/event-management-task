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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter the event title")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Please enter the event description")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  date: z
    .date({
      message: "Please select the event date",
    })
    .refine(
      (date) => date.getTime() >= Date.now() - 24 * 60 * 60 * 1000,
      "Event date cannot be in the past"
    ),
  location: z
    .string()
    .min(1, "Please enter the event location")
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location cannot exceed 100 characters"),
  category: z.enum(["Conference", "Workshop", "Meetup"], {
    message: "Please select the event category",
  }),
  maxAttendees: z
    .string()
    .min(1, "Please enter the maximum number of attendees")
    .refine((val) => Number(val) >= 1, "Maximum attendees must be at least 1"),
});

function CreateEventContent() {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const userId = user?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: undefined,
      maxAttendees: "",
      date: undefined,
    },
  });

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
            form.reset({
              title: eventToEdit.title,
              description: eventToEdit.description,
              location: eventToEdit.location,
              category: eventToEdit.category,
              maxAttendees: eventToEdit.maxAttendees?.toString() || "",
              date: new Date(eventToEdit.date),
            });
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
      } catch {
        toast.error("Failed to load event data");
        router.push("/my-events");
      }
    },
    [router, userId, form]
  );

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditMode(true);
      setEventId(editId);
      loadEventForEdit(editId);
    }
  }, [searchParams, loadEventForEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
          title: values.title,
          description: values.description,
          date: values.date.toISOString().split("T")[0],
          location: values.location,
          category: values.category as "Conference" | "Workshop" | "Meetup",
          userId: userId,
          attendeeCount: existingEvent?.attendeeCount || 0,
          maxAttendees: Number(values.maxAttendees),
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
          title: values.title,
          description: values.description,
          date: values.date.toISOString().split("T")[0],
          location: values.location,
          category: values.category as "Conference" | "Workshop" | "Meetup",
          userId: userId,
          attendeeCount: 0,
          maxAttendees: Number(values.maxAttendees),
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
    } catch {
      toast.error("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your event in detail"
                          rows={4}
                          maxLength={500}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <FormMessage />
                        <span className="ml-auto">
                          {field.value?.length || 0}/500
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date.getTime() < Date.now() - 24 * 60 * 60 * 1000
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select event category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Meetup">Meetup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attendees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter maximum number of attendees"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full"
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
            </Form>
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
