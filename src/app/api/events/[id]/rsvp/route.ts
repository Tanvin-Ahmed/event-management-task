import { updateEvent, getEventById } from "@/data/eventsStore";
import { RsvpRequest } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body: RsvpRequest = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!["rsvp", "cancel"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Use 'rsvp' or 'cancel'",
          data: null,
        },
        { status: 400 }
      );
    }

    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const isAlreadyRSVPed = event.attendees.includes(userId);

    if (action === "rsvp") {
      if (isAlreadyRSVPed) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already RSVPed to this event",
            data: event,
          },
          { status: 400 }
        );
      }

      if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
        return NextResponse.json(
          {
            success: false,
            message: "Event is at maximum capacity",
            data: event,
          },
          { status: 400 }
        );
      }

      const updatedEvent = {
        ...event,
        attendees: [...event.attendees, userId],
        attendeeCount: event.attendeeCount + 1,
      };

      updateEvent(eventId, updatedEvent);

      return NextResponse.json({
        success: true,
        data: updatedEvent,
        message: "Successfully RSVPed to the event",
      });
    } else if (action === "cancel") {
      if (!isAlreadyRSVPed) {
        return NextResponse.json(
          {
            success: false,
            message: "You have not RSVPed to this event",
            data: event,
          },
          { status: 400 }
        );
      }

      const updatedEvent = {
        ...event,
        attendees: event.attendees.filter((id) => id !== userId),
        attendeeCount: Math.max(0, event.attendeeCount - 1),
      };

      updateEvent(eventId, updatedEvent);

      return NextResponse.json({
        success: true,
        data: updatedEvent,
        message: "Successfully cancelled RSVP",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process RSVP",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
