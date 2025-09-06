import { Event } from "@/types";
import { useRsvp } from "@/hooks/useRsvp";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RsvpButtonProps {
  event: Event;
  userId?: string;
  onRsvpUpdate?: (updatedEvent: Event) => void;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export default function RsvpButton({
  event,
  userId,
  onRsvpUpdate,
  size = "default",
  className = "",
}: RsvpButtonProps) {
  const { rsvpToEvent, loading, error } = useRsvp();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const currentUserId = user?.id || userId;
  const [hasRsvped, setHasRsvped] = useState(
    currentUserId ? event.attendees.includes(currentUserId) : false
  );
  const [currentEvent, setCurrentEvent] = useState(event);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (currentUserId) {
      setHasRsvped(event.attendees.includes(currentUserId));
    }
  }, [currentUserId, event.attendees]);

  const handleRsvp = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to RSVP for events");
      router.push("/sign-in");
      return;
    }

    if (!currentUserId) {
      toast.error("User not found");
      return;
    }

    try {
      const action = hasRsvped ? "cancel" : "rsvp";
      const updatedEvent = await rsvpToEvent(event.id, currentUserId, action);

      if (updatedEvent) {
        setCurrentEvent(updatedEvent);
        setHasRsvped(updatedEvent.attendees.includes(currentUserId));
        onRsvpUpdate?.(updatedEvent);

        if (action === "rsvp") {
          toast.success("Successfully RSVPed to the event!");
        } else {
          toast.success("Successfully cancelled RSVP!");
        }
      }
    } catch {}
  };

  const isAtCapacity = Boolean(
    currentEvent.maxAttendees &&
      currentEvent.attendeeCount >= currentEvent.maxAttendees
  );

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        variant={hasRsvped ? "outline" : "default"}
        size={size}
        onClick={handleRsvp}
        disabled={loading || (!hasRsvped && isAtCapacity)}
        className={
          hasRsvped
            ? "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            : ""
        }
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : hasRsvped ? (
          <UserMinus className="mr-2 h-4 w-4" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        {hasRsvped ? "Cancel RSVP" : "RSVP"}
      </Button>
    </div>
  );
}
