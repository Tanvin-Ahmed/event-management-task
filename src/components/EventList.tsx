"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Event, ApiResponse } from "@/types";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Only show searching indicator if it's not the initial load
        if (!initialLoading) {
          setSearching(true);
        }

        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory !== "All")
          params.append("category", selectedCategory);

        const response = await axios.get<ApiResponse<Event[]>>(
          `/api/events?${params}`
        );
        const data = response.data;

        if (data.success) {
          setEvents(data.data);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch {
        setError("An error occurred while fetching events");
      } finally {
        setInitialLoading(false);
        setSearching(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">❌ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Upcoming Events
        </h1>
        <p className="text-gray-600 text-lg">
          Discover amazing events happening near you
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-6">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search events by title..."
          />
        </div>
        <div className="flex-shrink-0">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Events Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {searching || initialLoading
            ? "Finding..."
            : events.length === 0
            ? "No events found"
            : `Showing ${events.length} event${events.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Events Grid */}
      {searching || initialLoading ? (
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Finding events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
