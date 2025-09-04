import { Event } from "@/types";

import { NextRequest, NextResponse } from "next/server";

// Mock event data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "React Conference 2025",
    description:
      "Join us for the biggest React conference of the year featuring the latest updates, best practices, and networking opportunities.",
    date: "2025-10-15",
    location: "Dhaka, Bangladesh",
    category: "Conference",
  },
  {
    id: "2",
    title: "JavaScript Workshop: Advanced Patterns",
    description:
      "Deep dive into advanced JavaScript patterns and modern development techniques in this hands-on workshop.",
    date: "2025-09-20",
    location: "Chittagong, Bangladesh",
    category: "Workshop",
  },
  {
    id: "3",
    title: "Frontend Developers Meetup",
    description:
      "Monthly meetup for frontend developers to share experiences, learn new technologies, and network.",
    date: "2025-09-10",
    location: "Sylhet, Bangladesh",
    category: "Meetup",
  },
  {
    id: "4",
    title: "Web Development Bootcamp",
    description:
      "Intensive 3-day bootcamp covering full-stack web development from basics to advanced concepts.",
    date: "2025-11-05",
    location: "Rajshahi, Bangladesh",
    category: "Workshop",
  },
  {
    id: "5",
    title: "Tech Innovation Summit",
    description:
      "Annual summit bringing together tech leaders, entrepreneurs, and innovators to discuss the future of technology.",
    date: "2025-12-01",
    location: "Dhaka, Bangladesh",
    category: "Conference",
  },
  {
    id: "6",
    title: "Node.js Community Meetup",
    description:
      "Local Node.js developers meetup featuring talks on performance optimization and new features.",
    date: "2025-09-25",
    location: "Khulna, Bangladesh",
    category: "Meetup",
  },
  {
    id: "7",
    title: "UI/UX Design Workshop",
    description:
      "Learn modern UI/UX design principles and tools in this practical workshop session.",
    date: "2025-10-08",
    location: "Barisal, Bangladesh",
    category: "Workshop",
  },
  {
    id: "8",
    title: "DevOps Conference 2025",
    description:
      "Comprehensive conference covering DevOps practices, tools, and methodologies for modern development.",
    date: "2025-11-20",
    location: "Rangpur, Bangladesh",
    category: "Conference",
  },
];

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
