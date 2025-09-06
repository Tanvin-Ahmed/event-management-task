import { getEvents, addEvent } from "@/data/eventsStore";
import { Event } from "@/types";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";

    const events = getEvents();
    let filteredEvents = events;

    if (search) {
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category && category !== "All") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      message: "Events retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve events",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData: Event = await request.json();

    if (
      !eventData.title ||
      !eventData.description ||
      !eventData.date ||
      !eventData.location
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: title, description, date, location",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!eventData.id) {
      eventData.id = crypto.randomUUID();
    }

    if (!eventData.attendees) {
      eventData.attendees = [];
    }
    if (eventData.attendeeCount === undefined) {
      eventData.attendeeCount = 0;
    }

    if (!eventData.createdAt) {
      eventData.createdAt = new Date().toISOString();
    }

    const newEvent = addEvent(eventData);

    return NextResponse.json(
      {
        success: true,
        data: newEvent,
        message: "Event created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
