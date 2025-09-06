import { getEventById, updateEvent, deleteEvent } from "@/data/eventsStore";
import { Event } from "@/types";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = getEventById(id);

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

    return NextResponse.json({
      success: true,
      data: event,
      message: "Event retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve event",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventData: Event = await request.json();

    eventData.id = id;

    const updatedEvent = updateEvent(id, eventData);

    if (!updatedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedEvent = deleteEvent(id);

    if (!deletedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
