import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Not Found</h2>
            <p className="mb-8 text-gray-600">Could not find requested resource</p>
            <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
