"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  message,
  InputNumber,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Event } from "@/types";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import dayjs from "dayjs";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

function CreateEventContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getEventById, addEvent, updateEvent } = useEvents();
  const { user } = useAuth();

  const userId = user?.id;

  const loadEventForEdit = useCallback(
    (id: string) => {
      try {
        const eventToEdit = getEventById(id);

        if (eventToEdit && eventToEdit.userId === userId) {
          form.setFieldsValue({
            title: eventToEdit.title,
            description: eventToEdit.description,
            date: dayjs(eventToEdit.date),
            location: eventToEdit.location,
            category: eventToEdit.category,
            maxAttendees: eventToEdit.maxAttendees,
          });
        } else {
          message.error(
            "Event not found or you don't have permission to edit it"
          );
          router.push("/my-events");
        }
      } catch (error) {
        console.error("Error loading event for edit:", error);
        message.error("Failed to load event data");
        router.push("/my-events");
      }
    },
    [form, router, userId, getEventById]
  );

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditMode(true);
      setEventId(editId);
      loadEventForEdit(editId);
    }
  }, [searchParams, loadEventForEdit]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (isEditMode && eventId) {
        const existingEvent = getEventById(eventId);
        const updatedEvent: Event = {
          id: eventId,
          title: values.title,
          description: values.description,
          date: values.date.format("YYYY-MM-DD"),
          location: values.location,
          category: values.category,
          userId: userId,
          attendeeCount: existingEvent?.attendeeCount || 0,
          maxAttendees: Number(values.maxAttendees),
          attendees: existingEvent?.attendees || [],
        };

        updateEvent(updatedEvent);
        message.success("Event updated successfully!");
      } else {
        const newEvent: Event = {
          id: Date.now().toString(),
          title: values.title,
          description: values.description,
          date: values.date.format("YYYY-MM-DD"),
          location: values.location,
          category: values.category,
          userId: userId,
          attendeeCount: 0,
          maxAttendees: Number(values.maxAttendees),
          attendees: [],
        };

        addEvent(newEvent);
        message.success("Event created successfully!");
      }

      router.push("/my-events");
    } catch (error) {
      console.error("Error saving event:", error);
      message.error("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/my-events");
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
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Event Title"
              rules={[
                { required: true, message: "Please enter the event title" },
                { min: 3, message: "Title must be at least 3 characters long" },
                { max: 100, message: "Title cannot exceed 100 characters" },
                { whitespace: true },
              ]}
            >
              <Input placeholder="Enter event title" className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter the event description",
                },
                {
                  min: 10,
                  message: "Description must be at least 10 characters long",
                },
                {
                  max: 500,
                  message: "Description cannot exceed 500 characters",
                },
                { whitespace: true },
              ]}
            >
              <TextArea
                placeholder="Describe your event in detail"
                rows={4}
                className="rounded-md"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Event Date"
              rules={[
                { required: true, message: "Please select the event date" },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs(), "day")) {
                      return Promise.reject(
                        new Error("Event date cannot be in the past")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                placeholder="Select event date"
                className="w-full rounded-md"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[
                { required: true, message: "Please enter the event location" },
                {
                  min: 3,
                  message: "Location must be at least 3 characters long",
                },
                { max: 100, message: "Location cannot exceed 100 characters" },
                { whitespace: true },
              ]}
            >
              <Input
                placeholder="Enter event location"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[
                { required: true, message: "Please select the event category" },
              ]}
            >
              <Select
                placeholder="Select event category"
                className="rounded-md"
              >
                <Option value="Conference">Conference</Option>
                <Option value="Workshop">Workshop</Option>
                <Option value="Meetup">Meetup</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="maxAttendees"
              label="Maximum Attendees"
              rules={[
                {
                  required: true,
                  message: "Please enter the maximum number of attendees",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter maximum number of attendees"
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>

            <div className="flex gap-4 pt-4">
              <Button
                type="default"
                size="large"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                className="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                {isEditMode ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </Form>
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
