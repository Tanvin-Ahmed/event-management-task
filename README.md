# Event Management System

A modern event management application built with Next.js 15, TypeScript, and Tailwind CSS. This application allows users to browse, create, and RSVP to events with a clean and responsive interface.

## 🔗 Live Demo

**[View Live Application](https://event-management-task-delta.vercel.app)**

> **Note:**
>
> In the requirements document (Module 4), it was suggested to save created events in local state or local storage. However, I chose to store created events in the backend `eventsData` array instead. This approach is more efficient and enables features such as server-side rendering (SSR) for the event details page. By maintaining events in the backend, the application ensures better scalability, data consistency, and a more robust user experience. I think it is more realistic and in real world application event should be saved in backend.

## 🚀 Features

- **Event Listing**: Browse all available events with search and category filtering
- **Event Details**: View comprehensive event information including date, location, and attendees
- **Event Creation**: Create new events with all necessary details
- **RSVP System**: Register or cancel attendance for events
- **My Events**: View personal events and RSVP history
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Mock Authentication**: Simple user authentication system for demo purposes

## 🛠️ Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - UI component library

### State Management & HTTP

- **React Context API** - Global state management
- **Axios** - HTTP client for API requests
- **React Hooks** - Custom hooks for reusable logic

### Development Tools

- **ESLint** - Code linting

### Additional Libraries

- **Lucid Icons** - For consistent iconography

## 🎯 How to Use the Application

### 1. Browse Events

- Navigate to the home page to see all available events
- Use the search bar to find specific events where you can search event by title
- Filter events by category

### 2. View Event Details

- Click on any event card to view detailed information
- See event description, date, time, location, and current attendees
- RSVP or cancel your attendance from the event details page

### 3. Create New Event

- Click "Create Event" in the navigation header
- Fill in all required event details:
  - Event title and description
  - Date and time
  - Location
  - Category
  - Maximum attendees
- Submit the form to create your event

### 4. Manage Your Events

- Visit "My Events" to see:
  - Events you've created
  - Events you've RSVP'd to
- Cancel your RSVP or edit your events as needed

## 📋 Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 18.17 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** (for cloning the repository)

## 🚀 Getting Started

Follow these steps to run the project on your local machine:

### Step 1: Clone the Repository

```bash
git clone https://github.com/Tanvin-Ahmed/event-management-task.git
cd event-management-task
```

### Step 2: Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

### Step 3: Run the Development Server

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

Using pnpm:

```bash
pnpm dev
```

### Step 4: Open the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 🌐 API Documentation

The application includes REST API endpoints for event management:

### Events Management

#### Get All Events

```http
GET /api/events
```

**Query Parameters:**

- `search` (optional): Search events by title
- `category` (optional): Filter by event category (`Conference`, `Workshop`, `Meetup`, `All`)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Event Title",
      "description": "Event description",
      "date": "2025-01-15",
      "location": "Event Location",
      "category": "Conference",
      "userId": "creator-id",
      "attendeeCount": 5,
      "maxAttendees": 100,
      "attendees": ["user-id-1", "user-id-2"],
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "message": "Events retrieved successfully"
}
```

#### Create New Event

```http
POST /api/events
```

**Request Body:**

```json
{
  "title": "New Event",
  "description": "Event description",
  "date": "2025-01-15",
  "location": "Event Location",
  "category": "Conference",
  "userId": "creator-id",
  "maxAttendees": 100
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "New Event",
    "description": "Event description",
    "date": "2025-01-15",
    "location": "Event Location",
    "category": "Conference",
    "userId": "creator-id",
    "attendeeCount": 0,
    "maxAttendees": 100,
    "attendees": [],
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  "message": "Event created successfully"
}
```

### Individual Event Operations

#### Get Event by ID

```http
GET /api/events/[id]
```

**Parameters:**

- `id`: Event UUID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "title": "Event Title",
    "description": "Event description",
    "date": "2025-01-15",
    "location": "Event Location",
    "category": "Conference",
    "userId": "creator-id",
    "attendeeCount": 5,
    "maxAttendees": 100,
    "attendees": ["user-id-1", "user-id-2"],
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  "message": "Event retrieved successfully"
}
```

#### Update Specific Event

```http
PUT /api/events/[id]
```

**Parameters:**

- `id`: Event UUID

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2025-01-15",
  "location": "Updated Location",
  "category": "Meetup",
  "maxAttendees": 200
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "title": "Updated Title",
    "description": "Updated description",
    "date": "2025-01-15",
    "location": "Updated Location",
    "category": "Meetup",
    "userId": "creator-id",
    "attendeeCount": 5,
    "maxAttendees": 200,
    "attendees": ["user-id-1", "user-id-2"],
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  "message": "Event updated successfully"
}
```

#### Delete Specific Event

```http
DELETE /api/events/[id]
```

**Parameters:**

- `id`: Event UUID

**Response:**

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### RSVP Management

#### RSVP to Event or Cancel RSVP

```http
PUT /api/events/[id]/rsvp
```

**Parameters:**

- `id`: Event UUID

**Request Body:**

```json
{
  "userId": "user-uuid",
  "action": "rsvp"
}
```

**Valid Actions:** `"rsvp"` or `"cancel"`

**Response (RSVP Success):**

```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "title": "Event Title",
    "description": "Event description",
    "date": "2025-01-15",
    "location": "Event Location",
    "category": "Conference",
    "userId": "creator-id",
    "attendeeCount": 6,
    "maxAttendees": 100,
    "attendees": ["user-id-1", "user-id-2", "new-user-id"],
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  "message": "Successfully RSVPed to the event"
}
```

**Response (Cancel Success):**

```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "title": "Event Title",
    "description": "Event description",
    "date": "2025-01-15",
    "location": "Event Location",
    "category": "Conference",
    "userId": "creator-id",
    "attendeeCount": 4,
    "maxAttendees": 100,
    "attendees": ["user-id-1", "user-id-2"],
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  "message": "Successfully cancelled RSVP"
}
```

### User Events

#### Get My Events

```http
GET /api/my-events?userId=user-uuid
```

**Query Parameters:**

- `userId` (required): User UUID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "event-uuid-1",
      "title": "My Created Event",
      "description": "Event description",
      "date": "2025-01-15",
      "location": "Event Location",
      "category": "Conference",
      "userId": "user-uuid",
      "attendeeCount": 5,
      "maxAttendees": 100,
      "attendees": ["user-id-1", "user-id-2"],
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "message": "User events retrieved successfully"
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "data": null
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (missing required fields, invalid action, already RSVPed, etc.)
- `404`: Not Found (event not found)
- `500`: Internal Server Error

**Example Error Responses:**

**Missing Required Fields (400):**

```json
{
  "success": false,
  "message": "Missing required fields: title, description, date, location",
  "data": null
}
```

**Event Not Found (404):**

```json
{
  "success": false,
  "message": "Event not found",
  "data": null
}
```

**Already RSVPed (400):**

```json
{
  "success": false,
  "message": "You have already RSVPed to this event",
  "data": {
    "id": "event-uuid",
    "title": "Event Title"
  }
}
```

**Event at Capacity (400):**

```json
{
  "success": false,
  "message": "Event is at maximum capacity",
  "data": {
    "id": "event-uuid",
    "attendeeCount": 100,
    "maxAttendees": 100
  }
}
```

---

**Happy Event Managing! 🎉**
