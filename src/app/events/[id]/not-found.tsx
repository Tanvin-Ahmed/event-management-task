import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Event Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The event you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back to Events
        </Link>
      </div>
    </div>
  );
}
