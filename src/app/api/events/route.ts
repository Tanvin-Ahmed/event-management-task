import { mockEvents } from "@/data/mockEvents";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const id = searchParams.get("id");

    // If ID is provided, return single event
    if (id) {
      const event = mockEvents.find((event) => event.id === id);
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
    }

    let filteredEvents = mockEvents;

    // Filter by search term (title)
    if (search) {
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(search)
      );
    }

    // Filter by category
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
