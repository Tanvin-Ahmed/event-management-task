import { getUserEvents } from "@/data/eventsStore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const userEvents = getUserEvents(userId);

    return NextResponse.json({
      success: true,
      data: userEvents,
      message: "User events retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user events",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
