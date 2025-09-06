import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-blue-500 text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-900 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
