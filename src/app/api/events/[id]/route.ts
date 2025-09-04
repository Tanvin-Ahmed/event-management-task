import { mockEvents } from "@/data/mockEvents";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
