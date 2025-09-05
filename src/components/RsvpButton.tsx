import { Event } from "@/types";
import { useRsvp } from "@/hooks/useRsvp";
import { Button } from "antd";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useState } from "react";

interface RsvpButtonProps {
  event: Event;
  userId: string;
  onRsvpUpdate?: (updatedEvent: Event) => void;
  size?: "small" | "middle" | "large";
  className?: string;
}

export default function RsvpButton({
  event,
  userId,
  onRsvpUpdate,
  size = "middle",
  className = "",
}: RsvpButtonProps) {
  const { rsvpToEvent, loading, error } = useRsvp();
  const [hasRsvped, setHasRsvped] = useState(event.attendees.includes(userId));
  const [currentEvent, setCurrentEvent] = useState(event);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleRsvp = async () => {
    try {
      const action = hasRsvped ? "cancel" : "rsvp";
      const updatedEvent = await rsvpToEvent(event.id, userId, action);

      if (updatedEvent) {
        setCurrentEvent(updatedEvent);
        setHasRsvped(updatedEvent.attendees.includes(userId));
        onRsvpUpdate?.(updatedEvent);

        if (action === "rsvp") {
          message.success("Successfully RSVPed to the event!");
        } else {
          message.success("Successfully cancelled RSVP!");
        }
      }
    } catch (err) {
      console.error("RSVP failed:", err);
    }
  };

  const isAtCapacity = Boolean(
    currentEvent.maxAttendees &&
      currentEvent.attendeeCount >= currentEvent.maxAttendees
  );

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        type={hasRsvped ? "default" : "primary"}
        danger={hasRsvped}
        size={size}
        icon={hasRsvped ? <UserDeleteOutlined /> : <UserAddOutlined />}
        onClick={handleRsvp}
        loading={loading}
        disabled={!hasRsvped && isAtCapacity}
        className={
          hasRsvped ? "border-red-500 text-red-500 hover:bg-red-50" : ""
        }
      >
        {hasRsvped ? "Cancel RSVP" : "RSVP"}
      </Button>
    </div>
  );
}
