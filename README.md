# Event Management System

A modern event management application built with Next.js 15, TypeScript, and Tailwind CSS. This application allows users to browse, create, and RSVP to events with a clean and responsive interface.

> **Note:**
>
> In the requirements document (Module 4), it was suggested to save created events in local state or local storage. However, I chose to store created events in the backend `eventsData` array instead. This approach is more efficient and enables features such as server-side rendering (SSR) for the event details page. By maintaining events in the backend, the application ensures better scalability, data consistency, and a more robust user experience.

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
- **Ant Design (antd)** - UI component library

### State Management & HTTP

- **React Context API** - Global state management
- **Axios** - HTTP client for API requests
- **React Hooks** - Custom hooks for reusable logic

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Day.js** - Date manipulation library
- **React Icons** - Icon library

### Additional Libraries

- **React Icons** - For consistent iconography
- **Day.js** - Lightweight date formatting

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

## 📁 Project Structure

```
event-management/
├── public/                 # Static assets
│   ├── logo.webp          # Application logo
│   └── *.svg              # Various SVG icons
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   │   └── events/    # Event-related API endpoints
│   │   ├── create-event/  # Create event page
│   │   ├── events/        # Event listing and details pages
│   │   └── my-events/     # User's events page
│   ├── components/        # Reusable UI components
│   │   ├── shared/        # Shared components (Header, etc.)
│   │   └── *.tsx          # Feature-specific components
│   ├── context/           # React Context providers
│   ├── data/              # Mock data and data store
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── next.config.ts         # Next.js configuration
```

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

## 🌐 API Endpoints

The application includes the following API routes:

- `GET /api/events` - Fetch all events
- `GET /api/my-events` - Fetch all events of a user
- `GET /api/events/[id]` - Fetch specific event by ID
- `PUT /api/events/[id]/rsvp` - RSVP to event or cancel RSVP
- `DELETE /api/events/[id]` - Delete specific event by ID

---

**Happy Event Managing! 🎉**
